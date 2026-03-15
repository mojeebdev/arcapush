/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  transpilePackages: [
    "@solana/wallet-adapter-base",
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-react-ui",
    "@solana/wallet-adapter-wallets",
    "@solana/web3.js",
  ],

  serverExternalPackages: ['@prisma/client', 'pg'],

  experimental: {
    outputFileTracingIncludes: {
      "/blog/[slug]": ["./content/blog/**/*"],
    },
    serverActions: {
      allowedOrigins: ["arcapush.com", "www.arcapush.com"],
    },
  },
};

module.exports = nextConfig;