// app/startup/[category]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { AdminConfig } from "@/lib/adminConfig";
import { CategoryGrid } from "@/components/CategoryGrid";

interface Props {
  params: { category: string };
}

function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function getStartupsByCategory(categorySlug: string) {
  // fetch all distinct categories and find the matching one
  const allCategories = await prisma.startup.findMany({
    where:    { approved: true },
    select:   { category: true },
    distinct: ["category"],
  });

  const match = allCategories.find(
    (row) => row.category != null &&
             categoryToSlug(row.category) === categorySlug.toLowerCase()
  );

  if (!match) return null;

  const realCategory = match.category;

  const startups = await prisma.startup.findMany({
    where:   { approved: true, category: realCategory },
    orderBy: [{ tier: "desc" }, { pinnedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, slug: true, name: true, tagline: true,
      category: true, tier: true, logoUrl: true,
      faviconUrl: true, bannerUrl: true, ogImage: true,
      viewCount: true, scrapedAt: true, createdAt: true,
    },
  });

  return { startups, realCategory };
}

// ── metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getStartupsByCategory(params.category);
  if (!data) return { title: "Not found — Arcapush" };

  const { realCategory, startups } = data;
  const pageUrl = `${AdminConfig.SITE_URL}/startup/${params.category}`;

  const title       = `${realCategory} Products · Arcapush`;
  const description = `${startups.length} vibe-coded ${realCategory} product${startups.length !== 1 ? "s" : ""} indexed on Arcapush — discovered by VCs.`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title, description,
      url:      pageUrl,
      siteName: AdminConfig.SITE_NAME,
      images:   [{ url: AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630 }],
      type:     "website",
    },
    twitter: {
      card: "summary_large_image",
      site: AdminConfig.BRAND_TWITTER,
      title, description,
      images: [AdminConfig.SITE_OG_IMAGE],
    },
  };
}



export async function generateStaticParams() {
  const categories = await prisma.startup.findMany({
    where:    { approved: true },
    select:   { category: true },
    distinct: ["category"],
  });

  return categories
    .filter((c) => c.category != null)
    .map((c) => ({ category: categoryToSlug(c.category) }));
}

export const revalidate = 3600;



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
              fontFamily:    "var(--font-mono)",
              fontSize:      "0.6rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         "var(--accent)",
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
                background:    "color-mix(in srgb, var(--bg-2) 80%, transparent)",
                border:        "1px solid var(--border)",
                fontFamily:    "var(--font-mono)",
                fontSize:      "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "var(--text-tertiary)",
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

        <CategoryGrid
          startups={enriched}
          categorySlug={params.category}
          realCategory={realCategory}
        />

      </div>
    </main>
  );
}