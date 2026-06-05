'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, ChevronLeft, ChevronDown, Search, Image as GalleryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import cleanData from '@/lib/data/clean_data.json';
import { Project } from '@/lib/types';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; slug: string; url: string }[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Search input change inline to avoid React hooks synchronous state effect warning
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const results: typeof searchResults = [];

    // Search inside services
    cleanData.services.forEach((s) => {
      if (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        results.push({ type: 'خدمة', title: s.title, slug: s.slug, url: `/services/${s.slug}` });
      }
    });

    // Search inside projects
    (cleanData.projects as Project[]).forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        results.push({ type: 'مشروع', title: p.title, slug: p.serviceSlug || '', url: `/services/${p.serviceSlug || ''}` });
      }
    });

    // Search inside articles
    cleanData.articles.forEach((a) => {
      if (a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) {
        results.push({ type: 'مقال', title: a.title, slug: a.slug, url: `/blog/${a.slug}` });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 items
  };

  const openSearchModal = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 150);
  };

  const closeSearchModal = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const navItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المقاولات العامة', href: '/services?cat=بناء وترميم' },
    { name: 'الهناجر والمستودعات', href: '/services?cat=هناجر ومستودعات' },
    { name: 'المظلات', href: '/services?cat=مظلات' },
    { name: 'السواتر', href: '/services?cat=سواتر' },
  ];

  const subItems = [
    { name: 'واجهات كلادنج', href: '/services?cat=واجهات كلادنج' },
    { name: 'بيوت شعر مجهزة', href: '/services?cat=بيوت شعر مجهزة' },
    { name: 'برجولات وجلسات', href: '/services?cat=برجولات وجلسات' },
    { name: 'شبوك تجارية وزراعية', href: '/services?cat=شبوك تجارية وزراعية' },
    { name: 'قرميد وديكورات', href: '/services?cat=قرميد وديكورات' },
  ];

  const contactInfo = cleanData.settings;

  return (
    <>
      <header id="site_header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-lg py-3' 
          : 'bg-gradient-to-b from-neutral-950/90 to-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center space-x-2 space-x-reverse group">
              <div className="w-10 h-10 flex items-center justify-center text-amber-500 font-bold group-hover:scale-105 transition-transform duration-300">
                <svg className="w-10 h-10 text-amber-500 transition-colors duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 75 L50 25 L90 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 75 L50 44 L75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                  <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  <line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-white font-extrabold text-base sm:text-lg tracking-tight leading-tight group-hover:text-amber-400 transition-colors duration-300">
                  مؤسسة تلال
                </span>
                <span className="text-neutral-400 text-[9px] sm:text-[10px]">
                  للمقاولات العامة
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center lg:space-x-3 md:space-x-1.5 space-x-reverse">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative text-xs lg:text-[13px] font-bold transition-colors duration-300 px-1.5 lg:px-2.5 py-2 text-neutral-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Dropdown for أعمال متفرقة */}
              <div className="relative group/dropdown py-2">
                <button
                  className="flex items-center gap-1 text-xs lg:text-[13px] font-bold transition-colors duration-300 px-1.5 lg:px-2.5 py-2 text-neutral-300 hover:text-white cursor-pointer"
                >
                  <span>أعمال متفرقة</span>
                  <ChevronDown className="w-4 h-4 text-neutral-400 group-hover/dropdown:text-white transition-all duration-205 group-hover/dropdown:rotate-180" />
                </button>
                
                {/* Dropdown content */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-300 z-50 text-right">
                  <div className="p-1">
                    {subItems.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={sub.href}
                        className="block px-4 py-2 text-xs lg:text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Actions: Search + Call Button */}
            <div className="hidden md:flex items-center space-x-3 space-x-reverse">
              <button
                onClick={openSearchModal}
                className="p-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center space-x-2 space-x-reverse bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-amber-500/10 active:scale-95"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>اتصل الآن</span>
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-1.5 space-x-reverse">
              <button
                onClick={openSearchModal}
                className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-all cursor-pointer"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>

              <a 
                href={`tel:${contactInfo.phone}`}
                className="p-2 rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 active:scale-95 transition-all duration-200"
                aria-label="اتصل بنا"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="القائمة"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-neutral-950 border-b border-neutral-800 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all text-right"
                  >
                    <span>{item.name}</span>
                    <ChevronLeft className="w-4 h-4 opacity-50" />
                  </Link>
                ))}

                {/* Mobile Dropdown for أعمال متفرقة */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all text-right font-medium cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>أعمال متفرقة</span>
                      <span className="text-[10px] bg-neutral-850 text-amber-500 px-2.5 py-0.5 rounded-full font-bold border border-neutral-800">بقية الأعمال</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isMobileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-neutral-900/40 rounded-xl overflow-hidden pr-4 mr-2 border-r border-neutral-800 space-y-1"
                      >
                        {subItems.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.href}
                            onClick={() => {
                              setIsOpen(false);
                              setIsMobileDropdownOpen(false);
                            }}
                            className="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs sm:text-sm text-neutral-400 hover:text-white hover:bg-neutral-950 transition-all text-right"
                          >
                            <span>{sub.name}</span>
                            <ChevronLeft className="w-3.5 h-3.5 opacity-40" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-3">
                  <a 
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 space-x-reverse bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتساب</span>
                  </a>
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center justify-center space-x-2 space-x-reverse bg-amber-500 text-neutral-950 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>اتصل الآن</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Modern Glassmorphic Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          >
            <motion.div 
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              className="w-full max-w-2xl bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-right relative"
            >
              <button 
                onClick={closeSearchModal}
                className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all cursor-pointer"
                aria-label="إغلاق البحث"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-white font-bold text-lg mb-4 text-right">ابحث في الخدمات والمشاريع والمقالات</h2>

              <div className="relative mb-6">
                <Search className="w-5 h-5 text-neutral-400 absolute top-3.5 right-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ابحث عن: هناجر، مظلات، سواتر، ترميم فيلا..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-neutral-500 outline-none text-sm transition-all text-right"
                />
              </div>

              {/* Live search results */}
              <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
                {searchQuery.trim() === '' ? (
                  <p className="text-neutral-500 text-sm text-center py-6">اكتب للبحث في أعمالنا بالمنطقة الشرقية...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-neutral-400 text-sm text-center py-6">لم نجد أي نتائج متطابقة مع: &quot;{searchQuery}&quot;</p>
                ) : (
                  searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        closeSearchModal();
                        router.push(result.url);
                      }}
                      className="w-full flex items-center justify-between text-right p-3 hover:bg-neutral-800/60 rounded-xl transition-all border border-transparent hover:border-neutral-800 group cursor-pointer"
                    >
                      <span className="text-neutral-500 text-xs bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-md">
                        {result.type}
                      </span>
                      <span className="text-neutral-200 group-hover:text-amber-400 font-semibold text-sm transition-all">
                        {result.title}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
