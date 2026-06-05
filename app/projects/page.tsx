'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle, ArrowLeft, Heart, Layers } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const contactInfo = cleanData.settings;
  const projects = cleanData.projects as Project[];
  const categories = ['الكل', 'مظلات وسواتر', 'هناجر ومستودعات', 'بناء وترميم', 'واجهات كلادنج'];
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const filteredProjects = selectedCategory === 'الكل'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const getImageUrl = (item: Project) => {
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
            src="/images/hero/hero-construction.jpg"
            alt="أعمال ومشاريع مؤسسة تلال بالدمام والشرقية"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">معرض أعمالنا الميدانية</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">سجل المشاريع المنجزة بالشرقية</h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            مجموعة من مشاريع المستودعات ومحطات الإنتاج وهياكل المظلات والمشاريع الإنشائية التي تم تسليمها بنجاح بأيدي فرقنا الفنية.
          </p>
        </div>
      </section>

      {/* Grid categories Filter tab */}
      <section className="bg-white border-b border-neutral-200 py-5 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white border border-neutral-150 rounded-2xl">
            <Layers className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-neutral-800">لا توجد مشاريع مضافة في هذا التصنيف حالياً.</h3>
            <button 
              onClick={() => setSelectedCategory('الكل')}
              className="mt-4 text-amber-500 font-bold hover:underline"
            >
              عرض كافة المعرض
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <div 
                key={project.id}
                className="bg-white rounded-2xl border border-neutral-100 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full bg-neutral-100 overflow-hidden">
                    <Image
                      src={getImageUrl(project)}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <span>{project.category}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1.5 justify-start text-neutral-400 text-xs mb-3">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{project.location}</span>
                    </div>

                    <h2 className="font-bold text-lg sm:text-xl text-neutral-950 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {project.title}
                    </h2>
                    <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mt-3.5 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-4 border-t border-neutral-50 flex items-center justify-between">
                  <span className="text-neutral-400 text-xs">مكتمل بجودة فنية ٢٠٢٦</span>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20رأيت%20مشروع%20${encodeURIComponent(project.title)}%20وأريد%20الاستفسار%20عن%20سعر%20تركيب%20مماثل`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>أريد مماثل</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trust Quote box */}
      <section className="max-w-5xl mx-auto px-4 mt-24">
        <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <p className="text-amber-500 font-bold uppercase text-xs">خدمة زبائن ممتازة</p>
          <h2 className="text-xl sm:text-3xl font-bold mt-3 mb-4">هل تخطط لإنشاء مستودع صناعي أو تركيب هناجر؟</h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            يتيح لك طاقم المهندسين الإنشائيين لدينا حساب أحمال الهيكل والرياح وصبة الأرضية بدقة هندسية شاملة وتجهيز الرخص المعتمدة مجاناً لبدء العمل فوراً.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-950/20"
            >
              تواصل فوري عبر واتساب
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
            >
              اتصال مباشر للمبيعات
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
