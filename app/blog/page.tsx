'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, BookOpen } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import { Article } from '@/lib/types';

export default function BlogPage() {
  const articles = cleanData.articles as Article[];

  const getImageUrl = (item: Article) => {
    if (item.images && item.images.length > 0 && item.images[0].src) {
      return item.images[0].src;
    }
    return '/images/hero/hero-construction.jpg';
  };

  return (
    <div className="bg-neutral-50 pb-24 text-right">
      
      {/* Pages Header banner */}
      <section className="relative bg-neutral-950 text-white py-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/hero/hero-services.jpg"
            alt="المدونة الإرشادية - مؤسسة تلال"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">نصائح ومقالات مقاولات عامة</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">المدونة الإرشادية والثقافية</h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            دليلك المعرفي الشامل لاختيار خامات وتصميم ومقاسات الشبوك والمظلات والسواتر والهناجر للمنازل والمستودعات بالشرقية.
          </p>
        </div>
      </section>

      {/* Main Articles Grid Card listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {articles.length === 0 ? (
          <div className="text-center py-24 bg-white border border-neutral-150 rounded-2xl">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-neutral-800">لا توجد مقالات مضافة حالياً.</h3>
            <Link 
              href="/"
              className="mt-4 text-amber-500 font-bold hover:underline"
            >
              العودة للرئيسية
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div 
                key={article.slug}
                className="bg-white rounded-2xl border border-neutral-100 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 w-full bg-neutral-150 overflow-hidden">
                    <Image
                      src={getImageUrl(article)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-sm text-neutral-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-neutral-800">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="font-bold text-lg text-neutral-950 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mt-4 line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-2">
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-500 font-bold text-xs"
                  >
                    <span>اقرأ المقال بالكامل</span>
                    <ArrowLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
