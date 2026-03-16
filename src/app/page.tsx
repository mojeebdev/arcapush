import { prisma } from "@/lib/prisma";
import { HeroSection }        from "@/components/home/HeroSection";
import { TickerSection }      from "@/components/home/TickerSection";
import { ProblemSection }     from "@/components/home/ProblemSection";
import { HowItWorksSection }  from "@/components/home/HowItWorksSection";
import { ProofBar }           from "@/components/home/ProofBar";
import { FinalCTA }           from "@/components/home/FinalCTA";
import { HeroPin }            from "@/components/HeroPin";
import { CuratedToolsSection } from "@/components/CuratedToolsSection";
import { SignalsGrid }         from "@/components/SignalsGrid";

export const revalidate = 0;

async function getPinnedStartups() {
  const now = new Date();
  return prisma.startup.findMany({
    where: { approved: true, tier: "PINNED", pinnedUntil: { gt: now } },
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
    vcVisits:    vcVisits > 1000 ? `${(vcVisits / 1000).toFixed(1)}K` : String(vcVisits),
    ecosystems:  String(categories.length),
  };
}

export default async function HomePage() {
  const [pinnedStartups, freeStartups, stats] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
    getStats(),
  ]);

  return (
    <main className="min-h-screen relative" style={{ background: "var(--bg)" }}>

      {/* ── Page grid background ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `linear-gradient(to bottom,
            var(--bg) 0%,
            transparent 8%,
            transparent 92%,
            var(--bg) 100%
          )`,
        }}
      />

      {/* ── All sections ────────────────────────────────────────────────── */}
      <div className="relative z-10">

        {/* 1 ── Hero */}
        <HeroSection totalCount={stats.totalCount} />

        {/* 2 ── Ticker */}
        <TickerSection />

        {/* 3 ── Pinned products */}
        {pinnedStartups.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
              <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
              Boosted Products
            </div>
            <HeroPin startups={pinnedStartups} />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 lg:px-8"><div style={{ borderTop: "1px solid var(--border)" }} /></div>

        {/* 4 ── Problem */}
        <ProblemSection />

        <div className="max-w-7xl mx-auto px-6 lg:px-8"><div style={{ borderTop: "1px solid var(--border)" }} /></div>

        {/* 5 ── How it works */}
        <HowItWorksSection />

        <div className="max-w-7xl mx-auto px-6 lg:px-8"><div style={{ borderTop: "1px solid var(--border)" }} /></div>

        {/* 6 ── Proof bar */}
        <ProofBar totalCount={stats.totalCount} vcVisits={stats.vcVisits} ecosystems={stats.ecosystems} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8"><div style={{ borderTop: "1px solid var(--border)" }} /></div>

        {/* 7 ── Recent Signals */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-8 pb-6 gap-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="ap-display" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
              Recent <span style={{ color: "var(--accent)" }}>Signals</span>
            </h2>
            <span className="ap-mono">{freeStartups.length} Index Records</span>
          </div>
          <SignalsGrid startups={freeStartups} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8"><div style={{ borderTop: "1px solid var(--border)" }} /></div>

        {/* 8 ── Curated tools */}
        <CuratedToolsSection />

        <div className="max-w-7xl mx-auto px-6 lg:px-8"><div style={{ borderTop: "1px solid var(--border)" }} /></div>

        {/* 9 ── Final CTA */}
        <FinalCTA />

      </div>
    </main>
  );
}