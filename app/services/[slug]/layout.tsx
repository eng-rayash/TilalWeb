import type { Metadata } from 'next';
import articlesData from '@/lib/data/services_articles.json';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  
  const service = Object.values(articlesData).find((item: any) =>
    item.slug === resolvedParams.slug ||
    item.slug === decodedSlug ||
    decodeURIComponent(item.slug) === decodedSlug
  );

  if (!service) {
    return {
      title: 'خدمات سواتر ومظلات وهناجر',
    };
  }

  const description = (service as any).intro || (service as any).subtitle || (service as any).title;
  const cleanDesc = description.length > 160
    ? description.slice(0, 157) + '...'
    : description;

  return {
    title: (service as any).title,
    description: cleanDesc,
    openGraph: {
      title: `${(service as any).title} | مؤسسة تلال للمقاولات بالشرقية`,
      description: cleanDesc,
      images: (service as any).heroImage ? [{ url: (service as any).heroImage }] : [],
    }
  };
}

export default function ServiceDetailLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
