"use client";

import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineLink,
  HiOutlineRocketLaunch,
  HiOutlineSpeakerWave,
} from "react-icons/hi2";

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto relative z-10">

      {/* Hero */}
      <section className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <p className="ap-label">The Origin Story</p>
          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]"
            style={{ color: "var(--text-primary)" }}
          >
            From a Spark on X to the{" "}
            <span style={{ color: "var(--accent)" }}>Registry.</span>
          </h1>
          <p className="text-xl leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
            It started with a realization: the art of marketing is becoming as essential as the art of code.
            Arcapush was built to ensure no{" "}
            <span style={{ color: "var(--text-primary)" }} className="italic">"vibe-coded product"</span>
            {" "}remains invisible.
          </p>
        </motion.div>
      </section>

      {/* Mission + Vision */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-px mb-32 rounded-[3rem] overflow-hidden shadow-2xl"
        style={{ background: "var(--border)" }}
      >
        <div
          className="p-12 flex flex-col justify-between group"
          style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
        >
          <div className="space-y-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
            >
              <HiOutlineRocketLaunch className="w-6 h-6" style={{ color: "var(--accent)" }} />
            </div>
            <p className="ap-label">Our Mission</p>
            <p className="text-3xl font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>
              One Product <br />
              <span className="group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-secondary)" }}>
                At A Time.
              </span>
            </p>
          </div>
          <p className="mt-8 text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Methodically indexing and amplifying the most important signal in the ecosystem —
            the problem statement that proves a product solves something real.
          </p>
        </div>

        <div
          className="p-12 flex flex-col justify-between group"
          style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
        >
          <div className="space-y-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
            >
              <HiOutlineSpeakerWave className="w-6 h-6" style={{ color: "var(--accent)" }} />
            </div>
            <p className="ap-label">Our Vision</p>
            <p className="text-3xl font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>
              The Default<br />
              <span className="group-hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-secondary)" }}>
                Vibe Registry.
              </span>
            </p>
          </div>
          <p className="mt-8 text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            To become the definitive index for every vibe-coded product — the place
            VCs check first and founders trust to make them discoverable.
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          {
            icon: <HiOutlineSparkles className="w-8 h-8" />,
            title: "Visibility",
            body: "Bringing recognition to products that are building the future but aren't marketing enough.",
          },
          {
            icon: <HiOutlineLink className="w-8 h-8" />,
            title: "The Bridge",
            body: "Serving as the vital connection point between institutional VCs and innovative solo founders.",
          },
          {
            icon: <HiOutlineMagnifyingGlass className="w-8 h-8" />,
            title: "Registry",
            body: "The definitive directory of vibe-coded products. Search for any problem, find the right solution.",
          },
        ].map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2rem] space-y-4 transition-all group"
            style={{
              background: "color-mix(in srgb, var(--bg-3) 80%, transparent)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          >
            <div style={{ color: "var(--accent)" }} className="group-hover:scale-110 transition-transform inline-block">
              {pillar.icon}
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>
              {pillar.title}
            </h3>
            <p className="text-xs uppercase leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              {pillar.body}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Founder note */}
      <section
        className="p-12 rounded-[2.5rem]"
        style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
      >
        <p className="ap-label mb-4">The Founder</p>
        <p className="text-2xl font-black uppercase tracking-tighter mb-6" style={{ color: "var(--text-primary)" }}>
          Built by <span style={{ color: "var(--accent)" }}>Mojeeb</span>
        </p>
        <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: "var(--text-secondary)" }}>
          Web3 strategist, vibe coder, solo founder. Building in public.
          Arcapush is a BlindspotLab product.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="https://mojeeb.xyz" target="_blank" rel="noopener noreferrer" className="ap-btn-ghost" style={{ padding: "0.6rem 1.5rem" }}>
            mojeeb.xyz
          </a>
          <a href="https://twitter.com/mojeebeth" target="_blank" rel="noopener noreferrer" className="ap-btn-ghost" style={{ padding: "0.6rem 1.5rem" }}>
            @mojeebeth
          </a>
          <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer" className="ap-btn-ghost" style={{ padding: "0.6rem 1.5rem" }}>
            BlindspotLab
          </a>
        </div>
      </section>

    </main>
  );
}