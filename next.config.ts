import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@surrealdb/node"],
};

export default nextConfig;