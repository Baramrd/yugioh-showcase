import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ygoprodeck.com',
        port: '',
        pathname: '/images/cards/**', // <- updated
      },
      {
        protocol: 'https',
        hostname: 'images.ygoprodeck.com',
        port: '',
        pathname: '/images/cards_small/**', // <- keep this if you use small images too
      },
    ],
  },
};

export default nextConfig;
