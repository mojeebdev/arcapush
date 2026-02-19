export const AdminConfig = {
  // ⚙️ WHATE ENGINE VERSIONING [cite: 2026-02-03]
  VIBE_STREAM_VERSION: "18.25.0", // 👈 Upgraded for Dual-Auto Ascension
  LAST_PROTOCOL_UPDATE: "2026-02-19",

  // 📦 PIN PACKAGES (The "Food Items")
  PIN_PACKAGES: [
    { label: "30 Mins", value: "30m", price: 25.00, minutes: 30 },
    { label: "1 Day", value: "1d", price: 150.00, minutes: 1440 }, 
    { label: "3 Days", value: "3d", price: 350.00, minutes: 4320 }, 
    { label: "1 Week", value: "1w", price: 600.00, minutes: 10080 },
    { label: "2 Weeks", value: "2w", price: 1000.00, minutes: 20160 },
    { label: "1 Month", value: "1m", price: 1800.00, minutes: 43200 },
  ],

  
  PIN_PRICE_BASE_USDC: "25.00", 
  PIN_PRICE_SOL: "0.31",           
  
  
  HERO_ROTATION_MS: 30 * 60 * 1000,   
  TICKER_ROTATION_MS: 30 * 1000,      
  
  
  PAYMENT_WALLET_BASE: process.env.NEXT_PUBLIC_PAYMENT_WALLET_BASE as string, 
  PAYMENT_WALLET_SOLANA: process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOLANA as string, 
  USDC_CONTRACT_BASE: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  
  
  CATEGORIES: [
    "SaaS", "FinTech", "AI / ML", "E-commerce", "HealthTech", 
    "EdTech", "DeFi", "Infrastructure", "Gaming / GameFi", 
    "Social", "DAO Tooling", "AI x Crypto", "RWA", "Privacy", 
    "Developer Tools", "Other",
  ],
  
  
  SITE_NAME: "VibeStream",
  SITE_TAGLINE: "Where the next unicorn gets discovered.",
  SITE_DESCRIPTION: "A crypto-powered startup discovery hub. Premium access. Curated founders. On-chain verification.",
} as const;