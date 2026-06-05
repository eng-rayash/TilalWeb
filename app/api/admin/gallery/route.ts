import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'lib', 'data', 'gallery_data.json');

async function readData() {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}
async function writeData(data: unknown) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(Array.isArray(data) ? data : []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData();
  const items = Array.isArray(data) ? data : [];
  const newItem = {
    id: body.id || `gallery-${Date.now()}`,
    src: body.src || '',
    alt: body.alt || '',
    category: body.category || 'الكل',
    title: body.title || '',
  };
  items.push(newItem);
  await writeData(items);
  return NextResponse.json({ success: true, item: newItem });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readData();
  const items = Array.isArray(data) ? data : [];
  const updatedItems = items.map((item: { id: string | number }) =>
    String(item.id) === String(body.id) ? { ...item, ...body } : item
  );
  await writeData(updatedItems);
  return NextResponse.json({ success: true });
}


export async function DELETE(request: Request) {
  const { id } = await request.json();
  const data = await readData();
  const items = Array.isArray(data) ? data : [];
  const filtered = items.filter((item: { id: string }) => item.id !== id);
  await writeData(filtered);
  return NextResponse.json({ success: true });
}
