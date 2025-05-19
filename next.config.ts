import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images:{

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bubet-bucket.s3.sa-east-1.amazonaws.com',
        port: '',
        pathname: '**',
      },
    ],
  }
};

export default nextConfig;
