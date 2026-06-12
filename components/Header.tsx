'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, ChevronLeft, ChevronDown, Search } from 'lucide-react';
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const results: typeof searchResults = [];

    cleanData.services.forEach((s) => {
      if (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        results.push({ type: 'خدمة', title: s.title, slug: s.slug, url: `/services/${s.slug}` });
      }
    });

    (cleanData.projects as Project[]).forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        results.push({ type: 'مشروع', title: p.title, slug: p.serviceSlug || '', url: `/services/${p.serviceSlug || ''}` });
      }
    });

    setSearchResults(results.slice(0, 8));
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
    { name: 'المقاولات العامة', href: '/services?cat=مقاولات عامة' },
    { name: 'الهناجر والمستودعات', href: '/services?cat=هناجر ومستودعات' },
    { name: 'المظلات', href: '/services?cat=مظلات' },
    { name: 'السواتر', href: '/services?cat=سواتر' },
    { name: 'أعمال متنوعة', href: '/services?cat=أعمال متنوعة' },
  ];

  const subItems = [
    { name: 'واجهات كلادنج', href: '/services?cat=واجهات كلادنج' },
    { name: 'بيوت شعر', href: '/services?cat=بيوت شعر' },
    { name: 'برجولات وجلسات', href: '/services?cat=برجولات وجلسات' },
    { name: 'شبوك', href: '/services?cat=شبوك' },
    { name: 'قرميد وديكور', href: '/services?cat=قرميد وديكور' },
  ];

  const contactInfo = cleanData.settings;

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <>
      <header id="site_header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-stone-200/80 shadow-[0_2px_20px_rgba(0,0,0,.06)] py-2' 
          : 'bg-white/80 backdrop-blur-sm border-b border-transparent py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 75 L50 25 L90 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 75 L50 44 L75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
                  <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  <line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-stone-900 font-black text-base sm:text-lg tracking-tight leading-tight group-hover:text-amber-600 transition-colors duration-300">
                  مؤسسة تلال
                </span>
                <span className="text-stone-500 text-[10px] sm:text-[11px] font-medium">
                  للمقاولات العامة
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5 space-x-reverse">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-xs lg:text-[13px] font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
                      active 
                        ? 'text-amber-600 bg-amber-50' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {item.name}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                    )}
                  </Link>
                );
              })}

              {/* Dropdown */}
              <div className="relative group/dropdown py-1">
                <button className="flex items-center gap-1 text-xs lg:text-[13px] font-semibold transition-all duration-200 px-3 py-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer">
                  <span>أعمال متفرقة</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover/dropdown:text-stone-700 transition-all duration-200 group-hover/dropdown:rotate-180" />
                </button>
                
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,.10)] overflow-hidden opacity-0 invisible translate-y-2 group-hover/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:translate-y-0 transition-all duration-200 z-50 text-right">
                  <div className="p-1.5">
                    {subItems.map((sub, idx) => (
                      <Link
                        key={idx}
                        href={sub.href}
                        className="block px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={openSearchModal}
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200 cursor-pointer"
                aria-label="بحث"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
              
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_4px_14px_rgba(245,158,11,.25)] hover:shadow-[0_4px_20px_rgba(245,158,11,.35)] active:scale-95"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>اتصل الآن</span>
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={openSearchModal}
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all cursor-pointer"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>

              <a 
                href={`tel:${contactInfo.phone}`}
                className="p-2 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 active:scale-95 transition-all duration-200 shadow-[0_2px_8px_rgba(245,158,11,.3)]"
                aria-label="اتصل بنا"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="القائمة"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-stone-100 overflow-hidden shadow-lg"
            >
              <div className="px-4 pt-3 pb-6 space-y-1">
                {navItems.map((item) => {
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all text-right font-medium text-sm ${
                        active 
                          ? 'bg-amber-50 text-amber-700 font-semibold' 
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronLeft className={`w-4 h-4 ${active ? 'text-amber-500' : 'opacity-30'}`} />
                    </Link>
                  );
                })}

                {/* Mobile Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all text-right font-medium text-sm cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>أعمال متفرقة</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">بقية الأعمال</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-stone-400 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isMobileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-stone-50 rounded-xl overflow-hidden pr-4 mr-2 border-r-2 border-amber-300 space-y-0.5 py-1"
                      >
                        {subItems.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.href}
                            onClick={() => {
                              setIsOpen(false);
                              setIsMobileDropdownOpen(false);
                            }}
                            className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-all text-right"
                          >
                            <span>{sub.name}</span>
                            <ChevronLeft className="w-3.5 h-3.5 opacity-40" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-3 grid grid-cols-2 gap-3">
                  <a 
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>واتساب</span>
                  </a>
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center justify-center gap-2 bg-amber-500 text-stone-950 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors shadow-sm"
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

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-start justify-center pt-20 px-4"
            onClick={closeSearchModal}
          >
            <motion.div 
              initial={{ y: -30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -30, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 text-right relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeSearchModal}
                className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-all cursor-pointer"
                aria-label="إغلاق البحث"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-stone-900 font-bold text-lg mb-4 text-right">ابحث في الخدمات والمشاريع</h2>

              <div className="relative mb-5">
                <Search className="w-5 h-5 text-stone-400 absolute top-3.5 right-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ابحث عن: هناجر، مظلات، سواتر، ترميم فيلا..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-amber-400 focus:bg-white rounded-xl py-3.5 pr-12 pl-4 text-stone-900 placeholder-stone-400 outline-none text-sm transition-all text-right ring-0 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <div className="max-h-[350px] overflow-y-auto space-y-1.5">
                {searchQuery.trim() === '' ? (
                  <p className="text-stone-400 text-sm text-center py-8">اكتب للبحث في أعمالنا بالمنطقة الشرقية...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">لم نجد أي نتائج متطابقة مع: &quot;{searchQuery}&quot;</p>
                ) : (
                  searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        closeSearchModal();
                        router.push(result.url);
                      }}
                      className="w-full flex items-center justify-between text-right p-3 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-200 group cursor-pointer"
                    >
                      <span className="text-stone-500 text-xs bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md">
                        {result.type}
                      </span>
                      <span className="text-stone-700 group-hover:text-amber-700 font-semibold text-sm transition-all">
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
