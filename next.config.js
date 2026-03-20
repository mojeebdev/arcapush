/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source:      "/startup/:slug",
        destination: "/registry",
        permanent:   false,
      },
    ];
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  transpilePackages: [
    "@solana/wallet-adapter-base",
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-react-ui",
    "@solana/wallet-adapter-wallets",
    "@solana/web3.js",
  ],

  serverExternalPackages: ["@prisma/client", "pg"],

  outputFileTracingIncludes: {
    "/blog/[slug]": ["./content/blog/**/*"],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["arcapush.com", "www.arcapush.com"],
    },
  },
};

module.exports = nextConfig;