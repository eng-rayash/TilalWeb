import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'معرض أعمالنا وصور مشاريعنا',
  description: 'شاهد أرشيف صور حية من مشاريع مؤسسة تلال للمقاولات العامة بالشرقية. مظلات سيارات حديثة، سواتر فلل راقية، هناجر ومستودعات كبرى منفذة بالدمام والخبر والجبيل.',
  alternates: {
    canonical: '/gallery',
  },
  keywords: [
    'صور مظلات الدمام',
    'معرض أعمال مقاولات',
    'صور هناجر الشرقية',
    'أعمال سواتر الفلل',
  ],
  openGraph: {
    title: 'معرض أعمالنا وصور مشاريعنا | مؤسسة تلال للمقاولات',
    description: 'شاهد أرشيف صور حية من مشاريع مؤسسة تلال للمقاولات العامة بالشرقية. مظلات سيارات حديثة، سواتر فلل راقية، هناجر ومستودعات كبرى منفذة بالدمام والخبر والجبيل.',
    url: 'https://tilall.com/gallery',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'معرض أعمال مؤسسة تلال للمقاولات',
    description: 'صور مشاريع المظلات والسواتر والهناجر بالدمام والشرقية',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
