import { NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال أي ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');

    // الرفع إلى ImageKit باستخدام files.upload
    const response = await imagekit.files.upload({
      file: base64File,
      fileName: file.name || `upload-${Date.now()}`,
      folder: '/tilal-web',
    });

    return NextResponse.json({
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    });
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json(
      { error: error.message || 'فشل رفع الملف إلى ImageKit' },
      { status: 500 }
    );
  }
}
