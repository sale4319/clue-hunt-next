import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/level/start",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
