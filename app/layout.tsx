import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import Script from 'next/script';
import ConditionalLayout from '../components/ConditionalLayout';
import VisitorTracker from '../components/VisitorTracker';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: {
    default: 'مؤسسة تلال للمقاولات العامة بالدمام والخبر | هناجر ومظلات وسواتر الشرقية',
    template: '%s | مؤسسة تلال للمقاولات بالمنطقة الشرقية'
  },
  description: 'مؤسسة تلال للمقاولات العامة متخصصة في بناء هناجر ومستودعات، وتركيب مظلات وسواتر، وأعمال الترميم الشامل بأفضل جودة وأسعار تنافسية بالدمام والخبر وكافة مدن الشرقية.',
  metadataBase: new URL('https://tilall.com'),
  alternates: {
    canonical: '/',
  },
  keywords: [
    'مؤسسة تلال',
    'مظلات تلال',
    'هناجر تلال',
    'تلال للمقاولات',
    'مقاول هناجر الدمام',
    'تركيب مظلات السيارات الخبر',
    'سواتر فلل الشرقية',
    'مقاولات عامة الدمام',
    'بناء مستودعات الجبيل',
    'سواتر ومظلات الشرقية',
    'ترميم مباني الدمام',
    'شبوك زراعية الخبر',
    'هياكل حديدية الشرقية'
  ],
  authors: [{ name: 'مؤسسة تلال للمقاولات' }],
  creator: 'مؤسسة تلال للمقاولات',
  publisher: 'مؤسسة تلال للمقاولات',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://tilall.com',
    title: 'مؤسسة تلال للمقاولات العامة بالدمام والخبر | هناجر ومظلات وسواتر الشرقية',
    description: 'مؤسسة تلال للمقاولات العامة متخصصة في بناء هناجر ومستودعات، وتركيب مظلات وسواتر، وأعمال الترميم الشامل بأفضل جودة وأسعار تنافسية بالدمام والخبر وكافة مدن الشرقية.',
    siteName: 'مؤسسة تلال للمقاولات',
    images: [
      {
        url: 'https://ik.imagekit.io/tilal/tilal-web/hero/hero-construction.jpg',
        width: 1200,
        height: 630,
        alt: 'مؤسسة تلال للمقاولات العامة - الدمام والشرقية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مؤسسة تلال للمقاولات العامة | هناجر ومظلات وسواتر الشرقية',
    description: 'مؤسسة تلال للمقاولات العامة متخصصة في بناء هناجر ومستودعات، وتركيب مظلات وسواتر، وأعمال الترميم الشامل بأفضل جودة وأسعار تنافسية.',
    images: ['https://ik.imagekit.io/tilal/tilal-web/hero/hero-construction.jpg'],
  },
  verification: {
    google: 'REPLACE_WITH_YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  },
};

// JSON-LD Schema: LocalBusiness + GeneralContractor
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GeneralContractor'],
  '@id': 'https://tilall.com/#organization',
  name: 'مؤسسة تلال للمقاولات العامة',
  alternateName: 'تلال للمقاولات',
  url: 'https://tilall.com',
  logo: 'https://tilall.com/logo.png',
  image: 'https://ik.imagekit.io/tilal/tilal-web/hero/hero-construction.jpg',
  description:
    'مؤسسة مقاولات عامة بالدمام والشرقية متخصصة في بناء هناجر ومستودعات، وتركيب مظلات وسواتر، وأعمال الترميم الشامل بأفضل جودة وأسعار تنافسية.',
  telephone: '+966550916334',
  email: 'info@tilall.com',
  foundingDate: '2014',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 20 },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'المنطقة الشرقية',
    addressLocality: 'الدمام',
    addressRegion: 'المنطقة الشرقية',
    postalCode: '31411',
    addressCountry: 'SA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.4207,
    longitude: 50.0888,
  },
  areaServed: [
    { '@type': 'City', name: 'الدمام' },
    { '@type': 'City', name: 'الخبر' },
    { '@type': 'City', name: 'الجبيل' },
    { '@type': 'City', name: 'القطيف' },
    { '@type': 'City', name: 'الأحساء' },
    { '@type': 'AdministrativeArea', name: 'المنطقة الشرقية' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '22:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'خدمات مؤسسة تلال للمقاولات',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'بناء هناجر ومستودعات' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'تركيب مظلات السيارات' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'تركيب سواتر الفلل' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'شبوك وأسيجة معدنية' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'أعمال الترميم والتشطيب' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'واجهات كلادنج' } },
    ],
  },
  sameAs: [
    'https://wa.me/966550916334',
  ],
  priceRange: '$$',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.speakable'],
  },
  knowsAbout: [
    'بناء الهناجر والمستودعات',
    'تركيب مظلات السيارات',
    'تركيب سواتر الفلل',
    'أعمال المقاولات العامة بالمنطقة الشرقية',
    'واجهات كلادنج',
    'أعمال الترميم والتشطيب',
  ],
};

