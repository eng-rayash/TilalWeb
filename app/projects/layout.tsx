import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مشاريعنا والإنشاءات المنجزة',
  description: 'استعرض سيرة مشاريع مؤسسة تلال للمقاولات في المنطقة الشرقية. فخورون بتنفيذ أرقى مشاريع تركيب الهناجر، المستودعات التجارية، مظلات المدارس والمصانع بالقطيف والأحساء والجبيل.',
  alternates: {
    canonical: '/projects',
  },
  keywords: [
    'مشاريع مقاولات الدمام',
    'مشاريع هناجر الشرقية',
    'تنفيذ مستودعات',
    'مشاريع مظلات الخبر',
  ],
  openGraph: {
    title: 'مشاريعنا والإنشاءات المنجزة | مؤسسة تلال للمقاولات',
    description: 'استعرض سيرة مشاريع مؤسسة تلال للمقاولات في المنطقة الشرقية. فخورون بتنفيذ أرقى مشاريع تركيب الهناجر، المستودعات التجارية، مظلات المدارس والمصانع.',
    url: 'https://tlal-ksa.com/projects',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مشاريع مؤسسة تلال للمقاولات بالشرقية',
    description: 'سجل حافل بالمشاريع المنجزة لمؤسسة تلال بالدمام والشرقية',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
