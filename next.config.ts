import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./app/home-content.html"],
  },
  experimental: {
    serverActions: {
      // Story banner uploads go through a server action as multipart form data.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
