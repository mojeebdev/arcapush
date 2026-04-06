import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import PricingPage from "@/components/PricingPage";

export const metadata: Metadata = {
  title: `Pricing · ${AdminConfig.SITE_NAME}`,
  description:
    "List your vibe-coded product on Arcapush. Free permanent listing or pay once to pin, amplify, and get in front of VCs. USDC on Base, SOL on Solana, or card via Paystack.",
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: `${AdminConfig.SITE_URL}/pricing` },
  openGraph: {
    title: `Pricing · ${AdminConfig.SITE_NAME}`,
    description:
      "Free permanent listing. Pay once to pin. Pro Max gives you the full BlindspotLab studio. Crypto or card accepted.",
    url: `${AdminConfig.SITE_URL}/pricing`,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ url: "/og-arcapush.png", width: 1200, height: 630, alt: "Arcapush Pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,
    creator: AdminConfig.FOUNDER_TWITTER,
    title: `Pricing · ${AdminConfig.SITE_NAME}`,
    description: "List free. Pay once to get pinned. VCs are watching.",
    images: ["/og-arcapush.png"],
  },
};

export default function Page() {
  return <PricingPage />;
}