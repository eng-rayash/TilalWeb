'use client';

import { useEffect, useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, X, Save, Search, Tag } from 'lucide-react';

interface Service {
  slug: string;
  title: string;
  description: string;
  category: string;
  url?: string;
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

const emptyForm: Partial<Service> = { title: '', description: '', category: CATEGORIES[0], slug: '' };

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; form: Partial<Service> }>({
    open: false, mode: 'add', form: emptyForm,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/services');
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(s =>
    s.title?.includes(search) || s.category?.includes(search) || s.description?.includes(search)
  );

  const openAdd = () => setModal({ open: true, mode: 'add', form: { ...emptyForm } });
  const openEdit = (s: Service) => setModal({ open: true, mode: 'edit', form: { ...s } });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const handleSave = async () => {
    const { form, mode } = modal;
    if (!form.title?.trim()) return;
    setSaving(true);
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const body = mode === 'add'
        ? { ...form, slug: form.slug || `${form.title?.replace(/\s+/g, '-')}-${Date.now()}` }
        : form;
      await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await load();
      closeModal();
      showToast(mode === 'add' ? '✓ تمت إضافة الخدمة' : '✓ تم تحديث الخدمة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;
    setDeleting(slug);
    await fetch('/api/admin/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    await load();
    setDeleting(null);
    showToast('✓ تم حذف الخدمة');
  };

  const setField = (key: keyof Service, val: string) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" dir="rtl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-black flex items-center gap-3">
            <Wrench className="w-6 h-6 text-amber-400" />
            إدارة الخدمات
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} خدمة مسجلة</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          إضافة خدمة جديدة
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث في الخدمات..."
          className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl pr-10 pl-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="border-b border-white/5">
              <tr>
                {['الخدمة', 'التصنيف', 'الوصف', 'إجراءات'].map(h => (
                  <th key={h} className="text-neutral-500 text-xs font-bold py-4 px-5 text-right">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((svc, i) => (
                <tr key={svc.slug} className={`border-b border-white/3 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/1'}`}>
                  <td className="py-4 px-5">
                    <p className="text-white font-bold text-sm">{svc.title}</p>
                    <p className="text-neutral-600 text-[10px] font-mono">{svc.slug}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      {svc.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <p className="text-neutral-400 text-xs line-clamp-2">{svc.description}</p>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 flex items-center justify-center transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(svc.slug, svc.title)}
                        disabled={deleting === svc.slug}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-all disabled:opacity-50"
                      >
                        {deleting === svc.slug
                          ? <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-neutral-600 text-sm">
                    {search ? 'لا توجد نتائج للبحث' : 'لا توجد خدمات مضافة بعد'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-black text-base">
                {modal.mode === 'add' ? 'إضافة خدمة جديدة' : 'تعديل الخدمة'}
              </h2>
              <button onClick={closeModal} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">عنوان الخدمة *</label>
                <input
                  type="text"
                  value={modal.form.title ?? ''}
                  onChange={e => setField('title', e.target.value)}
                  placeholder="مثال: تركيب مظلات السيارات"
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2 flex items-center gap-2">
                  <Tag className="w-3 h-3 text-amber-500" /> التصنيف
                </label>
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
                  placeholder="وصف مختصر للخدمة..."
                  rows={3}
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                />
              </div>
              {modal.mode === 'add' && (
                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">الـ Slug (اختياري)</label>
                  <input
                    type="text"
                    value={modal.form.slug ?? ''}
                    onChange={e => setField('slug', e.target.value)}
                    placeholder="يُنشأ تلقائياً إن تُرك فارغاً"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 font-mono focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              )}
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
              <button onClick={closeModal} className="px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl py-3 text-sm font-bold transition-all">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
