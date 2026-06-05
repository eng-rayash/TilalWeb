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
  return NextResponse.json(data.services ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData();
  const newService = {
    ...body,
    slug: body.slug || body.title?.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now(),
    images: body.images || [],
    content: body.content || [],
  };
  data.services = [...(data.services ?? []), newService];
  await writeData(data);
  return NextResponse.json({ success: true, service: newService });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readData();
  data.services = (data.services ?? []).map((s: { slug: string }) =>
    s.slug === body.slug ? { ...s, ...body } : s
  );
  await writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { slug } = await request.json();
  const data = await readData();
  data.services = (data.services ?? []).filter((s: { slug: string }) => s.slug !== slug);
  await writeData(data);
  return NextResponse.json({ success: true });
}
