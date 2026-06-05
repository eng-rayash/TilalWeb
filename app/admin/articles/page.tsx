'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Pencil, Trash2, X, Save, Search, Calendar } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  content?: { type: string; text: string }[];
}

const emptyForm: Partial<Article> = {
  title: '', description: '', date: new Date().toISOString().split('T')[0], slug: '', content: []
};

export default function ArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; form: Partial<Article> }>({
    open: false, mode: 'add', form: emptyForm,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/articles');
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(a =>
    a.title?.includes(search) || a.description?.includes(search)
  );

  const setField = (key: keyof Article, val: string) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  const handleSave = async () => {
    const { form, mode } = modal;
    if (!form.title?.trim()) return;
    setSaving(true);
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const body = mode === 'add'
        ? { ...form, slug: form.slug || `article-${Date.now()}` }
        : form;
      await fetch('/api/admin/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await load();
      setModal(m => ({ ...m, open: false }));
      showToast(mode === 'add' ? '✓ تمت إضافة المقال' : '✓ تم تحديث المقال');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;
    await fetch('/api/admin/articles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    await load();
    showToast('✓ تم حذف المقال');
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
            <FileText className="w-6 h-6 text-emerald-400" />
            إدارة المقالات
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} مقال منشور</p>
        </div>
        <button
          onClick={() => setModal({ open: true, mode: 'add', form: { ...emptyForm } })}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" /> إضافة مقال جديد
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث في المقالات..."
          className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl pr-10 pl-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="border-b border-white/5">
              <tr>
                {['العنوان', 'الوصف المختصر', 'التاريخ', 'إجراءات'].map(h => (
                  <th key={h} className="text-neutral-500 text-xs font-bold py-4 px-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((art, i) => (
                <tr key={art.slug} className={`border-b border-white/3 hover:bg-white/2 transition-colors`}>
                  <td className="py-4 px-5">
                    <p className="text-white font-bold text-sm">{art.title}</p>
                    <p className="text-neutral-600 text-[10px] font-mono">{art.slug}</p>
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <p className="text-neutral-400 text-xs line-clamp-2">{art.description}</p>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <Calendar className="w-3 h-3 text-emerald-500" />
                      <span>{art.date}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal({ open: true, mode: 'edit', form: { ...art } })}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 flex items-center justify-center transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.slug, art.title)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-neutral-600 text-sm">
                    {search ? 'لا توجد نتائج' : 'لا توجد مقالات مضافة بعد'}
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
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-white font-black text-base">
                {modal.mode === 'add' ? 'إضافة مقال جديد' : 'تعديل المقال'}
              </h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">عنوان المقال *</label>
                <input
                  type="text" value={modal.form.title ?? ''} onChange={e => setField('title', e.target.value)}
                  placeholder="مثال: دليل اختيار مظلات السيارات المناسبة"
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">التاريخ</label>
                  <input
                    type="date" value={modal.form.date ?? ''} onChange={e => setField('date', e.target.value)}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">الـ Slug</label>
                  <input
                    type="text" value={modal.form.slug ?? ''} onChange={e => setField('slug', e.target.value)}
                    placeholder="يُنشأ تلقائياً"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">الوصف المختصر</label>
                <textarea
                  value={modal.form.description ?? ''} onChange={e => setField('description', e.target.value)}
                  rows={2} placeholder="ملخص المقال الذي يظهر في نتائج البحث..."
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-neutral-400 text-xs font-bold block mb-2">محتوى المقال</label>
                <textarea
                  value={modal.form.content?.map(b => b.text).join('\n\n') ?? ''}
                  onChange={e => setModal(m => ({
                    ...m,
                    form: {
                      ...m.form,
                      content: e.target.value.split('\n\n').filter(Boolean).map(text => ({ type: 'paragraph', text }))
                    }
                  }))}
                  rows={8}
                  placeholder="اكتب محتوى المقال هنا... (افصل الفقرات بسطر فارغ)"
                  className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button
                onClick={handleSave}
                disabled={saving || !modal.form.title?.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 text-neutral-950 font-black rounded-xl py-3 text-sm transition-all"
              >
                {saving ? <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'جاري الحفظ...' : 'حفظ المقال'}
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
