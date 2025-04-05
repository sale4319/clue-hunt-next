import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/clue-hunt-next",
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
