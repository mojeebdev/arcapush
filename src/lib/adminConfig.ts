const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  if (!value) {
    console.warn(`⚠️ ARCAPUSH WARNING: ${key} is missing from environment. Terminal may be offline.`);
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


  ARCAPUSH_VERSION: "1.0.0",
  LAST_PROTOCOL_UPDATE: "2026-03-13",


  SITE_NAME: "Arcapush",
  SITE_URL: "https://arcapush.com",
  SITE_TAGLINE: "Where vibe-coded products get discovered.",
  SITE_DESCRIPTION: "Arcapush is the home of vibe-coded products. Solo founders list once. Google indexes it. VCs discover it. Every listing requires a problem statement — not just marketing copy.",
  SITE_OG_IMAGE: "/og-arcapush.png",

 
  BRAND_TWITTER: "@arcapush",
  FOUNDER_TWITTER: "@mojeebeth",
  FOUNDER_URL: "https://mojeeb.xyz",

  PIN_PACKAGES: [
    {
      label: "30 Minutes",
      value: "30m",
      price: 5.00,
      minutes: 30,
      description: "Instant push — 30 mins at the top",
    },
    {
      label: "1 Day",
      value: "1d",
      price: 25.00,
      minutes: 1440,
      featured: true,
      description: "24-hour featured placement + VC visibility",
    },
    {
      label: "3 Days",
      value: "3d",
      price: 60.00,
      minutes: 4320,
      description: "Weekend domination — 3 days pinned",
    },
    {
      label: "1 Week",
      value: "1w",
      price: 100.00,
      minutes: 10080,
      description: "Full week push — maximum signal",
    },
    {
      label: "2 Weeks",
      value: "2w",
      price: 175.00,
      minutes: 20160,
      description: "Sustained exposure — 14 days",
    },
    {
      label: "1 Month",
      value: "1m",
      price: 299.00,
      minutes: 43200,
      description: "30-day total domination — VC magnet",
    },
  ] as PinPackage[],

  PIN_PRICE_BASE_USDC: "5.00",
  PIN_PRICE_SOL: "0.04",

  LISTING_TIERS: [
    { name: "Free",     price: 0,  description: "Permanent indexed listing. Google finds you." },
    { name: "Featured", price: 29, description: "Homepage placement + VC discovery panel." },
    { name: "Pro",      price: 99, description: "Unlimited listings + investor intros." },
  ],

  
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