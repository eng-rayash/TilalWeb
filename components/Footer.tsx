'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';

export default function Footer() {
  const contactInfo = cleanData.settings;

  const services = [
    { label: 'بناء هناجر ومستودعات', href: '/services?cat=هناجر ومستودعات' },
    { label: 'تركيب مظلات السيارات', href: '/services?cat=مظلات' },
    { label: 'تركيب سواتر الفلل', href: '/services?cat=سواتر' },
    { label: 'واجهات كلادنج', href: '/services?cat=واجهات كلادنج' },
    { label: 'برجولات وجلسات', href: '/services?cat=برجولات وجلسات' },
    { label: 'مقاولات عامة وترميم', href: '/services?cat=مقاولات عامة' },
  ];

  const quickLinks = [
    { label: 'الصفحة الرئيسية', href: '/' },
    { label: 'معرض أعمالنا', href: '/gallery' },
    { label: 'خدماتنا', href: '/services' },
    { label: 'المشاريع', href: '/projects' },
    { label: 'من نحن', href: '/about' },
    { label: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <footer id="site_footer" className="bg-stone-900 text-stone-400 font-sans text-right" aria-label="تذييل الموقع">
      
      {/* CTA Strip */}
      <div className="bg-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right">
            <p className="text-stone-950 font-black text-lg">هل تحتاج مقاولاً موثوقاً بالمنطقة الشرقية؟</p>
            <p className="text-stone-800 text-sm font-medium">تواصل معنا الآن للحصول على مقايسة فورية ومجانية</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20أرغب%20في%20التواصل%20والاستفسار%20فوراً`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-stone-950 hover:bg-stone-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>اتصل الآن</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center text-amber-400">
                <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 75 L50 25 L90 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 75 L50 44 L75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                  <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  <line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg leading-tight group-hover:text-amber-400 transition-colors duration-300">
                  مؤسسة تلال
                </span>
                <span className="text-stone-500 text-xs font-medium">
                  للمقاولات العامة والتركيبات المعدنية
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              {contactInfo.description || 'مؤسسة متخصصة في تشييد الهياكل الحديدية والإنشاءات الهندسية، وبناء هناجر ومستودعات ومظلات سيارات في الدمام والخبر بالمنطقة الشرقية.'}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href={`https://wa.me/${contactInfo.whatsapp}`}
                className="w-10 h-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-300 border border-emerald-500/20 hover:border-emerald-500"
                aria-label="مراسلة واتساب"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="w-10 h-10 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 flex items-center justify-center transition-all duration-300 border border-amber-500/20 hover:border-amber-500"
                aria-label="اتصال سريع"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-base pr-3 border-r-2 border-amber-500">
              خدماتنا الرئيسية
            </h3>
            <ul className="space-y-2.5">
              {services.map((svc, idx) => (
                <li key={idx}>
                  <Link
                    href={svc.href}
                    className="flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -mr-1 group-hover:mr-0 transition-all duration-200 text-amber-400" />
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-base pr-3 border-r-2 border-amber-500">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((lnk, idx) => (
                <li key={idx}>
                  <Link
                    href={lnk.href}
                    className="flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -mr-1 group-hover:mr-0 transition-all duration-200 text-amber-400" />
                    {lnk.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-base pr-3 border-r-2 border-amber-500">
              معلومات التواصل
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{contactInfo.address || 'الدمام - المنطقة الشرقية، المملكة العربية السعودية'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-amber-400 font-bold transition-colors">
                  {contactInfo.phone || '0550916334'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <a 
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  className="hover:text-amber-400 font-bold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactInfo.whatsapp || '966550916334'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <a href={`mailto:${contactInfo.email || 'info@tilall.com'}`} className="hover:text-stone-200 transition-colors text-xs">
                  {contactInfo.email || 'info@tilall.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-300 font-semibold text-xs mb-0.5">أوقات العمل:</p>
                  <p className="text-xs">{contactInfo.workingHours || 'طوال أيام الأسبوع من 8:00 صباحًا إلى 10:00 مساءً'}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-stone-600">
          <p>© {new Date().getFullYear()} {contactInfo.siteName || 'مؤسسة تلال للمقاولات'}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 items-center">
            <span className="text-stone-700">•</span>
            <span>الدمام - الخبر - الجبيل - المنطقة الشرقية</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
