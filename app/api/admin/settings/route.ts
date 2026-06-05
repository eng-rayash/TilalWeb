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
  try {
    const data = await readData();
    return NextResponse.json(data.settings);
  } catch {
    return NextResponse.json({ error: 'فشل القراءة' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    const data = await readData();
    data.settings = { ...data.settings, ...settings };
    await writeData(data);
    return NextResponse.json({ success: true, settings: data.settings });
  } catch {
    return NextResponse.json({ error: 'فشل الحفظ' }, { status: 500 });
  }
}
