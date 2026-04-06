import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: `List Your Product · ${AdminConfig.SITE_NAME}`,
  description:
    "Submit your vibe-coded product to Arcapush — the definitive registry for AI-native startups. Free permanent listing. Sign in with Google or GitHub. Reviewed within 6 hours.",
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: `${AdminConfig.SITE_URL}/submit` },
  openGraph: {
    title: `List Your Product · ${AdminConfig.SITE_NAME}`,
    description:
      "Get your vibe-coded product indexed, discovered, and in front of VCs. Free forever. Submit once — Arcapush does the rest.",
    url: `${AdminConfig.SITE_URL}/submit`,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ url: "/og-arcapush.png", width: 1200, height: 630, alt: "Submit to Arcapush" }],
  },
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,
    creator: AdminConfig.FOUNDER_TWITTER,
    title: `List Your Product · ${AdminConfig.SITE_NAME}`,
    description: "Free permanent listing. Reviewed in 6 hours. Built for vibe coders.",
    images: ["/og-arcapush.png"],
  },
};

export default function SubmitPage() {
  return <SubmitForm />;
}