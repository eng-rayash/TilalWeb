import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // الصور محلية الآن - لا نحتاج remotePatterns للصور الرئيسية
  // لكن نبقي على بعض المصادر كاحتياط
  images: {
    remotePatterns: [],
    // تمكين تحسين الصور المحلية
    formats: ['image/webp', 'image/avif'],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
