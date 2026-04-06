import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import DocsPage from "@/components/DocsPage";

export const metadata: Metadata = {
  title: `Docs · ${AdminConfig.SITE_NAME}`,
  description:
    "How Arcapush works under the hood — multichain infrastructure on Base and Solana, founder submission flow, on-chain boost verification, oracle pricing, and investor access controls.",
  metadataBase: new URL(AdminConfig.SITE_URL),
  alternates: { canonical: `${AdminConfig.SITE_URL}/docs` },
  openGraph: {
    title: `Docs · ${AdminConfig.SITE_NAME}`,
    description:
      "Technical documentation for the Arcapush registry — from wallet handshakes to indexed listings. Built on Next.js, Prisma, Supabase, wagmi, and Alchemy.",
    url: `${AdminConfig.SITE_URL}/docs`,
    siteName: AdminConfig.SITE_NAME,
    type: "website",
    images: [{ url: "/og-arcapush.png", width: 1200, height: 630, alt: "Arcapush Docs" }],
  },
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,
    creator: AdminConfig.FOUNDER_TWITTER,
    title: `Docs · ${AdminConfig.SITE_NAME}`,
    description: "How Arcapush works — multichain, non-custodial, and indexed.",
    images: ["/og-arcapush.png"],
  },
};

export default function Page() {
  return <DocsPage />;
}