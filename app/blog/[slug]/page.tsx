'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, User, Clock, Phone, MessageCircle } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import { Article } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SingleArticlePage({ params }: PageProps) {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);
  const contactInfo = cleanData.settings;
  const articles = cleanData.articles as Article[];

  // Find article by slug (try exact match first, then decoded, then includes)
  const article = articles.find(a => 
    a.slug === slug || 
    a.slug === decodedSlug || 
    decodeURIComponent(a.slug) === decodedSlug ||
    a.slug.toLowerCase().includes(decodedSlug.toLowerCase())
  );

  if (!article) {
    return notFound();
  }

  const recentArticles = articles.filter(a => a.slug !== article.slug).slice(0, 3);

  const getImageUrl = (item: Article) => {
    if (item.images && item.images.length > 0 && item.images[0].src) {
      return item.images[0].src;
    }
    return '/images/hero/hero-construction.jpg';
  };

  return (
    <div className="bg-neutral-50 pb-24 text-right">
      
      {/* Article Detail Hero Panel */}
      <section className="relative bg-neutral-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          {article.images && article.images.length > 0 && (
            <Image
              src={article.images[0].src}
              alt={article.title}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl transition-all mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة المقالات</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 justify-start">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{article.date}</span>
            </span>
            <span className="flex items-center gap-1.5 justify-start">
              <User className="w-4 h-4 text-amber-500" />
              <span>مستشار الشركة الفني</span>
            </span>
            <span className="flex items-center gap-1.5 justify-start">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>قراءة ٥ دقائق</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Article Text Content (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-100 p-6 sm:p-10 shadow-sm">
            <article className="space-y-6 text-neutral-700 leading-relaxed text-sm sm:text-base">
              {article.content && article.content.length > 0 ? (
                article.content.map((block, idx) => {
                  if (block.type.startsWith('h')) {
                    const headingClasses = `font-bold text-neutral-950 mt-8 mb-4 border-r-4 border-amber-500 pr-3 ${
                      block.type === 'h1' || block.type === 'h2' ? 'text-lg sm:text-x2' : 'text-sm sm:text-lg'
                    }`;
                    return (
                      <h2 key={idx} className={headingClasses}>
                        {block.text}
                      </h2>
                    );
                  } else {
                    return (
                      <p key={idx} className="text-neutral-600 text-justify break-words leading-relaxed whitespace-pre-line">
                        {block.text}
                      </p>
                    );
                  }
                })
              ) : (
                <p className="text-neutral-500 text-center py-6">جاري تحميل تفاصيل المقال من مؤسسة تلال...</p>
              )}
            </article>

            {/* Article Images Gallery */}
            {article.images && article.images.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {article.images.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative h-60 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || article.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Articles sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick quote block */}
            <div className="bg-neutral-900 text-white rounded-2xl border border-neutral-800 p-6 sm:p-8 shadow-md">
              <h3 className="font-bold text-white text-lg mb-3">هل ترغب في تواصل فوري واستشارة مجانية؟</h3>
              <p className="text-neutral-400 text-xs sm:text-sm mb-6 leading-relaxed">
                مهما كان حجم مشروعك في الدمام، الخبر، أو الجبيل، يسعدنا تواصلك وتقديم المشورة الفنية وعينات الألوان المتطورة مجاناً.
              </p>
              <div className="space-y-3.5">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20قرأت%20مقال%20${encodeURIComponent(article.title)}%20وأريد%20الاستفسار`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>تواصل مباشر واتساب</span>
                </a>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-transparent text-white border border-neutral-700 hover:border-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>اتصل بنا: {contactInfo.phone}</span>
                </a>
              </div>
            </div>

            {/* Recent Posts Sidebar link compilation */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-neutral-950 text-base mb-6 pb-2.5 border-b border-neutral-100">مقالات ونصائح حديثة</h3>
              <div className="space-y-4">
                {recentArticles.map((item) => (
                  <Link 
                    href={`/blog/${item.slug}`} 
                    key={item.slug}
                    className="flex gap-4 items-center group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-50">
                      <Image
                        src={getImageUrl(item)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h4 className="font-bold text-neutral-950 text-xs sm:text-sm group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-neutral-400 text-[10px] mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
