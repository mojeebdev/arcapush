"use client";

import { incrementStartupView } from "@/app/actions/startup";
import { buildStartupUrl } from "@/types";

type SignalStartup = {
  id:            string;
  slug:          string | null;
  categorySlug?: string | null;
  name:          string;
  tagline:       string;
  logoUrl:       string | null;
  faviconUrl?:   string | null;
  category:      string;
  viewCount:     number | null;
  scrapedAt?:    string | Date | null;
};

const CAT_COLORS: Record<string, string> = {
  "Productivity":    "#e6ff00",
  "Developer Tools": "#60a5fa",
  "Fintech":         "#a78bfa",
  "Gaming / GameFi": "#fb923c",
  "Lifestyle":       "#f472b6",
  "HealthTech":      "#34d399",
  "COMMUNITY":       "#94a3b8",
  "Infrastructure":  "#38bdf8",
  "AI / ML":         "#c084fc",
  "Web3":            "#fb923c",
  "Other":           "#888780",
};

const CAT_BANNER_BG: Record<string, [string, string]> = {
  "Productivity":    ["#1a1f0a", "#2a3010"],
  "Developer Tools": ["#0a0f1a", "#0f1a2a"],
  "Fintech":         ["#12081e", "#1a0f2e"],
  "Gaming / GameFi": ["#1e0f08", "#2e1a0a"],
  "Lifestyle":       ["#1e0812", "#2e0f1e"],
  "HealthTech":      ["#081e12", "#0f2e1a"],
  "COMMUNITY":       ["#121212", "#1e1e1e"],
  "Infrastructure":  ["#081218", "#0f1e2a"],
  "AI / ML":         ["#110820", "#1c1030"],
  "Web3":            ["#1a100a", "#2a1a0e"],
};

function getCatColor(category: string): string {
  return CAT_COLORS[category] ?? "#e6ff00";
}

function getBannerBg(category: string): string {
  const pair = CAT_BANNER_BG[category] ?? ["#111110", "#191918"];
  return `linear-gradient(135deg, ${pair[0]} 0%, ${pair[1]} 100%)`;
}

export function SignalsGrid({ startups }: { startups: SignalStartup[] }) {
  return (
    <>
      <div
        className="signals-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "16px",
        }}
      >
        {startups.map((startup) => {
          const isIndexed   = !!startup.scrapedAt;
          const displayLogo = startup.logoUrl || startup.faviconUrl || null;
          const catColor    = getCatColor(startup.category);
          const bannerBg    = getBannerBg(startup.category);
          const initial     = startup.name[0]?.toUpperCase() ?? "?";

          return (
            <a
              key={startup.id}
              href={buildStartupUrl(startup)}
              onClick={() => incrementStartupView(startup.id)}
              className="signal-card"
              style={{
                background:     "var(--bg-2)",
                border:         "1px solid var(--border)",
                borderRadius:   "24px",
                overflow:       "hidden",
                display:        "flex",
                flexDirection:  "column",
                cursor:         "pointer",
                textDecoration: "none",
                transition:     "border-color 0.2s, transform 0.2s",
                position:       "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${catColor}55`;
                e.currentTarget.style.transform   = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform   = "translateY(0)";
              }}
            >
              {/* Banner */}
              <div
                style={{
                  position:   "relative",
                  height:     "110px",
                  overflow:   "hidden",
                  background: bannerBg,
                  flexShrink: 0,
                }}
              >
                {/* Ghost name watermark */}
                <div
                  style={{
                    position:      "absolute",
                    bottom:        "10px",
                    left:          "16px",
                    fontFamily:    "var(--font-syne)",
                    fontSize:      "26px",
                    fontWeight:    800,
                    color:         catColor,
                    opacity:       0.1,
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    lineHeight:    1,
                    userSelect:    "none",
                    pointerEvents: "none",
                  }}
                >
                  {startup.name}
                </div>

                {/* Overlay gradient */}
                <div
                  style={{
                    position:   "absolute",
                    inset:      0,
                    background: "linear-gradient(to top, var(--bg-2) 0%, transparent 60%)",
                  }}
                />

                {/* Category badge */}
                <span
                  style={{
                    position:       "absolute",
                    top:            "10px",
                    left:           "10px",
                    fontFamily:     "var(--font-mono)",
                    fontSize:       "9px",
                    fontWeight:     500,
                    letterSpacing:  "0.12em",
                    textTransform:  "uppercase",
                    color:          catColor,
                    background:     "rgba(14,14,12,0.85)",
                    border:         `1px solid ${catColor}22`,
                    padding:        "4px 8px",
                    borderRadius:   "6px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {startup.category}
                </span>

                {/* Indexed dot */}
                {isIndexed && (
                  <div
                    style={{
                      position:     "absolute",
                      top:          "12px",
                      right:        "12px",
                      width:        "6px",
                      height:       "6px",
                      borderRadius: "50%",
                      background:   "#4ade80",
                      boxShadow:    "0 0 0 3px rgba(74,222,128,0.15)",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  padding:       "14px 16px 16px",
                  flex:          1,
                  display:       "flex",
                  flexDirection: "column",
                  gap:           "10px",
                }}
              >
                {/* Header: logo + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {displayLogo ? (
                    <img
                      src={displayLogo}
                      alt={startup.name}
                      style={{
                        width:        "34px",
                        height:       "34px",
                        borderRadius: "10px",
                        objectFit:    "cover",
                        border:       "1px solid var(--border)",
                        flexShrink:   0,
                        background:   "var(--bg)",
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div
                      style={{
                        width:          "34px",
                        height:         "34px",
                        borderRadius:   "10px",
                        background:     catColor,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        fontFamily:     "var(--font-syne)",
                        fontSize:       "13px",
                        fontWeight:     800,
                        color:          "#0e0e0c",
                        flexShrink:     0,
                      }}
                    >
                      {initial}
                    </div>
                  )}

                  <p
                    style={{
                      fontFamily:    "var(--font-syne)",
                      fontSize:      "13px",
                      fontWeight:    800,
                      color:         "var(--text-primary)",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      lineHeight:    1.2,
                      margin:        0,
                    }}
                  >
                    {startup.name}
                  </p>
                </div>

                {/* Tagline */}
                <p
                  style={{
                    fontFamily:      "var(--font-syne)",
                    fontSize:        "11px",
                    fontWeight:      700,
                    color:           "var(--text-secondary)",
                    lineHeight:      1.55,
                    flex:            1,
                    margin:          0,
                    display:         "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow:        "hidden",
                  }}
                >
                  {startup.tagline}
                </p>

                {/* Footer */}
                <div
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    borderTop:      "1px solid var(--border)",
                    paddingTop:     "10px",
                    marginTop:      "auto",
                  }}
                >
                  <span
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "9px",
                      color:         "var(--text-tertiary)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {startup.viewCount ?? 0} VIEWS
                  </span>
                  <span
                    className="view-arrow"
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "9px",
                      color:         catColor,
                      letterSpacing: "0.05em",
                      opacity:       0,
                      transition:    "opacity 0.2s",
                    }}
                  >
                    VIEW →
                  </span>
                </div>
              </div>

              {/* Accent bottom line */}
              <div
                className="accent-line"
                style={{
                  height:     "2px",
                  width:      "0%",
                  background: catColor,
                  transition: "width 0.4s ease",
                  flexShrink: 0,
                }}
              />
            </a>
          );
        })}
      </div>

      <style>{`
        .signal-card:hover .view-arrow { opacity: 1 !important; }
        .signal-card:hover .accent-line { width: 100% !important; }

        @media (max-width: 1024px) {
          .signals-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .signals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}