'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Quote, Phone, MessageCircle } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import { Service } from '@/lib/types';

function ServicesContent() {
  const contactInfo = cleanData.settings;
  const services = cleanData.services as Service[];
  const categories = ['الكل', ...new Set(services.map(s => s.category).filter(Boolean))];

  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = searchParams.get('cat');

  // Derive selectedCategory and titleSubFilter directly from URL search parameter!
  let selectedCategory = 'الكل';
  let titleSubFilter: string | null = null;

  if (catParam) {
    const decodedCat = decodeURIComponent(catParam);
    
    if (decodedCat === 'بناء وترميم' || decodedCat === 'مقاولات') {
      selectedCategory = 'بناء وترميم';
    } else if (decodedCat === 'هناجر ومستودعات' || decodedCat === 'هناجر') {
      selectedCategory = 'هناجر ومستودعات';
    } else if (decodedCat === 'مظلات') {
      selectedCategory = 'مظلات وسواتر';
      titleSubFilter = 'مظلة';
    } else if (decodedCat === 'سواتر') {
      selectedCategory = 'مظلات وسواتر';
      titleSubFilter = 'سواتر';
    } else if (decodedCat === 'مظلات وسواتر') {
      selectedCategory = 'مظلات وسواتر';
    } else if (decodedCat === 'واجهات كلادنج' || decodedCat === 'كلادنج') {
      selectedCategory = 'واجهات كلادنج';
    } else if (decodedCat === 'بيوت شعر مجهزة' || decodedCat === 'بيوت شعر') {
      selectedCategory = 'بيوت شعر مجهزة';
    } else if (decodedCat === 'برجولات وجلسات' || decodedCat === 'برجولات') {
      selectedCategory = 'برجولات وجلسات';
    } else if (decodedCat === 'شبوك تجارية وزراعية' || decodedCat === 'شبوك') {
      selectedCategory = 'شبوك تجارية وزراعية';
    } else if (decodedCat === 'قرميد وديكورات' || decodedCat === 'قرميد') {
      selectedCategory = 'قرميد وديكورات';
    } else {
      const exists = categories.includes(decodedCat);
      selectedCategory = exists ? decodedCat : 'الكل';
    }
  }

  const handleTabClick = (cat: string) => {
    if (cat === 'الكل') {
      router.push('/services', { scroll: false });
    } else {
      router.push(`/services?cat=${encodeURIComponent(cat)}`, { scroll: false });
    }
  };

  const servicesByCategory = selectedCategory === 'الكل'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const filteredServices = servicesByCategory.filter(s => {
    if (!titleSubFilter) return true;
    const title = s.title.toLowerCase();
    if (titleSubFilter === 'مظلة') {
      return title.includes('مظلة') || title.includes('مظلات');
    }
    if (titleSubFilter === 'سواتر') {
      return title.includes('سواتر') || title.includes('سواتر قماش') || title.includes('سواتر خشبية') || title.includes('سواتر مدارس');
    }
    return title.includes(titleSubFilter.toLowerCase());
  });

  const getImageUrl = (item: Service, index: number) => {
    if (item.images && item.images.length > 0 && item.images[0].src) {
      return item.images[0].src;
    }
    const staticIcons = [
      "/images/hero/service-fallback-1.jpg",
      "/images/hero/service-fallback-2.jpg",
      "/images/hero/service-fallback-3.jpg",
      "/images/hero/service-fallback-4.jpg",
    ];
    return staticIcons[index % 4];
  };

  return (
    <div className="bg-neutral-50 pb-24">
      
      {/* Page Header banner */}
      <section className="relative bg-neutral-950 text-white py-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/hero/hero-services.jpg"
            alt="خدمات مؤسسة تلال بالدمام"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">تصنيف الأعمال والخدمات</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">خدماتنا للمقاولات العامة والتركيبات</h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            تصفح دليل خدماتنا المتكاملة، المصنفة بعناية لتغطي كافة متطلبات المشاريع الحكومية والخاصة بالمنطقة الشرقية.
          </p>
        </div>
      </section>

      {/* Categories Filter Tabs */}
      <section className="bg-white border-b border-neutral-200 py-6 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleTabClick(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/10'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services List Index */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-150 rounded-2xl">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-neutral-800">لا توجد خدمات متاحة في هذا التصنيف حالياً.</h3>
            <button 
              onClick={() => handleTabClick('الكل')}
              className="mt-4 text-amber-500 font-bold hover:underline"
            >
              العودة لكافة الخدمات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service, index) => (
              <div 
                key={service.slug}
                className="bg-white rounded-2xl border border-neutral-100 hover:border-amber-400 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-right flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-neutral-100">
                    <Image
                      src={getImageUrl(service, index)}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-neutral-800">
                      {service.category || 'مقاولات عامة'}
                    </div>
                  </div>

                  <h2 className="font-bold text-xl sm:text-2xl text-neutral-950 group-hover:text-amber-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-neutral-500 text-sm leading-relaxed mt-4 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center mt-8 pt-6 border-t border-neutral-50">
                  <Link
                    href={`/services/${service.slug}`}
                    className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-amber-500/10 shrink-0"
                  >
                    تفاصيل الخدمة والمواصفات
                  </Link>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20أستفسر%20عن%20خدمة%20${encodeURIComponent(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-emerald-900/10"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تواصل فوري عبر واتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust Quote box */}
      <section className="max-w-5xl mx-auto px-4 mt-24">
        <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-2xl border border-neutral-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5 -translate-y-6 translate-x-6">
            <Quote className="w-48 h-48 rotate-180" />
          </div>
          <p className="text-amber-500 font-bold uppercase text-xs tracking-wider">التزام بالدقة والإتقان</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-3 mb-4">هل تحتاج لمواصفات وبنية حديدية بمقاييس خاصة؟</h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            بإمكان فريقنا الهندسي تصميم وتفصيل الهناجر والمظلات وفقاً لطلبكم واشتراطات أمان الدفاع المدني مع توريد أفضل حديد سابك والدهانات المقاومة للصدأ.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
            >
              اتصل بمسؤول المبيعات
            </a>
            <Link
              href="/contact"
              className="bg-transparent border border-neutral-700 hover:border-white text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
            >
              مراسلتنا عبر البريد الإلكتروني
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center text-center py-20 text-neutral-500 font-bold">
        جاري تحميل الخدمات...
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
