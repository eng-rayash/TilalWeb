/**
 * سكريبت تنزيل الصور وتحويل المشروع إلى نظام محلي بالكامل
 * يعمل مع Node.js 18+ (يدعم fetch بشكل افتراضي)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_IMAGES_DIR = join(PROJECT_ROOT, 'public', 'images');

// إنشاء مجلدات الصور
const DIRS = {
  gallery:  join(PUBLIC_IMAGES_DIR, 'gallery'),
  services: join(PUBLIC_IMAGES_DIR, 'services'),
  projects: join(PUBLIC_IMAGES_DIR, 'projects'),
  hero:     join(PUBLIC_IMAGES_DIR, 'hero'),
  blog:     join(PUBLIC_IMAGES_DIR, 'blog'),
};

Object.values(DIRS).forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

// خريطة الروابط القديمة إلى المسارات الجديدة
const urlToLocalPath = new Map();

/**
 * استخراج اسم ملف آمن من URL
 */
function getSafeFilename(url) {
  try {
    const urlObj = new URL(url);
    let filename = basename(urlObj.pathname);
    // فك ترميز عربية
    filename = decodeURIComponent(filename);
    // تنظيف اسم الملف
    filename = filename.replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_');
    // ضمان وجود امتداد
    if (!extname(filename)) filename += '.jpg';
    return filename;
  } catch {
    return crypto.createHash('md5').update(url).digest('hex') + '.jpg';
  }
}

/**
 * تحديد المجلد المناسب بناءً على URL
 */
function getTargetDir(url, context = 'gallery') {
  if (context === 'hero' || url.includes('unsplash')) return DIRS.hero;
  if (context === 'blog') return DIRS.blog;
  if (context === 'project') return DIRS.projects;
  if (context === 'service') return DIRS.services;
  return DIRS.gallery;
}

/**
 * تنزيل صورة واحدة مع retry
 */
function downloadImage(url, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    if (existsSync(destPath)) {
      resolve(destPath);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'ar,en-US;q=0.9',
        'Referer': 'https://tlal-ksa.com/',
      }
    };

    const request = protocol.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        if (existsSync(destPath)) {
          try { require('fs').unlinkSync(destPath); } catch {}
        }
        // Follow redirect
        downloadImage(response.headers.location, destPath, retries - 1)
          .then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    });

    request.on('error', (err) => {
      file.close();
      if (retries > 0) {
        setTimeout(() => {
          downloadImage(url, destPath, retries - 1).then(resolve).catch(reject);
        }, 1000);
      } else {
        reject(err);
      }
    });

    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (retries > 0) {
        setTimeout(() => {
          downloadImage(url, destPath, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(new Error(`Timeout downloading ${url}`));
      }
    });
  });
}

/**
 * تحويل مسار محلي إلى مسار عام للـ Next.js
 */
function toPublicPath(absPath) {
  const rel = absPath.replace(join(PROJECT_ROOT, 'public'), '').replace(/\\/g, '/');
  return rel;
}

/**
 * جمع كل الروابط من ملف JSON
 */
function collectUrlsFromCleanData(data) {
  const urls = [];
  
  // صور الخدمات
  if (data.services) {
    data.services.forEach(service => {
      if (service.images) {
        service.images.forEach(img => {
          if (img.src && (img.src.startsWith('http://') || img.src.startsWith('https://'))) {
            urls.push({ url: img.src, context: 'service', ref: img, field: 'src' });
          }
        });
      }
    });
  }

  // صور المشاريع
  if (data.projects) {
    data.projects.forEach(project => {
      if (project.images) {
        project.images.forEach(img => {
          if (img.src && (img.src.startsWith('http://') || img.src.startsWith('https://'))) {
            urls.push({ url: img.src, context: 'project', ref: img, field: 'src' });
          }
        });
      }
    });
  }

  // صور المقالات
  if (data.articles) {
    data.articles.forEach(article => {
      if (article.images) {
        article.images.forEach(img => {
          if (img.src && (img.src.startsWith('http://') || img.src.startsWith('https://'))) {
            urls.push({ url: img.src, context: 'blog', ref: img, field: 'src' });
          }
        });
      }
    });
  }

  return urls;
}

