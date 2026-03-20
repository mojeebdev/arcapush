import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import { CategoryGrid } from "@/components/CategoryGrid";
import { getStartupsByCategory, categoryToSlug } from "@/lib/getStartupsByCategory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getStartupsByCategory(params.category);
  if (!data) return { title: "Not found — Arcapush" };

  const { realCategory, startups } = data;
  const pageUrl = `${AdminConfig.SITE_URL}/startup/${params.category}`;
  const title   = `${realCategory} Products · Arcapush`;
  const desc    = `${startups.length} vibe-coded ${realCategory} product${startups.length !== 1 ? "s" : ""} indexed on Arcapush — discovered by VCs.`;

  return {
    title,
    description: desc,
    alternates:  { canonical: pageUrl },
    openGraph: {
      title, description: desc,
      url: pageUrl, siteName: AdminConfig.SITE_NAME, type: "website",
      images: [{ url: AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image", site: AdminConfig.BRAND_TWITTER,
      title, description: desc, images: [AdminConfig.SITE_OG_IMAGE],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const data = await getStartupsByCategory(params.category);
  if (!data) notFound();

  const { startups, realCategory } = data;

  const enriched = startups.map((s) => ({
    ...s,
    categorySlug: categoryToSlug(s.category),
  }));

  const jsonLd = {
    "@context":    "https://schema.org",
    "@type":       "CollectionPage",
    name:          `${realCategory} Products · Arcapush`,
    description:   `Vibe-coded ${realCategory} products indexed on Arcapush.`,
    url:           `${AdminConfig.SITE_URL}/startup/${params.category}`,
    numberOfItems: startups.length,
    publisher: {
      "@type": "Organization",
      name:    AdminConfig.SITE_NAME,
      url:     AdminConfig.SITE_URL,
    },
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 pb-12" style={{ borderBottom: "1px solid var(--border)" }}>
          <div
            className="mb-3 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Registry · {realCategory}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1
                className="ap-display mb-3"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "var(--text-primary)" }}
              >
                {realCategory}{" "}
                <span style={{ color: "var(--accent)" }}>Products.</span>
              </h1>
              <p className="ap-mono">
                <span style={{ color: "var(--accent)" }}>{startups.length}</span>{" "}
                product{startups.length !== 1 ? "s" : ""} indexed
              </p>
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start md:self-auto"
              style={{
                background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
                border: "1px solid var(--border)", fontFamily: "var(--font-mono)",
                fontSize: "0.6rem", letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--text-tertiary)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
              Live · Updated in real-time
            </div>
          </div>
        </div>
        <CategoryGrid
          startups={enriched}
          categorySlug={params.category}
          realCategory={realCategory}
        />
      </div>
    </main>
  );
}