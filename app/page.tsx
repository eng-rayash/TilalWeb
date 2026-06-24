'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, MessageCircle, ArrowLeft, ArrowRight, 
  MapPin, Eye, Star, CheckCircle, FlameKindling, 
  Sparkles, Award, Shield, UserCheck, X, ChevronLeft, ChevronRight, BookOpen,
  Building2, Warehouse, Tent, ShieldCheck, TreePine, Layers, Home as HomeIcon, Fence, Gem
} from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import { Service, Project } from '@/lib/types';
import galleryItemsRaw from '@/lib/data/gallery_data.json';
import articlesData from '@/lib/data/services_articles.json';

const SERVICES = [
  { id: 'مقاولات-عامة', label: 'مقاولات عامة', sub: 'بناء وترميم', icon: Building2, color: 'from-blue-600 to-blue-800', catKey: 'مقاولات عامة وبناء', articleKey: 'مقاولات عامة' },
  { id: 'هناجر-ومستودعات', label: 'هناجر ومستودعات', sub: 'تصميم وتنفيذ', icon: Warehouse, color: 'from-emerald-600 to-emerald-800', catKey: 'هناجر ومستودعات', articleKey: 'هناجر ومستودعات' },
  { id: 'مظلات', label: 'المظلات', sub: 'جميع الأنواع', icon: Tent, color: 'from-purple-600 to-purple-800', catKey: 'مظلات', articleKey: 'مظلات' },
  { id: 'سواتر', label: 'السواتر', sub: 'خصوصية وجمال', icon: ShieldCheck, color: 'from-rose-600 to-rose-800', catKey: 'سواتر', articleKey: 'سواتر' },
  { id: 'برجولات-وجلسات', label: 'برجولات وجلسات', sub: 'راحة وأناقة', icon: TreePine, color: 'from-teal-600 to-teal-800', catKey: 'برجولات وجلسات', articleKey: 'برجولات وجلسات' },
  { id: 'واجهات-كلادنج', label: 'واجهات كلادنج', sub: 'ديكور معماري', icon: Layers, color: 'from-orange-600 to-orange-800', catKey: 'واجهات كلادنج', articleKey: 'واجهات كلادنج' },
  { id: 'بيوت-شعر', label: 'بيوت شعر', sub: 'أصالة وفخامة', icon: HomeIcon, color: 'from-yellow-600 to-yellow-800', catKey: 'بيوت شعر', articleKey: 'بيوت شعر' },
  { id: 'شبوك', label: 'الشبوك', sub: 'تسوير متين', icon: Fence, color: 'from-cyan-600 to-cyan-800', catKey: 'شبوك', articleKey: 'شبوك' },
  { id: 'قرميد-وديكور', label: 'قرميد وديكور', sub: 'جمالية فريدة', icon: Gem, color: 'from-amber-600 to-amber-800', catKey: 'قرميد وديكور', articleKey: 'قرميد وديكور' },
  { id: 'أعمال-متنوعة', label: 'أعمال متنوعة', sub: 'مقاولات وتركيبات متفرقة', icon: Sparkles, color: 'from-neutral-600 to-neutral-800', catKey: 'أعمال متنوعة', articleKey: 'أعمال متنوعة' },
];

