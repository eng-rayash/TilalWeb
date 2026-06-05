'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, Eye, TrendingUp, BarChart3, Wrench,
  FolderOpen, FileText, Image, Star, ArrowUpRight,
  Smartphone, Monitor, Tablet, Globe, Clock, RefreshCw
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

function MiniLineChart({ data }: { data: { count: number; label: string }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  const W = 400;
  const H = 80;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.count / max) * (H - 10) - 5;
    return `${x},${y}`;
  });
  const polyline = points.join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${polyline} ${W},${H}`}
        fill="url(#lineGrad)"
      />
      <polyline
        points={polyline}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DonutChart({ mobile, tablet, desktop }: { mobile: number; tablet: number; desktop: number }) {
  const total = mobile + tablet + desktop || 1;
  const segments = [
    { value: mobile, color: '#f59e0b', label: 'جوال' },
    { value: tablet, color: '#3b82f6', label: 'تابلت' },
    { value: desktop, color: '#10b981', label: 'سطح مكتب' },
  ];

  let cumulative = 0;
  const R = 40;
  const cx = 60;
  const cy = 60;

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const startAngle = cumulative * Math.PI * 2 - Math.PI / 2;
          const endAngle = (cumulative + pct) * Math.PI * 2 - Math.PI / 2;
          cumulative += pct;

          const x1 = cx + R * Math.cos(startAngle);
          const y1 = cy + R * Math.sin(startAngle);
          const x2 = cx + R * Math.cos(endAngle);
          const y2 = cy + R * Math.sin(endAngle);
          const largeArc = pct > 0.5 ? 1 : 0;

          if (pct === 0) return null;

          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={seg.color}
              opacity="0.85"
            />
          );
        })}
        <circle cx={cx} cy={cy} r="25" fill="#111111" />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize="7">
          زيارة
        </text>
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-neutral-400 text-xs">{seg.label}</span>
            <span className="text-white text-xs font-bold mr-auto">
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </span>
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
      const sData = await sRes.json();
      const pData = await pRes.json();
      const artData = await artRes.json();
      const tData = await tRes.json();

      setAnalytics(aData);
      setCounts({
        services: Array.isArray(sData) ? sData.length : 0,
        projects: Array.isArray(pData) ? pData.length : 0,
        articles: Array.isArray(artData) ? artData.length : 0,
        testimonials: Array.isArray(tData) ? tData.length : 0,
      });
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pageLabels: Record<string, string> = {
    '/': 'الصفحة الرئيسية',
    '/services': 'الخدمات',
    '/projects': 'المشاريع',
    '/blog': 'المدونة',
    '/gallery': 'المعرض',
    '/contact': 'التواصل',
    '/about': 'من نحن',
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-black">لوحة الرئيسية</h1>
          <p className="text-neutral-500 text-sm mt-1">
            آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث</span>
        </button>
      </div>

      {loading && !analytics ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-neutral-500 text-sm">جاري تحميل البيانات...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Visitor Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'زيارات اليوم',
                value: analytics?.stats.today ?? 0,
                icon: Eye,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
              },
              {
                label: 'هذا الأسبوع',
                value: analytics?.stats.week ?? 0,
                icon: TrendingUp,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
              },
              {
                label: 'هذا الشهر',
                value: analytics?.stats.month ?? 0,
                icon: BarChart3,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
              },
              {
                label: 'إجمالي الزيارات',
                value: analytics?.stats.total ?? 0,
                icon: Users,
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`bg-neutral-900 border ${card.border} rounded-2xl p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-neutral-500 text-xs font-bold">{card.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                </div>
                <p className={`text-3xl font-black ${card.color}`}>
                  {card.value.toLocaleString('ar-SA')}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Visitor Trend */}
            <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-sm">منحنى الزيارات</h3>
                  <p className="text-neutral-500 text-xs">آخر 30 يوم</p>
                </div>
                <span className="text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {analytics?.stats.month ?? 0} زيارة
                </span>
              </div>
              {analytics?.dailyTrend && <MiniLineChart data={analytics.dailyTrend} />}
              {/* X labels */}
              <div className="flex justify-between mt-1 px-1">
                {analytics?.dailyTrend?.filter((_, i) => i % 7 === 0).map((d, i) => (
                  <span key={i} className="text-neutral-600 text-[9px]">{d.label}</span>
                ))}
              </div>
            </div>

            {/* Device Distribution */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-white font-bold text-sm">توزيع الأجهزة</h3>
                <p className="text-neutral-500 text-xs">آخر 30 يوم</p>
              </div>
              {analytics?.devices && (
                <DonutChart
                  mobile={analytics.devices.mobile}
                  tablet={analytics.devices.tablet}
                  desktop={analytics.devices.desktop}
                />
              )}
            </div>
          </div>

          {/* Top Pages & Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Pages */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold text-sm mb-4">أكثر الصفحات زيارةً</h3>
              <div className="space-y-3">
                {analytics?.topPages?.slice(0, 6).map(([page, count], i) => {
                  const total = analytics?.stats.month || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-300 text-xs font-medium">
                          {pageLabels[page] || page}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 text-xs">{pct}%</span>
                          <span className="text-amber-400 text-xs font-bold">{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.topPages || analytics.topPages.length === 0) && (
                  <p className="text-neutral-600 text-xs text-center py-4">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold text-sm mb-4">مصادر الزيارات</h3>
              <div className="space-y-3">
                {analytics?.sources?.slice(0, 6).map(([source, count], i) => {
                  const total = analytics?.stats.month || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-neutral-500" />
                          <span className="text-neutral-300 text-xs font-medium">{source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 text-xs">{pct}%</span>
                          <span className="text-emerald-400 text-xs font-bold">{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.sources || analytics.sources.length === 0) && (
                  <p className="text-neutral-600 text-xs text-center py-4">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Stats & Recent Visits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Content Counts */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-white font-bold text-sm mb-5">محتوى الموقع</h3>
              <div className="space-y-3">
                {[
                  { label: 'الخدمات', value: counts.services, icon: Wrench, href: '/admin/services', color: 'text-amber-400' },
                  { label: 'المشاريع', value: counts.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-400' },
                  { label: 'المقالات', value: counts.articles, icon: FileText, href: '/admin/articles', color: 'text-emerald-400' },
                  { label: 'آراء العملاء', value: counts.testimonials, icon: Star, href: '/admin/testimonials', color: 'text-purple-400' },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-neutral-300 text-xs font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Visits */}
            <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm">آخر الزيارات</h3>
                <Link href="/admin/analytics" className="text-amber-400 text-xs hover:text-amber-300 flex items-center gap-1">
                  <span>تفاصيل أكثر</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {analytics?.recentVisits?.slice(0, 10).map((visit, i) => {
                  const DeviceIcon = visit.device === 'mobile' ? Smartphone : visit.device === 'tablet' ? Tablet : Monitor;
                  const time = new Date(visit.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/3 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                        <DeviceIcon className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-neutral-300 text-xs font-medium truncate">
                          {pageLabels[visit.page] || visit.page}
                        </p>
                        <p className="text-neutral-600 text-[10px]">{visit.browser} • {visit.referrer}</p>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-600 text-[10px] shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{time}</span>
                      </div>
                    </div>
                  );
                })}
                {(!analytics?.recentVisits || analytics.recentVisits.length === 0) && (
                  <div className="text-center py-8">
                    <Eye className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                    <p className="text-neutral-600 text-xs">لا توجد زيارات مسجلة بعد</p>
                    <p className="text-neutral-700 text-[10px] mt-1">ستظهر الزيارات هنا بعد فتح الموقع</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'إضافة خدمة', href: '/admin/services', icon: Wrench, color: 'amber' },
                { label: 'إضافة مشروع', href: '/admin/projects', icon: FolderOpen, color: 'blue' },
                { label: 'إضافة مقال', href: '/admin/articles', icon: FileText, color: 'emerald' },
                { label: 'إضافة صورة', href: '/admin/gallery', icon: Image, color: 'purple' },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/20 transition-all text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-700 group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
                    <action.icon className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <span className="text-neutral-400 text-xs font-bold group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
