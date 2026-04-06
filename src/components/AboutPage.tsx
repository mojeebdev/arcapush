"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineLink,
  HiOutlineRocketLaunch,
  HiOutlineSpeakerWave,
  HiOutlineCommandLine,
  HiOutlineBookOpen,
} from "react-icons/hi2";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.45 },
});

export default function AboutPage() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto relative z-10">

      {/* ── Hero ── */}
      <section className="mb-24">
        <motion.div {...fadeUp} className="space-y-6">
          <p className="ap-label">The Origin Story</p>
          <h1
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]"
            style={{ color: "var(--text-primary)" }}
          >
            From a Keyboard in Fiditi{" "}
            <br className="hidden md:block" />
            to the{" "}
            <span style={{ color: "var(--accent)" }}>Registry.</span>
          </h1>
          <p className="text-xl leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
            It started with a school excursion in 2004 — a kid from Iware, Nigeria, 
            touching a keyboard for the first time and getting completely hooked. 
            Two decades later, that same instinct to build became Arcapush: 
            the home of every vibe-coded product the world almost never found.
          </p>
        </motion.div>
      </section>

      {/* ── Origin Story ── */}
      <section className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
        >
          <div className="space-y-5">
            <p className="ap-label">Where It Began</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Mojeeb grew up in Iware, a small community in Nigeria. His first encounter 
              with a computer came around 2004 — a school excursion to the neighbouring 
              town of Fiditi. He touched a keyboard. He was hooked.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              By 2008, he had regular computer access for the first time and taught himself 
              PowerPoint. He was the kid everyone called a <em style={{ color: "var(--text-primary)" }}>"hacker"</em> — 
              not because he was breaking into anything, but because the gap between what 
              he knew and what his peers knew was just that wide. He was one of the first 
              teenagers in his community on Facebook.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              By 2014, he was building on wapka.mobi — copying source code, injecting 
              JavaScript for time animations and visitor counters, learning by doing. 
              WordPress blogs. Udemy courses half-finished. A self-taught mentality 
              that never left.
            </p>
          </div>

          <div className="space-y-5">
            <p className="ap-label">16 Years in the Making</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Mojeeb graduated from the University of Ilorin with a B.A. in History 
              (Education). Not Computer Science. Not Engineering. <strong style={{ color: "var(--text-primary)" }}>History.</strong>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              That degree shaped everything. History is documentation — the organized 
              record of what happened, who built what, why it mattered, and what came next. 
              Most tech directories are noise. They capture the moment, not the meaning.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              12+ years in Web2 marketing. 4+ years deep in Web3 strategy. 500+ skit 
              videos before pivoting to Web3 full-time in 2021. He spearheaded the 
              <strong style={{ color: "var(--text-primary)" }}> TAIKU NFT</strong> launch — 
              9,000+ followers in three days. Built communities from Anblabs to Echelon HQ 
              to what is now <strong style={{ color: "var(--text-primary)" }}>BlindspotLab</strong>.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Arcapush is not his first product. Before it: <em style={{ color: "var(--text-primary)" }}>whate.online</em>, 
              <em style={{ color: "var(--text-primary)" }}> dearly.icu</em>, 
              <em style={{ color: "var(--text-primary)" }}> trench.mojeeb.xyz</em>, 
              and 14+ others shipped solo. Each born from a real frustration. 
              Arcapush is no different.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── The Gap ── */}
      <section
        className="mb-24 p-12 rounded-[2.5rem]"
        style={{
          background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
          border: "1px solid var(--accent-border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 max-w-3xl"
        >
          <p className="ap-label">The Gap Nobody Was Filling</p>
          <p
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Products Were Being Built.{" "}
            <span style={{ color: "var(--accent)" }}>Then Quietly Disappearing.</span>
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            In late 2024, vibe coding exploded. AI-assisted development tools meant more 
            people than ever — with or without engineering backgrounds — were shipping real 
            products. Founders went from idea to MVP in days. A new kind of builder emerged: 
            the <strong style={{ color: "var(--text-primary)" }}>vibe coder</strong>.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            But there was no central, curated place documenting what was being built. 
            No encyclopedia of the stacks being used, the tools being picked, the patterns 
            emerging. Directories existed. Launch platforms existed. None of them treated 
            vibe-coded products with the depth, credibility, and discoverability they 
            deserved. Nobody was documenting the culture.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
            That gap is where Arcapush was born.
          </p>
        </motion.div>
      </section>

      {/* ── Mission + Vision ── */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-px mb-24 rounded-[3rem] overflow-hidden shadow-2xl"
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
            the problem statement that proves a product solves something real. Every listing 
            requires one. This gives VCs investor-grade signal, not noise.
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
            To become the definitive index for every vibe-coded product — the place VCs 
            check first and founders trust to make them discoverable. Where the next wave 
            of unicorns get their first serious audience before the press picks them up.
          </p>
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          {
            icon: <HiOutlineSparkles className="w-8 h-8" />,
            title: "Visibility",
            body: "Bringing recognition to products that are building the future but aren't marketing enough. Solo founders list once — Arcapush creates an indexed page, adds structured data, and pushes it into the feed of VCs actively looking.",
          },
          {
            icon: <HiOutlineLink className="w-8 h-8" />,
            title: "The Bridge",
            body: "Serving as the vital connection point between institutional capital and the AI-native founders who are building the next decade of software — before the mainstream catches on.",
          },
          {
            icon: <HiOutlineMagnifyingGlass className="w-8 h-8" />,
            title: "The Registry",
            body: "Not a directory. An encyclopedia. A living, structured reference for vibe-coded products — capturing the stacks, founder stories, funding context, and cultural moment that made this era possible.",
          },
        ].map((pillar, i) => (
          <motion.div
            key={i}
            {...stagger(i)}
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

      {/* ── The Stack ── */}
      <section className="mb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="ap-label">How It Was Built</p>
          <p
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter"
            style={{ color: "var(--text-primary)" }}
          >
            Brainstormed with{" "}
            <span style={{ color: "var(--accent)" }}>Gemini.</span>{" "}
            Prompted into Existence with{" "}
            <span style={{ color: "var(--accent)" }}>Claude.</span>
          </p>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "var(--text-secondary)" }}>
            Arcapush was built solo — because credits run out and builders keep going anyway. 
            The vision came from 16 years of watching products fail not because they were bad, 
            but because nobody could find them.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Next.js App Router",
              "TypeScript",
              "Tailwind CSS",
              "Prisma 7",
              "Supabase",
              "wagmi / viem",
              "Base Mainnet",
              "Vercel",
            ].map((tech, i) => (
              <motion.div
                key={i}
                {...stagger(i)}
                className="px-4 py-3 rounded-xl flex items-center gap-2"
                style={{
                  background: "color-mix(in srgb, var(--bg-3) 80%, transparent)",
                  border: "1px solid var(--border)",
                }}
              >
                <HiOutlineCommandLine className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  {tech}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Why a Historian ── */}
      <section
        className="mb-24 p-12 rounded-[2.5rem]"
        style={{
          background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
          border: "1px solid var(--border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
            >
              <HiOutlineBookOpen className="w-5 h-5" style={{ color: "var(--accent)" }} />
            </div>
            <p className="ap-label">Why a Historian Built This</p>
          </div>
          <p
            className="text-2xl md:text-3xl font-black uppercase tracking-tighter"
            style={{ color: "var(--text-primary)" }}
          >
            We're Not Just Listing Products.{" "}
            <span style={{ color: "var(--accent)" }}>We're Archiving a Movement.</span>
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            History is documentation. It's the organized record of what happened, who built 
            what, why it mattered, and what came next. Most tech directories are noise — 
            they capture the moment, not the meaning.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Arcapush is built to capture the meaning. The stacks. The founder stories. 
            The funding context. The cultural moment that made vibe coding possible in the 
            first place. The products being built right now will define the next decade of 
            software — and we're making sure they're found.
          </p>
        </motion.div>
      </section>

      {/* ── Founder ── */}
      <section
        className="p-12 rounded-[2.5rem]"
        style={{
          background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
          border: "1px solid var(--border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="ap-label mb-4">The Founder</p>
          <p className="text-2xl font-black uppercase tracking-tighter mb-2" style={{ color: "var(--text-primary)" }}>
            Built by <span style={{ color: "var(--accent)" }}>Mojeeb</span>
          </p>
          <p className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: "var(--text-tertiary)" }}>
            Lagos, Nigeria · BlindspotLab · @mojeebeth
          </p>
          <p className="text-sm leading-relaxed max-w-2xl mb-4" style={{ color: "var(--text-secondary)" }}>
            Web3 strategist. Vibe coder. Solo founder. B.A. History (Education), 
            University of Ilorin. 16 years of combined Web2 and Web3 experience. 
            14+ products shipped solo under BlindspotLab — an AI-powered auditing, 
            marketing, and strategy intelligence studio based in Lagos, Nigeria.
          </p>
          <p className="text-sm leading-relaxed max-w-2xl mb-8" style={{ color: "var(--text-secondary)" }}>
            Building in public. Streaming the process. Documenting the culture. 
            Arcapush is the product that ties it all together.
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
            <a href="/blog/why-i-built-arcapush" className="ap-btn-ghost" style={{ padding: "0.6rem 1.5rem" }}>
              Read the Full Story →
            </a>
          </div>
        </motion.div>
      </section>

    </main>
  );
}