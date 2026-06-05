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
  return NextResponse.json(data.projects ?? []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readData();
  const newProject = {
    ...body,
    id: body.id || `proj-${Date.now()}`,
    images: body.images || [],
  };
  data.projects = [...(data.projects ?? []), newProject];
  await writeData(data);
  return NextResponse.json({ success: true, project: newProject });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readData();
  data.projects = (data.projects ?? []).map((p: { id: string }) =>
    p.id === body.id ? { ...p, ...body } : p
  );
  await writeData(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const data = await readData();
  data.projects = (data.projects ?? []).filter((p: { id: string }) => p.id !== id);
  await writeData(data);
  return NextResponse.json({ success: true });
}
