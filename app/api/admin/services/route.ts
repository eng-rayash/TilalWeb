import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CLEAN_DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'clean_data.json');
const ARTICLES_FILE = path.join(process.cwd(), 'lib', 'data', 'services_articles.json');

const CATEGORY_BY_KEY: Record<string, string> = {
  'مقاولات عامة': 'مقاولات عامة وبناء',
  'هناجر ومستودعات': 'هناجر ومستودعات',
  'مظلات': 'مظلات',
  'سواتر': 'سواتر',
  'برجولات وجلسات': 'برجولات وجلسات',
  'واجهات كلادنج': 'واجهات كلادنج',
  'بيوت شعر': 'بيوت شعر',
  'شبوك': 'شبوك',
  'قرميد وديكور': 'قرميد وديكور',
  'أعمال متنوعة': 'أعمال متنوعة',
};

const KEY_BY_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_BY_KEY).map(([key, category]) => [category, key])
) as Record<string, string>;

type ServiceArticle = {
  slug: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  images?: string[];
  intro?: string;
  features?: { icon: string; title: string; desc: string }[];
  whyUs?: string;
  tips?: string[];
  stats?: { value: string; label: string }[];
  content?: { type: string; text: string }[];
  faq?: { q: string; a: string }[];
};

async function readJson(file: string) {
  const raw = await fs.readFile(file, 'utf-8');
  return JSON.parse(raw);
}

async function writeJson(file: string, data: unknown) {
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function toCleanService(key: string, article: ServiceArticle) {
  const category = CATEGORY_BY_KEY[key] || key;
  return {
    url: `https://tilall.com/services/${encodeURIComponent(article.slug)}`,
    title: article.title,
    description: article.intro || article.subtitle || article.title,
    content: article.content || [],
    images: (article.images || []).map((src, index) => ({
      src,
      alt: `${article.title} - صورة رقم ${index + 1}`,
    })),
    slug: article.slug,
    category,
  };
}

function normalizeArticle(input: any, fallback?: ServiceArticle): ServiceArticle {
  return {
    slug: input.slug || fallback?.slug || input.title?.replace(/\s+/g, '-') || `service-${Date.now()}`,
    title: input.title || fallback?.title || 'خدمة جديدة',
    subtitle: input.subtitle ?? fallback?.subtitle ?? '',
    heroImage: input.heroImage ?? fallback?.heroImage ?? '',
    images: Array.isArray(input.images) ? input.images : fallback?.images ?? [],
    intro: input.intro ?? fallback?.intro ?? '',
    features: Array.isArray(input.features) ? input.features : fallback?.features ?? [],
    whyUs: input.whyUs ?? fallback?.whyUs ?? '',
    tips: Array.isArray(input.tips) ? input.tips : fallback?.tips ?? [],
    stats: Array.isArray(input.stats) ? input.stats : fallback?.stats ?? [],
    content: Array.isArray(input.content) ? input.content : fallback?.content ?? [],
    faq: Array.isArray(input.faq) ? input.faq : fallback?.faq ?? [],
  };
}

function findArticleKey(articles: Record<string, ServiceArticle>, body: any) {
  if (body.articleKey && articles[body.articleKey]) return body.articleKey;
  if (body.category && KEY_BY_CATEGORY[body.category] && articles[KEY_BY_CATEGORY[body.category]]) {
    return KEY_BY_CATEGORY[body.category];
  }

  const found = Object.entries(articles).find(([, article]) =>
    article.slug === body.slug ||
    article.slug === decodeURIComponent(body.slug || '') ||
    article.title === body.title
  );

  return found?.[0] || body.articleKey || KEY_BY_CATEGORY[body.category] || body.title;
}

async function syncCleanData(articles: Record<string, ServiceArticle>) {
  const cleanData = await readJson(CLEAN_DATA_FILE);
  cleanData.services = Object.entries(articles).map(([key, article]) => toCleanService(key, article));
  delete cleanData.articles;
  await writeJson(CLEAN_DATA_FILE, cleanData);
}

export async function GET() {
  const articles = await readJson(ARTICLES_FILE) as Record<string, ServiceArticle>;
  const services = Object.entries(articles).map(([key, article]) => ({
    articleKey: key,
    slug: article.slug,
    title: article.title,
    description: article.intro || article.subtitle || '',
    category: CATEGORY_BY_KEY[key] || key,
    url: `https://tilall.com/services/${encodeURIComponent(article.slug)}`,
    article,
  }));

  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const body = await request.json();
  const articles = await readJson(ARTICLES_FILE) as Record<string, ServiceArticle>;
  const key = body.articleKey || KEY_BY_CATEGORY[body.category] || body.title;
  const articleInput = {
    ...(body.article || {}),
    slug: body.slug || body.article?.slug,
    title: body.article?.title || body.title,
    intro: body.article?.intro ?? body.description,
  };
  const article = normalizeArticle(articleInput);

  articles[key] = article;
  await writeJson(ARTICLES_FILE, articles);
  await syncCleanData(articles);

  return NextResponse.json({ success: true, service: { articleKey: key, ...toCleanService(key, article), article } });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const articles = await readJson(ARTICLES_FILE) as Record<string, ServiceArticle>;
  const key = findArticleKey(articles, body);
  const current = articles[key];
  const articleInput = {
    ...(body.article || {}),
    slug: body.slug || body.article?.slug || current?.slug,
    title: body.article?.title || body.title || current?.title,
    intro: body.article?.intro ?? body.description ?? current?.intro,
  };

  articles[key] = normalizeArticle(articleInput, current);
  await writeJson(ARTICLES_FILE, articles);
  await syncCleanData(articles);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const articles = await readJson(ARTICLES_FILE) as Record<string, ServiceArticle>;
  const key = findArticleKey(articles, body);

  if (key && articles[key]) {
    delete articles[key];
  }

  await writeJson(ARTICLES_FILE, articles);
  await syncCleanData(articles);

  return NextResponse.json({ success: true });
}
