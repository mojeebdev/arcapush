// ============================================================
// FILE PATH: src/app/registry/page.tsx
// Arcapush rebrand — URLs, JSON-LD, colors → CSS vars
// ============================================================

import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RegistrySearchHandler } from "./RegistrySearchHandler";
import { AdminConfig } from "@/lib/adminConfig";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `Registry · ${AdminConfig.SITE_NAME}`,
  description: "Browse every vibe-coded product listed on Arcapush. The definitive registry of AI-native products — curated, indexed, and discoverable by VCs.",
  alternates: { canonical: `${AdminConfig.SITE_URL}/registry` },
  openGraph: {
    title: `Registry · ${AdminConfig.SITE_NAME}`,
    description: "Every vibe-coded product, indexed and discoverable.",
    url: `${AdminConfig.SITE_URL}/registry`,
    images: [{ url: AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: AdminConfig.BRAND_TWITTER,
    title: `Registry · ${AdminConfig.SITE_NAME}`,
    images: [AdminConfig.SITE_OG_IMAGE],
  },
};

function RegistryJsonLd({ count }: { count: number }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${AdminConfig.SITE_NAME} Registry`,
    description: "The definitive registry of vibe-coded products. Every listed product, indexed and discoverable.",
    url: `${AdminConfig.SITE_URL}/registry`,
    numberOfItems: count,
    publisher: { "@type": "Organization", name: AdminConfig.SITE_NAME, url: AdminConfig.SITE_URL },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function RegistryPage() {
  const startups = await prisma.startup.findMany({
    where: { approved: true },
    orderBy: [{ tier: "desc" }, { pinnedAt: "desc" }, { createdAt: "desc" }],
    select: { id: true, slug: true, name: true, tagline: true, category: true, tier: true, logoUrl: true },
  });

  return (
    <main className="min-h-screen pt-32 pb-20 px-6" style={{ background: "var(--bg)" }}>
      <RegistryJsonLd count={startups.length} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="ap-label mb-2">Registry</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>
            Indexed <span style={{ color: "var(--accent)" }}>Products.</span>
          </h1>
          <p className="ap-label mt-3">{startups.length} product{startups.length !== 1 ? "s" : ""} listed</p>
        </div>
        <Suspense fallback={<p className="ap-label animate-pulse">Loading...</p>}>
          <RegistrySearchHandler initialStartups={startups} />
        </Suspense>
      </div>
    </main>
  );
}