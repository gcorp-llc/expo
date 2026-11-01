/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cardiani/shared', '@cardiani/i18n'],
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
