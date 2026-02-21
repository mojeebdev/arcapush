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
    where: { approved: true },
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

      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden min-h-[100svh] md:min-h-[90vh] flex flex-col justify-start">

        
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/hero-signal-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        />

        
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/80 via-black/60 to-black md:from-black/70 md:via-black/50" />

        
        <div className="absolute inset-0 z-[2] pointer-events-none bg-[#0a0518]/40 mix-blend-multiply" />

        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[240px] sm:w-[600px] sm:h-[360px] md:w-[1000px] md:h-[500px] bg-[#4E24CF]/20 rounded-full blur-[80px] md:blur-[160px] z-[3] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

          <div className="text-center mb-12 sm:mb-16 md:mb-28 pt-6 sm:pt-8 md:pt-10">

            
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 md:mb-10 leading-[0.9] md:leading-[0.85] uppercase">
              Vibes for <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-[#4E24CF] bg-clip-text text-transparent">
                Developers
              </span>
            </h1>

            {/* Tagline — tighter on mobile */}
            <div className="max-w-3xl mx-auto mb-8 md:mb-12">
              <p
                className="text-base sm:text-xl md:text-3xl text-zinc-100 font-serif italic leading-relaxed px-2 sm:px-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                VibeStream is the premier destination for high-signal engineering and visionary capital.
              </p>
            </div>

            
            <p className="hidden xs:block text-zinc-500 text-[9px] md:text-xs max-w-xl mx-auto font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-12 opacity-80 px-4">
              A CRYPTO-POWERED STARTUP DISCOVERY HUB. <br />
              PREMIUM ACCESS. CURATED FOUNDERS.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 mt-8 md:mt-12">

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-6 w-full max-w-xs sm:max-w-none">

                
                <Link
                  href="/submit"
                  className="w-full sm:w-auto bg-white text-black px-8 sm:px-12 py-4 sm:py-5 min-h-[48px] flex items-center justify-center rounded-2xl font-black uppercase tracking-widest text-sm sm:text-base hover:bg-[#4E24CF] hover:text-white transition-all duration-500 active:scale-95 text-center"
                >
                  Get Started →
                </Link>

                {/* Secondary CTA */}
                <Link
                  href="/docs"
                  className="w-full sm:w-auto text-zinc-400 font-bold hover:text-white transition-colors tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] px-8 py-4 sm:py-5 min-h-[48px] flex items-center justify-center border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md text-center"
                >
                  Documentation
                </Link>

              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/20 bg-black/40 backdrop-blur-xl">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                </span>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-white/80 uppercase whitespace-nowrap">
                  VibeStream Live —{" "}
                  <span className="text-[#D4AF37]">{totalCount}</span>{" "}
                  Initialized
                </span>
              </div>

            </div>
          </div>

          {/* 💎 Featured / Pinned Section */}
          {pinnedStartups.length > 0 && (
            <div className="mb-16 sm:mb-20 md:mb-32 relative">
              <HeroPin startups={pinnedStartups} />
            </div>
          )}

          {/* 🌊 Recent Signals */}
          <div className="mt-10 sm:mt-14 md:mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 border-b border-white/5 pb-4 md:pb-6 gap-2 sm:gap-4">
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