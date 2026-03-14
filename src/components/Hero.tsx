"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

function useAnimatedCount(target: number, duration = 2.2) {
  const count = useMotionValue(0);
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
    animate={{ opacity: [0, 0.6, 0], scale: [0, 2, 0], y: [0, -50, -100] }}
    transition={{
      duration: 3.5, delay, repeat: Infinity,
      repeatDelay: Math.random() * 4 + 2, ease: "easeOut",
    }}
  />
);

const PARTICLES = [
  { x: "12%", y: "72%" }, { x: "24%", y: "58%" }, { x: "36%", y: "82%" },
  { x: "50%", y: "66%" }, { x: "62%", y: "76%" }, { x: "73%", y: "62%" },
  { x: "84%", y: "74%" }, { x: "8%",  y: "47%" }, { x: "88%", y: "52%" },
  { x: "44%", y: "42%" }, { x: "66%", y: "37%" }, { x: "28%", y: "32%" },
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
    <section
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20"
      style={{ background: "var(--bg)" }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: gridVisible ? 0.03 : 0,
          backgroundImage: `
            linear-gradient(rgba(232,255,71,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,255,71,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,255,71,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <Particle key={i} x={p.x} y={p.y} delay={i * 0.4} />
        ))}
      </div>

      {/* Hero BG image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ y: "35%", opacity: 0, scale: 1.05 }}
          animate={{ y: "-5%", opacity: 0.3, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[160%] h-[160%] md:w-[110%] md:h-[110%]"
          style={{
            backgroundImage: "url('/hero-signal-bg.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(0) brightness(0.4)",
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="ap-pill">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            Vibe Coding Registry · VC Discovery
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-black uppercase tracking-tighter leading-[0.92] mb-5"
          style={{ fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)" }}
        >
          <span className="block" style={{ color: "var(--text-primary)" }}>List Once.</span>
          <span className="block" style={{ color: "var(--text-secondary)" }}>Google Indexes It.</span>
          <span className="block" style={{ color: "var(--accent)" }}>VCs Find You.</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-px mx-auto mb-5"
          style={{
            background: "linear-gradient(to right, transparent, var(--accent-border), transparent)",
            transformOrigin: "center",
          }}
        />

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-3"
          style={{ color: "var(--text-secondary)", fontFamily: "Georgia, serif" }}
        >
          The registry for vibe-coded products. Every listing needs a problem statement —
          not just marketing copy.{" "}
          <span style={{ color: "var(--text-primary)" }} className="font-semibold not-italic">
            That's the signal VCs actually want.
          </span>
        </motion.p>

        {/* Tags */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="ap-mono mb-8"
        >
          Problem statement required · Google indexed · VC discovery tooling
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            <Link href="/submit" className="ap-btn-primary w-full md:w-auto text-center">
              List Your Product →
            </Link>
            <Link href="/registry" className="ap-btn-ghost w-full md:w-auto text-center">
              Browse Registry
            </Link>
          </div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
            style={{
              border: "1px solid var(--accent-border)",
              background: "rgba(232,255,71,0.03)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--accent)" }}
              />
            </span>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: "rgba(240,237,232,0.7)" }}>
              Arcapush Live —{" "}
              <motion.span style={{ color: "var(--accent)" }}>{animatedCount}</motion.span>
              {" "}Products Indexed
            </span>
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll hint */}
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
};