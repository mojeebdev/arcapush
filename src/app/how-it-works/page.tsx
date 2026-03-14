import type { Metadata } from "next";
import Link from "next/link";
import { AdminConfig } from "@/lib/adminConfig";
import {
  HiOutlineRocketLaunch,
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineArrowUpRight,
  HiOutlineBolt,
  HiOutlineGlobeAlt,
  HiOutlineUserGroup,
  HiOutlineCpuChip,
} from "react-icons/hi2";

export const metadata: Metadata = {
  title: `How It Works · ${AdminConfig.SITE_NAME}`,
  description:
    "Learn exactly how Arcapush gets your vibe-coded product indexed by Google, discovered by VCs, and permanently documented in the registry.",
  alternates: { canonical: `${AdminConfig.SITE_URL}/how-it-works` },
  openGraph: {
    title: `How It Works · ${AdminConfig.SITE_NAME}`,
    description: "From submission to Google indexing in 48 hours.",
    url: `${AdminConfig.SITE_URL}/how-it-works`,
    images: [{ url: AdminConfig.SITE_OG_IMAGE, width: 1200, height: 630 }],
  },
};

const STEPS = [
  {
    num: "01",
    icon: <HiOutlineDocumentText className="w-7 h-7" />,
    title: "Sign In & Submit",
    body: "Sign in with Google or GitHub — no passwords. Fill out the submission form with your product name, one-line tagline, website URL, and most importantly: your problem statement. This is mandatory and is exactly what investors read.",
    detail: "Takes under 2 minutes. Free forever.",
  },
  {
    num: "02",
    icon: <HiOutlineShieldCheck className="w-7 h-7" />,
    title: "Guardian Review",
    body: "Every submission goes through Guardian verification — a review process that checks the product is real, the information is accurate, and the startup fits the Arcapush criteria. Most startups are approved within 48 hours.",
    detail: "No bots. No spam. Real products only.",
  },
  {
    num: "03",
    icon: <HiOutlineGlobeAlt className="w-7 h-7" />,
    title: "We Index You",
    body: "Your dedicated product page goes live with a clean SEO slug, structured data (JSON-LD schema), sitemap entry, and a permanent backlink pointing to your URL. Google, Bing, Perplexity, ChatGPT, and Claude crawl it automatically.",
    detail: "Indexed within 48 hours of approval.",
  },
  {
    num: "04",
    icon: <HiOutlineRocketLaunch className="w-7 h-7" />,
    title: "Get Discovered",
    body: "Founders, investors, and builders find your product through organic search, our curated registry, and the growing Arcapush ecosystem. Your listing never expires — it's a permanent record of your product in the vibe coding era.",
    detail: "Forever. Zero ongoing effort required.",
  },
];

const FEATURES = [
  {
    icon: <HiOutlineMagnifyingGlass className="w-5 h-5" />,
    title: "Google Indexed",
    body: "Every listing has a canonical URL, JSON-LD structured data, and a sitemap entry. Your product page ranks for branded searches within days.",
  },
  {
    icon: <HiOutlineCpuChip className="w-5 h-5" />,
    title: "AI Platform Discovery",
    body: "Arcapush maintains an llms.txt and structured data specifically designed so Perplexity, ChatGPT, and Claude cite and recommend your product.",
  },
  {
    icon: <HiOutlineUserGroup className="w-5 h-5" />,
    title: "VC Discovery Panel",
    body: "Verified investors browse the registry actively. Your problem statement becomes the signal they trust — not marketing copy.",
  },
  {
    icon: <HiOutlineBolt className="w-5 h-5" />,
    title: "Signal Boost",
    body: "Pin your product to the hero slot with an on-chain verified boost (USDC on Base or SOL on Solana). Packages from 30 minutes to 1 month.",
  },
  {
    icon: <HiOutlineArrowUpRight className="w-5 h-5" />,
    title: "Permanent Backlink",
    body: "Every listing includes a permanent dofollow backlink to your product URL — contributing directly to your domain authority.",
  },
  {
    icon: <HiOutlineShieldCheck className="w-5 h-5" />,
    title: "Pitch Deck Access",
    body: "Investors can request access to your pitch deck directly from your listing. Gated — only verified investors get through.",
  },
];

