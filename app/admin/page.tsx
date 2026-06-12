'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, Eye, TrendingUp, BarChart3, Wrench,
  FolderOpen, Image, Star, ArrowUpRight,
  Smartphone, Monitor, Tablet, Globe, Clock, RefreshCw,
  Activity, MousePointerClick, Zap, CheckCircle2
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
  testimonials: number;
}

function Sparkline({ data }: { data: { count: number; label: string }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  const W = 200;
  const H = 48;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.count / max) * (H - 6) - 3;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(' ')} ${W},${H}`} fill="url(#sg)" />
      <polyline points={pts.join(' ')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ mobile, tablet, desktop }: { mobile: number; tablet: number; desktop: number }) {
  const total = mobile + tablet + desktop || 1;
  const segs = [
    { v: mobile, c: '#f59e0b', l: 'جوال', icon: Smartphone },
    { v: tablet, c: '#3b82f6', l: 'تابلت', icon: Tablet },
    { v: desktop, c: '#10b981', l: 'سطح مكتب', icon: Monitor },
  ];
  let cum = 0;
  const R = 30;
  const cx = 44;
  const cy = 44;
  return (
    <div className="flex items-center gap-5">
      <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
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
              fill={s.c} opacity="0.9" />
          );
        })}
        <circle cx={cx} cy={cy} r="18" fill="white" />
        <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="middle" fill="#1c1917" fontSize="9" fontWeight="bold">{total}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" fill="#78716c" fontSize="6">زيارة</text>
      </svg>
      <div className="space-y-2">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.c }} />
            <span className="text-stone-500 text-xs">{s.l}</span>
            <span className="text-stone-800 text-xs font-bold mr-auto">{total > 0 ? Math.round((s.v / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [counts, setCounts] = useState<ContentCounts>({ services: 0, projects: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, sRes, pRes, tRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/services'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/testimonials'),
      ]);
      const aData = await aRes.json();
      const [sData, pData, tData] = await Promise.all([
        sRes.json(),
        pRes.json(),
        tRes.json(),
      ]);
      setAnalytics(aData);
      setCounts({
        services: Array.isArray(sData) ? sData.length : 0,
        projects: Array.isArray(pData) ? pData.length : 0,
        testimonials: Array.isArray(tData) ? tData.length : 0,
      });
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pageLabels: Record<string, string> = {
    '/': 'الصفحة الرئيسية', '/services': 'الخدمات', '/projects': 'المشاريع',
    '/gallery': 'المعرض', '/contact': 'التواصل', '/about': 'من نحن',
  };

  const statCards = [
    { label: 'زيارات اليوم', value: analytics?.stats.today ?? 0, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100' },
    { label: 'هذا الأسبوع', value: analytics?.stats.week ?? 0, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100' },
    { label: 'هذا الشهر', value: analytics?.stats.month ?? 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100' },
    { label: 'إجمالي الزيارات', value: analytics?.stats.total ?? 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-100' },
  ];

  return (
    <div dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-stone-900 text-2xl font-black">لوحة الرئيسية</h1>
          <p className="text-stone-500 text-xs mt-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </button>
      </div>

      {loading && !analytics ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-stone-400 text-xs">جاري تحميل الإحصائيات...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((c, i) => (
              <div key={i} className={`relative overflow-hidden bg-white border ${c.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-stone-500 text-xs font-medium">{c.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                    <c.icon className={`w-4 h-4 ${c.color}`} />
                  </div>
                </div>
                <p className={`text-3xl font-black ${c.color}`}>
                  {c.value.toLocaleString('ar-SA')}
                </p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${c.bg} opacity-60`} />
              </div>
            ))}
          </div>

          {/* Trend Chart + Device Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-stone-900 font-bold text-sm">منحنى الزيارات</h3>
                  <p className="text-stone-400 text-[11px] mt-0.5">آخر 30 يوم</p>
                </div>
                <span className="text-amber-700 text-[11px] font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  {analytics?.stats.month ?? 0} زيارة
                </span>
              </div>
              {analytics?.dailyTrend && <Sparkline data={analytics.dailyTrend} />}
              <div className="flex justify-between mt-1 px-0.5">
                {analytics?.dailyTrend?.filter((_, i) => i % 7 === 0).map((d, i) => (
                  <span key={i} className="text-stone-400 text-[9px]">{d.label}</span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-stone-900 font-bold text-sm">توزيع الأجهزة</h3>
                <p className="text-stone-400 text-[11px] mt-0.5">آخر 30 يوم</p>
              </div>
              {analytics?.devices && (
                <DonutChart mobile={analytics.devices.mobile} tablet={analytics.devices.tablet} desktop={analytics.devices.desktop} />
              )}
            </div>
          </div>

          {/* Top Pages + Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-stone-900 font-bold text-sm mb-4">أكثر الصفحات زيارةً</h3>
              <div className="space-y-3">
                {analytics?.topPages?.slice(0, 6).map(([page, count], i) => {
                  const total = analytics?.stats.month || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-stone-600 text-xs font-medium">{pageLabels[page] || page}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 text-[11px]">{pct}%</span>
                          <span className="text-amber-600 text-xs font-bold">{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-amber-500 to-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.topPages || analytics.topPages.length === 0) && (
                  <p className="text-stone-400 text-xs text-center py-6">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-stone-900 font-bold text-sm mb-4">مصادر الزيارات</h3>
              <div className="space-y-3">
                {analytics?.sources?.slice(0, 6).map(([source, count], i) => {
                  const total = analytics?.stats.month || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-600 text-xs font-medium">{source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400 text-[11px]">{pct}%</span>
                          <span className="text-emerald-600 text-xs font-bold">{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.sources || analytics.sources.length === 0) && (
                  <p className="text-stone-400 text-xs text-center py-6">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>
          </div>

          {/* Content + Recent Visits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-stone-900 font-bold text-sm mb-4">محتوى الموقع</h3>
              <div className="space-y-2">
                {[
                  { label: 'الخدمات', value: counts.services, icon: Wrench, href: '/admin/services', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'المشاريع', value: counts.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'آراء العملاء', value: counts.testimonials, icon: Star, href: '/admin/testimonials', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 hover:border-amber-200 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className="text-stone-600 text-xs font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-black ${item.color}`}>{item.value}</span>
                      <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-stone-900 font-bold text-sm">آخر الزيارات</h3>
                <Link href="/admin/analytics" className="text-amber-600 text-[11px] hover:text-amber-700 flex items-center gap-1 font-medium">
                  <span>تفاصيل أكثر</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-0.5 max-h-60 overflow-y-auto">
                {analytics?.recentVisits?.slice(0, 10).map((visit, i) => {
                  const DeviceIcon = visit.device === 'mobile' ? Smartphone : visit.device === 'tablet' ? Tablet : Monitor;
                  const time = new Date(visit.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-stone-50 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <DeviceIcon className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-stone-700 text-xs font-medium truncate">{pageLabels[visit.page] || visit.page}</p>
                        <p className="text-stone-400 text-[10px]">{visit.browser} • {visit.referrer}</p>
                      </div>
                      <div className="flex items-center gap-1 text-stone-400 text-[10px] shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{time}</span>
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.recentVisits || analytics.recentVisits.length === 0) && (
                  <div className="text-center py-8">
                    <Eye className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                    <p className="text-stone-400 text-xs">لا توجد زيارات مسجلة بعد</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-stone-900 font-bold text-sm mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'إضافة خدمة جديدة', href: '/admin/services', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-200' },
                { label: 'إضافة مشروع', href: '/admin/projects', icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-200' },
                { label: 'رفع صورة', href: '/admin/gallery', icon: Image, color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-200' },
              ].map((action, i) => (
                <Link key={i} href={action.href}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl ${action.bg} border ${action.border} transition-all text-center group`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center`}>
                    <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                  </div>
                  <span className="text-stone-700 text-xs font-semibold group-hover:text-stone-900 transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
