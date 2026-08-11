import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rein statischer Export: kein Server, keine laufenden Kosten.
  // Deploybar auf Firebase Hosting (Spark, 0 €) oder Cloud Run via nginx.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
