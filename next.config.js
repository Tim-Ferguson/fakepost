/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  },
  images: {
    domains: ['pbs.twimg.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      },
    ],
    unoptimized: true // This helps with html2canvas
  }
}

module.exports = nextConfig 