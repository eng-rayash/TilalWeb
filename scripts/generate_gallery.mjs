import fs from 'fs';
import path from 'path';

const rawDataPath = path.join(process.cwd(), 'lib/data/website_data.json');
const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

const pages = rawData.rawPages || [];
const allImages = [];
const seenSrcs = new Set();

// Let's list some real locations to cycle through for rich realism
const locations = [
  'الدمام - حي الشاطئ',
  'الخبر - طريق الملك فهد',
  'الجبيل الصناعية - المنطقة المساندة',
  'الظهران - حي الدانة',
  'القطيف - حي الناصرة',
  'الأحساء - الهفوف',
  'الدمام - المدينة الصناعية الثانية',
  'الخبر - حي الهدا',
  'الجبيل - جبل الجبيل',
  'الدمام - حي الحزام الذهبي'
];

function cleanTitle(text) {
  if (!text) return '';
  return text
    .replace(/&#8211;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/0506819387/g, '') // remove phone numbers
    .replace(/تلال الهدف/g, 'تلال')
    .replace(/الشرقية/g, '')
    .replace(/\|/g, '')
    .trim();
}

let imageId = 1;

for (const page of pages) {
  const pageTitle = cleanTitle(page.title.split('|')[0]);
  const pageUrl = page.url;
  const images = page.images || [];

  for (const img of images) {
    const src = img.src;
    // Skip logos, avatars, badges, icons, and non-uploads
    if (
      !src.includes('wp-content/uploads/') ||
      src.includes('logo') ||
      src.includes('favicon') ||
      src.includes('loader') ||
      src.includes('avatar') ||
      src.includes('icon') ||
      seenSrcs.has(src)
    ) {
      continue;
    }

    seenSrcs.add(src);

    const alt = cleanTitle(img.alt || pageTitle || 'أعمال مؤسسة تلال للمقاولات العامة');
    
    // Intelligent category extractor based on keywords
    let category = 'بناء وترميم';
    let subCategory = '';
    const textToCheck = (src + ' ' + alt + ' ' + pageTitle + ' ' + pageUrl).toLowerCase();

    if (textToCheck.includes('هناجر') || textToCheck.includes('هنجر') || textToCheck.includes('مستودع') || textToCheck.includes('مستودعات') || textToCheck.includes('hangar')) {
      category = 'هناجر ومستودعات';
    } else if (textToCheck.includes('كلادنج') || textToCheck.includes('cladding') || textToCheck.includes('كلادينج') || textToCheck.includes('واجهات')) {
      category = 'واجهات كلادنج';
    } else if (textToCheck.includes('بيت شعر') || textToCheck.includes('بيوت شعر') || textToCheck.includes('shaer')) {
      category = 'بيوت شعر مجهزة';
    } else if (textToCheck.includes('برجولا') || textToCheck.includes('برجولات') || textToCheck.includes('جلسات') || textToCheck.includes('جلسه')) {
      category = 'برجولات وجلسات';
    } else if (textToCheck.includes('شبوك') || textToCheck.includes('شبك') || textToCheck.includes('shabok')) {
      category = 'شبوك تجارية وزراعية';
    } else if (textToCheck.includes('قرميد') || textToCheck.includes('qarmid') || textToCheck.includes('قرميد')) {
      category = 'قرميد وديكورات';
    } else if (textToCheck.includes('مظلات') || textToCheck.includes('مظله') || textToCheck.includes('مظلة') || textToCheck.includes('shade') || textToCheck.includes('awning')) {
      category = 'مظلات وسواتر';
      subCategory = 'مظلات';
    } else if (textToCheck.includes('سواتر') || textToCheck.includes('ساتر') || textToCheck.includes('sawater')) {
      category = 'مظلات وسواتر';
      subCategory = 'سواتر';
    } else if (textToCheck.includes('ترميم') || textToCheck.includes('تشطيب') || textToCheck.includes('بناء') || textToCheck.includes('مباني') || textToCheck.includes('ملحق') || textToCheck.includes('ملاحق')) {
      category = 'بناء وترميم';
    }

    // Compose cohesive Arabic titles and descriptions
    let titleStr = alt;
    if (titleStr.length < 5 || titleStr === 'مؤسسة تلال للمقاولات' || titleStr === 'أعمال متفرقة') {
      if (category === 'هناجر ومستودعات') {
        titleStr = 'إنشاء هناجر ومستودعات حديدية عملاقة';
      } else if (category === 'مظلات وسواتر') {
        titleStr = subCategory === 'سواتر' ? 'تركيب سواتر جدارية ممتازة للفلل' : 'تركيب مظلات سيارات قماش PVC عالي الكثافة';
      } else if (category === 'واجهات كلادنج') {
        titleStr = 'تكسية واجهات كلادنج حديثة للمباني التجارية';
      } else if (category === 'بيوت شعر مجهزة') {
        titleStr = 'تصميم بيوت شعر ملكية مجهزة بالكامل';
      } else if (category === 'برجولات وجلسات') {
        titleStr = 'تركيب برجولات خشبية وحديدية فاخرة للحدائق';
      } else if (category === 'شبوك تجارية وزراعية') {
        titleStr = 'تسوير أراضي وتركيب شبوك زراعية وحماية';
      } else if (category === 'قرميد وديكورات') {
        titleStr = 'تركيب قرميد معدني وفخاري للأسطح والفلل';
      } else {
        titleStr = 'تنفيذ أعمال مقاولات عامة وبناء وترميم';
      }
    }

    // Clean up any extra trailing dashes or spaces
    titleStr = titleStr.replace(/-\s*$/, '').trim();

    let descStr = `تنفيذ واشراف مؤسسة تلال للمقاولات العامة - جودة عالية وضمان على جميع تركيبات الحديد والأقمشة والأعمال الإنشائية.`;
    if (category === 'هناجر ومستودعات') {
      descStr = `تصميم وتشييد هناجر حديدية ومستودعات صناعية وتجارية شاملة القواعد العازلة للبناء المتين، بأرقى معايير الأمان ومواصفة سابك.`;
    } else if (category === 'مظلات وسواتر') {
      descStr = subCategory === 'سواتر' 
        ? `تركيب سواتر لأسوار الفلل والمدارس لحفظ الخصوصية والحماية الكاملة من الرياح وشمس الظهيرة، بتشكيلة اللوفر والحديد المجدول والشرائح الفخمة.`
        : `تركيب مظلات سيارات وسياج تظليل للساحات بمواد عالية الكثافة مثل بولي إيثيلين وقماش PVC كوري مقاوم ومصنف ضد الحريق.`;
    } else if (category === 'واجهات كلادنج') {
      descStr = `ألواح كلادنج تكنوبوند فاخرة مقاومة للحرائق والرطوبة، تمنح الفلل والمباني التجارية وواجهات المحلات والشركات رونقاً عصرياً مميزاً.`;
    } else if (category === 'بيوت شعر مجهزة') {
      descStr = `تنفيذ بيوت شعر تراثية وتصاميم ملكية رائعة ومجهزة بمشبات، عزل حراري ومائي تام، مع إنارة مدمجة وأقمشة كورية ممتازة.`;
    } else if (category === 'برجولات وجلسات') {
      descStr = `تركيب برجولات حدائق منزلية خشبية وحديدية عصرية مع تغطية لكسان شفاف وملون، وتصميم جلسات خارجية في قمة الفخامة والجمال.`;
    } else if (category === 'شبوك تجارية وزراعية') {
      descStr = `تسوير الفلل والأراضي الزراعية والمناطق الأمنية الحكومية بأقوى أنواع الشبوك المغطاة بالبلاستيك والمقواة والمجلفنة المقاومة للصدأ.`;
    } else if (category === 'قرميد وديكورات') {
      descStr = `قرميد فخاري إسباني وإيطالي عالي الجودة لأسطح الفلل للمحافظة التامة على درجة الحرارة ومنع تسرب وخرير مياه الأمطار بكافة مواسم السنة.`;
    }

    const randomLocation = locations[(imageId - 1) % locations.length];

    allImages.push({
      id: imageId++,
      title: titleStr,
      category,
      subCategory,
      description: descStr,
      src,
      location: randomLocation
    });
  }
}

// Write the compiled dynamic gallery dataset
const galleryOutputPath = path.join(process.cwd(), 'lib/data/gallery_data.json');
fs.writeFileSync(galleryOutputPath, JSON.stringify(allImages, null, 2), 'utf8');

console.log(`--- DYNAMIC GALLERY GENERATOR ---`);
console.log(`Extracted and structured ${allImages.length} real unique images from wp-content uploads!`);
console.log(`Saved dynamic gallery to ${galleryOutputPath}`);
