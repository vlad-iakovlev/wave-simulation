// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    extensionAlias: {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
  reactStrictMode: true,
  output: 'export',
}

export default nextConfig
