'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import cleanData from '@/lib/data/clean_data.json';

export default function ContactPage() {
  const contactInfo = cleanData.settings;

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setTopic('');
      setMessage('');
      
      setTimeout(() => setSubmitted(false), 8000);
    }, 1200);
  };

  return (
    <div className="bg-neutral-50 pb-24 text-right">
      
      {/* 1. Header Hero Panel */}
      <section className="relative bg-neutral-950 text-white py-20 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/hero/hero-construction.jpg"
            alt="اتصل بمؤسسة تلال"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">يسعدنا تواصلك دائماً</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-3">اتصل بنا أو راسلنا الآن</h1>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            احصل على إجابات فورية واستشارات متكاملة طوال أيام الأسبوع من مسؤولي الدعم والمبيعات بمؤسسة تلال بالشرقية.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-100 p-6 sm:p-10 shadow-sm relative">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-3">أرسل لنا رسالة أو طلب تسعير فوري</h2>
            <p className="text-neutral-500 text-xs sm:text-sm mb-8 leading-relaxed">
              يرجى تعبئة النموذج أدناه وتحديث بيانات موقع مشروعك وسيجيبك مهندسنا المختص مع تقديم كشف تقريبي بالأسعار والخامات.
            </p>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-500/10 text-emerald-400 p-8 rounded-2xl border border-emerald-500/20 text-center"
              >
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">تم استلام رسالتك بنجاح!</h3>
                <p className="text-sm leading-relaxed text-emerald-400/80 max-w-md mx-auto">
                  نشكرك على ذوقك وتواصلك معنا. نحن نقدر وقتك كثيراً، وسوف يقوم مهندسينا بدراسة مشروعك والاتصال بك خلال ساعات معدودة.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-2">الاسم الكريم (مطلوب)</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                      placeholder="مثال: يوسف المطيري"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-2">رقم الجوال النشط (مطلوب)</label>
                    <input
                      type="tel"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-left"
                      placeholder="05xxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-2">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-left"
                      placeholder="example@yourmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-2">موضوع الرسالة</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option value="">امضِ وحدد...</option>
                      <option value="عرض سعر هناجر">طلب تسعير مستودعات أو هناجر</option>
                      <option value="تركيب مظلات سيارات">طلب مظلات مواقف سيارات</option>
                      <option value="أعمال سواتر للفلل">سواتر جدران وحواجز</option>
                      <option value="مقاولات وترميم عام">أعمال ترميم أو بناء ملاحق وتشطيب</option>
                      <option value="شبوك وقرميد">أعمال الشبوك أو القرميد أو بيوت الشعر</option>
                      <option value="أخرى">أخرى / رسالة استشارية</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-2">تفاصيل مشروعك أو سؤالك</label>
                  <textarea
                    rows={4}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                    placeholder="امضِ في كتابة أية تفاصيل مثل المساحة المتوقعة وطبيعة الأرض والعمل والمدينة..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-neutral-900 hover:bg-neutral-850 text-amber-500 font-bold py-4 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'جاري الإرسال الفوري للرسالة...' : 'أرسل الرسالة الآن'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Info box (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Real contact channels listed */}
            <div className="bg-neutral-900 text-white rounded-2xl border border-neutral-800 p-6 sm:p-8 shadow-md">
              <h3 className="font-bold text-white text-lg mb-6 pb-2.5 border-b border-neutral-800">قنوات التواصل النشطة بمؤسستنا</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start justify-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-300 text-xs">اتصال هاتفي مباشر للمبيعات:</h4>
                    <a href={`tel:${contactInfo.phone}`} className="text-white font-bold text-sm sm:text-base mt-1 block hover:text-amber-400 hover:underline">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start justify-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-300 text-xs">مراسلة فورية عبر الـ WhatsApp:</h4>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-bold text-sm sm:text-base mt-2.5 block hover:text-emerald-400 hover:underline"
                    >
                      مراسلة المهندس المختص
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start justify-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-300 text-xs">البريد الإلكتروني الرسمي:</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-white font-bold text-sm sm:text-base mt-1 block hover:text-amber-400 hover:underline">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start justify-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-300 text-xs font-sans">المقر والإدارة:</h4>
                    <p className="text-white text-sm mt-1">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start justify-start">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-300 text-xs">ساعات العمل الرسمية:</h4>
                    <p className="text-white text-sm mt-1">{contactInfo.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick alert box */}
            <div className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-6 flex gap-4 items-start justify-start">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">سرعة الاستجابة والتواصل</h4>
                <p className="text-neutral-500 text-xs mt-1.5 leading-relaxed">
                  نحن نوفر خدمات تواصل فوري واستجابة سريعة لجميع عملائنا بالدمام ومختلف مدن ومحافظات المنطقة الشرقية للفلل والمساحات الكبرى.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
