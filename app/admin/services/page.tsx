'use client';

import { useEffect, useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, X, Save, Search, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { SITE_CATEGORIES } from '@/lib/site-categories';

type Feature = { icon: string; title: string; desc: string };
type Stat = { value: string; label: string };
type ContentBlock = { type: string; text: string };
type Faq = { q: string; a: string };

interface ServiceArticle {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  images: string[];
  intro: string;
  features: Feature[];
  whyUs: string;
  tips: string[];
  stats: Stat[];
  content: ContentBlock[];
  faq: Faq[];
}

interface Service {
  articleKey?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  article?: ServiceArticle;
}

const CATEGORIES = [...SITE_CATEGORIES];

const emptyArticle: ServiceArticle = {
  slug: '',
  title: '',
  subtitle: '',
  heroImage: '',
  images: [],
  intro: '',
  features: [],
  whyUs: '',
  tips: [],
  stats: [],
  content: [],
  faq: [],
};

const emptyForm: Partial<Service> = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  slug: '',
  article: emptyArticle,
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const slugify = (value: string) => value.trim().replace(/\s+/g, '-');
const lines = (value: string) => value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

const serializeFeatures = (items?: Feature[]) => (items || []).map(item => `${item.icon}|${item.title}|${item.desc}`).join('\n');
const parseFeatures = (value: string): Feature[] => lines(value).map(line => {
  const [icon = '•', title = '', ...desc] = line.split('|');
  return { icon: icon.trim() || '•', title: title.trim(), desc: desc.join('|').trim() };
}).filter(item => item.title);

const serializeStats = (items?: Stat[]) => (items || []).map(item => `${item.value}|${item.label}`).join('\n');
const parseStats = (value: string): Stat[] => lines(value).map(line => {
  const [valuePart = '', label = ''] = line.split('|');
  return { value: valuePart.trim(), label: label.trim() };
}).filter(item => item.value && item.label);

const serializeBlocks = (items?: ContentBlock[]) => (items || []).map(item => `${item.type}|${item.text}`).join('\n');
const parseBlocks = (value: string): ContentBlock[] => lines(value).map(line => {
  const [type = 'p', ...text] = line.split('|');
  return { type: type.trim() || 'p', text: text.join('|').trim() };
}).filter(item => item.text);

const serializeFaq = (items?: Faq[]) => (items || []).map(item => `${item.q}|${item.a}`).join('\n');
const parseFaq = (value: string): Faq[] => lines(value).map(line => {
  const [q = '', ...a] = line.split('|');
  return { q: q.trim(), a: a.join('|').trim() };
}).filter(item => item.q && item.a);

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; form: Partial<Service> }>({
    open: false, mode: 'add', form: clone(emptyForm),
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
    s.title?.includes(search) ||
    s.category?.includes(search) ||
    s.description?.includes(search) ||
    s.article?.content?.some(block => block.text.includes(search))
  );

  const openAdd = () => setModal({ open: true, mode: 'add', form: clone(emptyForm) });
  const openEdit = (s: Service) => setModal({ open: true, mode: 'edit', form: clone(s) });
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const setField = (key: keyof Service, val: string) =>
    setModal(m => ({ ...m, form: { ...m.form, [key]: val } }));

  const setArticleField = <K extends keyof ServiceArticle>(key: K, val: ServiceArticle[K]) =>
    setModal(m => ({
      ...m,
      form: {
        ...m.form,
        article: { ...emptyArticle, ...(m.form.article || {}), [key]: val },
      },
    }));

  const setTitle = (title: string) => {
    setModal(m => ({
      ...m,
      form: {
        ...m.form,
        title,
        slug: m.form.slug || slugify(title),
        article: { ...emptyArticle, ...(m.form.article || {}), title, slug: m.form.article?.slug || m.form.slug || slugify(title) },
      },
    }));
  };

  const setDescription = (description: string) => {
    setModal(m => ({
      ...m,
      form: {
        ...m.form,
        description,
        article: { ...emptyArticle, ...(m.form.article || {}), intro: description },
      },
    }));
  };

  const handleSave = async () => {
    const { form, mode } = modal;
    const article = { ...emptyArticle, ...(form.article || {}) };
    const title = form.title?.trim() || article.title?.trim();
    if (!title) return;

    const slug = form.slug?.trim() || article.slug?.trim() || slugify(title);
    const payload = {
      articleKey: form.articleKey,
      slug,
      title,
      description: article.intro || form.description || '',
      category: form.category || CATEGORIES[0],
      article: {
        ...article,
        slug,
        title,
        intro: article.intro || form.description || '',
      },
    };

    setSaving(true);
    try {
      await fetch('/api/admin/services', {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await load();
      closeModal();
      showToast(mode === 'add' ? '✓ تمت إضافة الخدمة والمقال' : '✓ تم تحديث الخدمة والمقال');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`هل أنت متأكد من حذف "${service.title}"؟`)) return;
    setDeleting(service.slug);
    await fetch('/api/admin/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: service.slug, articleKey: service.articleKey }),
    });
    await load();
    setDeleting(null);
    showToast('✓ تم حذف الخدمة');
  };

  const formArticle = { ...emptyArticle, ...(modal.form.article || {}) };

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
            <Wrench className="w-6 h-6 text-amber-400" />
            إدارة الخدمات
          </h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} خدمة رئيسية مع مقالاتها التفصيلية</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          إضافة خدمة جديدة
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث في الخدمات والمقالات..."
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
                {['الخدمة', 'التصنيف', 'المقال', 'الوصف', 'إجراءات'].map(h => (
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
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-blue-300 text-[11px] bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg">
                        {svc.article?.content?.length || 0} كتلة
                      </span>
                      <span className="text-purple-300 text-[11px] bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-lg">
                        {svc.article?.faq?.length || 0} FAQ
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <p className="text-neutral-400 text-xs line-clamp-2">{svc.description}</p>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 flex items-center justify-center transition-all"
                        title="تعديل"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(svc)}
                        disabled={deleting === svc.slug}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 flex items-center justify-center transition-all disabled:opacity-50"
                        title="حذف"
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
                  <td colSpan={5} className="text-center py-12 text-neutral-600 text-sm">
                    {search ? 'لا توجد نتائج للبحث' : 'لا توجد خدمات مضافة بعد'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/5 bg-neutral-900/95 backdrop-blur">
              <h2 className="text-white font-black text-base">
                {modal.mode === 'add' ? 'إضافة خدمة ومقال جديد' : 'تعديل الخدمة والمقال'}
              </h2>
              <button onClick={closeModal} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-6">
              <section className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="flex items-center gap-2 text-white font-bold text-sm">
                  <Tag className="w-4 h-4 text-amber-400" />
                  بيانات الخدمة
                </h3>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">عنوان الخدمة *</label>
                  <input
                    type="text"
                    value={modal.form.title ?? ''}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="مثال: أعمال متنوعة ومقاولات متفرقة"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>

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
                  <label className="text-neutral-400 text-xs font-bold block mb-2">الرابط Slug</label>
                  <input
                    type="text"
                    value={modal.form.slug ?? ''}
                    onChange={e => {
                      setField('slug', e.target.value);
                      setArticleField('slug', e.target.value);
                    }}
                    placeholder="يُنشأ تلقائياً من العنوان"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 font-mono focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">المقدمة المختصرة</label>
                  <textarea
                    value={formArticle.intro || modal.form.description || ''}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="وصف مختصر يظهر في البحث والميتاداتا..."
                    rows={5}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">العنوان الفرعي</label>
                  <input
                    type="text"
                    value={formArticle.subtitle}
                    onChange={e => setArticleField('subtitle', e.target.value)}
                    placeholder="وعد مختصر أو وصف تسويقي للخدمة"
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>

                <ImageUpload
                  value={formArticle.heroImage}
                  onChange={src => setArticleField('heroImage', src)}
                  label="صورة الهيرو"
                  placeholder="أو أدخل رابط صورة الهيرو مباشرة..."
                />

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">صور الخدمة</label>
                  <textarea
                    value={(formArticle.images || []).join('\n')}
                    onChange={e => setArticleField('images', lines(e.target.value))}
                    placeholder="رابط صورة في كل سطر"
                    rows={5}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y font-mono"
                  />
                </div>
              </section>

              <section className="space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="flex items-center gap-2 text-white font-bold text-sm">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  عناصر المقال
                </h3>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">الإحصائيات</label>
                  <textarea
                    value={serializeStats(formArticle.stats)}
                    onChange={e => setArticleField('stats', parseStats(e.target.value))}
                    placeholder={'24س|معاينة مبدئية\n10+|سنوات خبرة'}
                    rows={4}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">المميزات</label>
                  <textarea
                    value={serializeFeatures(formArticle.features)}
                    onChange={e => setArticleField('features', parseFeatures(e.target.value))}
                    placeholder={'🏗️|تنفيذ احترافي|وصف الميزة هنا\n🛡️|ضمان موثق|تفاصيل الضمان'}
                    rows={6}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">لماذا تختار تلال؟</label>
                  <textarea
                    value={formArticle.whyUs}
                    onChange={e => setArticleField('whyUs', e.target.value)}
                    rows={4}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">النصائح</label>
                  <textarea
                    value={(formArticle.tips || []).join('\n')}
                    onChange={e => setArticleField('tips', lines(e.target.value))}
                    placeholder="نصيحة في كل سطر"
                    rows={5}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y"
                  />
                </div>
              </section>

              <section className="lg:col-span-2 space-y-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <h3 className="flex items-center gap-2 text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-amber-400" />
                  المقال التفصيلي والأسئلة الشائعة
                </h3>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">كتل المحتوى التفصيلي</label>
                  <textarea
                    value={serializeBlocks(formArticle.content)}
                    onChange={e => setArticleField('content', parseBlocks(e.target.value))}
                    placeholder={'h2|عنوان رئيسي\np|فقرة تفصيلية\nh3|عنوان فرعي\nli|نقطة قائمة'}
                    rows={14}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y font-mono leading-6"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 text-xs font-bold block mb-2">الأسئلة الشائعة</label>
                  <textarea
                    value={serializeFaq(formArticle.faq)}
                    onChange={e => setArticleField('faq', parseFaq(e.target.value))}
                    placeholder={'السؤال الأول؟|الإجابة التفصيلية\nالسؤال الثاني؟|الإجابة التفصيلية'}
                    rows={6}
                    className="w-full bg-neutral-800 border border-white/10 text-white rounded-xl px-4 py-3 text-xs placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all resize-y font-mono leading-6"
                  />
                </div>
              </section>
            </div>

            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-white/5 bg-neutral-900/95 backdrop-blur">
              <button
                onClick={handleSave}
                disabled={saving || !((modal.form.title || formArticle.title || '').trim())}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-700 text-neutral-950 font-black rounded-xl py-3 text-sm transition-all"
              >
                {saving ? <div className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'جاري الحفظ...' : 'حفظ الخدمة والمقال'}
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
