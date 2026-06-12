'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Plus, Pencil, Trash2, X, Save, Search, MapPin, Image } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { SITE_CATEGORIES } from '@/lib/site-categories';

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  serviceSlug?: string;
  images?: { src: string; alt: string }[];
}

const CATEGORIES = [...SITE_CATEGORIES];
const emptyForm: Partial<Project> = { title: '', description: '', location: '', category: CATEGORIES[0], serviceSlug: '' };

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; form: Partial<Project> }>({
    open: false, mode: 'add', form: emptyForm,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(p =>
    p.title?.includes(search) || p.location?.includes(search) || p.category?.includes(search)
  );

  const setField = (key: keyof Project, val: string) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  const handleSave = async () => {
    const { form, mode } = modal;
    if (!form.title?.trim()) return;
    setSaving(true);
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const body = mode === 'add' ? { ...form, id: `proj-${Date.now()}` } : form;
      await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await load();
      setModal(m => ({ ...m, open: false }));
      showToast(mode === 'add' ? '✓ تمت إضافة المشروع' : '✓ تم تحديث المشروع');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;
    await fetch('/api/admin/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await load();
    showToast('✓ تم حذف المشروع');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" dir="rtl">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-black flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-blue-400" />
            إدارة المشاريع
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} مشروع مسجل</p>
        </div>
        <button
          onClick={() => setModal({ open: true, mode: 'add', form: { ...emptyForm } })}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> إضافة مشروع جديد
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث في المشاريع..."
          className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl pr-10 pl-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(proj => (
            <div key={proj.id} className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/20 transition-all group">
              {/* Image preview */}
              <div className="h-36 bg-neutral-800 relative overflow-hidden">
                {proj.images?.[0]?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proj.images[0].src} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="w-8 h-8 text-neutral-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
                <span className="absolute bottom-2 right-2 text-amber-400 text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {proj.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-sm mb-1">{proj.title}</h3>
                <div className="flex items-center gap-1 text-neutral-500 text-xs mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{proj.location || 'غير محدد'}</span>
                </div>
                <p className="text-neutral-500 text-xs line-clamp-2 mb-4">{proj.description}</p>
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setModal({ open: true, mode: 'edit', form: { ...proj } })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-bold transition-all"
                  >
                    <Pencil className="w-3 h-3" /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-neutral-600">لا توجد مشاريع مطابقة</div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-black text-base">
                {modal.mode === 'add' ? 'إضافة مشروع جديد' : 'تعديل المشروع'}
              </h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'title', label: 'عنوان المشروع *', placeholder: 'مثال: مظلة مسبح فلا خاصة' },
                { key: 'location', label: 'الموقع / المدينة', placeholder: 'مثال: الدمام، حي الشاطئ' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">{f.label}</label>
                  <input
                    type="text"
                    value={(modal.form as Record<string, string>)[f.key] ?? ''}
                    onChange={e => setField(f.key as keyof Project, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">التصنيف</label>
                <select
                  value={modal.form.category ?? CATEGORIES[0]}
                  onChange={e => setField('category', e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">الوصف</label>
                <textarea
                  value={modal.form.description ?? ''}
                  onChange={e => setField('description', e.target.value)}
                  rows={3}
                  placeholder="وصف تفاصيل المشروع..."
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                />
              </div>
              <ImageUpload
                value={modal.form.images?.[0]?.src ?? ''}
                onChange={src => setModal(m => ({
                  ...m,
                  form: { ...m.form, images: [{ src, alt: m.form.title || '' }] }
                }))}
                label="صورة المشروع"
                placeholder="أو أدخل رابط الصورة مباشرة..."
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving || !modal.form.title?.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 text-neutral-950 font-black rounded-xl py-3 text-sm transition-all"
              >
                {saving ? <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl py-3 text-sm font-bold transition-all">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
