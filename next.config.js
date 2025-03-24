const path = require("path"); // ✅ path 모듈 추가

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ✅ 독립형 빌드로 설정

  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, ".");
    config.externals = [...(config.externals || []), "canvas"];
    return config;
  },
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
    // serverActions: false,
    // appDir: true, // App Router 사용 시 반드시 true
    serverComponentsExternalPackages: ["canvas"],
  },
  // loading 컴포넌트 관련 설정 추가
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

module.exports = nextConfig;