// FAQ Schema for GEO (AI Search Engines)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'ما هي خدمات مؤسسة تلال للمقاولات بالدمام؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'تقدم مؤسسة تلال للمقاولات العامة خدمات شاملة تشمل: بناء الهناجر والمستودعات الصناعية، تركيب مظلات السيارات بجميع أنواعها، تركيب سواتر الفلل والمجمعات، واجهات كلادنج، برجولات وجلسات خارجية، بيوت شعر، شبوك وأسيجة معدنية، وأعمال الترميم والتشطيب الشامل في الدمام والخبر والجبيل وكافة مدن المنطقة الشرقية.',
      },
    },
    {
      '@type': 'Question',
      name: 'كيف أتواصل مع تلال للمقاولات؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يمكنك التواصل مع مؤسسة تلال للمقاولات عبر الهاتف: 0550916334، أو عبر واتساب على نفس الرقم، أو عبر البريد الإلكتروني info@tilall.com. نعمل على مدار أيام الأسبوع من الساعة 8 صباحاً حتى 10 مساءً.',
      },
    },
    {
      '@type': 'Question',
      name: 'هل تقدم تلال ضماناً على أعمالها؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'نعم، تقدم مؤسسة تلال للمقاولات ضماناً معتمداً على جميع أعمالها، مع استخدام أجود الخامات المقاومة للصدأ والعوامل الجوية، ودهانات فرن حرارية تضمن الجودة والمتانة لسنوات طويلة.',
      },
    },
    {
      '@type': 'Question',
      name: 'ما هي مناطق خدمة مؤسسة تلال للمقاولات؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'تخدم مؤسسة تلال للمقاولات العامة كافة مدن ومحافظات المنطقة الشرقية في المملكة العربية السعودية، بما فيها: الدمام، الخبر، الجبيل، القطيف، الأحساء، وسائر البلدات التابعة.',
      },
    },
    {
      '@type': 'Question',
      name: 'كم تكلفة بناء هنجر بالمنطقة الشرقية؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'تتفاوت تكلفة بناء الهناجر والمستودعات حسب المساحة ومواصفات الحديد والتشطيب المطلوب. تقدم مؤسسة تلال للمقاولات أسعاراً تنافسية مع مقايسة مجانية. تواصل معنا للحصول على عرض سعر مخصص لمشروعك.',
      },
    },
    {
      '@type': 'Question',
      name: 'هل تنفذ تلال مشاريع مظلات للأحياء السكنية والمجمعات؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'نعم، تتخصص مؤسسة تلال في تركيب مظلات السيارات للفلل والأحياء السكنية والمجمعات والمشاريع التجارية بجميع أنواع المظلات: الحديد، الخشب البلاستيكي، PVC، والبولي كربونيت، بتصاميم مخصصة تناسب كل مكان.',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="font-sans antialiased text-neutral-800 bg-neutral-50" suppressHydrationWarning>
        {/* JSON-LD Structured Data for Google */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          strategy="afterInteractive"
        />
        <VisitorTracker />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
