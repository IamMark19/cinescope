/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.tvmaze.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "static.tvmaze.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
