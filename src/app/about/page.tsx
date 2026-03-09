// ─────────────────────────────────────────────────────────────────────────────
// src/app/about/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { motion } from "framer-motion";
import {
  HiOutlineSparkles, HiOutlineMagnifyingGlass, HiOutlineLink,
  HiOutlineRocketLaunch, HiOutlineSpeakerWave
} from "react-icons/hi2";

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto" style={{ backgroundColor: "#0f0f12" }}>

      {/* Hero Section */}
      <section className="mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">The Origin Story</span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            From a Spark on X to the <span className="text-[#4E24CF]">Limelight.</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-3xl">
            It started with a realization: the art of marketing is becoming as essential as the art of code.
            Vibestream was built to ensure no <span className="text-white italic">"Vibe Code"</span> remains in the shadows.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8 border border-white/8 rounded-[3rem] overflow-hidden mb-32 shadow-card-lg">
        <div className="bg-[#16161b] p-12 flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#4E24CF]/8 flex items-center justify-center border border-[#4E24CF]/20">
              <HiOutlineRocketLaunch className="w-6 h-6 text-[#4E24CF]" />
            </div>
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Our Mission</h2>
            <p className="text-3xl font-black text-white uppercase tracking-tighter">
              One Startup <br />
              <span className="group-hover:text-[#4E24CF] transition-colors">At A Time.</span>
            </p>
          </div>
          <p className="mt-8 text-sm text-gray-400 font-medium leading-relaxed">
            Methodically indexing and amplifying the most potent signals in the ecosystem. No noise, just pure Vibe Code.
          </p>
        </div>

        <div className="bg-[#16161b] p-12 flex flex-col justify-between group">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/8 flex items-center justify-center border border-[#D4AF37]/20">
              <HiOutlineSpeakerWave className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Our Vision</h2>
            <p className="text-3xl font-black text-white uppercase tracking-tighter">
              The Mouthpiece of <br />
              <span className="group-hover:text-[#D4AF37] transition-colors">VC-Backed Talent.</span>
            </p>
          </div>
          <p className="mt-8 text-sm text-gray-400 font-medium leading-relaxed">
            To be the definitive voice for every Vibe Coder who secures the backing of Top VCs, turning their success into a global standard.
          </p>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { icon: <HiOutlineSparkles className="w-8 h-8 text-[#4E24CF] group-hover:scale-110 transition-transform" />, title: "Limelight", border: "hover:border-[#4E24CF]/30", text: "Bringing recognition to startups that are building the future but aren't marketing enough." },
          { icon: <HiOutlineLink className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />, title: "The Bridge", border: "hover:border-[#D4AF37]/30", text: "Serving as the vital connection point between institutional VCs and innovative Users." },
          { icon: <HiOutlineMagnifyingGlass className="w-8 h-8 text-gray-500 group-hover:scale-110 transition-transform" />, title: "Encyclopedia", border: "hover:border-gray-500", text: "The definitive directory of Vibe Code. Search for any problem, find the perfect productivity solution." },
        ].map((pillar) => (
          <div key={pillar.title} className={`p-8 rounded-[2rem] bg-[#16161b] border border-white/8 space-y-4 ${pillar.border} transition-all group shadow-card`}>
            {pillar.icon}
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">{pillar.title}</h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase">{pillar.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}