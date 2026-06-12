'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle, Phone, ArrowLeft, ChevronLeft, ChevronRight,
  Building2, Warehouse, Tent, ShieldCheck, TreePine,
  Layers, Home, Fence, Gem, Sparkles
} from 'lucide-react';
import galleryData from '@/lib/data/gallery_data.json';
import articlesData from '@/lib/data/services_articles.json';

/* ─── Types ─────────────────────────────────────── */
interface GalleryItem { id: string; src: string; title: string; category: string; alt: string; }

/* ─── Data ───────────────────────────────────────── */
const allImages = galleryData as GalleryItem[];

const SERVICES = [
  { id: 'مقاولات عامة', label: 'مقاولات عامة', sub: 'بناء وترميم', icon: Building2, color: 'from-blue-600 to-blue-800', catKey: 'مقاولات عامة وبناء', articleKey: 'مقاولات عامة' },
  { id: 'هناجر ومستودعات', label: 'هناجر ومستودعات', sub: 'تصميم وتنفيذ', icon: Warehouse, color: 'from-emerald-600 to-emerald-800', catKey: 'هناجر ومستودعات', articleKey: 'هناجر ومستودعات' },
  { id: 'مظلات', label: 'المظلات', sub: 'جميع الأنواع', icon: Tent, color: 'from-purple-600 to-purple-800', catKey: 'مظلات', articleKey: 'مظلات' },
  { id: 'سواتر', label: 'السواتر', sub: 'خصوصية وجمال', icon: ShieldCheck, color: 'from-rose-600 to-rose-800', catKey: 'سواتر', articleKey: 'سواتر' },
  { id: 'برجولات وجلسات', label: 'برجولات وجلسات', sub: 'راحة وأناقة', icon: TreePine, color: 'from-teal-600 to-teal-800', catKey: 'برجولات وجلسات', articleKey: 'برجولات وجلسات' },
  { id: 'واجهات كلادنج', label: 'واجهات كلادنج', sub: 'ديكور معماري', icon: Layers, color: 'from-orange-600 to-orange-800', catKey: 'واجهات كلادنج', articleKey: 'واجهات كلادنج' },
  { id: 'بيوت شعر', label: 'بيوت شعر', sub: 'أصالة وفخامة', icon: Home, color: 'from-yellow-600 to-yellow-800', catKey: 'بيوت شعر', articleKey: 'بيوت شعر' },
  { id: 'شبوك', label: 'الشبوك', sub: 'تسوير متين', icon: Fence, color: 'from-cyan-600 to-cyan-800', catKey: 'شبوك', articleKey: 'شبوك' },
  { id: 'قرميد وديكور', label: 'قرميد وديكور', sub: 'جمالية فريدة', icon: Gem, color: 'from-amber-600 to-amber-800', catKey: 'قرميد وديكور', articleKey: 'قرميد وديكور' },
  { id: 'أعمال متنوعة', label: 'أعمال متنوعة', sub: 'مقاولات وتركيبات متفرقة', icon: Sparkles, color: 'from-neutral-600 to-neutral-800', catKey: 'أعمال متنوعة', articleKey: 'أعمال متنوعة' },
];



/* ─── Image Carousel ─────────────────────────────── */
function ServiceCarousel({ images }: { images: GalleryItem[] }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => { timer.current = setInterval(() => setIdx(p => (p + 1) % images.length), 3000); }, [images.length]);
  const stop = useCallback(() => { if (timer.current) clearInterval(timer.current); }, []);

  useEffect(() => { if (images.length > 1) { start(); return stop; } }, [images.length, start, stop]);

  if (!images.length) return null;

  return (
    <div
      className="relative h-full w-full cursor-pointer overflow-hidden rounded-2xl"
      onMouseEnter={stop} onMouseLeave={start}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image src={images[idx].src} alt={images[idx].alt} fill unoptimized className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + images.length) % images.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-amber-500 transition-colors"
          ><ChevronRight className="h-4 w-4" /></button>
          <button
            onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % images.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-amber-500 transition-colors"
          ><ChevronLeft className="h-4 w-4" /></button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-4 right-4 z-10 text-xs text-white/80 font-medium">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

/* ─── Article Card ───────────────────────────────── */
type ArticleEntry = {
  title: string; subtitle: string; intro: string;
  features: { icon: string; title: string; desc: string }[];
  tips: string[]; whyUs: string;
  stats: { value: string; label: string }[];
};
type ArticlesMap = Record<string, ArticleEntry>;
const articles = articlesData as unknown as ArticlesMap;

