'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, Eye, TrendingUp, BarChart3, Wrench,
  FolderOpen, FileText, Image, Star, ArrowUpRight,
  Smartphone, Monitor, Tablet, Globe, Clock, RefreshCw,
  Activity, MousePointerClick, ArrowDownUp, Zap
} from 'lucide-react';

interface AnalyticsStats {
  today: number;
  week: number;
  month: number;
  total: number;
  uniqueSessions: number;
}

interface AnalyticsData {
  stats: AnalyticsStats;
  devices: { mobile: number; tablet: number; desktop: number };
  dailyTrend: { date: string; count: number; label: string }[];
  topPages: [string, number][];
  sources: [string, number][];
  browsers: [string, number][];
  recentVisits: { timestamp: string; page: string; device: string; browser: string; referrer: string }[];
}

interface ContentCounts {
  services: number;
  projects: number;
  articles: number;
  testimonials: number;
}

function Sparkline({ data }: { data: { count: number; label: string }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  const W = 200;
  const H = 36;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.count / max) * (H - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(' ')} ${W},${H}`} fill="url(#sg)" />
      <polyline points={pts.join(' ')} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Donut({ mobile, tablet, desktop }: { mobile: number; tablet: number; desktop: number }) {
  const total = mobile + tablet + desktop || 1;
  const segs = [
    { v: mobile, c: '#f59e0b', l: 'جوال' },
    { v: tablet, c: '#3b82f6', l: 'تابلت' },
    { v: desktop, c: '#10b981', l: 'سطح مكتب' },
  ];
  let cum = 0;
  const R = 32;
  const cx = 48;
  const cy = 48;
  return (
    <div className="flex items-center gap-4">
      <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
        {segs.map((s, i) => {
          const pct = s.v / total;
          const sa = cum * Math.PI * 2 - Math.PI / 2;
          const ea = (cum + pct) * Math.PI * 2 - Math.PI / 2;
          cum += pct;
          const x1 = cx + R * Math.cos(sa);
          const y1 = cy + R * Math.sin(sa);
          const x2 = cx + R * Math.cos(ea);
          const y2 = cy + R * Math.sin(ea);
          if (pct === 0) return null;
          return (
            <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2} Z`}
              fill={s.c} opacity="0.85" />
          );
        })}
        <circle cx={cx} cy={cy} r="20" fill="#0a0a0f" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fill="#525252" fontSize="6">زيارة</text>
      </svg>
      <div className="space-y-1.5">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.c }} />
            <span className="text-neutral-500 text-[11px]">{s.l}</span>
            <span className="text-white text-[11px] font-bold mr-auto">{total > 0 ? Math.round((s.v / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [counts, setCounts] = useState<ContentCounts>({ services: 0, projects: 0, articles: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, sRes, pRes, artRes, tRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/services'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/articles'),
        fetch('/api/admin/testimonials'),
      ]);
      const aData = await aRes.json();
      setAnalytics(aData);
      setCounts({
        services: Array.isArray(sData = await sRes.json()) ? sData.length : 0,
        projects: Array.isArray(pData = await pRes.json()) ? pData.length : 0,
        articles: Array.isArray(artData = await artRes.json()) ? artData.length : 0,
        testimonials: Array.isArray(tData = await tRes.json()) ? tData.length : 0,
      });
      setLastRefresh(new Date());
      var sData, pData, artData, tData;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pageLabels: Record<string, string> = {
    '/': 'الصفحة الرئيسية', '/services': 'الخدمات', '/projects': 'المشاريع',
    '/blog': 'المدونة', '/gallery': 'المعرض', '/contact': 'التواصل', '/about': 'من نحن',
  };

  const cards = [
    { label: 'زيارات اليوم', value: analytics?.stats.today ?? 0, icon: Eye, color: 'text-amber-400', gradient: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/10' },
    { label: 'هذا الأسبوع', value: analytics?.stats.week ?? 0, icon: Activity, color: 'text-blue-400', gradient: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/10' },
    { label: 'هذا الشهر', value: analytics?.stats.month ?? 0, icon: TrendingUp, color: 'text-emerald-400', gradient: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/10' },
    { label: 'إجمالي الزيارات', value: analytics?.stats.total ?? 0, icon: Users, color: 'text-purple-400', gradient: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/10' },
  ];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-black">لوحة الرئيسية</h1>
          <p className="text-neutral-600 text-xs mt-0.5">آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')}</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-neutral-400 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all backdrop-blur-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {loading && !analytics ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-neutral-600 text-xs">جاري التحميل...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {cards.map((c, i) => (
              <div key={i}
                className={`relative overflow-hidden bg-gradient-to-br ${c.gradient} border ${c.border} rounded-2xl p-4 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-neutral-500 text-[11px] font-semibold">{c.label}</span>
                  <div className={`w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center`}>
                    <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
                  </div>
                </div>
                <p className={`text-2xl font-black ${c.color}`}>
                  {c.value.toLocaleString('ar-SA')}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-sm">منحنى الزيارات</h3>
                  <p className="text-neutral-600 text-[11px]">آخر 30 يوم</p>
                </div>
                <span className="text-amber-400 text-[11px] font-semibold bg-amber-500/10 border border-amber-500/10 px-2.5 py-1 rounded-full">
                  {analytics?.stats.month ?? 0} زيارة
                </span>
              </div>
              {analytics?.dailyTrend && <Sparkline data={analytics.dailyTrend} />}
              <div className="flex justify-between mt-0.5 px-0.5">
                {analytics?.dailyTrend?.filter((_, i) => i % 7 === 0).map((d, i) => (
                  <span key={i} className="text-neutral-600 text-[8px]">{d.label}</span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-sm">توزيع الأجهزة</h3>
                <p className="text-neutral-600 text-[11px]">آخر 30 يوم</p>
              </div>
              {analytics?.devices && (
                <Donut mobile={analytics.devices.mobile} tablet={analytics.devices.tablet} desktop={analytics.devices.desktop} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-white font-semibold text-sm mb-3">أكثر الصفحات زيارةً</h3>
              <div className="space-y-2.5">
                {analytics?.topPages?.slice(0, 6).map(([page, count], i) => {
                  const total = analytics?.stats.month || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-400 text-[11px] font-medium">{pageLabels[page] || page}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-600 text-[11px]">{pct}%</span>
                          <span className="text-amber-400 text-[11px] font-bold">{count}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-amber-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.topPages || analytics.topPages.length === 0) && (
                  <p className="text-neutral-700 text-xs text-center py-4">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-white font-semibold text-sm mb-3">مصادر الزيارات</h3>
              <div className="space-y-2.5">
                {analytics?.sources?.slice(0, 6).map(([source, count], i) => {
                  const total = analytics?.stats.month || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-neutral-600" />
                          <span className="text-neutral-400 text-[11px] font-medium">{source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-600 text-[11px]">{pct}%</span>
                          <span className="text-emerald-400 text-[11px] font-bold">{count}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.sources || analytics.sources.length === 0) && (
                  <p className="text-neutral-700 text-xs text-center py-4">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-white font-semibold text-sm mb-4">محتوى الموقع</h3>
              <div className="space-y-2">
                {[
                  { label: 'الخدمات', value: counts.services, icon: Wrench, href: '/admin/services', color: 'text-amber-400' },
                  { label: 'المشاريع', value: counts.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-400' },
                  { label: 'المقالات', value: counts.articles, icon: FileText, href: '/admin/articles', color: 'text-emerald-400' },
                  { label: 'آراء العملاء', value: counts.testimonials, icon: Star, href: '/admin/testimonials', color: 'text-purple-400' },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-amber-500/10 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span className="text-neutral-400 text-[11px] font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">آخر الزيارات</h3>
                <Link href="/admin/analytics" className="text-amber-400 text-[11px] hover:text-amber-300 flex items-center gap-1">
                  <span>تفاصيل أكثر</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {analytics?.recentVisits?.slice(0, 10).map((visit, i) => {
                  const DeviceIcon = visit.device === 'mobile' ? Smartphone : visit.device === 'tablet' ? Tablet : Monitor;
                  const time = new Date(visit.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-white/[0.02] last:border-0">
                      <div className="w-6 h-6 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0">
                        <DeviceIcon className="w-3 h-3 text-neutral-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-neutral-300 text-[11px] font-medium truncate">{pageLabels[visit.page] || visit.page}</p>
                        <p className="text-neutral-600 text-[9px]">{visit.browser} • {visit.referrer}</p>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-600 text-[9px] shrink-0">
                        <Clock className="w-2 h-2" />
                        <span>{time}</span>
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.recentVisits || analytics.recentVisits.length === 0) && (
                  <div className="text-center py-6">
                    <Eye className="w-6 h-6 text-neutral-700 mx-auto mb-2" />
                    <p className="text-neutral-600 text-xs">لا توجد زيارات مسجلة بعد</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-white font-semibold text-sm mb-3">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'إضافة خدمة', href: '/admin/services', icon: Wrench },
                { label: 'إضافة مشروع', href: '/admin/projects', icon: FolderOpen },
                { label: 'إضافة مقال', href: '/admin/articles', icon: FileText },
                { label: 'إضافة صورة', href: '/admin/gallery', icon: Image },
              ].map((action, i) => (
                <Link key={i} href={action.href}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-amber-500/10 transition-all text-center group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
                    <action.icon className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <span className="text-neutral-500 text-[11px] font-semibold group-hover:text-white transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
