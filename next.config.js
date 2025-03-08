/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, ".");
    config.externals = [...(config.externals || []), "canvas"];
    return config;
  },
  reactStrictMode: true,
  experimental: {
    esmExternals: false,
    serverActions: false,
    appDir: true, // App Router 사용 시 반드시 true
    serverComponentsExternalPackages: ["canvas"],
  },
};

module.exports = nextConfig;
