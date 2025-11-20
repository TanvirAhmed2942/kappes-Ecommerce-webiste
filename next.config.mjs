/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.103",
        port: "7001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "10.10.7.103",
        port: "7001",
        pathname: "/**",
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
