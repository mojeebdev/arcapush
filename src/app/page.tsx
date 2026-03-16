import { prisma } from "@/lib/prisma";
import { HeroSection }      from "@/components/home/HeroSection";
import { TickerSection }    from "@/components/home/TickerSection";
import { ProblemSection }   from "@/components/home/ProblemSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ProofBar }         from "@/components/home/ProofBar";
import { FinalCTA }         from "@/components/home/FinalCTA";
import { HeroPin }          from "@/components/HeroPin";
import { DiscoveryTicker }  from "@/components/DiscoveryTicker";
import { CuratedToolsSection } from "@/components/CuratedToolsSection";

export const revalidate = 0;

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

export default async function HomePage() {
  const [pinnedStartups, freeStartups, featuredStartups, stats] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
    getFeaturedStartups(),
    getStats(),
  ]);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* 1 ── Hero */}
      <HeroSection totalCount={stats.totalCount} />

      {/* 2 ── Scrolling text ticker */}
      <TickerSection />

      {/* 3 ── Pinned / Boosted product spotlight */}
      {pinnedStartups.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div
            className="mb-4 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Boosted Products
          </div>
          <HeroPin startups={pinnedStartups} />
        </div>
      )}

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 4 ── Problem section */}
      <ProblemSection />

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 5 ── How it works */}
      <HowItWorksSection />

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 6 ── Social proof bar */}
      <ProofBar
        totalCount={stats.totalCount}
        vcVisits={stats.vcVisits}
        ecosystems={stats.ecosystems}
      />

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 7 ── Discovery ticker */}
      <DiscoveryTicker startups={freeStartups as any} />

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 8 ── Curated tools */}
      <CuratedToolsSection />

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 9 ── Recent Signals grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div
          className="flex items-center justify-between mb-8 pb-6 gap-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="ap-display"
            style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}
          >
            Recent <span style={{ color: "var(--accent)" }}>Signals</span>
          </h2>
          <span className="ap-mono">{freeStartups.length} Index Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeStartups.map((startup) => (
            <a
              key={startup.id}
              href={`/startups/${startup.slug}`}
              className="group flex flex-col gap-3 p-6 rounded-2xl transition-all"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              {/* Logo + Name */}
              <div className="flex items-center gap-3">
                {startup.logoUrl ? (
                  <img
                    src={startup.logoUrl}
                    alt={startup.name}
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    style={{ border: "1px solid var(--border)" }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: "var(--accent)", color: "#fff",
                      fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700,
                    }}
                  >
                    {startup.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p
                    className="ap-display truncate"
                    style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}
                  >
                    {startup.name}
                  </p>
                  <p className="ap-mono" style={{ fontSize: "0.6rem", color: "var(--accent)" }}>
                    {startup.category}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p
                className="text-xs line-clamp-2 flex-grow"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", lineHeight: 1.6 }}
              >
                {startup.tagline}
              </p>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-2"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <span className="ap-mono" style={{ fontSize: "0.58rem", color: "var(--text-secondary)" }}>
                  {startup.viewCount ?? 0} views
                </span>
                <span
                  className="ap-mono opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ fontSize: "0.58rem", color: "var(--accent)" }}
                >
                  View →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>

      {/* 10 ── Final CTA */}
      <FinalCTA />

    </main>
  );
}