/**
 * جمع كل الروابط من gallery_data.json
 */
function collectUrlsFromGalleryData(items) {
  return items
    .filter(item => item.src && (item.src.startsWith('http://') || item.src.startsWith('https://')))
    .map(item => ({ url: item.src, context: 'gallery', ref: item, field: 'src' }));
}

/**
 * الصور الثابتة في ملفات TSX (Unsplash وغيرها)
 */
const STATIC_HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop',
    filename: 'hero-construction.jpg',
    context: 'hero'
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop',
    filename: 'hero-services.jpg',
    context: 'hero'
  },
  {
    url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop',
    filename: 'service-fallback-1.jpg',
    context: 'hero'
  },
  {
    url: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=800&auto=format&fit=crop',
    filename: 'service-fallback-2.jpg',
    context: 'hero'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    filename: 'service-fallback-3.jpg',
    context: 'hero'
  },
  {
    url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=800&auto=format&fit=crop',
    filename: 'service-fallback-4.jpg',
    context: 'hero'
  },
];

// ===========================
// الدالة الرئيسية
// ===========================
async function main() {
  console.log('\n🚀 بدء عملية تنزيل الصور وتجهيز المشروع محلياً...\n');
  
  // قراءة ملفات البيانات
  const cleanDataPath = join(PROJECT_ROOT, 'lib', 'data', 'clean_data.json');
  const galleryDataPath = join(PROJECT_ROOT, 'lib', 'data', 'gallery_data.json');
  
  console.log('📂 قراءة ملفات البيانات...');
  const cleanData = JSON.parse(readFileSync(cleanDataPath, 'utf8'));
  const galleryData = JSON.parse(readFileSync(galleryDataPath, 'utf8'));

  // جمع كل الروابط
  const cleanDataUrls = collectUrlsFromCleanData(cleanData);
  const galleryDataUrls = collectUrlsFromGalleryData(galleryData);
  
  console.log(`📊 تم العثور على:`);
  console.log(`   - ${cleanDataUrls.length} صورة في clean_data.json`);
  console.log(`   - ${galleryDataUrls.length} صورة في gallery_data.json`);
  console.log(`   - ${STATIC_HERO_IMAGES.length} صورة ثابتة (Hero/Unsplash)`);
  
  const allUrls = [...cleanDataUrls, ...galleryDataUrls];
  
  // إنشاء خريطة URL → مسار محلي (لتجنب التكرار)
  const downloadMap = new Map(); // url → { localPath, publicPath }
  
  // معالجة روابط clean_data و gallery_data
  for (const item of allUrls) {
    if (!downloadMap.has(item.url)) {
      const filename = getSafeFilename(item.url);
      const dir = getTargetDir(item.url, item.context);
      
      // التأكد من عدم تكرار اسم الملف
      let finalFilename = filename;
      let counter = 1;
      while (existsSync(join(dir, finalFilename)) && !downloadMap.has(item.url)) {
        // إذا الملف موجود مسبقاً (من تنزيل سابق)، استخدمه
        break;
      }
      
      const localPath = join(dir, finalFilename);
      const publicPath = toPublicPath(localPath);
      downloadMap.set(item.url, { localPath, publicPath });
    }
  }
  
  // معالجة الصور الثابتة (Unsplash)
  for (const staticImg of STATIC_HERO_IMAGES) {
    const localPath = join(DIRS.hero, staticImg.filename);
    const publicPath = toPublicPath(localPath);
    downloadMap.set(staticImg.url, { localPath, publicPath });
  }
  
  // تنزيل الصور مع تتبع التقدم
  let downloaded = 0, skipped = 0, failed = 0;
  const failedUrls = [];
  const total = downloadMap.size;
  
  console.log(`\n⬇️  بدء تنزيل ${total} صورة...\n`);
  
  for (const [url, { localPath, publicPath }] of downloadMap.entries()) {
    const displayUrl = url.length > 80 ? url.substring(0, 77) + '...' : url;
    
    if (existsSync(localPath)) {
      skipped++;
      process.stdout.write(`\r⏭️  [${downloaded + skipped + failed}/${total}] تخطي (موجودة): ${basename(localPath)}`);
      continue;
    }
    
    try {
      await downloadImage(url, localPath);
      downloaded++;
      process.stdout.write(`\r✅ [${downloaded + skipped + failed}/${total}] تم: ${basename(localPath)}                    `);
    } catch (err) {
      failed++;
      failedUrls.push({ url, error: err.message });
      process.stdout.write(`\r❌ [${downloaded + skipped + failed}/${total}] فشل: ${basename(localPath)}                    `);
    }
    
    // تأخير بسيط لتجنب الحظر
    await new Promise(r => setTimeout(r, 150));
  }
  
  console.log(`\n\n📊 نتائج التنزيل:`);
  console.log(`   ✅ تم تنزيله: ${downloaded}`);
  console.log(`   ⏭️  تم تخطيه (موجودة): ${skipped}`);
  console.log(`   ❌ فشل: ${failed}`);
  
  if (failedUrls.length > 0) {
    console.log(`\n⚠️  الروابط التي فشل تنزيلها:`);
    failedUrls.forEach(({ url, error }) => console.log(`   - ${url}: ${error}`));
  }
  
  // ===========================
  // تحديث ملف clean_data.json
  // ===========================
  console.log('\n🔄 تحديث clean_data.json...');
  
  let cleanDataModified = false;
  
  // تحديث صور الخدمات
  if (cleanData.services) {
    cleanData.services.forEach(service => {
      if (service.images) {
        service.images.forEach(img => {
          if (img.src && downloadMap.has(img.src)) {
            img.src = downloadMap.get(img.src).publicPath;
            cleanDataModified = true;
          }
        });
      }
    });
  }
  
  // تحديث صور المشاريع
  if (cleanData.projects) {
    cleanData.projects.forEach(project => {
      if (project.images) {
        project.images.forEach(img => {
          if (img.src && downloadMap.has(img.src)) {
            img.src = downloadMap.get(img.src).publicPath;
            cleanDataModified = true;
          }
        });
      }
    });
  }
  
  // تحديث صور المقالات
  if (cleanData.articles) {
    cleanData.articles.forEach(article => {
      if (article.images) {
        article.images.forEach(img => {
          if (img.src && downloadMap.has(img.src)) {
            img.src = downloadMap.get(img.src).publicPath;
            cleanDataModified = true;
          }
        });
      }
    });
  }
  
  if (cleanDataModified) {
    writeFileSync(cleanDataPath, JSON.stringify(cleanData, null, 2), 'utf8');
    console.log('   ✅ تم تحديث clean_data.json');
  }
  
  // ===========================
  // تحديث ملف gallery_data.json
  // ===========================
  console.log('🔄 تحديث gallery_data.json...');
  
  let galleryModified = false;
  galleryData.forEach(item => {
    if (item.src && downloadMap.has(item.src)) {
      item.src = downloadMap.get(item.src).publicPath;
      galleryModified = true;
    }
  });
  
  if (galleryModified) {
    writeFileSync(galleryDataPath, JSON.stringify(galleryData, null, 2), 'utf8');
    console.log('   ✅ تم تحديث gallery_data.json');
  }
  
  // ===========================
  // حفظ خريطة التحويل للاستخدام في تحديث TSX
  // ===========================
  const mappingPath = join(PROJECT_ROOT, 'scripts', 'url_mapping.json');
  const mapping = {};
  downloadMap.forEach((value, key) => {
    mapping[key] = value.publicPath;
  });
  writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`\n💾 تم حفظ خريطة التحويل في: scripts/url_mapping.json`);
  
  console.log('\n🎉 تم الانتهاء من تنزيل الصور وتحديث ملفات JSON!\n');
  console.log('📋 الخطوة التالية: تشغيل سكريبت تحديث ملفات TSX');
  console.log('   node scripts/update_tsx_images.mjs\n');
}

main().catch(console.error);
