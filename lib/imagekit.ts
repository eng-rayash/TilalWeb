import ImageKit, { toFile } from '@imagekit/nodejs';

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.warn('IMAGEKIT_PRIVATE_KEY is not set');
}

export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
});

export { toFile };
