
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  if (!value) {
    console.warn(`⚠️ GUARDIAN WARNING: ${key} is missing from environment.`);
    return "";
  }
  return value;
};

export interface PinPackage {
  label: string;
  value: string;
  price: number;
  minutes: number;
  featured?: boolean; 
  description?: string; 
}

export const AdminConfig = {
  VIBE_STREAM_VERSION: "23.1.80",
  LAST_PROTOCOL_UPDATE: "2026-02-20",

  PIN_PACKAGES: [
    { label: "30 Mins", value: "30m", price: 25.00, minutes: 30, description: "Quick snack" },
    { label: "1 Day", value: "1d", price: 150.00, minutes: 1440, featured: true, description: "Full meal" }, 
    { label: "3 Days", value: "3d", price: 350.00, minutes: 4320, description: "Weekend feast" }, 
    { label: "1 Week", value: "1w", price: 600.00, minutes: 10080, description: "The harvest" },
    { label: "2 Weeks", value: "2w", price: 1000.00, minutes: 20160, description: "Grand banquet" },
    { label: "1 Month", value: "1m", price: 1800.00, minutes: 43200, description: "Unlimited pantry" },
  ] as PinPackage[],

  
  PIN_PRICE_BASE_USDC: "25.00", 
  PIN_PRICE_SOL: "0.31", 
  
  HERO_ROTATION_MS: 30 * 60 * 1000,   
  TICKER_ROTATION_MS: 30 * 1000,      
  
  PAYMENT_WALLET_BASE: getEnv("PAYMENT_WALLET_BASE"), 
  PAYMENT_WALLET_SOLANA: getEnv("PAYMENT_WALLET_SOLANA"), 
  
  
  USDC_CONTRACT_BASE: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
  
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