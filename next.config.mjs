/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://image.tmdb.org https://images.unsplash.com https://i.ytimg.com; font-src 'self'; media-src 'self' https://youtube.com https://www.youtube.com; frame-src 'self' https://youtube.com https://www.youtube.com; connect-src 'self' https://api.themoviedb.org;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
