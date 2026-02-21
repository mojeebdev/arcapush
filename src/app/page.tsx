import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { HeroPin } from "@/components/HeroPin";
import { DiscoveryTicker } from "@/components/DiscoveryTicker";

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
      id: true, name: true, tagline: true, problemStatement: true,
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
        {
          tier: "PINNED",
          pinnedUntil: { lte: new Date() },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true, name: true, tagline: true, problemStatement: true,
      bannerUrl: true, logoUrl: true, category: true, website: true,
      twitter: true, tier: true, viewCount: true, createdAt: true,
    },
  });
}

async function getStartupCount() {
  const count = await prisma.startup.count({
    where: { approved: true } 
  });
  return new Intl.NumberFormat().format(count);
}

export default async function HomePage() {
  const [pinnedStartups, freeStartups, totalCount] = await Promise.all([
    getPinnedStartups(),
    getFreeStartups(),
    getStartupCount(),
  ]);

  return (
    <main className="min-h-screen bg-black">
      
      
      <Hero totalCount={totalCount} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full -mt-10">
        
        {pinnedStartups.length > 0 && (
          <div className="mb-20 md:mb-24 relative">
            <HeroPin startups={pinnedStartups} />
          </div>
        )}

       
        <div className="pb-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 border-b border-white/5 pb-6 gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
              Recent <span className="text-[#4E24CF]">Signals</span>
            </h2>
            <span className="text-[10px] font-mono text-zinc-800 tracking-widest uppercase">
              {freeStartups.length} Index Records
            </span>
          </div>
          <DiscoveryTicker startups={freeStartups as any} />
        </div>
      </div>
    </main>
  );
}