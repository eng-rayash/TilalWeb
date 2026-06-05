import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن ومجالات تميزنا',
  description: 'تعرف على مؤسسة تلال للمقاولات العامة والإنشاءات المعدنية والتركيبات الحديدية بالمنطقة الشرقية. خبرة تمتد لأكثر من ١٠ سنوات في خدمة قطاعات التشييد والمقاولات والصناعة.',
  alternates: {
    canonical: '/about',
  },
  keywords: [
    'مؤسسة تلال',
    'مقاولات عامة الدمام',
    'مقاول الشرقية',
    'شركة مقاولات الدمام',
    'مقاول انشاءات معدنية',
  ],
  openGraph: {
    title: 'من نحن ومجالات تميزنا | مؤسسة تلال للمقاولات',
    description: 'تعرف على مؤسسة تلال للمقاولات العامة والإنشاءات المعدنية والتركيبات الحديدية بالمنطقة الشرقية. خبرة تمتد لأكثر من ١٠ سنوات في خدمة قطاعات التشييد والمقاولات والصناعة.',
    url: 'https://tlal-ksa.com/about',
  },
  twitter: {
    card: 'summary',
    title: 'من نحن | مؤسسة تلال للمقاولات',
    description: 'تعرف على مؤسسة تلال للمقاولات وخبرتها الطويلة بالشرقية',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
