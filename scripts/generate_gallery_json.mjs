import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = 'F:/مشروع موقع تلال للمقاولات/TilalWeb/public/images/projects';
const OUTPUT_FILE = 'F:/مشروع موقع تلال للمقاولات/TilalWeb/lib/data/gallery_data.json';

const CATEGORIES_MAP = {
  'مقاولات-عامة': {
    categoryName: 'مقاولات عامة وبناء',
    title: 'مقاولات عامة وبناء - مؤسسة تلال',
    alt: 'أعمال المقاولات العامة والبناء والترميم والتشطيب من مؤسسة تلال'
  },
  'هناجر-ومستودعات': {
    categoryName: 'هناجر ومستودعات',
    title: 'هناجر ومستودعات - مؤسسة تلال',
    alt: 'تصميم وتركيب هناجر ومستودعات ومخازن حديدية بمواصفات عالية'
  },
  'مظلات': {
    categoryName: 'مظلات',
    title: 'مظلات وسيارات - مؤسسة تلال',
    alt: 'تركيب مظلات سيارات ومظلات مساجد وحدائق بأحدث التصاميم ومقاومة للحرارة'
  },
  'سواتر': {
    categoryName: 'سواتر',
    title: 'سواتر وحواجز - مؤسسة تلال',
    alt: 'تركيب سواتر جدارية حديدية وخشبية وشرائح لحجب الرؤية وزيادة الأمان'
  },
  'برجولات-وجلسات': {
    categoryName: 'برجولات وجلسات',
    title: 'برجولات وجلسات - مؤسسة تلال',
    alt: 'تصميم جلسات خارجية وبرجولات حديدية وخشبية مودرن للمنازل والحدائق'
  },
  'واجهات-كلادنج': {
    categoryName: 'واجهات كلادنج',
    title: 'واجهات كلادنج - مؤسسة تلال',
    alt: 'تركيب واجهات كلادنج للمحلات والمباني التجارية بألوان وتصاميم عصرية'
  },
  'بيوت-شعر': {
    categoryName: 'بيوت شعر',
    title: 'بيوت شعر - مؤسسة تلال',
    alt: 'تصميم وتركيب بيوت شعر ملكية وتراثية مجهزة بالكامل ومقاومة لعوامل الطقس'
  },
  'شبوك': {
    categoryName: 'شبوك',
    title: 'شبوك وحماية - مؤسسة تلال',
    alt: 'تركيب شبوك زراعية وحماية وأسوار أمنية للمزارع والمواقع الحكومية والخاصة'
  },
  'قرميد-وديكور': {
    categoryName: 'قرميد وديكور',
    title: 'قرميد وديكور - مؤسسة تلال',
    alt: 'أعمال تركيب قرميد أسطح وعوازل وديكورات متميزة للمنازل والفلل'
  },
  'أعمال متنوعة': {
    categoryName: 'أعمال متنوعة',
    title: 'أعمال متنوعة - مؤسسة تلال',
    alt: 'أعمال مقاولات وتركيبات متنوعة ومتفرقة من مؤسسة تلال بالمنطقة الشرقية'
  }
};

function main() {
  console.log('🔄 جاري توليد ملف gallery_data.json...');
  
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.error(`❌ المجلد غير موجود: ${PROJECTS_DIR}`);
    process.exit(1);
  }

  const galleryItems = [];
  let globalId = 1;

  // قراءة المجلدات الفرعية
  const folders = fs.readdirSync(PROJECTS_DIR);

  for (const folder of folders) {
    const folderPath = path.join(PROJECTS_DIR, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const config = CATEGORIES_MAP[folder];
    if (!config) {
      console.log(`⚠️ فئة غير معروفة في مجلد المشاريع: ${folder}`);
      continue;
    }

    // قراءة الصور داخل المجلد
    const files = fs.readdirSync(folderPath).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    // ترتيب الملفات حسب الرقم إذا أمكن
    files.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    console.log(`📂 الفئة [${folder}]: تم العثور على ${files.length} صورة`);

    for (const file of files) {
      const srcPath = `/images/projects/${folder}/${file}`;
      galleryItems.push({
        id: String(globalId++),
        src: srcPath,
        title: config.title,
        category: config.categoryName,
        alt: `${config.alt} - صورة رقم ${file.replace(/\D/g, '') || globalId}`
      });
    }
  }

  // حفظ الملف الناتج
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(galleryItems, null, 2), 'utf-8');
  console.log(`✅ تم توليد ملف معرض الصور بنجاح! الإجمالي: ${galleryItems.length} صورة.`);
  console.log(`📍 مسار الملف: ${OUTPUT_FILE}`);
}

main();
