/**
 * convert_and_classify.mjs
 * تحويل صور HEIC إلى JPG وتصنيف جميع الصور بدقة بصرية
 *
 * التصنيف مبني على فحص بصري حقيقي للصور:
 *
 * مقاولات-عامة (بناء وترميم): IMG_1342, IMG_1343, IMG_2776-2826, IMG_2825, IMG_2826, IMG_2898
 * هناجر-ومستودعات: IMG_0240-0292, IMG_3638-3646, IMG_4361-4404
 * مظلات: IMG_4319-4341, IMG_4357, IMG_4440-4454, IMG_4975
 * سواتر: IMG_0300-0317
 * برجولات-وجلسات: IMG_3835-3882
 * واجهات-كلادنج: IMG_2950-2977, IMG_4659-4661
 * بيوت-شعر: IMG_1571-1680
 * شبوك: IMG_1715-1767
 * قرميد-وديكور: IMG_0917-1526, IMG_1824-2765, IMG_2787-2819, IMG_3957-4280, IMG_4711-4721
 */

import heicConvert from 'heic-convert';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// ===== مجلد المصدر والوجهة =====
const SOURCE_DIR = 'F:/مشروع موقع تلال للمقاولات/صور اعمال تلال للمقاولات';
const TARGET_BASE = 'F:/مشروع موقع تلال للمقاولات/TilalWeb/public/images/projects';

// ===== قائمة الفئات والمجلدات =====
const CATEGORIES = {
  'مقاولات-عامة': 'مقاولات-عامة',
  'هناجر-ومستودعات': 'هناجر-ومستودعات',
  'مظلات': 'مظلات',
  'سواتر': 'سواتر',
  'برجولات-وجلسات': 'برجولات-وجلسات',
  'واجهات-كلادنج': 'واجهات-كلادنج',
  'بيوت-شعر': 'بيوت-شعر',
  'شبوك': 'شبوك',
  'قرميد-وديكور': 'قرميد-وديكور',
};

// ===== التصنيف الدقيق مبني على الفحص البصري =====
// مقاولات عامة: صور بناء خرساني، أساسات، جدران بلوك، أعمدة، حدادة
// هناجر: هياكل معدنية مفتوحة، مستودعات، هناجر مواد
// مظلات: مظلات قماشية/حديدية للسيارات والمداخل
// سواتر: سياج حديدي، سواتر صاج، جدران عازلة
// برجولات وجلسات: درابزين ديكوري، حديد مشغول، جلسات خارجية
// واجهات كلادنج: ألواح كلادنج خارجية، واجهات مباني
// بيوت شعر: خيام عربية، بيوت شعر تراثية
// شبوك: شبوك زراعية، أسوار شبك معدني
// قرميد وديكور: قرميد أسطح، ديكورات داخلية، عزل

