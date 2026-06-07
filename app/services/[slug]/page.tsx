'use client';

import { use, useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Phone, MessageCircle, ChevronLeft, ChevronRight,
  CheckCircle2, Star, X, ZoomIn
} from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import galleryData from '@/lib/data/gallery_data.json';
import articlesData from '@/lib/data/services_articles.json';

interface PageProps { params: Promise<{ slug: string }>; }
interface GalleryItem { id: string; src: string; title: string; category: string; alt: string; }

/* ─── Category map: slug → gallery category ──────── */
const SLUG_TO_GALLERY: Record<string, string> = {
  'مقاولات-عامة': 'مقاولات عامة وبناء',
  'هناجر-ومستودعات': 'هناجر ومستودعات',
  'مظلات': 'مظلات',
  'سواتر': 'سواتر',
  'برجولات-وجلسات': 'برجولات وجلسات',
  'واجهات-كلادنج': 'واجهات كلادنج',
  'بيوت-شعر': 'بيوت شعر',
  'شبوك': 'شبوك',
  'قرميد-وديكور': 'قرميد وديكور',
};

/* ─── Carousel ───────────────────────────────────── */
function PhotoCarousel({ images, onOpen }: { images: GalleryItem[]; onOpen: (i: number) => void }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => { timer.current = setInterval(() => setIdx(p => (p + 1) % images.length), 3500); };
  const stop = () => { if (timer.current) clearInterval(timer.current); };

  useEffect(() => { if (images.length > 1) { start(); return stop; } }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative group" onMouseEnter={stop} onMouseLeave={start}>
      {/* Main Image */}
      <div className="relative h-72 md:h-[420px] w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl cursor-zoom-in"
        onClick={() => onOpen(idx)}>
        <AnimatePresence mode="sync">
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className="absolute inset-0">
            <Image src={images[idx].src} alt={images[idx].alt} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
          <ZoomIn className="h-3.5 w-3.5" /> انقر للتكبير
        </div>

        {/* Counter */}
        <div className="absolute top-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-sm">
          {idx + 1} / {images.length}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + images.length) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2.5 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 backdrop-blur-sm">
              <ChevronRight className="h-5 w-5" />
            </button>
            <button onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2.5 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 backdrop-blur-sm">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.slice(0, 12).map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.slice(0, 10).map((img, i) => (
            <button key={img.id} onClick={() => setIdx(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${i === idx ? 'border-amber-400 opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'}`}>
              <Image src={img.src} alt={img.alt} fill unoptimized className="object-cover" sizes="96px" />
            </button>
          ))}
          {images.length > 10 && (
            <Link href="/gallery"
              className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-amber-400 hover:bg-white/10 transition-colors">
              +{images.length - 10} صورة
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Lightbox ───────────────────────────────────── */
function Lightbox({ images, idx, onClose, onNav }: { images: GalleryItem[]; idx: number; onClose: () => void; onNav: (i: number) => void; }) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNav((idx + 1) % images.length);
    if (e.key === 'ArrowRight') onNav((idx - 1 + images.length) % images.length);
  }, [idx, images.length, onClose, onNav]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [handleKey]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/96 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="relative max-h-[90vh] max-w-5xl w-full px-4"
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose}
          className="absolute -top-10 left-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="absolute -top-10 right-2 text-xs text-gray-400">{idx + 1} / {images.length}</div>

        <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ paddingBottom: '56%' }}>
          <Image src={images[idx].src} alt={images[idx].alt} fill unoptimized className="object-contain"
            sizes="(max-width:1280px) 100vw, 80vw" priority />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-400">{images[idx].alt}</p>
          <a href={`https://wa.me/00966506819387?text=${encodeURIComponent(`أريد الاستفسار عن مشروع: ${images[idx].alt}`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500 transition-colors">
            <MessageCircle className="h-4 w-4" /> استفسر عن هذا المشروع
          </a>
        </div>

        {images.length > 1 && (
          <>
            <button onClick={() => onNav((idx - 1 + images.length) % images.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-amber-500 transition-colors">
              <ChevronRight className="h-6 w-6" />
            </button>
            <button onClick={() => onNav((idx + 1) % images.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-amber-500 transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function SingleServicePage({ params }: PageProps) {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);
  const contactInfo = cleanData.settings;

  // Look up service from articlesData by slug
  const articleEntry = Object.entries(articlesData).find(([key, art]) => {
    const artSlug = (art as any).slug;
    return artSlug === slug || artSlug === decodedSlug || decodeURIComponent(artSlug) === decodedSlug;
  });

  if (!articleEntry) return notFound();
  const [serviceKey, art] = articleEntry as [string, any];

  // Get gallery category display name
  const galleryCategory = SLUG_TO_GALLERY[decodedSlug] || SLUG_TO_GALLERY[serviceKey] || serviceKey;

  // Filter gallery items by category
  const categoryImages = (galleryData as GalleryItem[]).filter(img =>
    img.category === galleryCategory
  ).slice(0, 30);

  // Fallback to service images if no gallery images
  const displayImages: GalleryItem[] = categoryImages.length > 0
    ? categoryImages
    : (art.images ?? []).map((imgSrc: string, i: number) => ({
      id: String(i), src: imgSrc, title: art.title,
      category: galleryCategory, alt: `${art.title} - صورة رقم ${i + 1}`
    }));

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Generate other services list for sidebar
  const otherServices = Object.entries(articlesData)
    .filter(([key, item]: [string, any]) => item.slug !== decodedSlug && item.slug !== slug)
    .map(([key, item]: [string, any]) => ({
      slug: item.slug,
      title: item.title,
      category: SLUG_TO_GALLERY[item.slug] || key,
      images: [{ src: item.heroImage || '' }]
    }))
    .slice(0, 4);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-950 text-white pb-24">

      {/* ── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-1/3 h-80 w-80 rounded-full bg-amber-500/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4">
          <Link href="/services"
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 hover:border-amber-500/40 hover:text-amber-400 transition-all">
            <ArrowRight className="h-4 w-4" />
            العودة للخدمات
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
              {galleryCategory}
            </span>
          </div>

          <h1 className="text-2xl font-black leading-tight text-white md:text-4xl max-w-3xl">
            {art.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-400 leading-relaxed md:text-base">
            {art.subtitle}
          </p>

          {/* Quick stats from article */}
          <div className="mt-6 flex flex-wrap gap-3">
            {art.stats.map((s: any) => (
              <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-center backdrop-blur-sm">
                <div className="text-lg font-black text-amber-400">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN GRID ─── */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Left: Images + Article */}
          <div className="lg:col-span-8 space-y-10">

            {/* Photo Carousel */}
            <PhotoCarousel images={displayImages} onOpen={i => setLightboxIdx(i)} />

            {/* Article Content */}
            <div className="space-y-8">
              {/* Intro */}
              <div className="rounded-2xl border border-white/5 bg-white/3 p-6">
                <h2 className="mb-3 text-xl font-bold text-white">تفاصيل الخدمة</h2>
                <p className="text-gray-300 leading-relaxed">{art.intro}</p>
              </div>

              {/* Features Grid */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-white">مميزات الخدمة</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {art.features.map((f: any) => (
                    <div key={f.title} className="flex gap-3 rounded-2xl border border-white/5 bg-white/3 p-4 hover:border-amber-500/20 transition-colors">
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
              <div className="rounded-2xl border-r-4 border-amber-500 bg-amber-500/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-amber-400" />
                  <h3 className="font-bold text-amber-400">لماذا تختار مؤسسة تلال؟</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{art.whyUs}</p>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-white/5 bg-white/3 p-6">
                <h3 className="mb-4 font-bold text-white">نصائح وأفضليات احترافية</h3>
                <ul className="space-y-3">
                  {art.tips.map((tip: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* CTA Card */}
            <div className="sticky top-24 space-y-5">
              <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-6 shadow-xl shadow-amber-500/5">
                <h3 className="mb-1 text-lg font-bold text-white">احصل على عرض سعر مجاني</h3>
                <p className="mb-5 text-sm text-gray-400 leading-relaxed">
                  فريقنا جاهز لزيارة موقعك وتقديم تسعير دقيق خلال 24 ساعة.
                </p>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/00966506819387?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن ${art.title}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-500 hover:scale-[1.02]">
                    <MessageCircle className="h-5 w-5" /> تواصل واتساب الآن
                  </a>
                  <a href={`tel:${contactInfo.phone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3.5 font-bold text-white transition-all hover:border-amber-500 hover:bg-amber-500/10">
                    <Phone className="h-5 w-5 text-amber-400" /> اتصل: {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Trust badges */}
              <div className="rounded-3xl border border-white/5 bg-white/3 p-6">
                <h4 className="mb-4 font-bold text-white">ضمانات مؤسسة تلال</h4>
                {[
                  { icon: '🛡️', t: 'ضمان موثّق', d: 'عقود رسمية بشرط جزائي لحماية حقوقك' },
                  { icon: '🏆', t: 'مواد عالية الجودة', d: 'حديد سابك، أقمشة PVC كوري، ألمنيوم معياري' },
                  { icon: '⏱️', t: 'التزام بالمواعيد', d: 'جداول زمنية دقيقة والتزام صارم بالتسليم' },
                  { icon: '📞', t: 'دعم ما بعد التسليم', d: 'فريق صيانة جاهز لخدمتك بعد الانتهاء' },
                ].map(item => (
                  <div key={item.t} className="flex gap-3 py-3 border-b border-white/5 last:border-0">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div>
                      <h5 className="text-sm font-bold text-white">{item.t}</h5>
                      <p className="text-xs text-gray-500 mt-0.5">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Related services */}
              <div className="rounded-3xl border border-white/5 bg-white/3 p-6">
                <h4 className="mb-4 font-bold text-white">خدمات أخرى</h4>
                <div className="space-y-3">
                  {otherServices.map(item => (
                    <Link key={item.slug} href={`/services/${item.slug}`}
                      className="flex items-center gap-3 group rounded-xl p-2 hover:bg-white/5 transition-colors">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-900">
                        {item.images?.[0]?.src && (
                          <Image src={item.images[0].src} alt={item.title} fill unoptimized className="object-cover" sizes="64px" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-300 group-hover:text-amber-400 transition-colors line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/services"
                  className="mt-4 block text-center text-xs text-amber-400 hover:underline">
                  عرض جميع الخدمات →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={displayImages}
            idx={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onNav={setLightboxIdx}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
