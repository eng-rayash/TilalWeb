'use client';

import { useEffect, useState } from 'react';
import { Star, Plus, Pencil, Trash2, X, Save, Search } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
}

const emptyForm: Partial<Testimonial> = { name: '', role: '', feedback: '', rating: 5 };

function StarRating({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={`transition-colors ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className={`w-4 h-4 ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; form: Partial<Testimonial> }>({
    open: false, mode: 'add', form: emptyForm,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/testimonials');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(t =>
    t.name?.includes(search) || t.feedback?.includes(search) || t.role?.includes(search)
  );

  const setField = (key: keyof Testimonial, val: string | number) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  const handleSave = async () => {
    const { form, mode } = modal;
    if (!form.name?.trim() || !form.feedback?.trim()) return;
    setSaving(true);
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const body = mode === 'add' ? { ...form, id: `t-${Date.now()}` } : form;
      await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await load();
      setModal(m => ({ ...m, open: false }));
      showToast(mode === 'add' ? '✓ تمت إضافة التقييم' : '✓ تم تحديث التقييم');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف تقييم "${name}"؟`)) return;
    await fetch('/api/admin/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await load();
    showToast('✓ تم حذف التقييم');
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
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            آراء العملاء
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} تقييم مسجل</p>
        </div>
        <button
          onClick={() => setModal({ open: true, mode: 'add', form: { ...emptyForm } })}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> إضافة تقييم جديد
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث في التقييمات..."
          className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl pr-10 pl-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-sm">
                    {t.name?.[0] || '؟'}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-neutral-500 text-xs">{t.role}</p>
                  </div>
                </div>
                <StarRating value={t.rating} />
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed border-t border-white/5 pt-3 mb-4 line-clamp-3">
                {t.feedback}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ open: true, mode: 'edit', form: { ...t } })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-bold transition-all"
                >
                  <Pencil className="w-3 h-3" /> تعديل
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all"
                >
                  <Trash2 className="w-3 h-3" /> حذف
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Star className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-600 text-sm">{search ? 'لا توجد نتائج' : 'لا توجد تقييمات مضافة بعد'}</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-black text-base">
                {modal.mode === 'add' ? 'إضافة تقييم جديد' : 'تعديل التقييم'}
              </h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">اسم العميل *</label>
                  <input
                    type="text" value={modal.form.name ?? ''} onChange={e => setField('name', e.target.value)}
                    placeholder="محمد العمري"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">المسمى / المنطقة</label>
                  <input
                    type="text" value={modal.form.role ?? ''} onChange={e => setField('role', e.target.value)}
                    placeholder="صاحب فيلا، الدمام"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">التقييم</label>
                <StarRating
                  value={modal.form.rating ?? 5}
                  onChange={n => setField('rating', n)}
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">نص التقييم *</label>
                <textarea
                  value={modal.form.feedback ?? ''} onChange={e => setField('feedback', e.target.value)}
                  rows={4} placeholder="اكتب رأي العميل هنا..."
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving || !modal.form.name?.trim() || !modal.form.feedback?.trim()}
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
