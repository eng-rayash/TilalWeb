import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اتصل بنا وتواصل فوري لمشروعك',
  description: 'تواصل مع مؤسسة تلال للمقاولات العامة بالدمام والخبر للرد على استفساراتكم فوراً وتوفير أفضل خدمات واستشارات المظلات والسواتر والهناجر والمستودعات بالشرقية.',
  alternates: {
    canonical: '/contact',
  },
  keywords: [
    'تواصل مع مقاول الدمام',
    'رقم مقاول مظلات الشرقية',
    'سعر مظلات الدمام',
    'مقاول هناجر الخبر',
    'تواصل تلال للمقاولات',
  ],
  openGraph: {
    title: 'اتصل بنا وتواصل فوري لمشروعك | مؤسسة تلال للمقاولات',
    description: 'تواصل مع مؤسسة تلال للمقاولات العامة بالدمام والخبر للرد على استفساراتكم فوراً وتوفير أفضل خدمات واستشارات المظلات والسواتر والهناجر والمستودعات بالشرقية.',
    url: 'https://tilall.com/contact',
  },
  twitter: {
    card: 'summary',
    title: 'اتصل بنا | مؤسسة تلال للمقاولات',
    description: 'تواصل مع مؤسسة تلال للمقاولات فوراً بالدمام والشرقية',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
