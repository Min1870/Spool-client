import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // A stray lockfile at D:\ otherwise makes Next infer the wrong workspace root.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
