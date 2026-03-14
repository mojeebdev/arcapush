"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";


function useAnimatedCount(target: number, duration = 2.2) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [target]);
  return rounded;
}


const Particle = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute w-px h-px rounded-full"
    style={{ left: x, top: y, background: "var(--accent)" }}
    animate={{ opacity: [0, 0.5, 0], scale: [0, 2, 0], y: [0, -50, -100] }}
    transition={{
      duration: 3.5, delay,
      repeat: Infinity, repeatDelay: Math.random() * 4 + 2,
      ease: "easeOut",
    }}
  />
);

const PARTICLES = [
  { x: "12%", y: "72%" }, { x: "24%", y: "58%" }, { x: "36%", y: "82%" },
  { x: "50%", y: "66%" }, { x: "62%", y: "76%" }, { x: "73%", y: "62%" },
  { x: "84%", y: "74%" }, { x: "8%",  y: "47%" }, { x: "88%", y: "52%" },
  { x: "44%", y: "42%" }, { x: "66%", y: "37%" }, { x: "28%", y: "32%" },
];


export function HeroSection({ totalCount }: { totalCount: string }) {
  const numericCount  = parseInt(totalCount?.replace(/\D/g, "") || "0", 10);
  const animatedCount = useAnimatedCount(numericCount);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGridVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-14"
      style={{ background: "var(--bg)" }}
    >
      
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: gridVisible ? 0.5 : 0,
          backgroundImage:
            "linear-gradient(var(--rule, #D6D2C8) 1px, transparent 1px), linear-gradient(90deg, var(--rule, #D6D2C8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(91,43,255,0.06)", filter: "blur(100px)", animation: "drift 12s ease-in-out infinite alternate" }}
      />
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "rgba(91,43,255,0.04)", filter: "blur(80px)", animation: "drift 12s ease-in-out infinite alternate", animationDelay: "-4s" }}
      />
      <div className="absolute top-[30%] left-[-5%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "rgba(91,43,255,0.03)", filter: "blur(70px)", animation: "drift 12s ease-in-out infinite alternate", animationDelay: "-8s" }}
      />

      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <Particle key={i} x={p.x} y={p.y} delay={i * 0.4} />
        ))}
      </div>

      
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ y: "35%", opacity: 0, scale: 1.05 }}
          animate={{ y: "-5%", opacity: 0.06, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[160%] h-[160%] md:w-[110%] md:h-[110%]"
          style={{
            backgroundImage: "url('/hero-signal-bg.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(0) brightness(0.6)",
          }}
        />
      </div>

      {/* ── Fades ────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }} />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10 w-full">

        {/* Tag (HTML design) */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex mb-8"
        >
          <div className="ap-pill">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            Built for Vibe Coders &amp; Solo Founders
          </div>
        </motion.div>

        {/* H1 (HTML design structure) */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="ap-display mb-7"
          style={{ fontSize: "clamp(52px, 8vw, 100px)" }}
        >
          <span className="block" style={{ color: "var(--text-primary)" }}>Get Found.</span>
          <span className="block relative" style={{ color: "var(--accent)" }}>
            Keep Building.
            {/* underline (HTML design) */}
            <motion.span
              className="absolute block h-1 rounded-sm"
              style={{ bottom: 4, left: 0, background: "var(--accent)", opacity: 0.35 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px mb-6"
          style={{ background: "linear-gradient(to right, var(--accent-border), transparent)", transformOrigin: "left" }}
        />

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="text-lg leading-relaxed mb-3 max-w-xl"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
        >
          The curated directory that gets your product{" "}
          <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>indexed by Google</strong>,
          earns you <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>backlinks</strong>,
          and puts you in front of investors — automatically.
        </motion.p>

        {/* Tags line (old Hero.tsx) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="ap-mono mb-8"
        >
          Problem statement required · Google indexed · VC discovery tooling
        </motion.p>

        {/* CTAs (HTML design) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16"
        >
          <Link href="/submit" className="ap-btn-primary">
            List Your Product Free <span>→</span>
          </Link>
          <a href="/content/blog/how-arcapush-works" className="ap-btn-ghost">
            ↓ See how it works
          </a>
        </motion.div>

        {/* Live badge (old Hero.tsx animated count) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-12"
          style={{
            border: "1px solid var(--accent-border)",
            background: "var(--accent-dim)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "var(--accent)" }} />
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "var(--accent)" }} />
          </span>
          <span className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
          >
            Arcapush Live —{" "}
            <motion.span style={{ color: "var(--accent)" }}>{animatedCount}</motion.span>
            {" "}Products Indexed
          </span>
        </motion.div>

        {/* Stats bar (HTML design) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="flex items-center gap-8 flex-wrap pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[
            { num: totalCount, label: "Products Listed" },
            { num: "140+",    label: "Vibe Coders"     },
            { num: "40+",     label: "VCs Browsing"    },
            { num: "48h",     label: "Avg Index Time"  },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-8">
              {i > 0 && (
                <div className="w-px h-10 hidden sm:block" style={{ background: "var(--border)" }} />
              )}
              <div>
                <span className="block ap-display" style={{ fontSize: "1.75rem", color: "var(--text-primary)" }}>
                  {stat.num}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint (old Hero.tsx) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="ap-label">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className="w-px h-6"
          style={{ background: "linear-gradient(to bottom, var(--text-tertiary), transparent)" }}
        />
      </motion.div>
    </section>
  );
}