import { NextResponse } from 'next/server';
import { imagekit, toFile } from '@/lib/imagekit';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال أي ملف' }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'الحد الأقصى لحجم الصورة 8 ميجابايت' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadable = await toFile(buffer, file.name, { type: file.type });

    const response = await imagekit.files.upload({
      file: uploadable,
      fileName: file.name || `upload-${Date.now()}`,
      folder: '/tilal-web',
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      thumbnail: response.thumbnailUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'فشل رفع الملف' },
      { status: 500 }
    );
  }
}
