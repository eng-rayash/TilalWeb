'use client';

import { useState } from 'react';

interface CloudImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  fallback?: string;
}

const IK_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL || 'https://ik.imagekit.io/tilal';

function ikTransform(src: string, w?: number, h?: number, q = 75): string {
  if (!src || !src.includes(IK_URL)) return src;
  const params = [];
  if (w) params.push(`w-${w}`);
  if (h) params.push(`h-${h}`);
  params.push(`q-${q}`, `f-auto`);
  const tr = params.join(',');
  return src.includes('?') ? `${src}&tr=${tr}` : `${src}?tr=${tr}`;
}

export default function CloudImage({
  src, alt, width, height, quality = 75,
  className = '', priority = false,
  fallback = 'https://ik.imagekit.io/tilal/tilal-web/hero/hero-construction.jpg',
}: CloudImageProps) {
  const [error, setError] = useState(false);
  const imgSrc = error ? fallback : ikTransform(src, width, height, quality);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      onError={() => setError(true)}
    />
  );
}
