/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:* http://127.0.0.1:* http://192.168.*:* *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
