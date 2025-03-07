/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), "canvas"];
    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
