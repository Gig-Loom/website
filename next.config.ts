import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['127.0.0.1'], // Add this line to allow images from localhost
  },
};

assetPrefix: 'https://gig-loom.github.io/website/';

export default nextConfig;
