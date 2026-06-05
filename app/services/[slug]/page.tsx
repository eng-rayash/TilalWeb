'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowRight, Phone, MessageCircle, MapPin, Calendar, CheckSquare } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';
import { Service } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SingleServicePage({ params }: PageProps) {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug);
  const contactInfo = cleanData.settings;
  const services = cleanData.services as Service[];

  // Find the service by slug (try exact match first, then decoded, then includes)
  const service = services.find(s => 
    s.slug === slug || 
    s.slug === decodedSlug || 
    decodeURIComponent(s.slug) === decodedSlug ||
    s.slug.toLowerCase().includes(decodedSlug.toLowerCase())
  );

  if (!service) {
    return notFound();
  }

  const otherServices = services.filter(s => s.slug !== service.slug).slice(0, 3);

  // Helper for falling back image of related services
  const getImageUrl = (item: Service) => {
    if (item.images && item.images.length > 0 && item.images[0].src) {
      return item.images[0].src;
    }
    return "/images/hero/hero-construction.jpg";
  };

  // JSON-LD Schemas for SEO
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'مؤسسة تلال للمقاولات العامة',
      url: 'https://tlal-ksa.com',
      telephone: '+966556575574',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'الدمام',
        addressRegion: 'المنطقة الشرقية',
        addressCountry: 'SA',
      },
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'المنطقة الشرقية، السعودية',
    },
    url: `https://tlal-ksa.com/services/${service.slug}`,
    image: service.images?.[0]?.src || 'https://tlal-ksa.com/images/hero/hero-construction.jpg',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://tlal-ksa.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'خدماتنا',
        item: 'https://tlal-ksa.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://tlal-ksa.com/services/${service.slug}`,
      },
    ],
  };

  return (
    <div className="bg-neutral-50 pb-24 text-right">
      {/* JSON-LD: Service + Breadcrumb */}
      <Script
        id={`service-schema-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id={`breadcrumb-schema-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />
      
      {/* 1. Header Hero Panel */}
      <section className="relative bg-neutral-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          {service.images && service.images.length > 0 && (
            <Image
              src={service.images[0].src}
              alt={service.title}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl transition-all mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لكافة الخدمات</span>
          </Link>

          <span className="block text-amber-500 font-bold text-xs sm:text-sm">{service.category || 'مقاولات عامة'}</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-white max-w-4xl leading-tight">
            {service.title}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-3 max-w-3xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      {/* 2. Page Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content (Spaced Column - 8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-100 p-6 sm:p-10 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-6 pb-4 border-b border-neutral-100">تفاصيل الخدمة ومواصفات التنفيذ الرياضية</h2>
            
            {/* Structured Text Elements */}
            <div className="space-y-6 text-neutral-700 leading-relaxed text-sm sm:text-base">
              {service.content && service.content.length > 0 ? (
                service.content.map((block, idx) => {
                  if (block.type.startsWith('h')) {
                    const H = block.type as keyof HTMLElementTagNameMap;
                    let headingSizes = 'font-bold text-neutral-950 mt-8 mb-4 ';
                    if (block.type === 'h1' || block.type === 'h2') headingSizes += 'text-lg sm:text-2xl border-r-4 border-amber-500 pr-3';
                    else if (block.type === 'h3') headingSizes += 'text-md sm:text-xl text-amber-600 pr-2';
                    else headingSizes += 'text-sm sm:text-lg';
                    
                    return (
                      <h3 key={idx} className={headingSizes}>
                        {block.text}
                      </h3>
                    );
                  } else {
                    return (
                      <p key={idx} className="text-neutral-600 text-justify break-words leading-relaxed whitespace-pre-line">
                        {block.text}
                      </p>
                    );
                  }
                })
              ) : (
                <p className="text-neutral-500 text-center py-6">جاري تحميل مواصفات الخدمة التفصيلية...</p>
              )}
            </div>

            {/* Service Images Showcase */}
            {service.images && service.images.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-150">
                <h3 className="font-bold text-neutral-950 text-lg sm:text-xl mb-6">معرض صور من أعمال ومشاريع {service.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.images.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative h-60 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 hover:border-amber-400 cursor-pointer group shadow-sm"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || service.title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                        <span className="text-white font-bold text-xs">{img.alt || service.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Consultation CTA */}
            <div className="bg-neutral-900 text-white rounded-2xl border border-neutral-800 p-6 sm:p-8 shadow-md">
              <h3 className="font-bold text-white text-lg mb-3">تواصل فوري للحصول على تسعير دقيق</h3>
              <p className="text-neutral-400 text-xs sm:text-sm mb-6 leading-relaxed">
                هل تود معرفة أسعار وتفاصيل تنفيذ مشروعك بالدمام أو الخبر؟ اتصل بنا أو راسلنا الآن لتلقي استشارة فورية وتقدير دقيق للتكلفة.
              </p>
              <div className="space-y-3.5">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}?text=السلام%20عليكم،%20أريد%20الاستفسار%20عن%20تفاصيل%20وأسعار%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>تواصل مباشر واتساب</span>
                </a>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-transparent text-white border border-neutral-700 hover:border-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span>اتصل الآن بمهندس المبيعات</span>
                </a>
              </div>
            </div>

            {/* Delivery Warranties / Trust badges */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-sm text-right">
              <h3 className="font-bold text-neutral-950 text-base mb-6 pb-2.5 border-b border-neutral-100">ثقة وضمان مؤسسة تلال</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 justify-start">
                  <CheckSquare className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-950 text-sm">ضمان حتى ١٠ سنوات</h4>
                    <p className="text-neutral-500 text-xs mt-1">ضمان رسمي على كافة التركيبات المعدنية والهناجر وسيوف الحداد.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 justify-start">
                  <CheckSquare className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-950 text-sm">خامات أصلية قياسية</h4>
                    <p className="text-neutral-500 text-xs mt-1">نستخدم حديد سابك، أقمشة بي في سي كوري، ولجام لكسان بلجيكي مقاوم للعواصف.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 justify-start">
                  <CheckSquare className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-950 text-sm">سرعة في التنفيذ والتشطيب</h4>
                    <p className="text-neutral-500 text-xs mt-1">الالتزام بمواعيد تسليم المشاريع وبنود التعاقد والشرط الجزائي بالوقت.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Other Related Services */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-neutral-950 text-base mb-6 pb-2.5 border-b border-neutral-100">خدمات مقاولات أخرى</h3>
              <div className="space-y-4">
                {otherServices.map((item) => (
                  <Link 
                    href={`/services/${item.slug}`} 
                    key={item.slug}
                    className="flex gap-4 items-center group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-50">
                      <Image
                        src={getImageUrl(item)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h4 className="font-bold text-neutral-950 text-sm group-hover:text-amber-500 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-neutral-400 text-xs mt-1 truncate">{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