export default function Home() {
  const contactInfo = cleanData.settings;
  
  // State for Block 4: Services Showcase
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const activeService = SERVICES[activeServiceIdx];
  const activeArticle = (articlesData as any)[activeService.articleKey];
  
  // Filter gallery items for active service to showcase as projects
  const filteredProjects = (galleryItemsRaw as any[]).filter(
    (item) => item.category === activeService.catKey
  ).slice(0, 5); // Take up to 5 samples

  // Get 6 unique project samples from different categories
  const featuredProjects = SERVICES.map(svc => {
    const img = (galleryItemsRaw as any[]).find(item => item.category === svc.catKey);
    return img ? {
      id: img.id,
      title: svc.label + ' -  مشاريع تلال',
      description: img.alt || svc.sub,
      category: svc.label,
      src: img.src,
      slug: svc.id
    } : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null).slice(0, 6);
  
  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);
  const activeProjectIdxResolved = (activeProjectIdx !== null && activeProjectIdx < filteredProjects.length) ? activeProjectIdx : (filteredProjects.length > 0 ? 0 : null);
  const activeProject = activeProjectIdxResolved !== null ? filteredProjects[activeProjectIdxResolved] : null;

  // State for Block 5: Photos of our works / Gallery
  const [galleryCategory, setGalleryCategory] = useState('الكل');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load real image data of sample items
  const rawGalleryItems = (galleryItemsRaw as any[]).slice(0, 24);

  const galleryFilters = [
    'الكل',
    'مقاولات عامة وبناء',
    'هناجر ومستودعات',
    'مظلات',
    'سواتر',
    'برجولات وجلسات',
    'واجهات كلادنج',
    'بيوت شعر',
    'شبوك',
    'قرميد وديكور',
    'أعمال متنوعة'
  ];

  const filteredGallery = galleryCategory === 'الكل'
    ? rawGalleryItems
    : (galleryItemsRaw as any[]).filter(item => item.category === galleryCategory).slice(0, 24);

  const block4Ref = useRef<HTMLElement>(null);

  // Smooth scroll helper
  const scrollToBlock4 = () => {
    block4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Safe Index handlers for project article navigation (Block 4)
  const handlePrevProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIdx = activeProjectIdxResolved;
    if (currentIdx === null) return;
    const prevIdx = currentIdx === 0 ? filteredProjects.length - 1 : currentIdx - 1;
    setActiveProjectIdx(prevIdx);
  };

  const handleNextProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIdx = activeProjectIdxResolved;
    if (currentIdx === null) return;
    const nextIdx = (currentIdx + 1) % filteredProjects.length;
    setActiveProjectIdx(nextIdx);
  };

  // Safe Fallback image helper
  const getImageUrl = (item: any) => {
    if (item?.src) {
      return item.src;
    }
    if (item?.images && item.images.length > 0 && item.images[0].src) {
      return item.images[0].src;
    }
    return 'https://ik.imagekit.io/tilal/tilal-web/hero/hero-construction.jpg';
  };

  // Track cursor coordinates for floating parallax sways & tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    let lenisInst: any = null;
    let isDestroyed = false;

    import('lenis').then(({ default: Lenis }) => {
      if (isDestroyed) return;
      lenisInst = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time: number) {
        if (isDestroyed || !lenisInst) return;
        lenisInst.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    return () => {
      isDestroyed = true;
      if (lenisInst) {
        lenisInst.destroy();
      }
    };
  }, []);

  // Track cursor shifts relative to window center for interactive parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === 'undefined') return;
    const { clientX, clientY } = e;
    const shiftX = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const shiftY = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    setMousePos({ x: shiftX, y: shiftY });
  };

  // High performance custom 3D vector engineering frame canvas mapping to steel hangar truss structure
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = (canvas.width = canvas.offsetWidth);
      height = (canvas.height = canvas.offsetHeight);
    };
    window.addEventListener('resize', handleResize);

    // Generate Concentric Space Frame Truss Nodes in 3D
    const nodes: { x: number; y: number; z: number }[] = [];
    const numRings = 3;
    const pointsPerRing = 8;
    for (let r = 0; r < numRings; r++) {
      const radius = (r + 1) * (width < 640 ? 50 : 85);
      const elevation = r * -35; // Arching elevation
      for (let i = 0; i < pointsPerRing; i++) {
        const angle = (i * Math.PI * 2) / pointsPerRing;
        nodes.push({
          x: radius * Math.cos(angle),
          y: elevation + r * 15,
          z: radius * Math.sin(angle),
        });
      }
    }
    // Crown vertex on top
    nodes.push({ x: 0, y: -160, z: 0 });

    let angleX = 0.35;
    let angleY = 0.45;

    let targetTiltX = 0;
    let targetTiltY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate towards cursor offset smooth lerp
      targetTiltX = mousePos.x * 0.45;
      targetTiltY = mousePos.y * 0.45;

      angleY += 0.0025 + (targetTiltX - angleY) * 0.04;
      angleX += 0.0008 + (targetTiltY - angleX) * 0.04;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projectedNodes: { sx: number; sy: number; sz: number }[] = [];
      const fov = 380;
      const centerX = width / 2;
      const centerY = height / 2 + 35;

      nodes.forEach((node) => {
        // Rotate continuous
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.x * sinY + node.z * cosY;

        let y2 = node.y * cosX - z1 * sinX;
        let z2 = node.y * sinX + z1 * cosX;

        const distance = z2 + 320;
        const scale = fov / Math.max(1, distance);

        projectedNodes.push({
          sx: centerX + x1 * scale,
          sy: centerY + y2 * scale,
          sz: z2,
        });
      });

      // Draw truss connections (Steel frames)
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)'; // Amber/Gold lines
      ctx.lineWidth = 1;

      for (let r = 0; r < numRings; r++) {
        const ringOffset = r * pointsPerRing;

        // Draw ring segments
        for (let i = 0; i < pointsPerRing; i++) {
          const n1 = ringOffset + i;
          const n2 = ringOffset + ((i + 1) % pointsPerRing);
          ctx.beginPath();
          ctx.moveTo(projectedNodes[n1].sx, projectedNodes[n1].sy);
          ctx.lineTo(projectedNodes[n2].sx, projectedNodes[n2].sy);
          ctx.stroke();
        }

        // Draw connecting braces between concentric layers
        if (r < numRings - 1) {
          const nextRingOffset = (r + 1) * pointsPerRing;
          for (let i = 0; i < pointsPerRing; i++) {
            const current = ringOffset + i;
            const downNode = nextRingOffset + i;
            const diagonalNode = nextRingOffset + ((i + 1) % pointsPerRing);

            ctx.beginPath();
            ctx.moveTo(projectedNodes[current].sx, projectedNodes[current].sy);
            ctx.lineTo(projectedNodes[downNode].sx, projectedNodes[downNode].sy);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)'; // lighter shear load bracing
            ctx.moveTo(projectedNodes[current].sx, projectedNodes[current].sy);
            ctx.lineTo(projectedNodes[diagonalNode].sx, projectedNodes[diagonalNode].sy);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
          }
        }
      }

      // Connect crown to center ring
      const crownIdx = nodes.length - 1;
      const outerRing = (numRings - 1) * pointsPerRing;
      for (let i = 0; i < pointsPerRing; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)'; // solid load support trusses
        ctx.moveTo(projectedNodes[crownIdx].sx, projectedNodes[crownIdx].sy);
        ctx.lineTo(projectedNodes[outerRing + i].sx, projectedNodes[outerRing + i].sy);
        ctx.stroke();
      }

      // Draw spherical nodes / joint couplers
      projectedNodes.forEach((node, idx) => {
        const scaleRadius = 2.5 + (node.sz / 120);
        const radius = Math.max(1, scaleRadius * 1.5);

        ctx.beginPath();
        ctx.arc(node.sx, node.sy, radius, 0, Math.PI * 2);
        if (idx === crownIdx) {
          ctx.fillStyle = '#f59e0b'; // golden apex joint
        } else {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
        }
        ctx.fill();

        // Node flare glow
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return (
    <div className="bg-stone-50 font-sans text-stone-900 text-right overflow-hidden">

      {/* 1. HERO SECTION */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center bg-gradient-to-br from-stone-50 via-white to-amber-50/30 text-stone-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      >
        {/* Subtle geometric background patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Large amber glow top-right */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-400/8 rounded-full blur-3xl" />
          {/* Subtle blue tint bottom-left */}
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-stone-200/60 rounded-full blur-3xl" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </div>

        {/* Vector canvas (still works on light bg) */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              x: mousePos.x * -20, 
              y: mousePos.y * -20,
              rotate: [0, 360] 
            }}
            transition={{ type: 'spring', stiffness: 20, damping: 10, rotate: { repeat: Infinity, duration: 40, ease: 'linear' } }}
            className="absolute top-1/4 right-[8%] w-16 h-16 border-2 border-amber-300/30 rounded-2xl opacity-60"
          />
          <motion.div 
            animate={{ 
              x: mousePos.x * -35, 
              y: mousePos.y * 25,
              rotate: [360, 0]
            }}
            transition={{ type: 'spring', stiffness: 25, damping: 12, rotate: { repeat: Infinity, duration: 30, ease: 'linear' } }}
            className="absolute bottom-1/4 left-[8%] w-20 h-20 border-2 border-stone-300/40 rounded-full opacity-50"
          />
          <motion.div 
            animate={{ 
              x: mousePos.x * 15, 
              y: mousePos.y * -25 
            }}
            transition={{ type: 'spring', stiffness: 15, damping: 10 }}
            className="absolute top-[20%] left-[20%] w-6 h-6 bg-amber-400/20 rounded-lg"
          />
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute top-[35%] right-[18%] w-3 h-3 bg-amber-500/40 rounded-full"
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-amber-500/10 border border-amber-400/30 text-amber-700 font-bold text-xs sm:text-sm px-5 py-2 rounded-full mb-6 relative overflow-hidden"
          >
            جودة البناء وعراقة الإنشاء بالمنطقة الشرقية
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-stone-900 leading-tight"
          >
            مؤسسة <span className="text-amber-500 inline-block">تلال</span> للمقاولات العامة والتركيبات المعدنية
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mt-6 speakable"
          >
            مؤسسة مقاولات عامة بالدمام والشرقية متخصصة في بناء هناجر ومستودعات، وتركيب مظلات وسواتر، وأعمال الترميم الشامل بأفضل جودة وأسعار تنافسية. طوال ١٠ سنوات من الريادة، تبلور اسمنا كأحد أبرز مقدمي الحلول الإنشائية المتكاملة.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8"
          >
            {[
              { val: '+500', label: 'مشروع منجز' },
              { val: '+10', label: 'سنوات خبرة' },
              { val: '100%', label: 'ضمان الجودة' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-stone-200/80 shadow-sm">
                <p className="text-amber-600 font-black text-xl sm:text-2xl">{stat.val}</p>
                <p className="text-stone-500 text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <a
              href={`tel:${contactInfo.phone}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-8 py-4 rounded-xl text-base transition-all duration-300 shadow-[0_8px_24px_rgba(245,158,11,.3)] hover:shadow-[0_8px_32px_rgba(245,158,11,.4)] active:scale-95"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span>اتصل بنا الآن</span>
            </a>
            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20أرغب%20في%20التواصل%20والاستفسار%20فوراً`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-xl text-base transition-all duration-300 shadow-[0_8px_24px_rgba(5,150,105,.2)] active:scale-95"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>مراسلة واتساب فوراً</span>
            </a>
          </motion.div>

          {/* Scroll Down */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6 }}
            onClick={() => block4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="hidden md:flex flex-col items-center gap-2 mt-14 cursor-pointer select-none group"
          >
            <span className="text-xs text-stone-400 group-hover:text-amber-600 transition-colors font-mono tracking-widest">التمرير لأسفل</span>
            <div className="w-6 h-10 rounded-full border-2 border-stone-300 group-hover:border-amber-400 transition-colors flex justify-center p-1.5">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-1.5 h-2.5 rounded-full bg-amber-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-24 bg-white border-b border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-100/80 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 rounded-full">من نحن</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 mt-4">مؤسسة تلال للمقاولات العامة</h2>
            <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
              خبرة عريقة ممتدة لأكثر من ١٠ سنوات في خدمة قطاعات التشييد والمقاولات والصناعة بالمنطقة الشرقية
            </p>
            <div className="w-12 h-1 bg-amber-500 mx-auto my-5 rounded-full" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-right mt-12">
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,.12)] border border-stone-200 order-2 md:order-1 group"
            >
              <Image
                src="https://ik.imagekit.io/tilal/tilal-web/hero/hero-construction.jpg"
                alt="تنفيذ المقاولات والحديد في الشرقية"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-transparent p-6 text-white text-right">
                <p className="text-amber-400 font-black text-xs uppercase tracking-widest">الدقة في التنفيذ</p>
                <h4 className="font-extrabold text-sm sm:text-base mt-1">نسلّم مشاريعنا بأعلى مستويات الاحترافية والالتزام بالأكواد السعودية</h4>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-6 order-1 md:order-2"
            >
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                مرحبًا بكم في تلال للمقاولات، شركتكم الرائدة في المقاولات العامة بالشرقية.
              </h3>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                نحن متخصصون في تنفيذ المشاريع بكافة أحجامها، بدءًا من بناء الهناجر والمستودعات المتينة، مرورًا بتركيب المظلات والسواتر المصممة بعناية، وصولاً إلى أعمال الشبوك والقرميد، بالإضافة إلى جميع الأعمال المتفرقة والتشطيبات والترميم الشامل.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base mb-4">
                خبرتكم الطويلة تضمن تقديم حلول مبتكرة تلبي احتياجاتكم مع الالتزام التام بالمواعيد المبرمة والأسعار التنافسية بالدمام، الخبر، الجبيل وكامل مدن المنطقة الشرقية.
              </p>

              <div className="pt-4 border-t border-stone-100">
                <p className="text-stone-900 font-bold text-sm mb-3">📍 ركائز خدماتنا الميدانية المعتمدة:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                  {[
                    "بناء الهناجر والمستودعات بمواصفات قوية",
                    "أعمال التشطيبات الداخلية والخارجية للمباني",
                    "تركيب السواتر والشبوك لتوفير الحماية والأمان",
                    "تصميم وتركيب المظلات لجميع المساحات",
                    "تنفيذ جميع المشاريع الصغيرة بدقة كبرى",
                    "كوادر فنية ماهرة لضمان جودة التنفيذ"
                  ].map((bullet, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-stone-700 text-xs sm:text-sm font-medium">{bullet}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section ref={block4Ref} className="py-24 bg-neutral-50 border-b border-neutral-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">أقسام الخدمات والأعمال</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 mt-4 font-sans">بوابة تلال لخدماتنا وأعمالنا المنجزة بالدمام</h2>
          <p className="text-neutral-500 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
            شاهد منصتنا التفاعلية لتصفح الأقسام الكبرى، وتفاصيل المواصفات الهندسية الدقيقة مع صور المشاريع الميدانية الحية بمواقع التنفيذ.
          </p>
          <div className="w-12 h-1 bg-amber-500 mx-auto my-5 rounded-full" />

          {/* Interactive Split Screen Dashboard (12 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right items-stretch mt-12">
            
            {/* 1. MASTER SIDE SELECTOR (Right Pane: Spans 4 Columns on large screen) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
                <p className="text-neutral-400 font-bold text-xs mb-4">الخدمات الكبرى المتاحة:</p>
                
                <div className="flex flex-col gap-3">
                  {SERVICES.map((svc, idx) => {
                    const isCurrentActive = activeServiceIdx === idx;
                    const Icon = svc.icon;
                    return (
                      <div
                        key={svc.id}
                        onClick={() => {
                          setActiveServiceIdx(idx);
                          setActiveProjectIdx(0);
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer select-none relative overflow-hidden ${
                          isCurrentActive
                            ? 'border-amber-500 bg-neutral-950 text-white shadow-md'
                            : 'border-neutral-200/60 bg-neutral-50 hover:bg-white hover:border-amber-400'
                        }`}
                      >
                        {isCurrentActive && (
                          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-amber-500" />
                        )}

                        <div className="pr-2 pl-4 flex items-center gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${svc.color} shadow`}>
                            <Icon className="h-4 w-4 text-white" />
                          </span>
                          <div>
                            <h4 className={`font-black text-sm transition-colors ${
                              isCurrentActive ? 'text-white' : 'text-neutral-900'
                            }`}>
                              {svc.label}
                            </h4>
                            <p className={`text-[11px] leading-relaxed mt-0.5 ${
                              isCurrentActive ? 'text-neutral-400' : 'text-neutral-500'
                            }`}>
                              {svc.sub}
                            </p>
                          </div>
                        </div>

                        <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${
                          isCurrentActive ? '-translate-x-1.5 text-amber-400' : 'text-neutral-300'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct support message */}
              <div className="bg-amber-500 bg-opacity-5 border border-amber-500/20 rounded-2xl p-5 flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="font-bold text-sm text-neutral-950">التزام تلال بالجودة والضمان</h4>
                <p className="text-neutral-600 text-[11px] leading-relaxed mt-1">
                  نضمن استخدام أرقى الخامات المقاومة لصدأ رطوبة الشرقية وحرارة شمس الصيف المباشرة مع ضمان معتمد ممتد.
                </p>
              </div>
            </div>

            {/* 2. SHOWCASE DETAIL SCREEN (Left Pane: Spans 8 Columns on large screen) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-sm">
                
                {/* Active Sub-Service Header & Call Button */}
                <div className="border-b border-neutral-150 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-amber-600 text-[10.5px] font-black uppercase tracking-wider bg-amber-500/10 rounded-full px-2.5 py-1">
                      {activeService.sub}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-neutral-950 mt-2">{activeArticle.title}</h3>
                    <p className="text-neutral-500 text-[12px] mt-1 max-w-xl">{activeArticle.subtitle}</p>
                  </div>
                  
                  <Link
                    href={`/services/${activeService.id}`}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-neutral-950 px-5 py-3 rounded-xl font-black text-xs shrink-0 flex items-center justify-center gap-2 shadow-md shadow-amber-500/5 transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <span>عرض التفاصيل والمقال الكامل</span>
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  </Link>
                </div>

                {/* Sub-Service Engineering Specifications Mapping Sheet */}
                <div className="mt-5">
                  <p className="text-neutral-900 font-bold text-xs mb-3">📋 دليل المواصفات الفنية للخدمة:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeArticle.features.slice(0, 4).map((f: any, idx: number) => (
                      <div key={idx} className="bg-neutral-50 border border-neutral-100 p-3 rounded-xl text-right flex gap-3">
                        <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                        <div>
                          <span className="text-[11.5px] text-amber-600 font-bold block">{f.title}</span>
                          <span className="text-neutral-700 text-[11px] font-medium leading-relaxed mt-0.5 block">{f.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-projects list togglers within this active service */}
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <p className="text-neutral-900 font-bold text-xs mb-3">📍 نماذج سوابق أعمال حقيقية للخدمة:</p>
                  
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-6 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                      <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500 text-xs font-bold">لدينا سوابق أعمال عديدة بهذا التصنيف، تواصل لإرسال الكتالوج الورقي فوراً!</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {filteredProjects.map((proj, idx) => (
                        <button
                          key={proj.id}
                          onClick={() => setActiveProjectIdx(idx)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            activeProjectIdxResolved === idx
                              ? 'bg-amber-500 text-neutral-950 border-amber-500 font-extrabold shadow-sm'
                              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>صورة رقم {idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Article & Interactive Photo Slider */}
                <AnimatePresence mode="wait">
                  {activeProject && (
                    <motion.div
                      key={activeProject.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="bg-neutral-950 text-white rounded-xl p-5 border border-neutral-800 shadow-lg relative mt-3"
                    >
                      {/* Subtitle, Title */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <span className="text-amber-500 font-bold text-[10px]">استعراض موقع العمل الميداني</span>
                        <div className="flex items-center gap-1 text-neutral-400 text-[10px] bg-neutral-900 px-2 py-1 rounded-md">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>المنطقة الشرقية</span>
                        </div>
                      </div>

                      <h4 className="text-base font-black text-white">{activeService.label}</h4>
                      <p className="text-neutral-350 text-[11.5px] mt-2 leading-relaxed pb-3 border-b border-neutral-800 pr-3 border-r-2 border-amber-500">
                        {activeProject.alt}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 items-center">
                        {/* Interactive Large Image with Controls */}
                        <div className="relative h-48 sm:h-56 w-full rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group/img">
                          <Image
                            src={getImageUrl(activeProject)}
                            alt={activeProject.title}
                            fill
                            unoptimized
                            className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Left/Right Overlaid navigation pills on image */}
                          <div className="absolute inset-0 flex items-center justify-between px-2 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={handlePrevProject}
                              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all border border-white/10"
                              title="السابق"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleNextProject}
                              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all border border-white/10"
                              title="التالي"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Advisor Box advice notes */}
                        <div className="bg-neutral-900 rounded-lg p-3.5 border border-neutral-800 flex flex-col justify-between h-full">
                          <p className="text-amber-400 text-[11px] font-black flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                            <span>💡 نصيحة وأفضلية للخدمة:</span>
                          </p>
                          <ul className="text-neutral-350 text-[10.5px] leading-relaxed mt-2 space-y-1.5 list-disc list-inside">
                            {activeArticle.tips.slice(0, 3).map((tip: string, tIdx: number) => (
                              <li key={tIdx}>{tip}</li>
                            ))}
                          </ul>
                          <div className="text-[9px] text-neutral-500 font-mono mt-3 text-left">
                            مؤسسة تلال - الدمام والشرقية
                          </div>
                        </div>
                      </div>

                      {/* Slider controls footer */}
                      <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs">
                        <span className="text-neutral-400 text-[10px]">
                          مشروع {(activeProjectIdxResolved ?? 0) + 1} من أصل {filteredProjects.length} مشاريع متوفرة
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={handlePrevProject}
                            className="bg-neutral-900 hover:bg-neutral-800 text-[10px] text-white px-2.5 py-1.5 rounded-lg border border-neutral-800 flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>السابق</span>
                          </button>
                          <button
                            onClick={handleNextProject}
                            className="bg-neutral-900 hover:bg-neutral-800 text-[10px] text-white px-2.5 py-1.5 rounded-lg border border-neutral-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>التالي</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PHOTOS OF OUR WORKS / GALLERY ("اسفل شاشة الخدمات صور من اعمالنا") */}
      <section className="py-24 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-500 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">صور حية من الميدان</span>
          
          {/* Introductory text (كلام نصي ليتصفحوا مجموعة من الاعمال) */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 mt-4">معرض صور وتطبيقات أعمال تلال الحية</h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            يسعدنا أن تلتفتوا وتتصفحوا مجموعة مختارة وحقيقية من صور المشاريع التي قمنا بإنجازها مؤخراً، من تشييد مستودعات تجارية، مظلات هرمية للسيارات، شبوك وغيرها.
          </p>
          <div className="w-12 h-1 bg-amber-500 mx-auto my-5 rounded-full" />

          {/* Under introduction text button: Call Us Now + Gallery Entrance */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <a
              href={`tel:${contactInfo.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-900 text-amber-500 hover:text-amber-400 font-bold px-6 py-4 rounded-xl text-sm transition-all duration-300 border border-neutral-800 shadow-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>اتصل الآن للمقايسة الفنية</span>
            </a>
            <Link
              href="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              <span>دخول معرض صور المشاريع الكامل</span>
            </Link>
          </div>



          {/* Service Names horizontal Tab Bar (اسفله شريط اسماء الخدمات) */}

          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-2 scrollbar-none">
            {galleryFilters.map((tab) => (
              <button
                key={tab}
                onClick={() => setGalleryCategory(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  galleryCategory === tab
                    ? 'bg-amber-500 text-neutral-950 border-amber-500'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-neutral-150'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Images list (اسفله الصور المعروضه للخدمات) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {filteredGallery.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative h-48 sm:h-60 rounded-xl overflow-hidden bg-neutral-150 border border-neutral-200 shadow-sm cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Visual hover layer */}
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-amber-500 text-neutral-950 p-2.5 rounded-full">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-3 text-right">
                  <p className="text-white font-bold text-[10px] sm:text-xs truncate">{img.title}</p>
                  <p className="text-neutral-300 text-[8px] sm:text-[9px]">{img.category}</p>
                </div>
              </div>
            ))}
          </div>

          {/* See more gallery button under the grid */}
          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-8 py-4 rounded-xl text-sm transition-all duration-300 shadow-md shadow-amber-500/10 active:scale-95 cursor-pointer"
            >
              <span>عرض كافة صور ومنتجات مؤسسة تلال بالمعرض الكامل</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. PROJECTS / OUR WORKS */}
      <section className="py-24 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-400/30 px-3 py-1.5 rounded-full">المشاريع والمقاولات</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 mt-4">شاشة أعمالنا والمشاريع المعتمدة</h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto my-5 rounded-full" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {featuredProjects.map((proj, idx) => (
              <div
                key={proj.id}
                onClick={scrollToBlock4}
                className="group bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,.10)] hover:border-amber-400/60 transition-all duration-300 text-right flex flex-col justify-between cursor-pointer card-hover"
              >
                <div>
                  <div className="relative h-48 w-full bg-stone-100 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={getImageUrl(proj)}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-stone-900/80 text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full">
                      {proj.category}
                    </div>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base sm:text-lg mt-2 group-hover:text-amber-700 transition-all">
                    {proj.title}
                  </h3>

                  <p className="text-stone-500 text-xs sm:text-sm mt-3 leading-relaxed line-clamp-2">
                    {proj.description || 'من أعمال مؤسسة تلال الرائدة لتفصيل وتثبيت البنية التحتية والتشطيب الفاخر بالمنطقة الشرقية.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-amber-600 font-bold text-xs">
                  <span>تصفح الآن واقرأ مواصفات العمل</span>
                  <ChevronLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION - للـ GEO */}
      <section className="py-20 bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 rounded-full">الأسئلة الشائعة</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-4">أسئلة العملاء حول خدماتنا</h2>
            <p className="text-stone-500 text-sm mt-2">إجابات واضحة على أكثر الأسئلة شيوعاً حول مؤسسة تلال للمقاولات</p>
            <div className="w-12 h-1 bg-amber-500 mx-auto mt-5 rounded-full" />
          </div>
          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {[
              { q: 'ما هي خدمات مؤسسة تلال للمقاولات بالدمام؟', a: 'تقدم مؤسسة تلال للمقاولات العامة خدمات شاملة تشمل: بناء الهناجر والمستودعات، تركيب مظلات السيارات، تركيب سواتر الفلل، واجهات كلادنج، برجولات وجلسات خارجية، بيوت شعر، شبوك وأسيجة معدنية، وأعمال الترميم والتشطيب في كافة مدن المنطقة الشرقية.' },
              { q: 'هل تقدم تلال للمقاولات ضماناً على أعمالها؟', a: 'نعم، تقدم مؤسسة تلال ضماناً معتمداً على جميع أعمالها مع استخدام أجود الخامات المقاومة للصدأ والعوامل الجوية، ودهانات فرن حرارية تضمن الجودة والمتانة لسنوات طويلة.' },
              { q: 'ما هي مناطق خدمة مؤسسة تلال للمقاولات؟', a: 'تخدم مؤسسة تلال كافة مدن المنطقة الشرقية: الدمام، الخبر، الجبيل، القطيف، الأحساء، وسائر البلدات التابعة.' },
              { q: 'كيف أتواصل مع تلال للمقاولات للحصول على مقايسة؟', a: 'يمكنك التواصل عبر الهاتف أو واتساب على الرقم 0550916334، أو عبر البريد الإلكتروني. نوفر مقايسة مجانية وسريعة على مدار أيام الأسبوع.' },
              { q: 'هل تنفذ تلال مشاريع مظلات للأحياء السكنية والمجمعات؟', a: 'نعم، نتخصص في تركيب مظلات السيارات للفلل والأحياء والمجمعات بجميع أنواع المظلات: الحديد، الخشب البلاستيكي، PVC، والبولي كربونيت، بتصاميم مخصصة.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
                className="bg-stone-50 border border-stone-200 rounded-2xl p-6 hover:border-amber-400/50 hover:bg-amber-50/30 transition-all duration-300"
              >
                <h3 itemProp="name" className="text-stone-900 font-bold text-base mb-3 flex items-start gap-3">
                  <span className="text-amber-500 text-lg shrink-0">؟</span>
                  {faq.q}
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-stone-600 text-sm leading-relaxed pr-7">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VALUES SECTION */}
      <section className="py-24 bg-stone-900 text-white border-b border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">منظومة قيم مؤسستنا</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 speakable">ثوابت الرؤية والإتقان في تلال</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-stone-800/60 border border-stone-700 p-8 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 hover:bg-stone-800 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">رؤيتنا المعتمدة</h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  أن نكون الوجهة الفريدة في المنطقة الشرقية لتخطيط وتنفيذ الهياكل الحديدية الموثوقة، وتأسيس معايير فنية تدوم لعشرات السنين دون تآكل أو تأثر بعوامل المناخ والصدأ.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-stone-800/60 border border-stone-700 p-8 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 hover:bg-stone-800 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">الجودة والضمان</h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  نلتزم باستخدام حديد سابك بسماكات ممتازة، ودهانات فرن حرارية تحارب الصدأ، وتسيير كل عمل تحت مراقبة مهندسين فاحصين للتأكد من صرامة المطابقة التامة لمقاييس الجودة.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-stone-800/60 border border-stone-700 p-8 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 hover:bg-stone-800 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">السلامة المهنية والأمن</h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  نصمم هياكل ومستودعات مطابقة لاشتراطات الأمن والسلامة المقرة من قبل المديرية العامة للدفاع المدني، لندعم أمان المنشأة والعاملين بداخل مقاومة ممتازة للحرائق.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. SPECIAL OFFER CAMPAIGN ("واسفلها يعرض عنوان رئيسي باسم العلامة التجاري واسفل تخفيضات وعروض عالية جداً") */}
      <section className="py-20 bg-amber-500 text-neutral-950 text-center relative overflow-hidden">
        {/* Abstract design vector */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="500" cy="500" r="400" stroke="currentColor" strokeWidth="20" />
            <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="15" />
            <line x1="100" y1="500" x2="900" y2="500" stroke="currentColor" strokeWidth="15" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Brand Name Title (عنوان رئيسي باسم العلامة التجاري للمؤسسة او الموقع) */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-neutral-950 tracking-tight leading-snug">
            مؤسسة تلال للمقاولات العامة والتركيبات الحديدية بالدمام والخبر
          </h2>
          
          {/* Call to action subtitle (بدل العروض والتخفيضات، نص تواصل راقي ومناسب) */}
          <p className="text-lg sm:text-xl font-bold mt-4 text-neutral-900 max-w-2xl mx-auto leading-relaxed">
            نسعد بخدمتكم وتلبية تطلعاتكم عبر تقديم أفضل خدمات التشييد والبناء وأعمال الحديد والتركيبات بالمنطقة الشرقية.
          </p>


          {/* WhatsApp & Call Buttons (واسفله زرين للتواصل بالوتس واتصل الان) */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20أرغب%20في%20الاستفسار%20عن%20خدمات%20مؤسسة%20تلال%20للمقاولات`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6 py-3.5 rounded-xl text-neutral-50 shadow-md text-sm transition-all flex items-center justify-center gap-2 w-full"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>تواصل عبر واتساب</span>
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-neutral-950 hover:bg-neutral-900 font-bold px-6 py-3.5 rounded-xl text-amber-400 hover:text-amber-300 shadow-md text-sm transition-all flex items-center justify-center gap-2 w-full"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span>اتصل الآن مباشر</span>
            </a>
          </div>
        </div>
      </section>

      {/* LIGHTBOX FOR BLOCK 5: Photos of our works */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex flex-col justify-center items-center p-4"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 left-6 z-50 bg-neutral-900 hover:bg-neutral-850 text-white p-3 rounded-full border border-neutral-800 transition-all cursor-pointer"
              aria-label="إغلاق التكبير"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slider container */}
            <div 
              className="relative max-w-4xl w-full h-[60vh] sm:h-[70vh] bg-contain rounded-xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredGallery[lightboxIndex].src}
                alt={filteredGallery[lightboxIndex].title}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title & category banner below enlarged photo */}
            <div 
              className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 p-5 rounded-xl mt-4 text-right flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="text-amber-500 text-xs font-bold font-mono">
                  شعبة الأعمال: {filteredGallery[lightboxIndex].category}
                </span>
                <h3 className="text-white font-extrabold text-base sm:text-lg mt-1">
                  {filteredGallery[lightboxIndex].title}
                </h3>
              </div>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=أرغب%20في%20الحصول%20على%20معلومات%20حول%20العمل:%20${encodeURIComponent(filteredGallery[lightboxIndex].title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل فوري عبر واتساب</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
