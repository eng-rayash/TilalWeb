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

async function writeAnalytics(data: AnalyticsData): Promise<void> {
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function parseDevice(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
  return 'desktop';
}

function parseBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return 'Edge';
  if (/opr\//i.test(userAgent)) return 'Opera';
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/msie|trident/i.test(userAgent)) return 'Internet Explorer';
  return 'أخرى';
}

function parseReferrer(refHeader: string): string {
  if (!refHeader) return 'مباشر';
  try {
    const url = new URL(refHeader);
    const host = url.hostname.replace('www.', '');
    if (host.includes('google')) return 'Google';
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook';
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X';
    if (host.includes('snapchat')) return 'Snapchat';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('bing')) return 'Bing';
    return host;
  } catch {
    return 'مباشر';
  }
}

export async function POST(request: Request) {
  try {
    // Don't track admin pages
    const body = await request.json().catch(() => ({}));
    const page: string = body.page || '/';
    
    if (page.startsWith('/admin')) {
      return NextResponse.json({ success: true });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const refHeader = request.headers.get('referer') || '';
    const sessionId = body.sessionId || 'unknown';

    const visit: Visit = {
      timestamp: new Date().toISOString(),
      page,
      device: parseDevice(userAgent),
      browser: parseBrowser(userAgent),
      referrer: parseReferrer(refHeader),
      sessionId,
    };

    const data = await readAnalytics();

    // Trim to last 15,000 visits
    if (data.visits.length >= 15000) {
      data.visits = data.visits.slice(-14999);
    }

    data.visits.push(visit);
    await writeAnalytics(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Track error:', err);
    return NextResponse.json({ success: false });
  }
}
