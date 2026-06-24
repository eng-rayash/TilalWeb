# تلال للمقاولات — TilalWeb

<div align="center">

![Tilal Logo](./public/logo.png)

**موقع ويب لشركة تلال للمقاولات**  
*Next.js 15 · React 19 · TypeScript · Tailwind CSS 4*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 نظرة عامة

موقع إلكتروني متكامل لشركة **تلال للمقاولات**، مبني بتقنيات حديثة وبدون أي اعتماد على الذكاء الاصطناعي. يشمل:

- 🏠 **صفحة رئيسية** تفاعلية مع أقسام متكاملة
- 🔧 **صفحات الخدمات** مع محتوى تفصيلي ومقالات
- 📂 **معرض الأعمال** والمشاريع المنجزة
- 💬 **شهادات العملاء** وقسم التواصل
- 🔐 **لوحة تحكم Admin** محمية بكلمة مرور
- 📊 **نظام تتبع الزوار** وإحصاءات الموقع

---

## 🗂️ هيكل المشروع

```
TilalWeb/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout عام للموقع (SEO، Fonts، Header، Footer)
│   ├── page.tsx                  # الصفحة الرئيسية (Home)
│   ├── globals.css               # الأنماط العامة
│   ├── robots.ts                 # ملف robots.txt ديناميكي
│   ├── sitemap.ts                # Sitemap XML ديناميكي
│   │
│   ├── about/                    # صفحة من نحن
│   ├── contact/                  # صفحة التواصل
│   ├── services/                 # صفحات الخدمات
│   ├── projects/                 # صفحات المشاريع والمعرض
│   ├── gallery/                  # معرض الصور العام
│   │
│   ├── admin/                    # لوحة التحكم (محمية)
│   │   ├── layout.tsx            # Layout الإدارة
│   │   ├── page.tsx              # لوحة التحكم الرئيسية
│   │   ├── login/                # صفحة تسجيل الدخول
│   │   ├── projects/             # إدارة المشاريع
│   │   ├── services/             # إدارة الخدمات
│   │   ├── gallery/              # إدارة معرض الصور
│   │   ├── testimonials/         # إدارة الشهادات
│   │   ├── settings/             # إعدادات الموقع
│   │   └── analytics/            # صفحة الإحصاءات
│   │
│   └── api/                      # API Routes (Server-Side)
│       ├── track/                # تتبع الزيارات
│       └── admin/
│           ├── auth/             # المصادقة وتسجيل الدخول
│           ├── analytics/        # بيانات الإحصاءات
│           ├── projects/         # CRUD المشاريع
│           ├── services/         # CRUD الخدمات
│           ├── gallery/          # CRUD معرض الصور
│           ├── testimonials/     # CRUD الشهادات
│           ├── settings/         # قراءة/تحديث الإعدادات
│           └── upload/           # رفع الصور عبر ImageKit
│
├── components/                   # مكونات React المشتركة
│   ├── Header.tsx                # شريط التنقل العلوي
│   ├── Footer.tsx                # تذييل الصفحة
│   ├── FloatingButtons.tsx       # أزرار WhatsApp والعودة للأعلى
│   ├── CloudImage.tsx            # مكوّن عرض الصور
│   ├── ConditionalLayout.tsx     # Layout مشروط (إخفاء Header في Admin)
│   ├── VisitorTracker.tsx        # تتبع الزيارات (Client Component)
│   └── admin/                   # مكونات خاصة بلوحة التحكم
│
├── lib/                          # الوظائف المشتركة والبيانات
│   ├── types.ts                  # تعريفات TypeScript
│   ├── utils.ts                  # دوال مساعدة (cn helper)
│   ├── imagekit.ts               # إعداد ImageKit SDK
│   ├── site-categories.ts        # تصنيفات وفئات الخدمات
│   └── data/                    # بيانات JSON (قاعدة البيانات المحلية)
│       ├── clean_data.json       # البيانات الرئيسية (خدمات، مشاريع، شهادات)
│       ├── gallery_data.json     # بيانات معرض الصور
│       ├── services_articles.json # مقالات تفصيلية للخدمات
│       ├── website_data.json     # بيانات الموقع الكاملة
│       └── analytics.json        # سجل زيارات الموقع
│
├── hooks/
│   └── use-mobile.ts             # Hook للكشف عن الأجهزة المحمولة
│
├── public/                       # الملفات الثابتة (صور، أيقونات)
│
├── middleware.ts                 # حماية مسارات /admin
├── next.config.ts                # إعداد Next.js
├── tsconfig.json                 # إعداد TypeScript
├── postcss.config.mjs            # إعداد PostCSS
├── .env.example                  # نموذج متغيرات البيئة
└── .gitignore
```

