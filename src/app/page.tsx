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
      
      <section className="relative pt-32 pb-16 overflow-hidden min-h-[95vh] flex flex-col justify-start">
        
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div 
            className="w-full h-full bg-no-repeat bg-[center_top_20%] bg-cover opacity-45 mix-blend-lighten animate-vibe-hero"
            style={{ 
              backgroundImage: "url('/hero-signal-bg.jpg')",
              maskImage: 'linear-gradient(to bottom, black 10%, transparent 90%), radial-gradient(circle at center, black 30%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 90%), radial-gradient(circle at center, black 30%, transparent 80%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>

        
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-transparent to-black" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          
          <div className="text-center mb-16 md:mb-24 pt-10 flex flex-col items-center">
            
            
            <h1 className="relative z-10 text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 md:mb-10 leading-[0.9] md:leading-[0.85] uppercase text-white">
              Vibes for <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-[#4E24CF] bg-clip-text text-transparent">Developers</span>
            </h1>
            
            
            <div className="relative z-10 max-w-3xl mx-auto mb-10 md:mb-12">
              <p className="text-xl md:text-3xl text-zinc-100 font-serif italic leading-relaxed drop-shadow-xl px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                VibeStream is the premier destination for high-signal engineering and visionary capital.
              </p>
            </div>

            
            <p className="relative z-10 text-zinc-400 text-[10px] md:text-xs max-w-xl mx-auto font-bold uppercase tracking-[0.4em] mb-12 opacity-100 drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
              A CRYPTO-POWERED STARTUP DISCOVERY HUB. <br />
              PREMIUM ACCESS. CURATED FOUNDERS. ON-CHAIN VERIFICATION.
            </p>
            
            
            <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
                <Link 
                  href="/submit" 
                  className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 text-center"
                >
                  Get Started →
                </Link>
                <Link 
                  href="/docs" 
                  className="w-full md:w-auto text-zinc-300 font-bold hover:text-white transition-colors tracking-[0.3em] uppercase text-[10px] px-8 py-5 border border-white/10 rounded-2xl bg-black/60 backdrop-blur-md text-center"
                >
                  Documentation
                </Link>
              </div>

              
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#D4AF37]/30 bg-black/80 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                </span>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/90 uppercase">
                  VibeStream Live — <span className="text-[#D4AF37]">{totalCount}</span> Initialized
                </span>
              </div>
            </div>
          </div>

          
          {pinnedStartups.length > 0 && (
            <div className="mb-20 md:mb-32 relative">
              <div className="absolute -inset-10 bg-[#4E24CF]/10 blur-[100px] rounded-full -z-10" />
              <HeroPin startups={pinnedStartups} />
            </div>
          )}

          
          <div className="mt-16 md:mt-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 border-b border-white/10 pb-6 gap-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                Recent <span className="text-[#4E24CF]">Signals</span>
              </h2>
              <span className="text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
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