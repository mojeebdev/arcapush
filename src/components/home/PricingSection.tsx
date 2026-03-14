"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const PLANS = [
  {
    tier: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Listed in directory",
      "Indexed by Google (48h)",
      "1 backlink to your product",
      "Founder profile page",
      "Basic structured data",
    ],
    cta: "List Free →",
    href: "/submit",
    popular: false,
  },
  {
    tier: "Featured",
    price: "$29",
    period: "/ month",
    features: [
      "Everything in Free",
      "Homepage + category top placement",
      "3× backlinks (DA boost)",
      "Featured badge on profile",
      "Priority indexing (24h)",
    ],
    cta: "Get Featured →",
    href: "/pricing",
    popular: true,
  },
  {
    tier: "Pro",
    price: "$99",
    period: "/ month",
    features: [
      "Everything in Featured",
      "Verified founder profile",
      "VC discovery exposure",
      "Dedicated product spotlight",
      "Monthly backlink report",
    ],
    cta: "Go Pro →",
    href: "/pricing",
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} className="px-6 lg:px-12 py-24" style={{ background: "var(--bg-3)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
          <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          Pricing
        </div>
        <h2 className="ap-display mb-4" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
          Start free.<br />Scale your visibility.
        </h2>
        <p className="mb-16 text-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: 500 }}>
          Free listings get indexed. Featured listings get front-row placement and 3× the backlinks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`reveal ${i > 0 ? `reveal-d${i}` : ""} relative p-10 rounded-2xl transition-all`}
              style={{
                background: plan.popular ? "var(--bg)" : "var(--bg-2)",
                border: plan.popular ? "1px solid var(--accent)" : "1px solid var(--border)",
                boxShadow: plan.popular ? "0 0 0 1px var(--accent)" : "none",
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ background: "var(--accent)", color: "#0a0a0a", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.12em" }}
                >
                  MOST POPULAR
                </div>
              )}

              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>
                {plan.tier}
              </div>
              <div className="ap-display" style={{ fontSize: "3rem", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.25rem" }}>
                {plan.price}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-tertiary)", letterSpacing: "0.06em", marginBottom: "2rem" }}>
                {plan.period}
              </div>

              <ul className="flex flex-col gap-3 mb-9">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm leading-snug"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
                  >
                    <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginTop: "1px", flexShrink: 0 }}>→</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="block w-full text-center py-3.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  background: plan.popular ? "var(--accent)" : "transparent",
                  color: plan.popular ? "#0a0a0a" : "var(--text-secondary)",
                  border: plan.popular ? "1px solid var(--accent)" : "1px solid var(--border)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}