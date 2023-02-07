/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ink-preview.s3-website.us-east-2.amazonaws.com',
        port: '',
        pathname: '/previews/**',
      },
      {
        protocol: 'https',
        hostname: 'd331ancnbhe3hg.cloudfront.net',
        port: '',
        pathname: '/previews/**',
      },
    ],
  },
  env: {
    ALCHEMY_ID: process.env.ALCHEMY_ID,
  },
}

module.exports = nextConfig