function ArticleSection({ articleKey }: { articleKey: string }) {
  const art = articles[articleKey];
  if (!art) return null;
  return (
    <div className="mt-8 space-y-8">
      {/* Intro */}
      <div className="rounded-2xl bg-gray-900/50 border border-white/5 p-6">
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">{art.intro}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {art.stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <div className="text-xl font-black text-amber-400">{s.value}</div>
            <div className="mt-1 text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-white">مميزات الخدمة</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {art.features.map((f) => (
            <div key={f.title} className="flex gap-3 rounded-xl border border-white/5 bg-gray-900/40 p-4">
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <h4 className="font-bold text-white text-sm">{f.title}</h4>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="rounded-2xl border-r-4 border-amber-500 bg-amber-500/5 p-5">
        <h3 className="mb-2 font-bold text-amber-400">لماذا تختار تلال للمقاولات؟</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{art.whyUs}</p>
      </div>

      {/* Tips */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-white">نصائح وأفضليات</h3>
        <ul className="space-y-2">
          {art.tips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-300">
              <span className="mt-0.5 shrink-0 text-amber-400 font-bold">💡</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://wa.me/00966506819387?text=${encodeURIComponent(`أريد الاستفسار عن خدمة ${art.title}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-500 hover:scale-[1.02]"
        >
          <MessageCircle className="h-5 w-5" />
          تواصل واتساب الآن
        </a>
        <a
          href="tel:+966506819387"
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-white transition-all hover:border-amber-500 hover:bg-amber-500/10"
        >
          <Phone className="h-5 w-5 text-amber-400" />
          0506819387
        </a>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function ServicesPage() {
  const [active, setActive] = useState(SERVICES[0].id);
  const activeService = SERVICES.find(s => s.id === active)!;
  const categoryImages = allImages.filter(img => img.category === activeService.catKey).slice(0, 20);



  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('cat');
      if (cat) {
        const decodedCat = decodeURIComponent(cat);
        const matched = SERVICES.find(s => 
          s.id.includes(decodedCat) || 
          s.label.includes(decodedCat) || 
          s.sub.includes(decodedCat) || 
          decodedCat.includes(s.id) ||
          decodedCat.includes(s.sub)
        );
        if (matched) {
          setActive(matched.id); // eslint-disable-line react-hooks/set-state-in-effect
        }
      }
    }
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-gray-950 text-white">


      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-1/3 h-[500px] w-[500px] rounded-full bg-amber-500/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm font-medium text-amber-400"
          >
            مؤسسة تلال للمقاولات العامة
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4 text-4xl font-black leading-tight md:text-6xl"
          >
            خدماتنا{' '}
            <span className="bg-gradient-to-l from-amber-300 to-amber-500 bg-clip-text text-transparent">المتكاملة</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base text-gray-400 md:text-lg"
          >
            9 تخصصات إنشائية — كل خدمة مدعومة بخبرة عملية وصور أعمال حقيقية من مشاريعنا المنجزة
          </motion.p>
        </div>
      </section>

      {/* ── LAYOUT: Sidebar + Content ────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-1.5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">التخصصات</p>
              {SERVICES.map((svc, i) => {
                const Icon = svc.icon;
                const isActive = active === svc.id;
                return (
                  <motion.button
                    key={svc.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setActive(svc.id)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-right transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/25'
                        : 'border border-white/5 bg-white/3 text-gray-300 hover:border-amber-500/30 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${svc.color} shadow`}>
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${isActive ? 'text-gray-950' : ''}`}>{svc.label}</div>
                      <div className={`text-xs ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>{svc.sub}</div>
                    </div>
                    {isActive && <ChevronLeft className="mr-auto h-4 w-4 text-gray-950" />}
                  </motion.button>
                );
              })}

              {/* Gallery CTA */}
              <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-4 text-center">
                <p className="text-xs text-gray-400 mb-3">تصفح جميع أعمالنا</p>
                <Link
                  href="/gallery"
                  className="block rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-gray-950 hover:bg-amber-400 transition-colors"
                >
                  معرض الأعمال الكامل →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {/* Service Header */}
                <div className="mb-6 flex items-start gap-4">
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                      {activeService.sub}
                    </div>
                    <h2 className="text-2xl font-black text-white md:text-3xl">
                      {activeService.label}
                    </h2>
                  </div>
                </div>

                {/* Photo Carousel — full width hero */}
                <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl mb-8">
                  {categoryImages.length > 0 ? (
                    <ServiceCarousel images={categoryImages} />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-900 text-gray-600">
                      لا توجد صور لهذا التصنيف
                    </div>
                  )}
                  {/* Overlay badge */}
                  <div className="absolute top-4 right-4 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-sm">
                    {categoryImages.length} صورة حقيقية من مشاريعنا
                  </div>
                </div>



                {/* Article */}
                <ArticleSection articleKey={activeService.articleKey} />

                {/* Sub-services link */}
                <div className="mt-8 rounded-2xl border border-white/5 bg-gray-900/50 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white mb-1">هل تبحث عن معلومات مفصلة أو صور مشاريع أكثر؟</p>
                    <p className="text-xs text-gray-400">يمكنك قراءة المقال الشامل والتقارير والنصائح لهذه الخدمة أو مشاهدة كافة الأعمال الحقيقية.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto shrink-0 justify-end">
                    <Link
                      href={`/services/${activeService.id.replace(/ /g, '-')}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-gray-950 hover:bg-amber-400 transition-all w-full sm:w-auto"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      المقال والتفاصيل الكاملة
                    </Link>
                    <Link
                      href={`/gallery?category=${encodeURIComponent(activeService.catKey)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-bold text-white hover:border-amber-500 hover:bg-amber-500/10 transition-all w-full sm:w-auto"
                    >
                      عرض ألبوم الصور المخصصة
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </main>
  );
}
