import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', 
    '*.local-origin.dev',
    'http://192.168.0.136:3000','http://0.0.0.0:3000'],
};

export default nextConfig;
