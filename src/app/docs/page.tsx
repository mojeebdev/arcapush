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
      {/* 🛡️ pt-16 reduces the space between Navbar and the Hero content */}
      <section className="relative pt-16 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">
              Vibes for <br />
              <span className="bg-gradient-to-r from-white via-zinc-400 to-[#4E24CF] bg-clip-text text-transparent">Developers</span>
            </h1>
            
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-2xl md:text-3xl text-zinc-300 font-serif italic leading-relaxed opacity-90" style={{ fontFamily: "'Playfair Display', serif" }}>
                VibeStream is the premier destination for high-signal engineering and visionary capital.
              </p>
            </div>

            <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto font-bold uppercase tracking-[0.2em] mb-12">
              {AdminConfig.SITE_DESCRIPTION}
            </p>
            
            {/* CTA Buttons & Status Indicator */}
            <div className="flex flex-col items-center gap-8 mt-12">
              <div className="flex items-center justify-center gap-6">
                <Link 
                  href="/submit" 
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all duration-500 shadow-2xl shadow-white/5"
                >
                  Get Started →
                </Link>
                <Link 
                  href="/docs" 
                  className="text-zinc-500 font-bold hover:text-white transition-colors tracking-[0.3em] uppercase text-[10px] px-6 py-4 border border-white/5 rounded-2xl bg-zinc-950/50"
                >
                  Documentation
                </Link>
              </div>

              {/* Live Status — Relocated & Integrated */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                </span>
                <span className="text-[10px] font-black tracking-[0.3em] text-white/70 uppercase">
                  VibeStream Live — <span className="text-[#D4AF37]">{totalCount}</span> Initialized
                </span>
              </div>
            </div>
          </div>

          {/* 💎 Featured Tier */}
          {pinnedStartups.length > 0 && (
            <div className="mb-32 relative">
              <div className="absolute -inset-4 bg-[#4E24CF]/5 blur-3xl rounded-full -z-10" />
              <HeroPin startups={pinnedStartups} />
            </div>
          )}

          {/* 🌊 Recent Signals */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
                Recent <span className="text-[#4E24CF]">Signals</span>
              </h2>
              <span className="text-[10px] font-mono text-zinc-800 tracking-widest">
                {freeStartups.length} Registered
              </span>
            </div>
            <DiscoveryTicker startups={freeStartups as any} />
          </div>
        </div>
      </section>
    </main>
  );
}