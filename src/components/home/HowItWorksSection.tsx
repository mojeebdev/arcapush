"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    num: "STEP 01",
    icon: "📝",
    title: "List Your Product",
    body: "Add your product name, URL, one-line description, and tech stack. Takes under 2 minutes.",
  },
  {
    num: "STEP 02",
    icon: "🔍",
    title: "We Index You",
    body: "Your dedicated product page goes live with structured data (JSON-LD), sitemap entry, and a backlink. Google crawls within 48 hours.",
  },
  {
    num: "STEP 03",
    icon: "🚀",
    title: "Get Discovered",
    body: "Founders, investors, and builders find your product through organic search, our curated directory, and the growing Arcapush ecosystem.",
  },
];

export function HowItWorksSection() {
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
    <section id="how" ref={ref} className="px-6 lg:px-12 py-24" style={{ background: "var(--bg-3)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
          <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          How It Works
        </div>
        <h2 className="ap-display mb-4" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
          Three steps.<br />One job: get you found.
        </h2>
        <p className="mb-16 text-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: 500 }}>
          You fill out a form. We do the rest.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`reveal ${i > 0 ? `reveal-d${i}` : ""} relative p-10 rounded-2xl transition-all`}
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {/* Step number */}
              <div className="flex items-center gap-3 mb-6"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}
              >
                {step.num}
                <span className="flex-1 h-px" style={{ background: "var(--accent-border)" }} />
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
              >
                {step.icon}
              </div>

              <h3 className="ap-display mb-3" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {step.body}
              </p>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 z-10 -translate-y-1/2"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", color: "var(--border-2)" }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}