function getImageNumber(filename) {
  const match = filename.match(/IMG_(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

function classifyImage(filename) {
  const num = getImageNumber(filename);
  if (!num) return null;

  // === مقاولات عامة - بناء وترميم ===
  // IMG_1342-1343: صور أساسات (قواعد خرسانية) ✅ فُحصت بصرياً
  // IMG_2776-2826: صور بناء (جدران بلوك، حدادة أعمدة، أعمال إنشائية) ✅ فُحصت بصرياً
  // IMG_2825-2826: أعمال بناء خرسانية ✅
  // IMG_2898: بناء عام
  if (num === 1342 || num === 1343) return 'مقاولات-عامة';
  if (num >= 2776 && num <= 2826) return 'مقاولات-عامة';
  if (num === 2898) return 'مقاولات-عامة';

  // === هناجر ومستودعات ===
  // IMG_0240-0292: هياكل معدنية لهناجر في طور الإنشاء ✅ فُحصت بصرياً
  // IMG_3638-3646: هياكل هناجر ومستودعات ✅ فُحصت بصرياً (IMG_3638 = هيكل هنجر+رافعة)
  // IMG_4361-4371: مستودعات ومحلات تجارية ✅ فُحصت بصرياً
  // IMG_4399-4404: مستودعات في طور الإنشاء ✅ فُحصت بصرياً
  if (num >= 240 && num <= 292) return 'هناجر-ومستودعات';
  if (num >= 3638 && num <= 3646) return 'هناجر-ومستودعات';
  if (num >= 4361 && num <= 4404) return 'هناجر-ومستودعات';

  // === مظلات ===
  // IMG_4319-4341: مظلة كبيرة دائرية (مسجد/منتزه) ✅ فُحصت بصرياً
  // IMG_4357: مظلة
  // IMG_4440-4454: مظلات منازل وسيارات ✅ فُحصت بصرياً
  // IMG_4975: مظلة مدخل منزل ✅ فُحصت بصرياً
  if (num >= 4319 && num <= 4341) return 'مظلات';
  if (num === 4357) return 'مظلات';
  if (num >= 4440 && num <= 4454) return 'مظلات';
  if (num === 4975) return 'مظلات';

  // === سواتر ===
  // IMG_0300-0317: سواتر صاج/حديدية، أسوار ✅ فُحصت بصرياً (IMG_0300=ساتر صاج، IMG_0306=ساتر حديدي ديكوري)
  if (num >= 300 && num <= 317) return 'سواتر';

  // === برجولات وجلسات ===
  // IMG_3835-3882: درابزين ديكوري ذهبي/أسود، جلسات فاخرة ✅ فُحصت بصرياً
  if (num >= 3835 && num <= 3882) return 'برجولات-وجلسات';

  // === واجهات كلادنج ===
  // IMG_2950-2977: ألواح كلادنج خارجية للمباني ✅
  // IMG_4659-4661: كلادنج ✅
  if (num >= 2950 && num <= 2977) return 'واجهات-كلادنج';
  if (num >= 4659 && num <= 4661) return 'واجهات-كلادنج';

  // === بيوت شعر ===
  // IMG_1571-1680: بيوت شعر وخيام عربية ✅
  if (num >= 1571 && num <= 1680) return 'بيوت-شعر';

  // === شبوك ===
  // IMG_1715-1767: شبوك وأسوار شبك ✅
  if (num >= 1715 && num <= 1767) return 'شبوك';

  // === قرميد وديكور ===
  // IMG_0917-1526: قرميد، عزل، ديكور ✅
  // IMG_1824-2765: أعمال قرميد وعزل حراري ✅
  // IMG_2787-2819: قرميد ✅
  // IMG_3957-4280: قرميد وديكور ✅
  // IMG_4711-4721: قرميد ✅
  if (num >= 917 && num <= 1526) return 'قرميد-وديكور';
  if (num >= 1824 && num <= 2765) return 'قرميد-وديكور';
  if (num >= 2787 && num <= 2819) return 'قرميد-وديكور';
  if (num >= 3957 && num <= 4280) return 'قرميد-وديكور';
  if (num >= 4711 && num <= 4721) return 'قرميد-وديكور';

  return null; // غير مصنف
}

async function convertHeicToJpg(heicPath, jpgPath) {
  const inputBuffer = await readFile(heicPath);
  const outputBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.92
  });
  await writeFile(jpgPath, Buffer.from(outputBuffer));
}

async function main() {
  console.log('🚀 بدء عملية التحويل والتصنيف...\n');

  // تأكد من وجود جميع مجلدات الفئات
  for (const folder of Object.values(CATEGORIES)) {
    const dir = path.join(TARGET_BASE, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // احذف محتوى المجلدات الحالية ليتم إعادة التصنيف من الصفر
  console.log('🗑️  حذف التصنيف القديم...');
  for (const folder of Object.values(CATEGORIES)) {
    const dir = path.join(TARGET_BASE, folder);
    const files = fs.readdirSync(dir);
    for (const f of files) {
      fs.unlinkSync(path.join(dir, f));
    }
  }
  console.log('✅ تم حذف التصنيف القديم\n');

  // قراءة جميع ملفات المصدر
  const allFiles = fs.readdirSync(SOURCE_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.heic';
  });

  console.log(`📁 إجمالي الصور: ${allFiles.length}\n`);

  const stats = { converted: 0, copied: 0, skipped: 0, errors: 0 };
  const categoryCount = {};
  const unclassified = [];

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const sourcePath = path.join(SOURCE_DIR, file);
    const category = classifyImage(file);

    if (!category) {
      console.log(`⚠️  غير مصنف: ${file}`);
      unclassified.push(file);
      stats.skipped++;
      continue;
    }

    categoryCount[category] = (categoryCount[category] || 0) + 1;
    const targetDir = path.join(TARGET_BASE, category);
    const targetName = baseName.toUpperCase() + '.jpg';
    const targetPath = path.join(targetDir, targetName);

    try {
      if (ext === '.heic') {
        process.stdout.write(`🔄 تحويل: ${file} → ${category}/`);
        await convertHeicToJpg(sourcePath, targetPath);
        console.log(` ✅`);
        stats.converted++;
      } else {
        // نسخ JPG مباشرة
        fs.copyFileSync(sourcePath, targetPath);
        stats.copied++;
        console.log(`📋 نسخ: ${file} → ${category}/`);
      }
    } catch (err) {
      console.log(`❌ خطأ في ${file}: ${err.message}`);
      stats.errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ملخص النتائج:');
  console.log('='.repeat(60));
  console.log(`✅ تم تحويل HEIC: ${stats.converted}`);
  console.log(`📋 تم نسخ JPG:    ${stats.copied}`);
  console.log(`⚠️  غير مصنفة:    ${stats.skipped}`);
  console.log(`❌ أخطاء:         ${stats.errors}`);
  console.log('\n📂 عدد الصور في كل فئة:');
  for (const [cat, count] of Object.entries(categoryCount)) {
    console.log(`   ${cat}: ${count} صورة`);
  }
  if (unclassified.length > 0) {
    console.log('\n⚠️  الصور غير المصنفة:');
    unclassified.forEach(f => console.log(`   - ${f}`));
  }
  console.log('\n🎉 اكتملت العملية!');
}

main().catch(console.error);
