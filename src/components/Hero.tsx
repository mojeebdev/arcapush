'use client';

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Animated counter hook
function useAnimatedCount(target: number, duration = 2.2) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [target]);
  return rounded;
}

// Floating particle
const Particle = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute w-px h-px rounded-full bg-[#4E24CF]"
    style={{ left: x, top: y }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 2.5, 0],
      y: [0, -60, -120],
    }}
    transition={{
      duration: 3.5,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 4 + 2,
      ease: "easeOut",
    }}
  />
);

const PARTICLES = [
  { x: "15%", y: "70%" }, { x: "25%", y: "55%" }, { x: "38%", y: "80%" },
  { x: "52%", y: "65%" }, { x: "63%", y: "75%" }, { x: "74%", y: "60%" },
  { x: "85%", y: "72%" }, { x: "10%", y: "45%" }, { x: "90%", y: "50%" },
  { x: "45%", y: "40%" }, { x: "68%", y: "35%" }, { x: "30%", y: "30%" },
];

export const Hero = ({ totalCount }: { totalCount: string }) => {
  const numericCount = parseInt(totalCount?.replace(/\D/g, "") || "0", 10);
  const animatedCount = useAnimatedCount(numericCount);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGridVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-black pt-20">

      {/* === GRID OVERLAY === */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: gridVisible ? 0.04 : 0,
          backgroundImage: `
            linear-gradient(rgba(78,36,207,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(78,36,207,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* === RADIAL GLOW — purple center === */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(78,36,207,0.18) 0%, transparent 70%)",
        }}
      />

      {/* === SECONDARY GLOW — gold hint bottom === */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* === TOP GRADIENT FADE from navbar === */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-0 pointer-events-none" />

      {/* === BOTTOM FADE === */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />

      {/* === PARTICLES === */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <Particle key={i} x={p.x} y={p.y} delay={i * 0.4} />
        ))}
      </div>

      {/* === HERO BG IMAGE === */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ y: "35%", opacity: 0, scale: 1.05 }}
          animate={{ y: "-5%", opacity: 0.45, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[160%] h-[160%] md:w-[110%] md:h-[110%]"
          style={{
            backgroundImage: "url('/hero-signal-bg.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(0.6) brightness(0.7)",
          }}
        />
      </div>

      {/* === CONTENT === */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-center">

        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#4E24CF]/35 bg-[#4E24CF]/8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4E24CF] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-[#4E24CF]/90">
              Vibe Coding Encyclopedia · VC Discovery
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2rem,6vw,5rem)] font-black tracking-tighter leading-[0.9] uppercase mb-6"
        >
          <span className="block text-white">Where the Next</span>
          <span className="block bg-gradient-to-r from-white via-zinc-200 to-[#7B4FE8] bg-clip-text text-transparent">
            Unicorn Gets
          </span>
          <span className="block" style={{ color: "#D4AF37" }}>
            Discovered.
          </span>
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-px bg-gradient-to-r from-transparent via-[#4E24CF]/60 to-transparent mx-auto mb-8"
          style={{ transformOrigin: "center" }}
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="text-base md:text-lg max-w-2xl mx-auto text-zinc-400 leading-relaxed mb-3 font-light"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          The definitive encyclopedia for VC-backed Vibe Coders.{" "}
          <em>Building is hard. Marketing too.</em>{" "}
          <span className="text-white font-semibold not-italic">You don't have to do both.</span>
        </motion.p>

        {/* Tags row */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-zinc-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.45em] mb-8"
        >
          On-chain verified &nbsp;·&nbsp; Curated founders &nbsp;·&nbsp; VC discovery tooling
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            {/* Primary */}
            <Link
              href="/registry"
              className="relative group w-full md:w-auto overflow-hidden bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 hover:shadow-[0_0_40px_rgba(78,36,207,0.4)] active:scale-95 text-center"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Explore Registry →
              </span>
              <span className="absolute inset-0 bg-[#4E24CF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl" />
            </Link>

            {/* Secondary */}
            <Link
              href="/submit"
              className="w-full md:w-auto text-zinc-400 font-bold hover:text-white transition-colors tracking-[0.3em] uppercase text-[10px] px-10 py-4 border border-white/10 hover:border-white/25 rounded-2xl bg-white/3 backdrop-blur-md text-center"
            >
              Submit Your Startup
            </Link>
          </div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#D4AF37]/20 bg-black/60 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/80 uppercase">
              VibeStream Live —{" "}
              <motion.span className="text-[#D4AF37]">{animatedCount}</motion.span>
              {" "}Vibe Codes Indexed
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-px h-6 bg-gradient-to-b from-zinc-700 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};