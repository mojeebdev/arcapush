"use client";

interface Props {
  totalCount: string;
  vcVisits: string;
  ecosystems: string;
}

export function ProofBar({ totalCount, vcVisits, ecosystems }: Props) {
  return (
    <div
      className="px-6 lg:px-12 py-16"
      style={{ background: "var(--accent)" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 flex-wrap">

        {[
          { n: totalCount, l: "Products Indexed"   },
          { n: ecosystems, l: "Ecosystems Covered"  },
          { n: vcVisits,   l: "VC Access Requests"  },
          { n: "48h",      l: "Average Index Time"  },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-8">
            {i > 0 && (
              <div className="hidden sm:block w-px h-14"
                style={{ background: "rgba(10,10,10,0.15)" }} />
            )}
            <div>
              <div className="ap-display" style={{ fontSize: "3rem", color: "#0a0a0a", lineHeight: 1 }}>
                {stat.n}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(10,10,10,0.5)", marginTop: "0.25rem",
              }}>
                {stat.l}
              </div>
            </div>
          </div>
        ))}

        <blockquote
          className="max-w-xs text-sm italic leading-relaxed pl-5"
          style={{
            borderLeft: "2px solid rgba(10,10,10,0.2)",
            color: "rgba(10,10,10,0.65)",
            fontFamily: "var(--font-syne)",
          }}
        >
          "Listed on a Tuesday. By Thursday, my product page was on Google. Didn't touch a thing."
          <br /><br />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            — Verified Founder
          </span>
        </blockquote>

      </div>
    </div>
  );
}