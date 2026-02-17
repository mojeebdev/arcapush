export const AdminConfig = {
  // ── Pin Packages & Pricing ────────────────────────
  
  PIN_PACKAGES: [
    { label: "30 Mins", value: "30m", price: "25.00", minutes: 30 },
    { label: "1 Day", value: "1d", price: "150.00", minutes: 1440 },    // ~87% Disc.
    { label: "3 Days", value: "3d", price: "350.00", minutes: 4320 },   // ~90% Disc.
    { label: "1 Week", value: "1w", price: "600.00", minutes: 10080 },  // ~92% Disc.
    { label: "2 Weeks", value: "2w", price: "1000.00", minutes: 20160 }, // ~94% Disc.
    { label: "1 Month", value: "1m", price: "1800.00", minutes: 43200 }, // ~95% Disc.
  ],

  PIN_PRICE_BASE_USDC: "25.00", 
  PIN_PRICE_SOL: "0.6",           
  
  // ── Pin Duration (Legacy Reference) ───────────────
  PIN_DURATION_MINUTES: 30,
  
  // ── Rotation Intervals ───────────────────────────
  HERO_ROTATION_MS: 30 * 60 * 1000,   
  TICKER_ROTATION_MS: 30 * 1000,       
  
  PAYMENT_WALLET_BASE: process.env.NEXT_PUBLIC_PAYMENT_WALLET_BASE, 
  PAYMENT_WALLET_SOL: process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOL,
  
  // ── USDC Contract (Base Mainnet) ─────────────────
  USDC_CONTRACT_BASE: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
  
  // ── Categories ───────────
  CATEGORIES: [
    "SaaS",
    "FinTech",
    "AI / ML",
    "E-commerce",
    "HealthTech",
    "EdTech",
    "DeFi",
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