---

## ⚙️ التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---|---|---|
| **Next.js** | 15 | الإطار الرئيسي (App Router) |
| **React** | 19 | واجهة المستخدم |
| **TypeScript** | 5.9 | الكتابة الصارمة للكود |
| **Tailwind CSS** | 4 | التصميم والأنماط |
| **Motion** | 12 | الرسوم المتحركة |
| **Lenis** | 1.3 | التمرير السلس |
| **Lucide React** | 0.553 | الأيقونات |
| **ImageKit SDK** | 7 | إدارة ورفع الصور |

> ✅ **لا يوجد أي استخدام لمكتبات الذكاء الاصطناعي.**  
> جميع البيانات تُحمَّل من ملفات JSON محلية عبر API Routes نظيفة.

---

## 🚀 تشغيل المشروع

### المتطلبات الأساسية

- **Node.js** >= 18
- **npm** >= 9

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd TilalWeb
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env.local
```

ثم عدّل `.env.local` بقيمك الحقيقية (راجع قسم متغيرات البيئة أدناه).

### 4. تشغيل بيئة التطوير

```bash
npm run dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

### 5. البناء للإنتاج

```bash
npm run build
npm run start
```

---

## 🔐 لوحة التحكم

لوحة التحكم محمية بمصادقة بسيطة قائمة على الـ Cookie.

- **رابط الدخول:** `/admin/login`
- **الحماية:** تُقارَن قيمة `ADMIN_TOKEN_SECRET` في الـ cookie مع المتغير في `.env.local`

### الصلاحيات المتاحة في لوحة التحكم

- ✏️ تعديل بيانات الخدمات والمشاريع والشهادات
- 🖼️ إدارة معرض الصور (رفع/حذف عبر ImageKit)
- ⚙️ تحديث إعدادات الموقع (الاسم، الهاتف، العنوان...)
- 📊 عرض إحصاءات الزوار (يومي، أسبوعي، شهري)

---

## 🌍 متغيرات البيئة

| المتغير | الوصف | مثال |
|---|---|---|
| `IMAGEKIT_PRIVATE_KEY` | المفتاح الخاص لـ ImageKit لرفع الصور | `private_...` |
| `ADMIN_TOKEN_SECRET` | كلمة مرور لوحة التحكم (عشوائية وسرية) | `abc123xyz...` |
| `APP_URL` | رابط الموقع الكامل للـ SEO والـ Sitemap | `https://tilal.com` |

---

## 🗄️ قاعدة البيانات

يستخدم المشروع **ملفات JSON محلية** كقاعدة بيانات بسيطة وسريعة:

| الملف | المحتوى |
|---|---|
| `lib/data/clean_data.json` | الإعدادات، الخدمات، المشاريع، الشهادات |
| `lib/data/gallery_data.json` | بيانات معرض الصور |
| `lib/data/services_articles.json` | المقالات التفصيلية لكل خدمة |
| `lib/data/analytics.json` | سجل زيارات الموقع |

> **ملاحظة:** جميع عمليات القراءة والكتابة تتم من خلال API Routes على الـ Server-Side فقط.

---

## 📸 إدارة الصور

- **ImageKit** هو المزود الرئيسي لتخزين وتقديم الصور.
- عند الرفع من لوحة التحكم، تُرسَل الصور إلى مجلد `/tilal-web` في ImageKit.
- الصور مُحسَّنة تلقائياً بصيغ **WebP / AVIF**.

---

## 🔒 الأمان

- مسارات `/admin` و `/api/admin` محمية بـ **middleware** على مستوى Next.js.
- المصادقة تعتمد على **HTTP-only Cookie** مقارنةً بسر مخزن في متغيرات البيئة.
- لا توجد قواعد بيانات خارجية أو خدمات تحتاج إلى مصادقة OAuth.

---

## 📄 الترخيص

جميع الحقوق محفوظة © شركة تلال للمقاولات.

---

<div align="center">
صُنع بـ ❤️ باستخدام تقنيات ويب حديثة ونظيفة
</div>
