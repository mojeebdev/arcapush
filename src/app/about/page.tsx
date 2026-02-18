"use client";

import { motion } from "framer-motion";
import { 
  HiOutlineSparkles, 
  HiOutlineMagnifyingGlass, 
  HiOutlineLink,
  HiOutlineRocketLaunch,
  HiOutlineSpeakerWave 
} from "react-icons/hi2";

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      {/* 🚀 Hero Section: The Origin */}
      <section className="mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">The Origin Story</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            From a Spark on X to the <span className="text-[#4E24CF]">Limelight.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-3xl">
            It started with a realization: the art of marketing is becoming as essential as the art of code. 
            Vibestream was built to ensure no <span className="text-white italic">"Vibe Code"</span> remains in the shadows.
          </p>
        </motion.div>
      </section>

      {/* 🎯 Mission & Vision: The Core Directives */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[3rem] overflow-hidden mb-32 shadow-2xl">
        {/* Mission */}
        <div className="bg-zinc-950 p-12 flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4E24CF]/10 flex items-center justify-center border border-[#4E24CF]/20">
              <HiOutlineRocketLaunch className="w-6 h-6 text-[#4E24CF]" />
            </div>
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Our Mission</h2>
            <p className="text-3xl font-black text-white uppercase tracking-tighter">
              One Startup <br />
              <span className="group-hover:text-[#4E24CF] transition-colors">At A Time.</span>
            </p>
          </div>
          <p className="mt-8 text-sm text-zinc-500 font-medium leading-relaxed">
            Methodically indexing and amplifying the most potent signals in the ecosystem. No noise, just pure Vibe Code.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-zinc-950 p-12 flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
              <HiOutlineSpeakerWave className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Our Vision</h2>
            <p className="text-3xl font-black text-white uppercase tracking-tighter">
              The Mouthpiece of <br />
              <span className="group-hover:text-[#D4AF37] transition-colors">VC-Backed Talent.</span>
            </p>
          </div>
          <p className="mt-8 text-sm text-zinc-500 font-medium leading-relaxed">
            To be the definitive voice for every Vibe Coder who secures the backing of Top VCs, turning their success into a global standard.
          </p>
        </div>
      </section>

      {/* 🏛️ The Three Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div className="p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 space-y-4 hover:border-[#4E24CF]/30 transition-all group">
          <HiOutlineSparkles className="w-8 h-8 text-[#4E24CF] group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">Limelight</h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase">
            Bringing recognition to startups that are building the future but aren't marketing enough.
          </p>
        </div>

        <div className="p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 space-y-4 hover:border-[#D4AF37]/30 transition-all group">
          <HiOutlineLink className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">The Bridge</h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase">
            Serving as the vital connection point between institutional VCs and innovative Users.
          </p>
        </div>

        <div className="p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 space-y-4 hover:border-white/20 transition-all group">
          <HiOutlineMagnifyingGlass className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">Encyclopedia</h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed uppercase">
            The definitive directory of Vibe Code. Search for any problem, find the perfect productivity solution.
          </p>
        </div>
      </section>
    </main>
  );
}