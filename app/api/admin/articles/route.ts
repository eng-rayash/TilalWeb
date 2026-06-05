import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'clean_data.json');

async function readData() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}
async function writeData(data: unknown) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data.articles ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData();
  const newArticle = {
    ...body,
    slug: body.slug || `article-${Date.now()}`,
    date: body.date || new Date().toISOString().split('T')[0],
    images: body.images || [],
    content: body.content || [],
  };
  data.articles = [...(data.articles ?? []), newArticle];
  await writeData(data);
  return NextResponse.json({ success: true, article: newArticle });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readData();
  data.articles = (data.articles ?? []).map((a: { slug: string }) =>
    a.slug === body.slug ? { ...a, ...body } : a
  );
  await writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { slug } = await request.json();
  const data = await readData();
  data.articles = (data.articles ?? []).filter((a: { slug: string }) => a.slug !== slug);
  await writeData(data);
  return NextResponse.json({ success: true });
}
