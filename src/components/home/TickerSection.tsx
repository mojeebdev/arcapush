"use client";

const TICKER_ITEMS = [
  "Google Indexed", "Backlinks Generated", "VC Discovery",
  "Next.js", "Solana", "Base Chain", "Supabase", "Vibe Coded",
  "Solo Founders", "Ship Fast", "Get Found", "Arcapush",
];

export function TickerSection() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="overflow-hidden py-4"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}
      aria-hidden="true"
    >
      <div
        className="flex gap-16 whitespace-nowrap"
        style={{ animation: "ticker 28s linear infinite" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 shrink-0"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}
          >
            <span style={{ color: "var(--accent)", fontSize: "0.5rem" }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}