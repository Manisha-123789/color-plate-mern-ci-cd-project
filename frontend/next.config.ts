import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode : false,
  experimental : {
    staleTimes : {
      dynamic : 30,
      static : 30
    }
  },

  typescript: {
    // Skip type checking during builds
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
