import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ANALYTICS_FILE = path.join(process.cwd(), 'lib', 'data', 'analytics.json');

interface Visit {
  timestamp: string;
  page: string;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  referrer: string;
  sessionId: string;
}

interface AnalyticsData {
  visits: Visit[];
}

async function readAnalytics(): Promise<AnalyticsData> {
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { visits: [] };
  }
}

function getDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function GET() {
  try {
    const data = await readAnalytics();
    const visits = data.visits;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayVisits = visits.filter(v => new Date(v.timestamp) >= todayStart);
    const weekVisits = visits.filter(v => new Date(v.timestamp) >= weekStart);
    const monthVisits = visits.filter(v => new Date(v.timestamp) >= monthStart);

    // Unique sessions this month
    const uniqueSessions = new Set(monthVisits.map(v => v.sessionId)).size;

    // Device distribution
    const deviceMap: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
    monthVisits.forEach(v => { deviceMap[v.device] = (deviceMap[v.device] || 0) + 1; });

    // Browser distribution
    const browserMap: Record<string, number> = {};
    monthVisits.forEach(v => { browserMap[v.browser] = (browserMap[v.browser] || 0) + 1; });
    const browsers = Object.entries(browserMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

    // Top pages
    const pageMap: Record<string, number> = {};
    monthVisits.forEach(v => { pageMap[v.page] = (pageMap[v.page] || 0) + 1; });
    const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Traffic sources
    const sourceMap: Record<string, number> = {};
    monthVisits.forEach(v => { sourceMap[v.referrer] = (sourceMap[v.referrer] || 0) + 1; });
    const sources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

    // Daily trend – last 30 days
    const dailyTrend: { date: string; count: number; label: string }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = getDateStr(d);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const count = visits.filter(v => {
        const t = new Date(v.timestamp);
        return t >= dayStart && t < dayEnd;
      }).length;
      dailyTrend.push({
        date: dateStr,
        count,
        label: `${d.getDate()}/${d.getMonth() + 1}`,
      });
    }

    // Hourly distribution today
    const hourlyMap: number[] = Array(24).fill(0);
    todayVisits.forEach(v => {
      const hour = new Date(v.timestamp).getHours();
      hourlyMap[hour]++;
    });

    // Recent visits (last 50)
    const recentVisits = visits.slice(-50).reverse().map(v => ({
      timestamp: v.timestamp,
      page: v.page,
      device: v.device,
      browser: v.browser,
      referrer: v.referrer,
    }));

    return NextResponse.json({
      stats: {
        today: todayVisits.length,
        week: weekVisits.length,
        month: monthVisits.length,
        total: visits.length,
        uniqueSessions,
      },
      devices: deviceMap,
      browsers,
      topPages,
      sources,
      dailyTrend,
      hourlyMap,
      recentVisits,
    });
  } catch (err) {
    console.error('Analytics GET error:', err);
    return NextResponse.json({ error: 'فشل تحميل البيانات' }, { status: 500 });
  }
}
