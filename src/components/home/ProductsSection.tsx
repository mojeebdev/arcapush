"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

interface Startup {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  logoUrl?: string | null;
  category?: string | null;
  website?: string | null;
  twitter?: string | null;
  tier: string;
  viewCount: number;
  createdAt: Date;
}

interface Props {
  startups: Startup[];
}

const STACK_COLORS: Record<string, string> = {
  "Next.js": "#0a0a0a",
  "Supabase": "#3ecf8e",
  "Web3": "#6366f1",
  "Solana": "#9945ff",
  "Base": "#0052ff",
};

export function ProductsSection({ startups }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displayStartups = startups.slice(0, 5);

  return (
    <section id="products" ref={ref} className="px-6 lg:px-12 py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
          <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          Featured Products
        </div>
        <h2 className="ap-display mb-4" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
          What gets built,<br />gets found here.
        </h2>
        <p className="mb-16 text-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: 520 }}>
          A few of the products our community is building. Want yours here? List for free — or upgrade to be featured.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {displayStartups.map((startup, i) => (
            <Link
              key={startup.id}
              href={`/startup/${startup.slug}`}
              className={`reveal ${i > 0 && i < 4 ? `reveal-d${Math.min(i, 2)}` : ""} block p-7 rounded-2xl transition-all group`}
              style={{
                background: "var(--bg-2)",
                border: startup.tier === "PINNED" ? "1px solid var(--accent-border)" : "1px solid var(--border)",
                position: "relative",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = startup.tier === "PINNED" ? "var(--accent-border)" : "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {startup.tier === "PINNED" && (
                <div className="absolute top-0 right-4 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-b-lg"
                  style={{ background: "var(--accent)", color: "#0a0a0a", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em" }}
                >
                  ⭐ Featured
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl overflow-hidden"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)", flexShrink: 0 }}
                >
                  {startup.logoUrl
                    ? <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover rounded-xl" />
                    : startup.name[0]
                  }
                </div>
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.08em",
                    background: "var(--accent-dim)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                  }}
                >
                  Live
                </span>
              </div>

              <div className="ap-display mb-1" style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {startup.name}
              </div>
              <p className="mb-5 leading-relaxed" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {startup.tagline}
              </p>

              {startup.category && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className="px-2 py-1 rounded"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      background: "var(--accent-dim)",
                      border: "1px solid var(--accent-border)",
                      color: "var(--accent)",
                    }}
                  >
                    {startup.category}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                {startup.twitter && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)" }}>
                    @{startup.twitter.replace("@", "")}
                  </span>
                )}
                <span className="flex items-center gap-1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.06em" }}>
                  ✓ Google Indexed
                </span>
              </div>
            </Link>
          ))}

          {/* CTA card */}
          <Link
            href="/submit"
            className="reveal reveal-d2 flex flex-col items-center justify-center text-center p-7 rounded-2xl transition-all"
            style={{
              background: "var(--accent-dim)",
              border: "1px dashed var(--accent-border)",
              minHeight: 260,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(232,255,71,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)"; }}
          >
            <div className="text-4xl mb-4" style={{ color: "var(--accent)" }}>＋</div>
            <div className="ap-display mb-2" style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>Your product here</div>
            <p className="mb-5" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              List for free and get indexed by Google in 48 hours.
            </p>
            <span className="ap-btn-primary" style={{ fontSize: "0.7rem", padding: "0.65rem 1.5rem" }}>
              List Free →
            </span>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/registry" className="ap-btn-ghost">
            Browse All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}