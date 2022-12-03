/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_BASE_PATH || ''

const nextConfig = {
  assetPrefix: `${basePath}/`,
  basePath,
  reactStrictMode: true,
}

module.exports = nextConfig
