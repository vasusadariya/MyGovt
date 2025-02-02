import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    LANGFLOW_APPLICATION_TOKEN: process.env.LANGFLOW_APPLICATION_TOKEN,
  },
};

export default nextConfig;
