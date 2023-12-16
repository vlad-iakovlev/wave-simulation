// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    },
  },
  reactStrictMode: true,
  output: 'export',
}

export default nextConfig
