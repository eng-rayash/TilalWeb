import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المدونة والنصائح الهندسية لعام ٢٠٢٦',
  description: 'مقالات ونشرات هندسية تثقيفية تقدمها مؤسسة تلال للمقاولات: كيفية اختيار مظلات وسواتر مناسبة للفلل بالشرقية، شروط ترخيص الهناجر، ونصائح التشطيب والصيانة الفعالة.',
  alternates: {
    canonical: '/blog',
  },
  keywords: [
    'مدونة مقاولات',
    'نصائح بناء الهناجر',
    'نصائح مظلات السيارات',
    'مقالات هندسية الشرقية',
  ],
  openGraph: {
    title: 'المدونة والنصائح الهندسية لعام ٢٠٢٦ | مؤسسة تلال للمقاولات',
    description: 'مقالات ونشرات هندسية تثقيفية تقدمها مؤسسة تلال للمقاولات: كيفية اختيار مظلات وسواتر مناسبة للفلل بالشرقية، شروط ترخيص الهناجر، ونصائح التشطيب والصيانة الفعالة.',
    url: 'https://tlal-ksa.com/blog',
  },
  twitter: {
    card: 'summary',
    title: 'مدونة مؤسسة تلال للمقاولات',
    description: 'نصائح هندسية ومقالات تثقيفية من خبراء تلال للمقاولات',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
