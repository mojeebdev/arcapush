import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { HeroPin } from "@/components/HeroPin";
import { DiscoveryTicker } from "@/components/DiscoveryTicker";
import { AdminConfig } from "@/lib/adminConfig";

export const revalidate = 30; 

async function getPinnedStartups() {
  const now = new Date();
  return prisma.startup.findMany({
    where: {
      tier: "PINNED",
      pinnedUntil: { gt: now },
    },
    orderBy: { pinnedAt: "desc" },
    select: {
      id: true,
      name: true,
      tagline: true,
      problemStatement: true,
      bannerUrl: true,
      logoUrl: true,
      category: true,
      website: true,
      twitter: true,
      tier: true,
      pinnedAt: true,
      pinnedUntil: true,
      viewCount: true,
      createdAt: true,
    },
  });
}

async function getFreeStartups() {
  return prisma.startup.findMany({
    where: {
      OR: [
        { tier: "FREE" },
        {
          tier: "PINNED",
          pinnedUntil: { lte: new Date() },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      tagline: true,
      bannerUrl: true,
      logoUrl: true,
      category: true,
      viewCount: true,
      createdAt: true,
    },
  });
}

export default async function HomePage() {
  const [pinnedStartups, freeStartups] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
  ]);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section: The "Vibe Code" Spotlight */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* Status Indicator */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.3em] text-white/70 uppercase">
                Live Discovery Feed
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic uppercase leading-none">
              Discover the <br />
              <span className="text-vibe-gradient">Next Wave</span>
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium italic">
              {AdminConfig.SITE_DESCRIPTION}
            </p>
          </div>

          {/* Featured/Pinned Component */}
          {pinnedStartups.length > 0 && (
            <div className="mb-24">
              <HeroPin startups={pinnedStartups} />
            </div>
          )}

          {/* General Discovery Feed */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500">Recent Signals</h2>
              <span className="text-[10px] font-mono text-zinc-700">{freeStartups.length} Registered</span>
            </div>
            <DiscoveryTicker startups={freeStartups} />
          </div>

        </div>
      </section>
    </main>
  );
}