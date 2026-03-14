import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RegistrySearchHandler } from "./RegistrySearchHandler";
import { AdminConfig } from "@/lib/adminConfig";

export const revalidate = 0;

export const metadata: Metadata = {
  title: `Registry · ${AdminConfig.SITE_NAME}`,
  description:
    "Browse every vibe-coded product listed on Arcapush. The definitive registry of AI-native products — curated, indexed, and discoverable by VCs.",
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
    description:
      "The definitive registry of vibe-coded products. Every listed product, indexed and discoverable.",
    url: `${AdminConfig.SITE_URL}/registry`,
    numberOfItems: count,
    publisher: {
      "@type": "Organization",
      name: AdminConfig.SITE_NAME,
      url: AdminConfig.SITE_URL,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function RegistryPage() {
  const startups = await prisma.startup.findMany({
    where: { approved: true },
    orderBy: [{ tier: "desc" }, { pinnedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, name: true, tagline: true,
      category: true, tier: true, logoUrl: true,
    },
  });

  // Unique categories for filter pills
  const categories = Array.from(
    new Set(startups.map((s) => s.category).filter(Boolean))
  ).sort() as string[];

  return (
    <main
      className="min-h-screen pt-32 pb-20 px-6"
      style={{ background: "var(--bg)" }}
    >
      <RegistryJsonLd count={startups.length} />
      <div className="max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div
          className="mb-12 pb-12"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="mb-3 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Registry
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1
                className="ap-display mb-3"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "var(--text-primary)" }}
              >
                Indexed{" "}
                <span style={{ color: "var(--accent)" }}>Products.</span>
              </h1>
              <p className="ap-mono">
                <span style={{ color: "var(--accent)" }}>
                  {startups.length}
                </span>{" "}
                product{startups.length !== 1 ? "s" : ""} listed
              </p>
            </div>

            {/* Live indicator */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start md:self-auto"
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#16a34a" }}
              />
              Live · Updated in real-time
            </div>
          </div>
        </div>

        {/* ── Search + Filter handler ──────────────────────────────────────── */}
        <Suspense
          fallback={
            <p className="ap-label animate-pulse">Loading registry...</p>
          }
        >
          <RegistrySearchHandler
            initialStartups={startups}
            categories={categories}
          />
        </Suspense>

      </div>
    </main>
  );
}