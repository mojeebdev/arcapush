/**
 * VibeStream Admin Configuration
 * ────────────────────────────────
 * Adjust pricing, durations, and wallet addresses here.
 * This is the single source of truth for all configurable values.
 */

export const AdminConfig = {
  // ── Pin Pricing ──────────────────────────────────
  PIN_PRICE_BASE_USDC: "25.00",    // 25 USDC on Base
  PIN_PRICE_SOL: "0.5",            // 0.5 SOL on Solana
  
  // ── Pin Duration ─────────────────────────────────
  PIN_DURATION_MINUTES: 30,
  
  // ── Rotation Intervals ───────────────────────────
  HERO_ROTATION_MS: 30 * 60 * 1000,   // 30 minutes
  TICKER_ROTATION_MS: 30 * 1000,       // 30 seconds
  
  // ── Payment Wallets ──────────────────────────────
  PAYMENT_WALLET_BASE: process.env.NEXT_PUBLIC_PAYMENT_WALLET_BASE || "0x0000000000000000000000000000000000000000",
  PAYMENT_WALLET_SOL: process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOL || "11111111111111111111111111111111",
  
  // ── USDC Contract (Base Mainnet) ─────────────────
  USDC_CONTRACT_BASE: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  
  // ── Categories ───────────────────────────────────
  CATEGORIES: [
    "DeFi",
    "NFT / Digital Art",
    "Infrastructure",
    "Gaming / GameFi",
    "Social",
    "DAO Tooling",
    "AI x Crypto",
    "RWA",
    "Privacy",
    "Developer Tools",
    "Other",
  ],
  
  // ── Branding ─────────────────────────────────────
  SITE_NAME: "VibeStream",
  SITE_TAGLINE: "Where the next unicorn gets discovered.",
  SITE_DESCRIPTION: "A crypto-powered startup discovery hub. Premium access. Curated founders. On-chain verification.",
} as const;