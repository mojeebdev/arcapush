'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export const Hero = ({ totalCount }: { totalCount: string }) => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden h-auto flex flex-col justify-center items-center"
      style={{ backgroundColor: "#0f0f12" }}>

      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ y: "40%", opacity: 0 }}
          animate={{ y: "-10%", opacity: 0.25 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[180%] h-[180%] md:w-[130%] md:h-[130%] flex items-center justify-center"
          style={{
            backgroundImage: "url('/hero-signal-bg.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "grayscale(1) brightness(1.1)",
          }}
        />
      </div>

      {/* Gradient Shields */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #0f0f12 0%, transparent 30%, transparent 70%, #0f0f12 100%)" }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, transparent 20%, #0f0f12 90%)" }} />

      {/* Content Layer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4E24CF]/30 bg-[#4E24CF]/12 mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B8A0FF]">
              Vibe Coding Encyclopedia
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] md:leading-[0.85] uppercase text-white">
            Where the Next <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-[#4E24CF] bg-clip-text text-transparent">
              Unicorn Gets
            </span>{" "}
            <span className="text-[#D4AF37]">Discovered.</span>
          </h1>

          {/* Subheadline */}
          <div className="max-w-3xl mx-auto mb-10">
            <p
              className="text-xl md:text-2xl text-gray-300 font-serif italic leading-relaxed px-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The definitive encyclopedia for VC-backed Vibe Coders.
              Building is hard. Marketing too.{" "}
              <span className="text-white font-bold not-italic">You don't have to do both.</span>
            </p>
          </div>

          <p className="text-gray-400 text-[10px] md:text-xs max-w-xl mx-auto font-bold uppercase tracking-[0.4em] mb-12">
            On-chain verified · Curated founders · VC discovery
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
              <Link
                href="/registry"
                className="w-full md:w-auto bg-[#4E24CF] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#6B3FE0] transition-all duration-500 active:scale-95 text-center shadow-sm"
              >
                Explore Registry →
              </Link>
              <Link
                href="/submit"
                className="w-full md:w-auto text-gray-300 font-bold hover:text-white transition-colors tracking-[0.3em] uppercase text-[10px] px-8 py-5 border border-white/12 rounded-2xl bg-white/8 backdrop-blur-md text-center"
              >
                Submit Your Startup
              </Link>
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/8 backdrop-blur-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase">
                VibeStream Live —{" "}
                <span className="text-[#4E24CF]">{totalCount}</span> Vibe Codes Indexed
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};