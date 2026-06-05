'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ArrowRight, ArrowLeft, MessageCircle, Phone, Layers, Image as ImageIcon } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import galleryItemsRaw from '@/lib/data/gallery_data.json';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  description: string;
  src: string;
  location: string;
}

export default function GalleryPage() {
  const contactInfo = cleanData.settings;
  
  const galleryItems: GalleryItem[] = galleryItemsRaw;

  const categories = [
    'الكل',
    'مظلات وسواتر',
    'هناجر ومستودعات',
    'بناء وترميم',
    'واجهات كلادنج',
    'بيوت شعر مجهزة',
    'برجولات وجلسات',
    'شبوك تجارية وزراعية',
    'قرميد وديكورات'
  ];
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  const filteredItems = activeCategory === 'الكل'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIdx === null) return;
    const nextIdx = (activeImageIdx + 1) % filteredItems.length;
    setActiveImageIdx(nextIdx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIdx === null) return;
    const prevIdx = (activeImageIdx - 1 + filteredItems.length) % filteredItems.length;
    setActiveImageIdx(prevIdx);
  };

  return (
    <div className="bg-neutral-50 pb-24 text-right">
      
      {/* 1. Header Banner Panel */}
      <section className="relative bg-neutral-950 text-white py-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/hero/hero-services.jpg"
            alt="معرض صور تلال للمقاولات"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full flex gap-1.5 justify-center items-center max-w-max mx-auto mb-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>معرض الأعمال الحية لمشاريعنا</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">معرض صور مشاريع تلال المنجزة</h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            تصفح صوراً حية وعالية الدقة من مواقع أعمالنا الميدانية في تشييد الهناجر وتثبيت مظلات السيارات وسواتر الفلل بالمنطقة الشرقية.
          </p>
        </div>
      </section>

      {/* 2. Category Tabs */}
      <section className="bg-white border-b border-neutral-200 py-6 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveImageIdx(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
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

      {/* 3. Image Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              onClick={() => setActiveImageIdx(idx)}
              className="group cursor-pointer bg-white rounded-2xl border border-neutral-100 p-3 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300"
            >
              <div className="relative h-64 w-full bg-neutral-100 rounded-xl overflow-hidden mb-4">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-amber-500 text-neutral-950 p-3 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-neutral-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-amber-500 border border-neutral-800">
                  {item.category}
                </div>
              </div>

              <div className="p-2 text-right">
                <p className="text-neutral-400 text-[10px] font-sans font-semibold mb-1">{item.location}</p>
                <h3 className="font-bold text-neutral-950 text-sm sm:text-base group-hover:text-amber-600 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Lightbox Modal */}
      <AnimatePresence>
        {activeImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIdx(null)}
            className="fixed inset-0 bg-neutral-950/95 z-50 flex flex-col justify-center items-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImageIdx(null)}
              className="absolute top-6 left-6 z-50 bg-neutral-900 hover:bg-neutral-850 text-white p-3.5 rounded-full border border-neutral-800 hover:scale-105 active:scale-95 transition-all text-sm flex gap-1.5 items-center font-bold"
              aria-label="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline text-xs">إغلاق</span>
            </button>

            {/* Main Interactive Box */}
            <div className="relative max-w-4xl w-full flex flex-col items-center justify-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              
              {/* Media Area */}
              <div className="relative w-full h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
                <Image
                  src={filteredItems[activeImageIdx].src}
                  alt={filteredItems[activeImageIdx].title}
                  fill
                  className="object-contain"
                  priority
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right controls */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-neutral-900/85 hover:bg-neutral-950 text-white p-3 rounded-full border border-neutral-800 shadow-md active:scale-95 transition-all cursor-pointer"
                  aria-label="الصورة السابقة"
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-neutral-900/85 hover:bg-neutral-950 text-white p-3 rounded-full border border-neutral-800 shadow-md active:scale-95 transition-all cursor-pointer"
                  aria-label="الصورة التالية"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 h-6" />
                </button>
              </div>

              {/* Description Panel below */}
              <motion.div 
                key={activeImageIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-6 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl text-right flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-[10px] px-2.5 py-1 rounded-full">
                      {filteredItems[activeImageIdx].category}
                    </span>
                    <span className="text-neutral-400 text-xs">{filteredItems[activeImageIdx].location}</span>
                  </div>
                  <h2 className="text-white font-extrabold text-base sm:text-lg lg:text-xl">
                    {filteredItems[activeImageIdx].title}
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-2.5">
                    {filteredItems[activeImageIdx].description}
                  </p>
                </div>

                {/* Inquire Instant WhatsApp */}
                <div className="shrink-0 flex gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم%20مؤسسة%20تلال%20للمقاولات،%20أنا%20مهتم%20بطلب%20مشروع%20مماثل%20لعمل:%20${encodeURIComponent(filteredItems[activeImageIdx].title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all shadow-md shadow-emerald-900/30 font-sans"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>اطلب عمل مماثل</span>
                  </a>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Custom Bottom CTA banner */}
      <section className="max-w-5xl mx-auto px-4 mt-24">
        <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <p className="text-amber-500 font-bold uppercase text-xs">تواصل وطني مباشر</p>
          <h2 className="text-xl sm:text-3xl font-bold mt-3 mb-4">هل ترغب في استشارة مخصصة لمشروعك؟</h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            في مؤسسة تلال، نسعد بالتواصل المباشر مع العملاء بالدمام والخبر والجبيل لتوضيح عينات الدهانات ونوعية تغطية المظلات المناسبة لهم فوراً.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>تواصل فوري عبر واتساب</span>
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span>اتصل بنا الآن</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
