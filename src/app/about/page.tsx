import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = {
  title: `About · ${AdminConfig.SITE_NAME}`,
  description:
    "Arcapush was built by Mojeeb — a vibe coder and Web3 strategist from Lagos, Nigeria with 16 years of combined experience. The origin story behind the registry for vibe-coded products.",
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: `${AdminConfig.SITE_URL}/about` },
  openGraph: {
    title: `About · ${AdminConfig.SITE_NAME}`,
    description:
      "Built by a historian-turned-vibe-coder to ensure no AI-native product remains invisible.",
    url: `${AdminConfig.SITE_URL}/about`,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ url: "/og-arcapush.png", width: 1200, height: 630, alt: "Arcapush — Where vibe coded products get discovered" }],
  },
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,
    creator: AdminConfig.FOUNDER_TWITTER,
    title: `About · ${AdminConfig.SITE_NAME}`,
    description: "Built by a historian-turned-vibe-coder. 16 years. 14+ products. One registry.",
    images: ["/og-arcapush.png"],
  },
};

export default function Page() {
  return <AboutPage />;
}