'use client';

import Image from 'next/image';
import { ShieldCheck, Award, HeartHandshake, Phone, MessageCircle } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';

export default function AboutPage() {
  const contactInfo = cleanData.settings;

  const coreValues = [
    {
      title: 'الجودة الفائقة والمواصفات القياسية',
      description: 'نلتزم التزاماً تاماً بتوريد وتركيب أفضل المواد المعدنية ومظلات السيارات المقاومة للأوزون والعوامل الجوية بالشرقية بمواصفات مطابقة للدفاع المدني وخامات ممتازة.',
      icon: ShieldCheck
    },
    {
      title: 'الشفافية والتسعير العادل المنافس',
      description: 'نقدّم حلولاً متطورة وبدائل متعددة لكل مشروع لتناسب ميزانية عملائنا مع الالتزام بتقديم عروض أسعار تفصيلية شفافة بلا رسوم خفية أو زيادات مفاجئة.',
      icon: Award
    },
    {
      title: 'الكفاءة والالتزام بالجدول الزمني',
      description: 'تتميز فرقنا الفنية بالتنسيق الفائق والسرعة الفائقة في تنفيذ وتغطية المساحات الكبيرة وتشييد الهناجر مع تسليم العمل في التوقيتات المتفق عليها.',
      icon: HeartHandshake
    },
  ];

  return (
    <div className="bg-neutral-50 pb-24 text-right">
      
      {/* 1. Header Hero Panel */}
      <section className="relative bg-neutral-950 text-white py-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://ik.imagekit.io/tilal/tilal-web/hero/hero-services.jpg"
            alt="من نحن - تلال للمقاولات"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">تعرّف على خبرتنا</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">قصة الريادة وضمان مؤسسة تلال</h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            مؤسسة تلال للمقاولات كشركة رائدة ترسم الريادة في قطاع تشييد الهياكل الحديدية والمستودعات والظل المعاصر بالمنطقة الشرقية.
          </p>
        </div>
      </section>

      {/* 2. Narrative Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/10">منذ عقد من الزمان</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-4">ثقة تبنى، ومشاريع تتخطى التوقعات</h2>
            <div className="w-16 h-1.5 bg-amber-500 my-5 rounded-full" />
            
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-4 text-justify">
              تأسست مؤسسة تلال للمقاولات العامة في المنطقة الشرقية بالمملكة العربية السعودية لتقديم خدمات نوعية في البناء والتشطيب والإنشاء والمظلات. قادنا الالتزام المستمر بالتطور واستثمار الإمكانات والابتكارات لنكون الخيار الأول للعملاء في الدمام والخبر والجبيل لتنفيذ المشاريع الكبرى والمصانع ومظلات مواقف السيارات والفلل السكنية.
            </p>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 text-justify">
              نحن نؤمن بأن رضا العميل هو حجر الزاوية لنجاح واستمرار أية مؤسسة؛ لذلك نعمل جاهدين على انتقاء الكوادر الهندسية والعمال والحدادين المحترفين وتوريد خامات الحديد والدهانات المقاومة للصدأ والعوامل الجوية الشديدة، لنوفر لعملائنا السلامة والجمال والديمومة.
            </p>

            <div className="bg-amber-500/10 border-r-4 border-amber-500 p-6 rounded-l-xl">
              <p className="text-neutral-950 font-bold text-sm sm:text-base mb-1">رسالتنا السامية:</p>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                تقديم خدمات وحلول إيجاد وبناء عالية الجودة والأمان في قطاع الهناجر والمظلات والمستودعات والترميم بسواعد كوادرنا الوطنية والخبرات الدولية، لنهيئ غداً معاصراً ومتيناً لعملائنا في السعودية.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-neutral-100">
            <Image
              src="https://ik.imagekit.io/tilal/tilal-web/hero/service-fallback-4.jpg"
              alt="تلال للمقاولات"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="bg-white border-y border-neutral-150 py-24 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/10">مبادئ نسير عليها</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-4">القيم والثوابت المهنية لمؤسستنا</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto my-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div 
                key={idx} 
                className="bg-neutral-50 rounded-2xl border border-neutral-100 p-6 sm:p-8 text-right flex flex-col items-start hover:border-amber-400 transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 shrink-0 self-start">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-neutral-950 mb-3">{value.title}</h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Direct CTA banner */}
      <section className="max-w-5xl mx-auto px-4 mt-24">
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <p className="text-amber-500 font-bold uppercase text-xs">تواصل وطني ممتد</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-4">يسر فريقنا الهندسي الرد على تساؤلاتكم واستفساراتكم</h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
            في مؤسسة تلال، مستشارونا ومهندسونا على تواصل كامل على مدار الساعة طوال أيام الأسبوع لتلبية متطلبات أعمال المشاريع بالشرقية بمرونة ومهنية.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>مراسلتنا عبر واتساب</span>
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span>اتصل بنا الآن</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
