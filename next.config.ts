import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "tesseract.js",
    "@napi-rs/canvas",
    "@napi-rs/canvas-win32-x64-msvc",
  ],
};

export default nextConfig;