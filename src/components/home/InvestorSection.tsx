"use client";

import { useState } from "react";
import Link from "next/link";

const FILTERS = ["All", "Base", "Solana", "SaaS", "Pre-seed"];

const MINI_PRODUCTS = [
  { icon: "🔮", name: "BlindspotLab", sub: "Web3 Strategy · @mojeebeth", stage: "Bootstrapped", bg: "rgba(232,255,71,0.1)" },
  { icon: "⚡", name: "ShipKit", sub: "Dev Tools · @alexbuilds", stage: "Pre-seed", bg: "rgba(232,255,71,0.07)" },
  { icon: "🎯", name: "DaoSync", sub: "Web3 Tooling · @krypto_kai", stage: "Seed", bg: "rgba(232,255,71,0.05)" },
];

export function InvestorSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <section id="investors" className="px-6 lg:px-12 py-24" style={{ background: "var(--bg-2)" }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-20">

        {/* Text */}
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            For Investors
          </div>
          <h2 className="ap-display mb-4" style={{ fontSize: "clamp(32px, 4.5vw, 56px)", color: "var(--text-primary)" }}>
            Discover builders<br />before the round.
          </h2>
          <p className="mb-10 text-lg leading-relaxed" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: 460 }}>
            Browse curated, indexed founder profiles and live products across the vibe coder ecosystem. Filter by stack, stage, and ecosystem.
          </p>
          <Link
            href="/request"
            className="ap-btn-primary inline-flex"
            style={{ background: "var(--accent)", color: "#0a0a0a" }}
          >
            Request Investor Access →
          </Link>
        </div>

        {/* Visual panel */}
        <div className="w-full lg:max-w-md p-8 rounded-2xl"
          style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
        >
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-lg transition-all text-xs font-black uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  background: activeFilter === f ? "var(--accent)" : "transparent",
                  color: activeFilter === f ? "#0a0a0a" : "var(--text-tertiary)",
                  border: `1px solid ${activeFilter === f ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Mini cards */}
          <div className="flex flex-col gap-3">
            {MINI_PRODUCTS.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl transition-all"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: p.bg, border: "1px solid var(--border)" }}
                >
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="ap-display truncate" style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{p.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>{p.sub}</div>
                </div>
                <span className="px-2 py-1 rounded shrink-0"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  {p.stage}
                </span>
              </div>
            ))}
            <div className="text-center pt-2" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>
              + many more products
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}