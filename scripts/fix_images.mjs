import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, statSync, createWriteStream, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(PROJECT_ROOT, 'public');
const CACHE_DIR = join(PROJECT_ROOT, 'public', 'images', 'source_cache');

// التأكد من وجود مجلد الكاش
if (!existsSync(CACHE_DIR)) {
  mkdirSync(CACHE_DIR, { recursive: true });
}

// الفئات والروابط الخاصة بها من Unsplash (صور عالية الدقة ومجانية)
const SOURCE_IMAGES = {
  construction: [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503387873255-3a4a2e5d7190?q=80&w=800&auto=format&fit=crop',
  ],
  warehouse: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520626337972-ebf863448db6?q=80&w=800&auto=format&fit=crop',
  ],
  cladding: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=800&auto=format&fit=crop',
  ],
  canopy: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=800&auto=format&fit=crop',
  ],
  pergola: [
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
  ],
  tent: [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
  ],
  roof_tiles: [
    'https://images.unsplash.com/photo-1634739501538-4e12fb9c3c1e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1609766918277-5b3dd6279fcc?q=80&w=800&auto=format&fit=crop',
  ],
  fence: [
    'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579309442080-60b135bc6f50?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516216621174-b58ec9ad8535?q=80&w=800&auto=format&fit=crop',
  ]
};

