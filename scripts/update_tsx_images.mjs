/**
 * سكريبت تحديث ملفات TSX لاستخدام الصور المحلية
 * يستبدل جميع روابط الصور الخارجية بمسارات محلية
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// خريطة الاستبدال المباشرة لروابط Unsplash في ملفات TSX
const UNSPLASH_REPLACEMENTS = {
  // صور الهيرو الرئيسية
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop': '/images/hero/hero-construction.jpg',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop': '/images/hero/hero-construction.jpg',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop': '/images/hero/hero-services.jpg',
  
  // صور fallback للخدمات
  'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop': '/images/hero/service-fallback-1.jpg',
  'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=800&auto=format&fit=crop': '/images/hero/service-fallback-2.jpg',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop': '/images/hero/service-fallback-3.jpg',
  'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=800&auto=format&fit=crop': '/images/hero/service-fallback-4.jpg',
};

// قراءة خريطة التحويل من سكريبت التنزيل (إن وجدت)
let urlMapping = {};
const mappingPath = join(PROJECT_ROOT, 'scripts', 'url_mapping.json');
if (existsSync(mappingPath)) {
  urlMapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
  console.log(`📂 تم تحميل ${Object.keys(urlMapping).length} رابط من خريطة التحويل`);
}

// دمج الخرائط
const allReplacements = { ...urlMapping, ...UNSPLASH_REPLACEMENTS };

/**
 * تحديث ملف TSX
 */
function updateTsxFile(filePath, replacements) {
  if (!existsSync(filePath)) {
    console.log(`⚠️  الملف غير موجود: ${filePath}`);
    return false;
  }

  let content = readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [oldUrl, newPath] of Object.entries(replacements)) {
    if (content.includes(oldUrl)) {
      content = content.replaceAll(oldUrl, newPath);
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ تم تحديث: ${filePath.replace(PROJECT_ROOT, '')}`);
  } else {
    console.log(`   ⏭️  لا توجد تغييرات في: ${filePath.replace(PROJECT_ROOT, '')}`);
  }

  return modified;
}

// ===========================
// ملفات TSX التي تحتاج تحديث
// ===========================
const TSX_FILES = [
  join(PROJECT_ROOT, 'app', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'about', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'services', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'services', '[slug]', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'projects', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'gallery', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'blog', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'blog', '[slug]', 'page.tsx'),
  join(PROJECT_ROOT, 'app', 'contact', 'page.tsx'),
  join(PROJECT_ROOT, 'components', 'Header.tsx'),
  join(PROJECT_ROOT, 'components', 'Footer.tsx'),
  join(PROJECT_ROOT, 'components', 'FloatingButtons.tsx'),
];

console.log('\n🔄 تحديث ملفات TSX...\n');

let totalModified = 0;
for (const filePath of TSX_FILES) {
  const modified = updateTsxFile(filePath, allReplacements);
  if (modified) totalModified++;
}

console.log(`\n✅ تم تحديث ${totalModified} ملف من أصل ${TSX_FILES.length}`);

// ===========================
// تحديث next.config.ts
// ===========================
const nextConfigPath = join(PROJECT_ROOT, 'next.config.ts');
console.log('\n🔄 تحديث next.config.ts...');

const nextConfigContent = `import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // الصور محلية الآن - لا نحتاج remotePatterns للصور الرئيسية
  // لكن نبقي على بعض المصادر كاحتياط
  images: {
    remotePatterns: [],
    // تمكين تحسين الصور المحلية
    formats: ['image/webp', 'image/avif'],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
`;

writeFileSync(nextConfigPath, nextConfigContent, 'utf8');
console.log('   ✅ تم تحديث next.config.ts');

console.log('\n🎉 تم الانتهاء من تحديث جميع ملفات TSX!\n');
