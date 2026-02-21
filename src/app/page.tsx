import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroPin } from "@/components/HeroPin";
import { DiscoveryTicker } from "@/components/DiscoveryTicker";
import { AdminConfig } from "@/lib/adminConfig";

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
      
      <section className="relative pt-32 pb-16 overflow-hidden min-h-[85vh] md:min-h-[90vh] flex flex-col justify-start">
        
        
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "url('/hero-signal-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />

        
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/70 via-black/40 to-black" />

        
        <div className="absolute inset-0 z-[2] pointer-events-none bg-[#0a0518]/40 mix-blend-multiply" />

        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#4E24CF]/20 rounded-full blur-[160px] z-[3] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">

          <div className="text-center mb-20 md:mb-28 pt-10">
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9] md:leading-[0.85] uppercase">
              Vibes for <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-[#4E24CF] bg-clip-text text-transparent">Developers</span>
            </h1>

            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-xl md:text-3xl text-zinc-100 font-serif italic leading-relaxed px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                VibeStream is the premier destination for high-signal engineering and visionary capital.
              </p>
            </div>

            <p className="text-zinc-500 text-[10px] md:text-xs max-w-xl mx-auto font-bold uppercase tracking-[0.4em] mb-12 opacity-80">
              A CRYPTO-POWERED STARTUP DISCOVERY HUB. <br />
              PREMIUM ACCESS. CURATED FOUNDERS.
            </p>
            
            
            <div className="flex flex-col items-center gap-8 mt-12">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
                <Link 
                  href="/submit" 
                  className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all duration-500 active:scale-95 text-center shadow-lg"
                >
                  Get Started →
                </Link>
                <Link 
                  href="/docs" 
                  className="w-full md:w-auto text-zinc-400 font-bold hover:text-white transition-colors tracking-[0.3em] uppercase text-[10px] px-8 py-5 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md text-center"
                >
                  Documentation
                </Link>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#D4AF37]/20 bg-black/40 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                </span>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/80 uppercase">
                  VibeStream Live — <span className="text-[#D4AF37]">{totalCount}</span> Initialized
                </span>
              </div>
            </div>
          </div>

          {/* 💎 Featured Section */}
          {pinnedStartups.length > 0 && (
            <div className="mb-24 md:mb-32 relative">
              <HeroPin startups={pinnedStartups} />
            </div>
          )}

          {/* 🌊 Recent Signals */}
          <div className="mt-16 md:mt-20">
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
      </section>
    </main>
  );
}