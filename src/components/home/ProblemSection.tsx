"use client";

import { useEffect, useRef } from "react";

const PROBLEMS = [
  {
    num: "01",
    title: "You build in silence.",
    body: "Your product is live, your GitHub is green, but Google doesn't know you exist. No backlinks. No organic traffic. No discoverability.",
  },
  {
    num: "02",
    title: "Marketing kills momentum.",
    body: "Every hour you spend on SEO, link building, and distribution is an hour not spent building. You can't do both at full speed alone.",
  },
  {
    num: "03",
    title: "VCs can't find you.",
    body: "The investors who would back you are actively looking. But you're invisible — not because your product is weak, because your discoverability is zero.",
  },
];

export function ProblemSection() {
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
    <section ref={ref} className="px-6 lg:px-12 py-24 relative">
      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .problem-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .problem-card:hover::before { transform: scaleX(1); }
      `}</style>

      {/* Cards get a very subtle bg tint so content stays readable over the grid */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
          <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          The Reality
        </div>
        <h2 className="ap-display mb-4" style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}>
          You shipped.<br />Nobody showed up.
        </h2>
        <p className="mb-16 text-lg" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: 500 }}>
          You didn't sign up to become a marketer. But here you are.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className={`problem-card reveal ${i > 0 ? `reveal-d${i}` : ""} relative p-10 overflow-hidden`}
              style={{
                // semi-transparent so the grid behind shows through
                background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
                backdropFilter: "blur(0px)", // optional: add slight blur if grid feels too busy
              }}
            >
              <div className="ap-display mb-5 select-none" style={{ fontSize: "4rem", color: "var(--border-2)", lineHeight: 1 }}>
                {p.num}
              </div>
              <h3 className="ap-display mb-3" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}