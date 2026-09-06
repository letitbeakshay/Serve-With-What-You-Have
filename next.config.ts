import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./app/home-content.html"],
  },
};

export default nextConfig;