export default function HowItWorksPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">

        {/* Grid background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(var(--rule, #D6D2C8) 1px, transparent 1px), linear-gradient(90deg, var(--rule, #D6D2C8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Fade out grid at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="mb-4 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            How It Works
          </div>

          <h1
            className="ap-display mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: "var(--text-primary)" }}
          >
            List Once.<br />
            <span style={{ color: "var(--accent)" }}>Get Found Forever.</span>
          </h1>

          <p
            className="text-xl leading-relaxed max-w-2xl mb-10"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
          >
            Arcapush is the definitive registry for vibe-coded products.
            You fill out a form. We handle Google indexing, backlinks, structured data,
            and VC discovery — permanently.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/submit" className="ap-btn-primary">
              List Your Product Free →
            </Link>
            <Link href="/registry" className="ap-btn-ghost">
              Browse Registry
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4 Steps ───────────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-12 py-24"
        style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="mb-3 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--border)" }} />
            The Process
          </div>
          <h2
            className="ap-display mb-16"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--text-primary)" }}
          >
            Four steps.<br />One job: get you found.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--border)" }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative p-10 lg:p-14"
                style={{ background: "var(--bg-2)" }}
              >
                {/* Step number watermark */}
                <div
                  className="ap-display absolute top-8 right-10 select-none pointer-events-none"
                  style={{ fontSize: "5rem", color: "var(--border)", lineHeight: 1 }}
                >
                  {step.num}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: "var(--accent-dim)",
                    border:     "1px solid var(--accent-border)",
                    color:      "var(--accent)",
                  }}
                >
                  {step.icon}
                </div>

                {/* Step label */}
                <div
                  className="mb-3 flex items-center gap-3"
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  STEP {step.num}
                  <span className="flex-1 h-px" style={{ background: "var(--accent-border)" }} />
                </div>

                <h3
                  className="ap-display mb-4"
                  style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
                >
                  {step.body}
                </p>
                <p
                  className="ap-label"
                  style={{ color: "var(--accent)" }}
                >
                  → {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ──────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="mb-3 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--border)" }} />
            What You Get
          </div>
          <h2
            className="ap-display mb-16"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "var(--text-primary)" }}
          >
            Everything included.<br />
            <span style={{ color: "var(--accent)" }}>Free forever.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "var(--accent-dim)",
                    border:     "1px solid var(--accent-border)",
                    color:      "var(--accent)",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="ap-display mb-3"
                  style={{ fontSize: "1rem", color: "var(--text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
                >
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof bar ─────────────────────────────────────────────────────── */}
      <div
        className="px-6 lg:px-12 py-14"
        style={{ background: "var(--accent)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 flex-wrap">
          {[
            { n: "Free",  l: "Always"             },
            { n: "48h",   l: "Average Index Time"  },
            { n: "∞",     l: "Listing Never Expires"},
            { n: "1",     l: "Form. That's It."    },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-8">
              {i > 0 && (
                <div
                  className="hidden sm:block w-px h-12"
                  style={{ background: "rgba(10,10,10,0.15)" }}
                />
              )}
              <div>
                <div
                  className="ap-display"
                  style={{ fontSize: "2.5rem", color: "#0a0a0a", lineHeight: 1 }}
                >
                  {stat.n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(10,10,10,0.5)", marginTop: "0.25rem",
                  }}
                >
                  {stat.l}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-12 py-24"
        style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="mb-3 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--border)" }} />
            FAQ
          </div>
          <h2
            className="ap-display mb-12"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}
          >
            Common questions.
          </h2>

          <div className="space-y-px" style={{ background: "var(--border)" }}>
            {[
              {
                q: "Is it really free?",
                a: "Yes. A permanent indexed listing is free forever. Signal Boosts (pinning to the hero slot) are paid — from $5 for 30 minutes to $299 for a full month.",
              },
              {
                q: "What is a problem statement?",
                a: "A one-to-three sentence description of the specific problem your product solves. This is mandatory and is what VCs actually read. Marketing copy doesn't count.",
              },
              {
                q: "How long does approval take?",
                a: "Most submissions are reviewed within 48 hours. Guardian verification checks the product is real and the information is accurate.",
              },
              {
                q: "Does my listing expire?",
                a: "Never. Your Arcapush entry is a permanent record. Once approved, it stays in the registry and remains indexed indefinitely.",
              },
              {
                q: "How does the VC discovery work?",
                a: "Verified investors browse the registry directly and can request pitch deck access from your listing. Your problem statement is the signal they filter by.",
              },
              {
                q: "What blockchains do you support for boosts?",
                a: "Base (USDC via EVM) and Solana (SOL). All payments are verified on-chain before the boost activates.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-8"
                style={{ background: "var(--bg-2)" }}
              >
                <h3
                  className="ap-display mb-3"
                  style={{ fontSize: "1rem", color: "var(--text-primary)" }}
                >
                  {faq.q}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-6 lg:px-12 py-32 text-center relative overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none ap-display"
          style={{ fontSize: "clamp(60px, 14vw, 180px)", color: "rgba(91,43,255,0.04)", letterSpacing: "-0.04em", whiteSpace: "nowrap" }}
        >
          ARCAPUSH
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div
            className="mb-4 flex items-center justify-center gap-3"
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Ready?
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          </div>

          <h2
            className="ap-display mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "var(--text-primary)" }}
          >
            Stop being invisible.<br />Start getting found.
          </h2>
          <p
            className="text-lg mb-10"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
          >
            One form. Permanent indexing. Zero ongoing effort.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/submit" className="ap-btn-primary">
              List Your Product Free →
            </Link>
            <Link href="/pricing" className="ap-btn-ghost">
              View Boost Packages
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}