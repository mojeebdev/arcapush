import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  HiOutlineGlobeAlt, 
  HiOutlineLink, 
  HiOutlineShieldCheck,
  HiOutlineArrowUpRight 
} from "react-icons/hi2";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StartupDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      _count: {
        select: { accessRequests: true }
      }
    }
  });

  if (!startup) notFound();

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto relative">
        {/* 🌌 Ambient Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4E24CF]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* 🏛️ Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-[#4E24CF]/10 text-[#4E24CF] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-[#4E24CF]/20">
                {startup.category || "Vibe Code"}
              </span>
              {startup.pinnedAt && (
                <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-[#D4AF37]/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  In Limelight
                </span>
              )}
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              {startup.name}
            </h1>
            <p className="text-zinc-500 text-xl md:text-2xl font-medium max-w-2xl leading-tight">
              {startup.tagline}
            </p>
          </div>

          <div className="p-10 border border-white/5 bg-zinc-950 rounded-[3rem] text-center min-w-[200px] shadow-2xl">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">VC Interest</p>
            <p className="text-5xl font-black text-white italic tracking-tighter">
              {startup._count.accessRequests}
            </p>
          </div>
        </div>

        {/* 🖼️ Main Visual Asset */}
        {startup.bannerUrl && (
          <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 mb-16 shadow-2xl">
            <img src={startup.bannerUrl} alt={startup.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        )}

        {/* 📜 Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          <div className="lg:col-span-2 space-y-12">
            <section className="p-10 border border-white/5 rounded-[3rem] bg-zinc-950/50 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <HiOutlineShieldCheck className="w-24 h-24" />
              </div>
              <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-8">The Problem Statement</h3>
              <p className="text-2xl text-zinc-300 leading-relaxed font-medium">
                {startup.problemStatement}
              </p>
            </section>
          </div>

          <aside className="space-y-8">
            {/* 🔗 Signal Links */}
            <div className="p-8 border border-white/5 rounded-[3rem] bg-zinc-950 space-y-4">
              <h3 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Signals</h3>
              <a href={startup.website || "#"} target="_blank" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#4E24CF]/50 hover:bg-[#4E24CF]/5 transition-all group">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Platform</span>
                <HiOutlineGlobeAlt className="w-4 h-4 text-zinc-500 group-hover:text-white" />
              </a>
              <a href={startup.founderLinkedIn || "#"} target="_blank" className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#4E24CF]/50 hover:bg-[#4E24CF]/5 transition-all group">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Founder</span>
                <HiOutlineLink className="w-4 h-4 text-zinc-500 group-hover:text-white" />
              </a>
            </div>

            {/* 🛡️ Access CTA */}
            <button className="w-full py-6 rounded-[2rem] bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#D4AF37] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
              Request Pitch Access <HiOutlineArrowUpRight className="w-4 h-4" />
            </button>
            
            <p className="text-[9px] text-zinc-700 font-black text-center uppercase tracking-[0.5em]">
              VIBE-ID: {id.slice(0, 8)}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}