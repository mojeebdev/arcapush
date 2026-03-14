import { prisma } from "@/lib/prisma";
import { HeroSection }      from "@/components/home/HeroSection";
import { TickerSection }    from "@/components/home/TickerSection";
import { ProblemSection }   from "@/components/home/ProblemSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ProofBar }         from "@/components/home/ProofBar";
import { ProductsSection }  from "@/components/home/ProductsSection";
import { InvestorSection }  from "@/components/home/InvestorSection";
import { PricingSection }   from "@/components/home/PricingSection";
import { FinalCTA }         from "@/components/home/FinalCTA";
import { HeroPin }          from "@/components/HeroPin";
import { DiscoveryTicker }  from "@/components/DiscoveryTicker";

export const revalidate = 0;

// ── Data fetchers ─────────────────────────────────────────────────────────────

async function getPinnedStartups() {
  const now = new Date();
  return prisma.startup.findMany({
    where: {
      approved: true,
      tier: "PINNED",
      pinnedUntil: { gt: now },
    },
    orderBy: { pinnedAt: "desc" },
    select: {
      id: true, slug: true, name: true, tagline: true,
      problemStatement: true, bannerUrl: true, logoUrl: true,
      category: true, website: true, twitter: true, tier: true,
      pinnedAt: true, pinnedUntil: true, viewCount: true, createdAt: true,
    },
  });
}

async function getFreeStartups() {
  return prisma.startup.findMany({
    where: {
      approved: true,
      OR: [
        { tier: "FREE" },
        { tier: "PINNED", pinnedUntil: { lte: new Date() } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, slug: true, name: true, tagline: true,
      problemStatement: true, bannerUrl: true, logoUrl: true,
      category: true, website: true, twitter: true, tier: true,
      viewCount: true, createdAt: true,
    },
  });
}

async function getFeaturedStartups() {
  return prisma.startup.findMany({
    where: { approved: true },
    orderBy: [{ tier: "desc" }, { createdAt: "desc" }],
    take: 6,
    select: {
      id: true, slug: true, name: true, tagline: true,
      logoUrl: true, category: true, website: true,
      twitter: true, tier: true, viewCount: true, createdAt: true,
    },
  });
}

async function getStats() {
  const [totalProducts, vcVisits, categories] = await Promise.all([
    prisma.startup.count({ where: { approved: true } }),
    prisma.accessRequest.count(),
    prisma.startup.findMany({
      where: { approved: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  return {
    totalCount:  new Intl.NumberFormat().format(totalProducts),
    vcVisits:    vcVisits > 1000
                   ? `${(vcVisits / 1000).toFixed(1)}K`
                   : String(vcVisits),
    ecosystems:  String(categories.length),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [pinnedStartups, freeStartups, featuredStartups, stats] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
    getFeaturedStartups(),
    getStats(),
  ]);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* 1 ── Hero (merged: HTML structure + old animated count + particles) */}
      <HeroSection totalCount={stats.totalCount} />

      {/* 2 ── Scrolling text ticker (HTML design) */}
      <TickerSection />

      {/* 3 ── Pinned / Boosted product spotlight (old HeroPin — preserved) */}
      {pinnedStartups.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-4 flex items-center gap-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Boosted Products
          </div>
          <HeroPin startups={pinnedStartups} />
        </div>
      )}

      {/* 4 ── Problem section (HTML design) */}
      <ProblemSection />

      {/* 5 ── How it works (HTML design) */}
      <HowItWorksSection />

      {/* 6 ── Social proof bar (authenticated from DB) */}
      <ProofBar
        totalCount={stats.totalCount}
        vcVisits={stats.vcVisits}
        ecosystems={stats.ecosystems}
      />

      {/* 7 ── Featured products grid (HTML design) */}
      <ProductsSection startups={featuredStartups as any} />

      
      <InvestorSection />

      
      <PricingSection />

      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div
          className="flex items-center justify-between mb-8 pb-6 gap-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="ap-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
            Recent <span style={{ color: "var(--accent)" }}>Signals</span>
          </h2>
          <span className="ap-mono">{freeStartups.length} Index Records</span>
        </div>
        <DiscoveryTicker startups={freeStartups as any} />
      </div>

      {/* 11 ── Final CTA (HTML design) */}
      <FinalCTA />

    </main>
  );
}