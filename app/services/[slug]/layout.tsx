import type { Metadata } from 'next';
import cleanData from '@/lib/data/clean_data.json';
import { Service } from '@/lib/types';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const services = cleanData.services as Service[];
  
  // Find the service by slug (try exact match first, then decoded, then includes)
  const service = services.find(s => 
    s.slug === resolvedParams.slug || 
    s.slug === decodedSlug || 
    decodeURIComponent(s.slug) === decodedSlug ||
    s.slug.toLowerCase().includes(decodedSlug.toLowerCase())
  );

  if (!service) {
    return {
      title: 'خدمات سواتر ومظلات وهناجر',
    };
  }

  const cleanDesc = service.description.length > 160 
    ? service.description.slice(0, 157) + '...'
    : service.description;

  return {
    title: service.title,
    description: cleanDesc,
    openGraph: {
      title: `${service.title} | مؤسسة تلال للمقاولات بالشرقية`,
      description: cleanDesc,
      images: service.images?.[0]?.src ? [{ url: service.images[0].src }] : [],
    }
  };
}

export default function ServiceDetailLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
