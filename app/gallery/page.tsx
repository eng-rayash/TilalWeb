'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Grid3X3,
  Images,
  Phone,
} from 'lucide-react';
import galleryData from '@/lib/data/gallery_data.json';
import { CATEGORY_COLORS, GALLERY_FILTERS, ALL_CATEGORY } from '@/lib/site-categories';

/* ─────────────────────────────────────────────────────────────── */
/*  Types                                                          */
/* ─────────────────────────────────────────────────────────────── */
interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  alt: string;
}

/* ─────────────────────────────────────────────────────────────── */
/*  Constants                                                      */
/* ─────────────────────────────────────────────────────────────── */
const allImages: GalleryItem[] = galleryData as GalleryItem[];

const CATEGORIES = [...GALLERY_FILTERS];

const PAGE_SIZE = 60;



/* ─────────────────────────────────────────────────────────────── */
/*  Main Component                                                 */
/* ─────────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* Set category from URL parameter if present */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat && CATEGORIES.includes(cat as any)) {
        setActiveCategory(cat); // eslint-disable-line react-hooks/set-state-in-effect
      }
    }
  }, []);

  /* Filtered images */
  const filteredImages = useMemo(() => {
    return activeCategory === ALL_CATEGORY
      ? allImages
      : allImages.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  const displayedImages = filteredImages.slice(0, visibleCount);





  /* Lightbox keyboard navigation */
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredImages.length - 1 : prev - 1;
    });
  }, [filteredImages.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredImages.length - 1 ? 0 : prev + 1;
    });
  }, [filteredImages.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goNext();   // RTL: left = next
      if (e.key === 'ArrowRight') goPrev();  // RTL: right = prev
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  /* Lock body scroll when lightbox is open */
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const currentItem =
    lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  /* WhatsApp link */
  const waLink = (title: string) =>
    `https://wa.me/966550916334?text=${encodeURIComponent(
      `أرغب في الاستفسار عن ${title}`
    )}`;

  /* ──────────────────────────────────────────────────────────── */
  return (
    <main dir="rtl" className="min-h-screen bg-gray-950 text-white">


      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-24 text-center">
        {/* Decorative glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-amber-400/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm font-medium text-amber-400"
          >
            <Images className="h-4 w-4" />
            <span>مؤسسة تلال للمقاولات</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4 text-5xl font-black leading-tight tracking-tight md:text-7xl"
          >
            معرض{' '}
            <span className="bg-gradient-to-l from-amber-300 to-amber-500 bg-clip-text text-transparent">
              أعمالنا
            </span>{' '}
            الحقيقية
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-gray-400 md:text-xl"
          >
            أكثر من{' '}
            <span className="font-bold text-amber-400">{allImages.length}</span>{' '}
            صورة حقيقية من مشاريعنا المنجزة في المملكة العربية السعودية
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {[
              { label: 'مشروع منجز', value: '+500' },
              { label: 'تصنيف متخصص', value: '9' },
              { label: 'سنوات خبرة', value: '+15' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center backdrop-blur-sm"
              >
                <div className="text-2xl font-black text-amber-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════════
          STICKY FILTER BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-gray-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <Grid3X3 className="ml-2 h-4 w-4 flex-shrink-0 text-amber-400" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-gray-950 shadow-lg shadow-amber-500/30'
                    : 'border border-white/10 text-gray-400 hover:border-amber-500/50 hover:text-amber-400'
                }`}
              >
                {cat}
                {cat !== 'الكل' && (
                  <span className="mr-1.5 text-xs opacity-60">
                    ({allImages.filter((i) => i.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          GRID SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {/* Count badge */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            عرض{' '}
            <span className="font-bold text-amber-400">
              {displayedImages.length}
            </span>{' '}
            من{' '}
            <span className="font-bold text-white">{filteredImages.length}</span>{' '}
            صورة
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />
          <span className="text-xs text-gray-600 font-medium">
            {activeCategory === 'الكل' ? 'جميع الأعمال' : activeCategory}
          </span>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {displayedImages.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index % 20, 15) * 0.04,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-gray-900 shadow-md"
                style={{
                  /* Vary card heights for masonry feel */
                  aspectRatio: index % 5 === 0 ? '4/5' : index % 7 === 0 ? '3/4' : '4/3',
                }}
                onClick={() => setLightboxIndex(index)}
              >
                {/* Image */}
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Category badge – shows on hover */}
                <div className="absolute right-2 top-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-lg ${
                      CATEGORY_COLORS[img.category] ?? 'bg-gray-700'
                    }`}
                  >
                    {img.category}
                  </span>
                </div>

                {/* Caption at bottom */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="truncate text-sm font-semibold text-white drop-shadow-lg">
                    {img.title}
                  </p>
                  <p className="mt-0.5 text-xs text-amber-300 opacity-80">
                    انقر للعرض
                  </p>
                </div>

                {/* Subtle permanent gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {visibleCount < filteredImages.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="mb-3 text-sm text-gray-500">
              تم عرض {displayedImages.length} من أصل{' '}
              {filteredImages.length} صورة
            </div>
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + PAGE_SIZE)
              }
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 px-10 py-4 text-base font-bold text-gray-950 shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/40"
            >
              <span className="relative z-10">
                عرض المزيد ({filteredImages.length - visibleCount} صورة متبقية)
              </span>
              <div className="absolute inset-0 bg-gradient-to-l from-amber-400 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </motion.div>
        )}

        {/* End message */}
        {visibleCount >= filteredImages.length && filteredImages.length > 0 && (
          <div className="mt-10 text-center text-sm text-gray-600">
            ✓ تم عرض جميع الصور ({filteredImages.length} صورة)
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && currentItem && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Inner panel – stops propagation */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative flex max-h-[95vh] w-full max-w-5xl flex-col items-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-2 left-4 z-10 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Counter */}
              <div className="absolute -top-2 right-4 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                {lightboxIndex + 1} / {filteredImages.length}
              </div>

              {/* Image */}
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
                style={{ maxHeight: 'calc(95vh - 140px)' }}>
                <div className="relative" style={{ paddingBottom: '60%' }}>
                  <Image
                    src={currentItem.src}
                    alt={currentItem.alt}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="(max-width: 1280px) 100vw, 80vw"
                    priority
                  />
                </div>
              </div>

              {/* Info bar */}
              <div className="mt-4 flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center sm:text-right">
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    {currentItem.title}
                  </h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      CATEGORY_COLORS[currentItem.category] ?? 'bg-gray-700'
                    }`}
                  >
                    {currentItem.category}
                  </span>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={waLink(currentItem.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-600/30 transition-all duration-200 hover:bg-green-500 hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4" />
                  استفسر عن هذا المشروع
                </a>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goPrev}
                className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-amber-500 hover:scale-110 sm:-translate-x-14"
                aria-label="السابق"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-amber-500 hover:scale-110 sm:translate-x-14"
                aria-label="التالي"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </motion.div>

            {/* Click outside area hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-600">
              اضغط ESC أو انقر خارج الصورة للإغلاق
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Amber gradient background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-500 via-amber-600 to-amber-700" />
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950/20 backdrop-blur-sm">
              <Phone className="h-8 w-8 text-gray-950" />
            </div>

            <h2 className="mb-4 text-4xl font-black text-gray-950 md:text-5xl">
              تواصل معنا لتنفيذ مشروعك
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-950/75">
              فريقنا المتخصص جاهز لتحويل رؤيتك إلى واقع. اتصل بنا اليوم
              واحصل على استشارة مجانية وعرض سعر فوري.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {/* WhatsApp */}
              <a
                href="https://wa.me/966550916334?text=أرغب في الاستفسار عن خدماتكم"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-gray-950 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-800"
              >
                <MessageCircle className="h-5 w-5 text-green-400" />
                واتساب مباشر
              </a>

              {/* Phone */}
              <a
                href="tel:+966550916334"
                className="flex items-center gap-3 rounded-2xl border-2 border-gray-950/30 bg-transparent px-8 py-4 text-base font-bold text-gray-950 transition-all duration-300 hover:scale-105 hover:bg-gray-950/10"
              >
                <Phone className="h-5 w-5" />
                اتصل الآن: 0550916334
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-950/60">
              {[
                '✓ استشارة مجانية',
                '✓ عرض سعر فوري',
                '✓ ضمان الجودة',
                '✓ خبرة +15 سنة',
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-gray-950/20 bg-gray-950/10 px-4 py-1.5 font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
