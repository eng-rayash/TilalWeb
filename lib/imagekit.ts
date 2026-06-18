import ImageKit, { toFile } from '@imagekit/nodejs';

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.warn('IMAGEKIT_PRIVATE_KEY is not set');
}

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export { toFile };
