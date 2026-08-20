/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "velomacflowmeter.com"
          }
        ],
        destination: "https://www.velomacflowmeter.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
