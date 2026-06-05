'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, Phone, Mail, MapPin, Clock, Globe, MessageSquare } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  slogan: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        setSettings(d);
        setForm(d);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setForm(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSettings(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof SiteSettings; label: string; icon: React.ElementType; placeholder: string; textarea?: boolean }[] = [
    { key: 'siteName', label: 'اسم الموقع', icon: Globe, placeholder: 'مؤسسة تلال للمقاولات' },
    { key: 'slogan', label: 'الشعار / السلوقان', icon: Globe, placeholder: 'جودة البناء وعراقة الإنشاء' },
    { key: 'description', label: 'وصف الموقع', icon: Globe, placeholder: 'وصف مختصر للمؤسسة...', textarea: true },
    { key: 'phone', label: 'رقم الهاتف', icon: Phone, placeholder: '+966556575574' },
    { key: 'whatsapp', label: 'رقم الواتساب', icon: MessageSquare, placeholder: '966556575574' },
    { key: 'email', label: 'البريد الإلكتروني', icon: Mail, placeholder: 'info@tilal-ksa.com' },
    { key: 'address', label: 'العنوان', icon: MapPin, placeholder: 'الدمام، المنطقة الشرقية' },
    { key: 'workingHours', label: 'ساعات العمل', icon: Clock, placeholder: 'السبت - الخميس: 8ص - 10م' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-black flex items-center gap-3">
            <Settings className="w-6 h-6 text-amber-400" />
            الإعدادات العامة
          </h1>
          <p className="text-neutral-500 text-sm mt-1">إدارة معلومات وبيانات التواصل الخاصة بالموقع</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !form}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          {saved ? (
            <>✓ تم الحفظ</>
          ) : saving ? (
            <><div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" /> حفظ...</>
          ) : (
            <><Save className="w-4 h-4" /> حفظ التغييرات</>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-3xl">
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-bold text-sm mb-6 pb-4 border-b border-white/5">بيانات الموقع والتواصل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map(field => (
                <div key={field.key} className={field.textarea ? 'md:col-span-2' : ''}>
                  <label className="flex items-center gap-2 text-neutral-400 text-xs font-bold mb-2">
                    <field.icon className="w-3.5 h-3.5 text-amber-500" />
                    {field.label}
                  </label>
                  {field.textarea ? (
                    <textarea
                      value={form?.[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form?.[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
            <p className="text-amber-400 text-xs font-bold">ℹ️ ملاحظة مهمة</p>
            <p className="text-neutral-500 text-xs mt-1">
              التغييرات تُحفظ فوراً في ملفات الموقع. تحتاج إلى إعادة بناء المشروع لرؤية التغييرات على الموقع.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
