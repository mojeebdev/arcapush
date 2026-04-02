"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PaymentModal } from "@/components/PaymentModal";
import { TierBadge }    from "@/components/TierBadge";
import { buildStartupUrl, categoryToSlug } from "@/types";
import type { StartupTier } from "@/types";
import {
  HiOutlinePlus,
  HiOutlineArrowUpRight,
  HiOutlineFire,
  HiOutlineEye,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineShare,
} from "react-icons/hi2";

interface DashboardStartup {
  id:          string;
  slug:        string | null;
  name:        string;
  tagline:     string;
  category:    string;
  logoUrl:     string | null;
  faviconUrl:  string | null;
  website:     string | null;
  tier:        StartupTier;
  approved:    boolean;
  viewCount:   number;
  pinnedUntil: string | Date | null;
  pinnedAt:    string | Date | null;
  createdAt:   string | Date;
  reviewCount: number;
  avgRating:   number | null;
}

interface FounderDashboardProps {
  user: {
    id:    string;
    name:  string;
    email: string;
    image: string | null;
  };
}

function timeLeft(until: string | Date | null): string {
  if (!until) return "";
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

function StatusPill({ approved }: { approved: boolean }) {
  return (
    <span style={{
      display:       "inline-flex",
      alignItems:    "center",
      gap:           "5px",
      fontFamily:    "var(--font-mono)",
      fontSize:      "0.55rem",
      fontWeight:    600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding:       "3px 9px",
      borderRadius:  "20px",
      background:    approved ? "rgba(16,185,129,0.08)" : "rgba(217,119,6,0.08)",
      color:         approved ? "#059669"               : "#d97706",
      border:        `1px solid ${approved ? "rgba(16,185,129,0.2)" : "rgba(217,119,6,0.2)"}`,
    }}>
      {approved
        ? <><HiOutlineCheckCircle style={{ width: "10px", height: "10px" }} /> Live</>
        : <><HiOutlineClock       style={{ width: "10px", height: "10px" }} /> Pending</>
      }
    </span>
  );
}

export function FounderDashboard({ user }: FounderDashboardProps) {
  const [startups, setStartups]         = useState<DashboardStartup[]>([]);
  const [loading, setLoading]           = useState(true);
  const [boostTarget, setBoostTarget]   = useState<DashboardStartup | null>(null);
  const [copied, setCopied]             = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setStartups(d.startups ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = (startup: DashboardStartup) => {
    const url = `https://arcapush.com${buildStartupUrl({ ...startup, categorySlug: categoryToSlug(startup.category) })}`;
    navigator.clipboard.writeText(url);
    setCopied(startup.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalViews   = startups.reduce((sum, s) => sum + s.viewCount, 0);
  const totalReviews = startups.reduce((sum, s) => sum + s.reviewCount, 0);
  const liveCount    = startups.filter((s) => s.approved).length;

  // ── Shared styles ────────────────────────────────────────────────────────────
  const mono = (size = "0.6rem") => ({
    fontFamily:    "var(--font-mono)",
    fontSize:      size,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  });

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 sm:px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
          <div>
            <p style={{ ...mono(), color: "var(--accent)", marginBottom: "6px" }}>
              <span style={{ display: "inline-block", width: "16px", height: "1px", background: "var(--accent)", verticalAlign: "middle", marginRight: "8px" }} />
              Founder Dashboard
            </p>
            <h1 className="ap-display" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", marginBottom: "4px" }}>
              Hey, {user.name.split(" ")[0]}
            </h1>
            <p style={{ ...mono("0.55rem"), color: "var(--text-tertiary)" }}>{user.email}</p>
          </div>
          <Link href="/submit" className="ap-btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
            <HiOutlinePlus className="w-4 h-4" /> List a Product
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "40px" }}>
          {[
            { label: "Products",     value: startups.length, icon: <HiOutlineFire style={{ width: "16px", height: "16px", color: "var(--accent)" }} /> },
            { label: "Total views",  value: totalViews.toLocaleString(), icon: <HiOutlineEye style={{ width: "16px", height: "16px", color: "var(--accent)" }} /> },
            { label: "Reviews",      value: totalReviews, icon: <HiOutlineStar style={{ width: "16px", height: "16px", color: "var(--accent)" }} /> },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                {stat.icon}
                <span style={{ ...mono("0.55rem"), color: "var(--text-tertiary)" }}>{stat.label}</span>
              </div>
              <p className="ap-display" style={{ fontSize: "1.75rem", color: "var(--text-primary)", lineHeight: 1 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Products list */}
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ ...mono("0.6rem"), color: "var(--text-secondary)" }}>
            Your products ({startups.length})
          </p>
          {liveCount > 0 && (
            <span style={{ ...mono("0.55rem"), color: "#059669" }}>
              {liveCount} live
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px", height: "100px", opacity: 0.5 }} />
            ))}
          </div>
        ) : startups.length === 0 ? (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "48px 24px", textAlign: "center" }}>
            <HiOutlineFire style={{ width: "32px", height: "32px", color: "var(--accent)", margin: "0 auto 16px" }} />
            <p className="ap-display" style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No products yet</p>
            <p style={{ ...mono("0.6rem"), color: "var(--text-tertiary)", marginBottom: "20px" }}>List your first product and get indexed</p>
            <Link href="/submit" className="ap-btn-primary">List a product →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {startups.map((startup) => {
              const logo      = startup.logoUrl || startup.faviconUrl;
              const initial   = startup.name[0]?.toUpperCase() ?? "?";
              const url       = buildStartupUrl({ ...startup, categorySlug: categoryToSlug(startup.category) });
              const isPaid    = startup.tier !== "FREE";
              const isActive  = isPaid && startup.pinnedUntil && new Date(startup.pinnedUntil) > new Date();
              const expiry    = timeLeft(startup.pinnedUntil);

              return (
                <div key={startup.id} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>

                  {/* Logo */}
                  {logo ? (
                    <img src={logo} alt={startup.name} style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover", flexShrink: 0, border: "1px solid var(--border)" }}
                      onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontSize: "16px", fontWeight: 800, color: "var(--accent)", flexShrink: 0 }}>
                      {initial}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span style={{ fontFamily: "var(--font-syne)", fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                        {startup.name}
                      </span>
                      <StatusPill approved={startup.approved} />
                      {startup.tier !== "FREE" && <TierBadge tier={startup.tier} size="sm" />}
                    </div>
                    <p style={{ ...mono("0.55rem"), color: "var(--text-tertiary)", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {startup.tagline}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ ...mono("0.55rem"), color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <HiOutlineEye style={{ width: "10px", height: "10px" }} />
                        {startup.viewCount.toLocaleString()} views
                      </span>
                      {startup.reviewCount > 0 && (
                        <span style={{ ...mono("0.55rem"), color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <HiOutlineStar style={{ width: "10px", height: "10px" }} />
                          {startup.reviewCount} reviews
                          {startup.avgRating && ` · ${startup.avgRating}★`}
                        </span>
                      )}
                      {isActive && expiry && (
                        <span style={{ ...mono("0.55rem"), color: "#d97706", display: "flex", alignItems: "center", gap: "4px" }}>
                          <HiOutlineClock style={{ width: "10px", height: "10px" }} />
                          {expiry}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    {/* Share */}
                    <button onClick={() => handleShare(startup)}
                      title="Copy link"
                      style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: copied === startup.id ? "#059669" : "var(--text-tertiary)", transition: "all 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}>
                      <HiOutlineShare style={{ width: "14px", height: "14px" }} />
                    </button>

                    {/* View */}
                    {startup.approved && (
                      <Link href={url} target="_blank"
                        style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", textDecoration: "none", transition: "all 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}>
                        <HiOutlineArrowUpRight style={{ width: "14px", height: "14px" }} />
                      </Link>
                    )}

                    {/* Boost */}
                    {startup.approved && (
                      <button onClick={() => setBoostTarget(startup)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: isActive ? "var(--bg-3)" : "var(--accent)", border: isActive ? "1px solid var(--border)" : "1px solid var(--accent)", color: isActive ? "var(--text-secondary)" : "#fff", cursor: "pointer", ...mono("0.6rem"), fontWeight: 700, transition: "all 0.15s" }}
                        onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                        <HiOutlineFire style={{ width: "12px", height: "12px" }} />
                        {isActive ? "Boosted" : "Boost"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick links */}
        <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { href: "/registry",  label: "Browse Registry" },
            { href: "/pricing",   label: "View Plans"      },
            { href: "/blog",      label: "Blog"            },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              style={{ ...mono("0.6rem"), color: "var(--text-tertiary)", padding: "8px 16px", borderRadius: "20px", border: "1px solid var(--border)", background: "var(--bg-2)", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
              {link.label} →
            </Link>
          ))}
        </div>

      </div>

      {/* Boost modal */}
      {boostTarget && (
        <PaymentModal
          startupId={boostTarget.id}
          status="APPROVED"
          onClose={() => setBoostTarget(null)}
          onSuccess={() => {
            setBoostTarget(null);
            // Refresh startups
            fetch("/api/dashboard").then((r) => r.json()).then((d) => setStartups(d.startups ?? []));
          }}
        />
      )}
    </main>
  );
}