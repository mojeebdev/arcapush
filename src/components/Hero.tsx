'use client';

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  totalCount: string;
}

export const Hero = ({ totalCount }: HeroProps) => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden min-h-[90vh] flex flex-col justify-start bg-black">
      
      
      <motion.div
        initial={{ y: "20%", opacity: 0 }}
        animate={{ y: "-20%", opacity: 0.8 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/hero-signal-bg.jpg')",
          backgroundSize: "150% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-16 md:mb-24 pt-12 flex flex-col items-center"
        >
          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 md:mb-10 leading-[0.9] md:leading-[0.85] uppercase text-white">
            Vibes for <br />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-[#4E24CF] bg-clip-text text-transparent">Developers</span>
          </h1>
          
          {/* Paragraph */}
          <div className="max-w-3xl mx-auto mb-10 md:mb-12">
            <p className="text-xl md:text-3xl text-zinc-100 font-serif italic leading-relaxed px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              VibeStream is the premier destination for high-signal engineering and visionary capital.
            </p>
          </div>

          <p className="text-zinc-400 text-[10px] md:text-xs max-w-xl mx-auto font-bold uppercase tracking-[0.4em] mb-12 opacity-80">
            A CRYPTO-POWERED STARTUP DISCOVERY HUB. <br />
            PREMIUM ACCESS. CURATED FOUNDERS.
          </p>
          
         
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
              <Link 
                href="/submit" 
                className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all duration-500 shadow-2xl text-center"
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

            
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#D4AF37]/20 bg-black/40 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/90 uppercase">
                VibeStream Live — <span className="text-[#D4AF37]">{totalCount}</span> Initialized
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};