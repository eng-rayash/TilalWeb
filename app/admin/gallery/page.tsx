'use client';

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, Save, Search, Tag, ExternalLink, Pencil } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title?: string;
}

const CATEGORIES = [
  'مظلات وسواتر',
  'هناجر ومستودعات',
  'بناء وترميم',
  'واجهات كلادنج',
  'بيوت شعر مجهزة',
  'برجولات وجلسات',
  'شبوك تجارية وزراعية',
  'قرميد وديكورات',
  'أخرى'
];

const emptyForm: Partial<GalleryItem> = { src: '', alt: '', category: CATEGORIES[0], title: '' };

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('الكل');
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<Partial<GalleryItem>>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/gallery');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(item => {
    const matchCat = filterCat === 'الكل' || item.category === filterCat;
    const matchSearch = !search || item.alt?.includes(search) || item.title?.includes(search) || item.category?.includes(search);
    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setMode('add');
    setForm({ ...emptyForm });
    setModal(true);
  };

  const openEdit = (item: GalleryItem) => {
    setMode('edit');
    setForm({ ...item });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.src?.trim()) return;
    setSaving(true);
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const body = mode === 'add' ? { ...form, id: `gallery-${Date.now()}` } : form;
      await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await load();
      setModal(false);
      setForm({ ...emptyForm });
      showToast(mode === 'add' ? '✓ تمت إضافة الصورة' : '✓ تم تحديث الصورة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    await fetch('/api/admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await load();
    showToast('✓ تم حذف الصورة');
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
            <ImageIcon className="w-6 h-6 text-purple-400" />
            معرض الصور
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} صورة مضافة</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> إضافة صورة
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-48 bg-neutral-900 border border-white/10 text-white rounded-xl pr-10 pl-4 py-2.5 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['الكل', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                filterCat === cat ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="relative group bg-neutral-900 border border-white/5 rounded-xl overflow-hidden aspect-square hover:border-amber-500/30 transition-all">
              {item.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-8 h-8 text-neutral-700" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-[10px] font-bold line-clamp-1 mb-1.5">{item.alt || item.title || item.category}</p>
                  <div className="flex gap-1.5">
                    <a
                      href={item.src} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 flex items-center justify-center py-1.5 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-400 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 flex items-center justify-center py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Category badge */}
              <span className="absolute top-2 right-2 text-[9px] font-bold bg-black/60 text-amber-400 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                {item.category}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <ImageIcon className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-600 text-sm">لا توجد صور مطابقة</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-black text-base">
                {mode === 'add' ? 'إضافة صورة جديدة' : 'تعديل بيانات الصورة'}
              </h2>
              <button onClick={() => setModal(false)} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUpload
                value={form.src ?? ''}
                onChange={src => setForm(f => ({ ...f, src }))}
                label="الصورة *"
                placeholder="أو أدخل رابط الصورة مباشرة..."
              />
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">الوصف / النص البديل</label>
                <input
                  type="text" value={form.alt ?? ''} onChange={e => setForm(f => ({ ...f, alt: e.target.value }))}
                  placeholder="وصف الصورة..."
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-amber-500" /> التصنيف
                </label>
                <select
                  value={form.category ?? CATEGORIES[0]}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving || !form.src?.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 text-neutral-950 font-black rounded-xl py-3 text-sm transition-all"
              >
                {saving ? <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'جاري الحفظ...' : mode === 'add' ? 'إضافة الصورة' : 'حفظ التعديلات'}
              </button>
              <button onClick={() => setModal(false)} className="px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl py-3 text-sm font-bold transition-all">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
