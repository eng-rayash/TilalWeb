import type { Metadata } from 'next';
import cleanData from '@/lib/data/clean_data.json';
import { Article } from '@/lib/types';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const articles = cleanData.articles as Article[];
  
  // Find article by slug
  const article = articles.find(a => 
    a.slug === resolvedParams.slug || 
    a.slug === decodedSlug || 
    decodeURIComponent(a.slug) === decodedSlug ||
    a.slug.toLowerCase().includes(decodedSlug.toLowerCase())
  );

  if (!article) {
    return {
      title: 'مقالات في المقاولات والتركيبات',
    };
  }

  const cleanDesc = article.description.length > 160 
    ? article.description.slice(0, 157) + '...'
    : article.description;

  return {
    title: article.title,
    description: cleanDesc,
    openGraph: {
      title: `${article.title} | مدونة مؤسسة تلال بالدمام`,
      description: cleanDesc,
      images: article.images?.[0]?.src ? [{ url: article.images[0].src }] : [],
    }
  };
}

export default function ArticleDetailLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
