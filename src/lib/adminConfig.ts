const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || defaultValue;
  if (!value) {
    console.warn(`⚠️ ARCAPUSH WARNING: ${key} is missing from environment.`);
    return "";
  }
  return value;
};

export interface PinPackage {
  label:        string;
  value:        string;
  price:        number;
  billingType:  "one_time" | "yearly";
  featured?:    boolean;
  description?: string;
  perks:        string[];
}

const PIN_PACKAGES: PinPackage[] = [
  {
    label:       "Free",
    value:       "FREE",
    price:       0,
    billingType: "one_time",
    description: "Get listed and indexed",
    perks: [
      "Permanent indexed listing",
      "Community reviews",
      "Google indexed",
      "Signals grid placement",
    ],
  },
  {
    label:       "Launch",
    value:       "LAUNCH",
    price:       29,
    billingType: "one_time",
    description: "Pin your startup for 3 weeks",
    perks: [
      "Pinned in Signals grid — 3 weeks",
      "Blog post write-up",
      "Google indexed (blog)",
      "Launch badge on your card",
    ],
  },
  {
    label:       "Pro",
    value:       "PRO",
    price:       50,
    billingType: "one_time",
    featured:    true,
    description: "Hero placement + content amplification",
    perks: [
      "Hero pin — 1 month",
      "Blog: Why I built this",
      "Google + Bing + IndexNow indexed",
      "Short-form on @arcapush + @blindspotlab",
      "1x content strategy session",
      "Supported badge on your card",
    ],
  },
  {
    label:       "Pro Max",
    value:       "PRO_MAX",
    price:       299,
    billingType: "yearly",
    description: "Full studio support — BlindspotLab",
    perks: [
      "Everything in Pro",
      "Direct studio support from BlindspotLab",
      "Suggest & improve sessions",
      "Priority hero placement — always",
      "Pro Max badge on your card",
      "Quarterly strategy review",
    ],
  },
];

export const AdminConfig = {
  ARCAPUSH_VERSION:     "2.0.0",
  LAST_PROTOCOL_UPDATE: "2026-04-01",

  SITE_NAME:        "Arcapush",
  SITE_URL:         "https://arcapush.com",
  SITE_TAGLINE:     "Where vibe-coded products get discovered.",
  SITE_DESCRIPTION: "Arcapush is the home of vibe-coded products. Solo founders list once. Google indexes it. VCs discover it. Every listing requires a problem statement — not just marketing copy.",
  SITE_OG_IMAGE:    "/og-arcapush.png",

  BRAND_TWITTER:   "@arcapush",
  FOUNDER_TWITTER: "@mojeebeth",
  FOUNDER_URL:     "https://mojeeb.xyz",
  STUDIO_URL:      "https://blindspotlab.xyz",
  STUDIO_TWITTER:  "@blindspotlab",

  PIN_PACKAGES,

  PIN_PRICE_BASE_USDC: "50.00",
  PIN_PRICE_SOL:       "0.04",

  HERO_ROTATION_MS:   30 * 1000,
  TICKER_ROTATION_MS: 10 * 1000,

  PAYMENT_WALLET_BASE:   getEnv("PAYMENT_WALLET_BASE"),
  PAYMENT_WALLET_SOLANA: getEnv("PAYMENT_WALLET_SOLANA"),
  USDC_CONTRACT_BASE:    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,

  HERO_TIERS:         ["PRO", "PRO_MAX"] as string[],
  SIGNALS_GRID_LIMIT: 20,

  CATEGORIES: [
    "SaaS", "FinTech", "AI / ML", "Productivity", "Lifestyle",
    "DeAI (Decentralized AI)", "E-commerce", "HealthTech",
    "Bio-Tech & Longevity", "EdTech", "DeFi", "Infrastructure",
    "Gaming / GameFi", "Social", "DAO Tooling", "AI x Crypto",
    "RWA", "Privacy", "Developer Tools", "Other"
  ] as string[],
};