import https from 'https';
import http from 'http';
import fs, { readFileSync, writeFileSync, existsSync, mkdirSync, createWriteStream } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const MAPPING_FILE = join(PROJECT_ROOT, 'scripts', 'url_mapping.json');

// قائمة الآيبيات الخاصة بـ web.archive.org لتجاوز حجب DNS (نستخدم الآي بي الأكثر استقراراً في الاستجابة)
const ARCHIVE_IPS = ['207.241.237.3'];
let currentIpIndex = 0;

function getNextIp() {
  const ip = ARCHIVE_IPS[currentIpIndex];
  currentIpIndex = (currentIpIndex + 1) % ARCHIVE_IPS.length;
  return ip;
}

/**
 * تنزيل ملف من أرشيف الإنترنت مع دعم المزامنة والتحويل عبر الآي بي والـ SNI
 */
function downloadFromArchive(archiveUrl, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    let urlObj;
    try {
      urlObj = new URL(archiveUrl);
    } catch (e) {
      reject(e);
      return;
    }
    
    const isArchive = urlObj.hostname === 'web.archive.org' || urlObj.hostname === 'archive.org';
    const ipAddress = isArchive ? getNextIp() : urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    if (isArchive) {
      headers['Host'] = 'web.archive.org';
    }
    
    const options = {
      hostname: ipAddress,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: path,
      method: 'GET',
      headers: headers,
      rejectUnauthorized: false
    };
    
    if (isArchive) {
      options.servername = 'web.archive.org';
    }
    
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const file = createWriteStream(destPath);
    
    const req = protocol.request(options, (res) => {
      // التعامل مع التحويلات
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, archiveUrl).toString();
        }
        
        // إذا كان هناك تحويل، تتبع التحويل
        downloadFromArchive(redirectUrl, destPath, retries)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // إذا كان هناك خطأ حد الـ Rate Limit
      if (res.statusCode === 429) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        
        if (retries > 0) {
          const waitTime = 5000 + (3 - retries) * 3000;
          setTimeout(() => {
            downloadFromArchive(archiveUrl, destPath, retries - 1).then(resolve).catch(reject);
          }, waitTime);
        } else {
          reject(new Error(`Rate limited (429) for ${archiveUrl}`));
        }
        return;
      }
      
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        reject(new Error(`HTTP ${res.statusCode} for ${archiveUrl}`));
        return;
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    });
    
    req.on('error', (err) => {
      file.close();
      try { fs.unlinkSync(destPath); } catch {}
      if (retries > 0) {
        setTimeout(() => {
          downloadFromArchive(archiveUrl, destPath, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(err);
      }
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      file.close();
      try { fs.unlinkSync(destPath); } catch {}
      if (retries > 0) {
        setTimeout(() => {
          downloadFromArchive(archiveUrl, destPath, retries - 1).then(resolve).catch(reject);
        }, 3000);
      } else {
        reject(new Error(`Timeout downloading ${archiveUrl}`));
      }
    });
    
    req.end();
  });
}

async function main() {
  console.log('\n🚀 بدء تنزيل الصور الحقيقية للمشاريع والأعمال من أرشيف الإنترنت...\n');
  
  if (!existsSync(MAPPING_FILE)) {
    console.error('❌ لم يتم العثور على ملف scripts/url_mapping.json. يرجى إنشاء خريطة الروابط أولاً.');
    return;
  }
  
  const mapping = JSON.parse(readFileSync(MAPPING_FILE, 'utf8'));
  
  // تصفية وتجهيز قائمة التنزيلات للصور الحقيقية فقط (تجاهل Unsplash والأشياء الثابتة)
  const downloadQueue = [];
  for (const [originalUrl, localPath] of Object.entries(mapping)) {
    if (originalUrl.includes('tlal-ksa.com') && !originalUrl.includes('logo')) {
      const destPath = join(PROJECT_ROOT, 'public', localPath);
      
      // استخراج سنة الرفع من مسار الرابط (مثال: /uploads/2023/05/ -> 2023)
      const match = originalUrl.match(/\/uploads\/(\d{4})\/(\d{2})\//);
      const year = match ? match[1] : '2023';
      
      // التنزيل عبر Wayback مع اللاحقة if_ للحصول على الملف الأصلي مباشرة
      const archiveUrl = `https://web.archive.org/web/${year}if_/${originalUrl}`;
      downloadQueue.push({ originalUrl, archiveUrl, destPath, localPath });
    }
  }
  
  const total = downloadQueue.length;
  console.log(`📊 تم جدولة تنزيل ${total} صورة حقيقية من الأرشيف...\n`);
  
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failedList = [];
  
  for (let i = 0; i < total; i++) {
    const item = downloadQueue[i];
    const filename = basename(item.destPath);
    
    // التأكد من المجلد الوجهة
    const destDir = dirname(item.destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    // التحقق إذا كان الملف موجود مسبقاً وبحجم سليم (غير 0 بايت وصورة حقيقية)
    // لتجنب إعادة تنزيل الصور التي تم إصلاحها، سنقوم باستبدال الصور الحالية إذا كان حجمها صغيراً جداً (مثلاً أقل من 5 كيلوبايت لأن صور unsplash كبيرة، أو سنقوم باستبدالها جميعاً لضمان الحصول على الصور الحقيقية)
    // المستخدم يطلب صراحة جلب الصور الحقيقية للموقع، لذا سنقوم بتحميلها جميعاً لضمان استبدال صور Unsplash المؤقتة بالصور الحقيقية.
    // سنقوم بحذف الملف القديم إذا كان موجوداً لضمان الكتابة النظيفة.
    if (existsSync(item.destPath)) {
      try { fs.unlinkSync(item.destPath); } catch {}
    }
    
    try {
      console.log(`📥 [${i + 1}/${total}] جاري تحميل الصورة الحقيقية لـ: ${filename}...`);
      await downloadFromArchive(item.archiveUrl, item.destPath);
      downloaded++;
      console.log(`   ✅ تم بنجاح! الحجم: ${Math.round(fs.statSync(item.destPath).size / 1024)} KB`);
    } catch (err) {
      failed++;
      failedList.push({ filename, error: err.message, url: item.originalUrl });
      console.error(`   ❌ فشل التحميل: ${err.message}`);
    }
    
    // تأخير بسيط لتفادي الـ rate limit من أرشيف الإنترنت
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n=======================================');
  console.log('🎉 اكتملت عملية التنزيل!');
  console.log(`   ✅ تم تنزيل واستبدال بالصور الحقيقية: ${downloaded}`);
  console.log(`   ❌ فشل التنزيل: ${failed}`);
  console.log('=======================================');
  
  if (failedList.length > 0) {
    console.log('\n⚠️ قائمة الصور التي فشل تحميلها:');
    failedList.forEach(item => {
      console.log(`   - ${item.filename}: ${item.error} (${item.url})`);
    });
  }
}

main().catch(console.error);
