import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { HeroPin } from "@/components/HeroPin";
import { DiscoveryTicker } from "@/components/DiscoveryTicker";
import {
  ProblemBlock,
  HowItWorks,
  InvestorPanel,
  Pricing,
} from "@/components/HomeSections";

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
      id: true, slug: true, name: true, tagline: true, problemStatement: true,
      bannerUrl: true, logoUrl: true, category: true, website: true,
      twitter: true, tier: true, pinnedAt: true, pinnedUntil: true,
      viewCount: true, createdAt: true,
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
      id: true, slug: true, name: true, tagline: true, problemStatement: true,
      bannerUrl: true, logoUrl: true, category: true, website: true,
      twitter: true, tier: true, viewCount: true, createdAt: true,
    },
  });
}

async function getStartupCount() {
  const count = await prisma.startup.count({ where: { approved: true } });
  return new Intl.NumberFormat().format(count);
}


export default async function HomePage() {
  const [pinnedStartups, freeStartups, totalCount] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
    getStartupCount(),
  ]);

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* Hero */}
      <Hero totalCount={totalCount} />

      {/* Pinned + Discovery feed */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 -mt-10">
        {pinnedStartups.length > 0 && (
          <div className="mb-20 md:mb-24">
            <HeroPin startups={pinnedStartups} />
          </div>
        )}
        <div className="pb-20">
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 pb-6 gap-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2
              className="text-lg font-black uppercase tracking-widest"
              style={{ color: "var(--text-primary)" }}
            >
              Recent <span style={{ color: "var(--accent)" }}>Signals</span>
            </h2>
            <span className="ap-mono">{freeStartups.length} Index Records</span>
          </div>
          <DiscoveryTicker startups={freeStartups as any} />
        </div>
      </div>

      {/* Divider */}
      <div className="ap-divider mx-8" />

      
      <ProblemBlock />
      <HowItWorks />
      <InvestorPanel />
      <Pricing />

    </main>
  );
}