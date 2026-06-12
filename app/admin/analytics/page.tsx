'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3, Users, Eye, TrendingUp, Smartphone, Monitor, Tablet,
  Globe, Clock, RefreshCw, Download, Calendar, ChevronDown
} from 'lucide-react';

interface AnalyticsData {
  stats: { today: number; week: number; month: number; total: number; uniqueSessions: number };
  devices: { mobile: number; tablet: number; desktop: number };
  browsers: [string, number][];
  topPages: [string, number][];
  sources: [string, number][];
  dailyTrend: { date: string; count: number; label: string }[];
  hourlyMap: number[];
  recentVisits: { timestamp: string; page: string; device: string; browser: string; referrer: string }[];
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'الصفحة الرئيسية',
  '/services': 'الخدمات',
  '/projects': 'المشاريع',
  '/gallery': 'المعرض',
  '/contact': 'التواصل',
  '/about': 'من نحن',
};

function LineChart({ data }: { data: { count: number; label: string; date: string }[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  const W = 800;
  const H = 160;
  const padL = 40;
  const padB = 30;
  const chartW = W - padL;
  const chartH = H - padB;

  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: chartH - (d.count / max) * (chartH - 10) + 5,
    ...d,
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${padL},${chartH} ${polyline} ${W - 0.5},${chartH}`;

  const yTicks = [0, Math.round(max / 2), max];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick, i) => {
        const y = chartH - (tick / max) * (chartH - 10) + 5;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 5} y={y + 4} fill="#4b5563" fontSize="9" textAnchor="end">{tick}</text>
          </g>
        );
      })}

      {/* Area fill */}
      <polygon points={area} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots for high values */}
      {pts.map((p, i) => p.count > 0 && (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#f59e0b" opacity="0.7" />
      ))}

      {/* X labels every 5 days */}
      {pts.filter((_, i) => i % 5 === 0).map((p, i) => (
        <text key={i} x={p.x} y={H - 5} fill="#4b5563" fontSize="8" textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  );
}

function HourlyBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group">
          <div
            className="w-full rounded-sm bg-amber-500/40 group-hover:bg-amber-500/70 transition-all"
            style={{ height: `${Math.max((v / max) * 56, v > 0 ? 3 : 1)}px` }}
            title={`${i}:00 - ${v} زيارة`}
          />
          {(i % 6 === 0) && (
            <span className="text-[7px] text-neutral-600">{i}h</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'total'>('month');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const periodLabels = { today: 'اليوم', week: 'الأسبوع', month: 'الشهر', total: 'الإجمالي' };
  const periodValue = data?.stats[period] ?? 0;

  const deviceTotal = data ? (data.devices.mobile + data.devices.tablet + data.devices.desktop) || 1 : 1;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-black flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            إحصائيات الزوار
          </h1>
          <p className="text-neutral-500 text-sm mt-1">تتبع حركة الزوار والأداء التفصيلي للموقع</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-neutral-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Period Selector */}
          <div className="flex items-center gap-2 mb-6 bg-neutral-900 border border-white/5 rounded-xl p-1 w-fit">
            {(['today', 'week', 'month', 'total'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  period === p ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'اليوم', value: data?.stats.today ?? 0, icon: Calendar, color: 'text-amber-400', border: 'border-amber-500/20' },
              { label: 'هذا الأسبوع', value: data?.stats.week ?? 0, icon: TrendingUp, color: 'text-blue-400', border: 'border-blue-500/20' },
              { label: 'هذا الشهر', value: data?.stats.month ?? 0, icon: Eye, color: 'text-emerald-400', border: 'border-emerald-500/20' },
              { label: 'إجمالي الزيارات', value: data?.stats.total ?? 0, icon: Users, color: 'text-purple-400', border: 'border-purple-500/20' },
              { label: 'جلسات فريدة', value: data?.stats.uniqueSessions ?? 0, icon: Globe, color: 'text-rose-400', border: 'border-rose-500/20' },
            ].map((card, i) => (
              <div key={i} className={`bg-neutral-900 border ${card.border} rounded-2xl p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-neutral-500 text-xs font-bold">{card.label}</span>
                </div>
                <p className={`text-2xl font-black ${card.color}`}>{card.value.toLocaleString('ar-SA')}</p>
              </div>
            ))}
          </div>

          {/* Line Chart */}
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-sm">منحنى الزيارات اليومية</h3>
                <p className="text-neutral-500 text-xs">آخر 30 يوم</p>
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>{data?.stats.month ?? 0} زيارة / شهر</span>
              </div>
            </div>
            {data?.dailyTrend && <LineChart data={data.dailyTrend} />}
          </div>

          {/* Hourly + Devices + Browsers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Hourly */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-3">توزيع الزيارات بالساعة (اليوم)</h3>
              {data?.hourlyMap && <HourlyBarChart data={data.hourlyMap} />}
              <p className="text-neutral-600 text-[10px] mt-2 text-center">
                ذروة الزيارات: {data?.hourlyMap ? `${data.hourlyMap.indexOf(Math.max(...data.hourlyMap))}:00` : '-'}
              </p>
            </div>

            {/* Devices */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">توزيع الأجهزة</h3>
              <div className="space-y-3">
                {[
                  { label: 'جوال', icon: Smartphone, value: data?.devices.mobile ?? 0, color: '#f59e0b' },
                  { label: 'تابلت', icon: Tablet, value: data?.devices.tablet ?? 0, color: '#3b82f6' },
                  { label: 'سطح المكتب', icon: Monitor, value: data?.devices.desktop ?? 0, color: '#10b981' },
                ].map((item, i) => {
                  const pct = Math.round((item.value / deviceTotal) * 100);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-neutral-300 text-xs">{item.label}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-neutral-600 text-xs">{pct}%</span>
                          <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">المتصفحات</h3>
              <div className="space-y-3">
                {data?.browsers?.map(([browser, count], i) => {
                  const pct = data?.stats.month ? Math.round((count / data.stats.month) * 100) : 0;
                  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#06b6d4'];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-300 text-xs">{browser}</span>
                        <div className="flex gap-2">
                          <span className="text-neutral-600 text-xs">{pct}%</span>
                          <span className="text-xs font-bold" style={{ color: colors[i % colors.length] }}>{count}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                      </div>
                    </div>
                  );
                })}
                {(!data?.browsers || data.browsers.length === 0) && (
                  <p className="text-neutral-600 text-xs text-center py-4">لا توجد بيانات</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Pages & Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Pages */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">الصفحات الأكثر زيارةً</h3>
              <div className="space-y-3">
                {data?.topPages?.slice(0, 8).map(([page, count], i) => {
                  const max = data?.topPages?.[0]?.[1] || 1;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-neutral-600 text-xs w-5 text-center font-bold">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-neutral-300 text-xs font-medium truncate">
                            {PAGE_LABELS[page] || page}
                          </span>
                          <span className="text-amber-400 text-xs font-bold shrink-0 mr-2">{count}</span>
                        </div>
                        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(!data?.topPages || data.topPages.length === 0) && (
                  <p className="text-neutral-600 text-xs text-center py-4">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>

            {/* Sources */}
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">مصادر الزيارات التفصيلية</h3>
              <div className="space-y-3">
                {data?.sources?.slice(0, 8).map(([source, count], i) => {
                  const max = data?.sources?.[0]?.[1] || 1;
                  const pct = Math.round((count / max) * 100);
                  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4', '#84cc16', '#fb923c'];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Globe className="w-3 h-3 text-neutral-600 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-neutral-300 text-xs font-medium">{source}</span>
                          <span className="text-xs font-bold" style={{ color: colors[i % colors.length] }}>{count}</span>
                        </div>
                        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {(!data?.sources || data.sources.length === 0) && (
                  <p className="text-neutral-600 text-xs text-center py-4">لا توجد بيانات بعد</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Visits Table */}
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4">سجل الزيارات الأخيرة</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    {['الصفحة', 'الجهاز', 'المتصفح', 'المصدر', 'الوقت'].map(h => (
                      <th key={h} className="text-neutral-500 text-xs font-bold py-3 px-3 text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.recentVisits?.slice(0, 20).map((visit, i) => {
                    const DeviceIcon = visit.device === 'mobile' ? Smartphone : visit.device === 'tablet' ? Tablet : Monitor;
                    return (
                      <tr key={i} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="text-neutral-300 text-xs">{PAGE_LABELS[visit.page] || visit.page}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <DeviceIcon className="w-3 h-3 text-neutral-500" />
                            <span className="text-neutral-400 text-xs">{visit.device === 'mobile' ? 'جوال' : visit.device === 'tablet' ? 'تابلت' : 'سطح مكتب'}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-neutral-400 text-xs">{visit.browser}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-neutral-400 text-xs">{visit.referrer}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1 text-neutral-600 text-xs">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {new Date(visit.timestamp).toLocaleString('ar-SA', {
                                month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(!data?.recentVisits || data.recentVisits.length === 0) && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-neutral-600 text-sm">
                        لا توجد زيارات مسجلة بعد. ستظهر الزيارات فور فتح الموقع.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
