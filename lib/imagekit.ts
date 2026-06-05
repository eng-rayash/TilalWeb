import ImageKit from '@imagekit/nodejs';

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.warn('تحذير: مفتاح IMAGEKIT_PRIVATE_KEY غير متوفر في البيئة المحيطة (.env.local)');
}

export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
});
