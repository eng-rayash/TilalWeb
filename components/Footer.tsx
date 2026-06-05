'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';

export default function Footer() {
  const contactInfo = cleanData.settings;

  return (
    <footer id="site_footer" className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 font-sans text-right">
      
      {/* 3-Column Structured Footer layout per user guidelines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Logo, Name & Specialization Description */}
          <div className="space-y-6 flex flex-col items-start text-right">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse group self-start">
              <div className="w-10 h-10 flex items-center justify-center text-amber-500">
                <svg className="w-10 h-10 text-amber-500 transition-colors duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 75 L50 25 L90 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 75 L50 44 L75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                  <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                  <line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-lg leading-tight group-hover:text-amber-400 transition-colors duration-300">
                  مؤسسة تلال
                </span>
                <span className="text-neutral-500 text-xs">
                  للمقاولات العامة والتركيبات المعدنية
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              {contactInfo.description || 'مؤسسة متخصصة في تشييد الهياكل الحديدية والإنشاءات الهندسية، وبناء هناجر ومستودعات ومظلات سيارات في الدمام والخبر بالمنطقة الشرقية.'}
            </p>
            <div className="flex items-center space-x-3 space-x-reverse pt-2">
              <a 
                href={`https://wa.me/${contactInfo.whatsapp}`}
                className="w-10 h-10 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="مراسلة واتساب"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="w-10 h-10 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-550 hover:text-neutral-950 flex items-center justify-center transition-all duration-300"
                aria-label="اتصال سريع"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Information (العنوان-الرقم-رقم الوتس-البريد الإلكتروني) */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-base border-r-4 border-amber-500 pr-3">
              معلومات الاتصال والتواصل
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{contactInfo.address || 'الدمام - المنطقة الشرقية، المملكة العربية السعودية'}</span>
              </li>
              <li className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-amber-500 hover:underline font-bold transition-colors">
                  الهاتف: {contactInfo.phone || '0506819387'}
                </a>
              </li>
              <li className="flex items-center space-x-3 space-x-reverse">
                <MessageCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <a 
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  className="hover:text-amber-500 hover:underline font-bold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  الواتساب: {contactInfo.whatsapp || '966506819387'}
                </a>
              </li>
              <li className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <a href={`mailto:${contactInfo.email || 'info@tlal-ksa.com'}`} className="hover:text-white transition-colors">
                  البريد: {contactInfo.email || 'info@tlal-ksa.com'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Working Hours & Active Days */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-base border-r-4 border-amber-500 pr-3">
              ساعات العمل والنشاط
            </h3>
            <p className="text-sm leading-relaxed text-neutral-400">
              يسعدنا استقبال اتصالاتكم وطلبات المعاينة الفنية والمقايسات على مدار الأسبوع في المنطقة الشرقية.
            </p>
            <div className="flex items-start space-x-3 space-x-reverse bg-neutral-900 border border-neutral-800/80 p-4 rounded-xl">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-neutral-200 font-bold text-sm">أوقات العمل المعتمدة:</p>
                <p className="text-neutral-400 text-xs sm:text-sm">
                  {contactInfo.workingHours || 'طوال أيام الأسبوع من 8:00 صباحًا إلى 8:00 مساءً'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copy of Lower footer */}
      <div className="bg-neutral-950 border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {contactInfo.siteName || 'مؤسسة تلال للمقاولات'}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/services" className="hover:text-neutral-400 transition-colors">خدماتنا</Link>
            <span>•</span>
            <Link href="/gallery" className="hover:text-neutral-400 transition-colors">معرض الأعمال</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
