/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.7.79",
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
      {
        protocol: "http",
        hostname: "35.183.138.114",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "35.183.138.114",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.thecanuckmall.ca",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kappes-ecommerce-webiste.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
