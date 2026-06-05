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
  return NextResponse.json(data.testimonials ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData();
  const newT = {
    id: body.id || `t-${Date.now()}`,
    name: body.name || '',
    role: body.role || '',
    feedback: body.feedback || '',
    rating: body.rating ?? 5,
  };
  data.testimonials = [...(data.testimonials ?? []), newT];
  await writeData(data);
  return NextResponse.json({ success: true, testimonial: newT });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readData();
  data.testimonials = (data.testimonials ?? []).map((t: { id: string }) =>
    t.id === body.id ? { ...t, ...body } : t
  );
  await writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const data = await readData();
  data.testimonials = (data.testimonials ?? []).filter((t: { id: string }) => t.id !== id);
  await writeData(data);
  return NextResponse.json({ success: true });
}
