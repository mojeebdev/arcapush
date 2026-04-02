import { prisma } from "@/lib/prisma";
import { HeroSection }         from "@/components/home/HeroSection";
import { TickerSection }       from "@/components/home/TickerSection";
import { ProblemSection }      from "@/components/home/ProblemSection";
import { HowItWorksSection }   from "@/components/home/HowItWorksSection";
import { ProofBar }            from "@/components/home/ProofBar";
import { FinalCTA }            from "@/components/home/FinalCTA";
import { HeroPin }             from "@/components/HeroPin";
import { CuratedToolsSection } from "@/components/CuratedToolsSection";
import { SignalsGrid }         from "@/components/SignalsGrid";
import { MostViewed }          from "@/components/MostViewed";
import { LogoTicker }          from "@/components/LogoTicker";
import { SuggestionBox }       from "@/components/SuggestionBox";
import { categoryToSlug }      from "@/types";
import type { StartupCardData, SiteStats } from "@/types";

export const revalidate = 0;

const CARD_SELECT = {
  id:               true,
  slug:             true,
  name:             true,
  tagline:          true,
  problemStatement: true,
  bannerUrl:         true,
  logoUrl:           true,
  ogImage:           true,
  faviconUrl:       true,
  scrapedAt:         true,
  category:         true,
  website:          true,
  twitter:          true,
  tier:             true,
  viewCount:         true,
  createdAt:         true,
  pinnedAt:          true,
  pinnedUntil:      true,
} as const;

async function getPinnedStartups(): Promise<StartupCardData[]> {
  const now      = new Date();
  const startups = await prisma.startup.findMany({
    where:   { approved: true, tier: { in: ["PRO", "PRO_MAX"] as any }, pinnedUntil: { gt: now } },
    orderBy: [{ tier: "desc" }, { pinnedAt: "desc" }],
    select:  CARD_SELECT,
  });
  return startups.map((s) => ({ ...s, categorySlug: categoryToSlug(s.category) }));
}

async function getFreeStartups(): Promise<StartupCardData[]> {
  const now = new Date();
  const startups = await prisma.startup.findMany({
    where: {
      approved: true,
      OR: [
        { tier: "FREE" as any },
        { tier: "LAUNCH" as any },
        { tier: { in: ["PRO", "PRO_MAX"] as any }, pinnedUntil: { lte: now } },
      ],
    },
    orderBy: [{ tier: "desc" }, { createdAt: "desc" }],
    take:    20,
    select:  CARD_SELECT,
  });
  return startups.map((s) => ({ ...s, categorySlug: categoryToSlug(s.category) }));
}

async function getMostViewed() {
  const now   = new Date();
  const week  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const month = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const select = {
    id: true, slug: true, category: true, name: true,
    tagline: true, logoUrl: true, faviconUrl: true, viewCount: true, tier: true,
  } as const;

  const [weekly, monthly] = await Promise.all([
    prisma.startup.findMany({
      where:   { approved: true, updatedAt: { gte: week } },
      orderBy: { viewCount: "desc" },
      take:    5,
      select,
    }),
    prisma.startup.findMany({
      where:   { approved: true, updatedAt: { gte: month } },
      orderBy: { viewCount: "desc" },
      take:    5,
      select,
    }),
  ]);

  return {
    weekly:  weekly.map((s) => ({ ...s, categorySlug: categoryToSlug(s.category) })),
    monthly: monthly.map((s) => ({ ...s, categorySlug: categoryToSlug(s.category) })),
  };
}

async function getStats(): Promise<SiteStats> {
  const [totalProducts, vcVisits, categories] = await Promise.all([
    prisma.startup.count({ where: { approved: true } }),
    prisma.accessRequest.count(),
    prisma.startup.findMany({
      where:    { approved: true },
      select:   { category: true },
      distinct: ["category"],
    }),
  ]);
  return {
    totalCount: new Intl.NumberFormat().format(totalProducts),
    vcVisits:   vcVisits > 1000 ? `${(vcVisits / 1000).toFixed(1)}K` : String(vcVisits),
    ecosystems: String(categories.length),
  };
}

export default async function HomePage() {
  const [pinnedStartups, freeStartups, stats, mostViewed] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
    getStats(),
    getMostViewed(),
  ]);

  return (
    <main className="min-h-screen relative" style={{ background: "transparent" }}>

      <div className="relative z-10">

        {/* 1 — Hero */}
        <HeroSection totalCount={stats.totalCount} />

        {/* 2 — Ticker */}
        <TickerSection />

        {/* 2b — Primary Strip: Indexed Status (Separated after Hero) */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 border-b border-stone-900/30">
          <LogoTicker variant="indexed-on" speed={40} logoSize={24} />
        </div>

        {/* 3 — Pinned products */}
        {pinnedStartups.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div
              className="mb-4 flex items-center gap-3"
              style={{
                fontFamily:     "var(--font-mono)",
                fontSize:       "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color:          "var(--accent)",
              }}
            >
              <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
              Boosted Products
            </div>
            <HeroPin startups={pinnedStartups} />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 4 — Problem */}
        <ProblemSection />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 5 — How it works */}
        <HowItWorksSection />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 6 — Proof bar */}
        <ProofBar
          totalCount={stats.totalCount}
          vcVisits={stats.vcVisits}
          ecosystems={stats.ecosystems}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 7 — Recent Signals */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div
            className="flex items-center justify-between mb-8 pb-6 gap-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2
              className="ap-display"
              style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}
            >
              Latest <span style={{ color: "var(--accent)" }}>Signals</span>
            </h2>
            <a href="/registry" className="ap-mono" style={{ color: "var(--accent)", textDecoration: "none" }}>
              View all in Registry →
            </a>
          </div>
          <SignalsGrid startups={freeStartups} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 8 — Most viewed */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className="mb-8 pb-6 flex items-center justify-between gap-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="ap-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
              Top <span style={{ color: "var(--accent)" }}>Signals</span>
            </h2>
          </div>
          <MostViewed weekly={mostViewed.weekly} monthly={mostViewed.monthly} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 9 — Suggestion box */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className="mb-8 pb-6"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="ap-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
              Shape <span style={{ color: "var(--accent)" }}>Arcapush</span>
            </h2>
          </div>
          <SuggestionBox />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* 10 — Curated tools */}
        <CuratedToolsSection />

        {/* 10b — Secondary Strips: Tech Stack (Separated before Footer) */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 border-t border-stone-900/50">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <LogoTicker variant="built-on" speed={50} logoSize={20} />
            <LogoTicker variant="ai-powered" speed={30} logoSize={20} />
          </div>
        </div>

        {/* 11 — Final CTA */}
        <FinalCTA />

      </div>
    </main>
  );
}