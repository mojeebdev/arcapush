"use client";

import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative px-6 lg:px-12 py-36 text-center overflow-hidden">

      {/* Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap ap-display"
        style={{ fontSize: "clamp(80px, 18vw, 220px)", color: "rgba(232,255,71,0.03)", letterSpacing: "-0.04em", lineHeight: 1 }}
      >
        ARCAPUSH
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
          <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          Ready?
          <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
        </div>

        <h2 className="ap-display mb-5" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
          Stop being invisible.<br />Start getting found.
        </h2>
        <p className="mb-12 text-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}>
          Join 5+ vibe coders and solo founders who let Arcapush handle the discoverability work.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/submit" className="ap-btn-primary">
            List Your Product Free <span>→</span>
          </Link>
          <Link href="/pricing" className="ap-btn-ghost">
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}