/**
 * تنزيل ملف مع المتابعة
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        reject(new Error(`Status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

async function main() {
  console.log('📥 1. تنزيل الصور المصدرية من Unsplash لتخزينها مؤقتاً...');
  
  const cacheMap = {}; // category -> [localCachedPaths]
  
  for (const [category, urls] of Object.entries(SOURCE_IMAGES)) {
    cacheMap[category] = [];
    for (let i = 0; i < urls.length; i++) {
      const destFile = join(CACHE_DIR, `${category}_${i}.jpg`);
      if (existsSync(destFile) && statSync(destFile).size > 1000) {
        cacheMap[category].push(destFile);
        continue;
      }
      
      try {
        console.log(`   ⬇️  تنزيل صورة لـ ${category} (${i + 1}/${urls.length})...`);
        await downloadFile(urls[i], destFile);
        cacheMap[category].push(destFile);
      } catch (err) {
        console.error(`   ❌ فشل تنزيل ${urls[i]}: ${err.message}`);
      }
    }
  }

  console.log('\n🔍 2. قراءة ملفات البيانات وتجهيز خرائط الصور...');
  
  const cleanDataPath = join(PROJECT_ROOT, 'lib', 'data', 'clean_data.json');
  const galleryDataPath = join(PROJECT_ROOT, 'lib', 'data', 'gallery_data.json');
  
  const cleanData = JSON.parse(readFileSync(cleanDataPath, 'utf8'));
  const galleryData = JSON.parse(readFileSync(galleryDataPath, 'utf8'));
  
  // خريطة لتحديد فئة كل مسار صورة محلي
  const pathCategoryMap = {}; // relativePublicPath -> categoryKey
  
  // أ. معالجة clean_data (الخدمات والمشاريع)
  if (cleanData.services) {
    cleanData.services.forEach(s => {
      let cat = 'construction';
      const title = s.title;
      if (title.includes('هناجر') || title.includes('مستودع')) cat = 'warehouse';
      else if (title.includes('كلادنج') || title.includes('كلادينج')) cat = 'cladding';
      else if (title.includes('مظلات') || title.includes('سواتر')) cat = 'canopy';
      else if (title.includes('برجول') || title.includes('جلس')) cat = 'pergola';
      else if (title.includes('بيت شعر') || title.includes('خيام')) cat = 'tent';
      else if (title.includes('قرميد')) cat = 'roof_tiles';
      else if (title.includes('شبوك')) cat = 'fence';
      
      if (s.images) {
        s.images.forEach(img => {
          if (img.src) {
            pathCategoryMap[img.src] = cat;
          }
        });
      }
    });
  }
  
  if (cleanData.projects) {
    cleanData.projects.forEach(p => {
      let cat = 'construction';
      const title = p.title || '';
      if (title.includes('هناجر') || title.includes('مستودع')) cat = 'warehouse';
      else if (title.includes('كلادنج') || title.includes('كلادينج')) cat = 'cladding';
      else if (title.includes('مظلات') || title.includes('سواتر')) cat = 'canopy';
      else if (title.includes('برجول') || title.includes('جلس')) cat = 'pergola';
      else if (title.includes('بيت شعر') || title.includes('خيام')) cat = 'tent';
      else if (title.includes('قرميد')) cat = 'roof_tiles';
      else if (title.includes('شبوك')) cat = 'fence';
      
      if (p.images) {
        p.images.forEach(img => {
          if (img.src) {
            pathCategoryMap[img.src] = cat;
          }
        });
      }
    });
  }

  // ب. معالجة galleryData
  galleryData.forEach(item => {
    let cat = 'construction';
    const category = item.category || '';
    if (category.includes('هناجر') || category.includes('مستودع')) cat = 'warehouse';
    else if (category.includes('كلادنج') || category.includes('كلادينج')) cat = 'cladding';
    else if (category.includes('مظلات') || category.includes('سواتر')) cat = 'canopy';
    else if (category.includes('برجولات') || category.includes('جلسات')) cat = 'pergola';
    else if (category.includes('بيت شعر') || category.includes('خيام')) cat = 'tent';
    else if (category.includes('قرميد')) cat = 'roof_tiles';
    else if (category.includes('شبوك')) cat = 'fence';
    
    if (item.src) {
      pathCategoryMap[item.src] = cat;
    }
  });

  console.log('\n🛠️  3. البحث عن الصور ذات الحجم 0 بايت واستبدالها بالصور المناسبة...');
  
  const folders = ['services', 'gallery', 'blog'];
  let fixedCount = 0;
  let skippedCount = 0;
  
  folders.forEach(folder => {
    const folderPath = join(PUBLIC_DIR, 'images', folder);
    if (!existsSync(folderPath)) return;
    
    const files = readdirSync(folderPath);
    files.forEach((file, idx) => {
      const filePath = join(folderPath, file);
      const relPath = `/images/${folder}/${file}`;
      
      const stats = statSync(filePath);
      if (stats.isFile() && stats.size === 0) {
        // تحديد فئة الصورة
        let category = pathCategoryMap[relPath];
        
        // محاولة تحديد فئة الصورة من اسم الملف إذا لم تكن في الخريطة
        if (!category) {
          if (file.includes('هناجر') || file.includes('warehouse')) category = 'warehouse';
          else if (file.includes('كلادنج') || file.includes('كلادينج')) category = 'cladding';
          else if (file.includes('مظلات') || file.includes('سواتر') || file.includes('برجولات')) category = 'canopy';
          else if (file.includes('قرميد')) category = 'roof_tiles';
          else if (file.includes('شبوك')) category = 'fence';
          else if (file.includes('خيام') || file.includes('شعر')) category = 'tent';
          else category = folder === 'blog' ? 'construction' : 'construction';
        }
        
        const candidates = cacheMap[category] || cacheMap['construction'] || [];
        if (candidates.length > 0) {
          // اختيار صورة مرشحة بشكل دوري أو عشوائي لتفادي التكرار المباشر
          const selectedSource = candidates[idx % candidates.length];
          try {
            copyFileSync(selectedSource, filePath);
            fixedCount++;
          } catch (e) {
            console.error(`   ❌ فشل نسخ الصورة إلى ${file}: ${e.message}`);
          }
        } else {
          console.warn(`   ⚠️ لا توجد صور مصدرية متاحة للفئة ${category}`);
        }
      } else {
        skippedCount++;
      }
    });
  });

  console.log(`\n🎉 اكتمل استبدال الصور بنجاح!`);
  console.log(`   ✅ تم إصلاح واستبدال: ${fixedCount} صورة فارغة بصور عالية الدقة.`);
  console.log(`   ⏭️  تم تخطي: ${skippedCount} صورة (سليمة بالفعل أو ليست ملفات فارغة).`);
}

main().catch(console.error);
