/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.103",
      },
      {
        protocol: "http",
        hostname: "10.10.7.103",
      },
      {
        protocol: "https",
        hostname: "asif7001.binarybards.online",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
