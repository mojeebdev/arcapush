"use client";
import Link from "next/link";
import { buildStartupUrl, categoryToSlug } from "@/types";
import { TierBadge } from "@/components/TierBadge";
import type { StartupTier } from "@/types";

interface MostViewedStartup {
  id:          string;
  slug:        string | null;
  category:    string;
  name:        string;
  tagline:     string;
  logoUrl:     string | null;
  faviconUrl?: string | null;
  viewCount:   number;
  tier?:       StartupTier;
}

interface MostViewedProps {
  weekly:  MostViewedStartup[];
  monthly: MostViewedStartup[];
}

function ViewedCard({ startup, rank }: { startup: MostViewedStartup; rank: number }) {
  const logo    = startup.logoUrl || startup.faviconUrl;
  const initial = startup.name[0]?.toUpperCase() ?? "?";
  const url     = buildStartupUrl({ ...startup, categorySlug: categoryToSlug(startup.category) });

  return (
    <Link
      href={url}
      style={{
        display:        "flex",
        alignItems:     "center",
        gap:            "12px",
        padding:        "10px 14px",
        borderRadius:   "12px",
        background:     "var(--bg)",
        border:         "1px solid var(--border)",
        textDecoration: "none",
        transition:     "border-color 0.15s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)" as string)}
    >
      {/* Rank */}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color: rank <= 3 ? "var(--accent)" : "var(--text-tertiary)", minWidth: "16px", flexShrink: 0 }}>
        #{rank}
      </span>

      {/* Logo */}
      {logo ? (
        <img src={logo} alt={startup.name} style={{ width: "28px", height: "28px", borderRadius: "7px", objectFit: "cover", flexShrink: 0 }} onError={(e) => (e.currentTarget.style.display = "none")} />
      ) : (
        <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontSize: "11px", fontWeight: 800, color: "var(--accent)", flexShrink: 0 }}>
          {initial}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-syne)", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {startup.name}
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-tertiary)", letterSpacing: "0.06em", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {startup.tagline}
        </p>
      </div>

      {/* Badge + Views */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0 }}>
        {startup.tier && startup.tier !== "FREE" && <TierBadge tier={startup.tier} size="sm" />}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>
          {startup.viewCount.toLocaleString()} views
        </span>
      </div>
    </Link>
  );
}

export function MostViewed({ weekly, monthly }: MostViewedProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
      {/* Weekly */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>◆</span>
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-secondary)", margin: 0 }}>
            Most Viewed — This Week
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {weekly.length === 0 ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", padding: "16px" }}>No data yet.</p>
          ) : weekly.map((s, i) => <ViewedCard key={s.id} startup={s} rank={i + 1} />)}
        </div>
      </div>

      {/* Monthly */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>◆</span>
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-secondary)", margin: 0 }}>
            Most Viewed — This Month
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {monthly.length === 0 ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", padding: "16px" }}>No data yet.</p>
          ) : monthly.map((s, i) => <ViewedCard key={s.id} startup={s} rank={i + 1} />)}
        </div>
      </div>
    </div>
  );
}
