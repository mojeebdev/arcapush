const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  if (!value) {
    console.warn(`⚠️ GUARDIAN WARNING: ${key} is missing from environment. Terminal may be offline.`);
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

  VIBE_STREAM_VERSION: "23.2.29",
  LAST_PROTOCOL_UPDATE: "2026-03-07",

 
  SITE_NAME: "VibeStream",
  SITE_URL: "https://vibestream.cc",
  SITE_TAGLINE: "Where the next unicorn gets discovered.",
  SITE_DESCRIPTION: "The definitive encyclopedia for VC-backed Vibe Coders and AI-native startup products. Discover who got funded, what they built, and how. Building is hard. Marketing too. You don't have to do both.",
  SITE_OG_IMAGE: "/og-vibestream.png",

  
  BRAND_TWITTER: "@vibestreamcc",
  FOUNDER_TWITTER: "@mojeebeth",
  FOUNDER_URL: "https://mojeeb.xyz",

  
  PIN_PACKAGES: [
    { label: "30 Mins", value: "30m", price: 5.00,   minutes: 30,    description: "Quick snack" },
    { label: "1 Day",   value: "1d",  price: 25.00,  minutes: 1440,  featured: true, description: "Full meal" },
    { label: "3 Days",  value: "3d",  price: 60.00,  minutes: 4320,  description: "Weekend feast" },
    { label: "1 Week",  value: "1w",  price: 100.00, minutes: 10080, description: "The harvest" },
    { label: "2 Weeks", value: "2w",  price: 175.00, minutes: 20160, description: "Grand banquet" },
    { label: "1 Month", value: "1m",  price: 299.00, minutes: 43200, description: "Unlimited pantry" },
  ] as PinPackage[],

  PIN_PRICE_BASE_USDC: "5.00",   
  PIN_PRICE_SOL: "0.04",         

  
  HERO_ROTATION_MS:   30 * 1000,
  TICKER_ROTATION_MS: 10 * 1000,

  
  PAYMENT_WALLET_BASE:   getEnv("PAYMENT_WALLET_BASE"),
  PAYMENT_WALLET_SOLANA: getEnv("PAYMENT_WALLET_SOLANA"),
  USDC_CONTRACT_BASE: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,

  
  CATEGORIES: [
    "SaaS", "FinTech", "AI / ML", "Productivity", "Lifestyle",
    "DeAI (Decentralized AI)", "E-commerce", "HealthTech",
    "Bio-Tech & Longevity", "EdTech", "DeFi", "Infrastructure",
    "Gaming / GameFi", "Social", "DAO Tooling", "AI x Crypto",
    "RWA", "Privacy", "Developer Tools", "Other"
  ],

} as const;