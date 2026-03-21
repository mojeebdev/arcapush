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

const CAT_CONFIG: Record<string, {
  color:       string;
  bg:          string;
  badgeBg:     string;
  badgeColor:  string;
}> = {
  "Productivity":    { color: "#8a9900", bg: "#f0f5d6", badgeBg: "#eaf2b0", badgeColor: "#5a6600" },
  "Developer Tools": { color: "#2563eb", bg: "#dbeafe", badgeBg: "#dbeafe", badgeColor: "#1e3a8a" },
  "Fintech":         { color: "#7c3aed", bg: "#ede9fe", badgeBg: "#ede9fe", badgeColor: "#4c1d95" },
  "Gaming / GameFi": { color: "#ea580c", bg: "#ffedd5", badgeBg: "#ffedd5", badgeColor: "#7c2d12" },
  "Lifestyle":       { color: "#db2777", bg: "#fce7f3", badgeBg: "#fce7f3", badgeColor: "#831843" },
  "HealthTech":      { color: "#059669", bg: "#d1fae5", badgeBg: "#d1fae5", badgeColor: "#064e3b" },
  "COMMUNITY":       { color: "#6b7280", bg: "#f3f4f6", badgeBg: "#f3f4f6", badgeColor: "#374151" },
  "Infrastructure":  { color: "#0284c7", bg: "#e0f2fe", badgeBg: "#e0f2fe", badgeColor: "#0c4a6e" },
  "AI / ML":         { color: "#9333ea", bg: "#f3e8ff", badgeBg: "#f3e8ff", badgeColor: "#581c87" },
  "Web3":            { color: "#d97706", bg: "#fef3c7", badgeBg: "#fef3c7", badgeColor: "#78350f" },
  "Other":           { color: "#6b7280", bg: "#f3f4f6", badgeBg: "#f3f4f6", badgeColor: "#374151" },
};

function getCatConfig(category: string) {
  return CAT_CONFIG[category] ?? CAT_CONFIG["Other"];
}

export function SignalsGrid({ startups }: { startups: SignalStartup[] }) {
  return (
    <>
      <div
        className="signals-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "12px",
        }}
      >
        {startups.map((startup) => {
          const isIndexed   = !!startup.scrapedAt;
          const displayLogo = startup.logoUrl || startup.faviconUrl || null;
          const cat         = getCatConfig(startup.category);
          const initial     = startup.name[0]?.toUpperCase() ?? "?";

          return (
            <a
              key={startup.id}
              href={buildStartupUrl(startup)}
              onClick={() => incrementStartupView(startup.id)}
              className="signal-card"
              style={{
                background:     "#f7f6f2",
                border:         "1px solid #e2e0d8",
                borderRadius:   "18px",
                overflow:       "hidden",
                display:        "flex",
                flexDirection:  "column",
                cursor:         "pointer",
                textDecoration: "none",
                transition:     "transform 0.18s, border-color 0.18s",
                position:       "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${cat.color}55`;
                e.currentTarget.style.transform   = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e0d8";
                e.currentTarget.style.transform   = "translateY(0)";
              }}
            >
              {/* Banner */}
              <div
                style={{
                  position:   "relative",
                  height:     "88px",
                  overflow:   "hidden",
                  background: cat.bg,
                  flexShrink: 0,
                }}
              >
                {/* Ghost watermark — tinted to banner color */}
                <div
                  style={{
                    position:      "absolute",
                    bottom:        "-4px",
                    left:          "12px",
                    fontFamily:    "var(--font-syne)",
                    fontSize:      "38px",
                    fontWeight:    800,
                    letterSpacing: "-0.05em",
                    textTransform: "uppercase",
                    lineHeight:    1,
                    color:         cat.color,
                    opacity:       0.12,
                    pointerEvents: "none",
                    userSelect:    "none",
                    whiteSpace:    "nowrap",
                  }}
                >
                  {startup.name}
                </div>

                {/* Category badge */}
                <span
                  style={{
                    position:      "absolute",
                    top:           "10px",
                    left:          "10px",
                    fontFamily:    "var(--font-mono)",
                    fontSize:      "8.5px",
                    fontWeight:    500,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    padding:       "3px 8px",
                    borderRadius:  "5px",
                    background:    cat.badgeBg,
                    color:         cat.badgeColor,
                  }}
                >
                  {startup.category}
                </span>

                {/* Indexed dot */}
                {isIndexed && (
                  <div
                    style={{
                      position:     "absolute",
                      top:          "13px",
                      right:        "12px",
                      width:        "5px",
                      height:       "5px",
                      borderRadius: "50%",
                      background:   "#22c55e",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  padding:       "12px 14px 14px",
                  flex:          1,
                  display:       "flex",
                  flexDirection: "column",
                  gap:           "8px",
                }}
              >
                {/* Logo + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  {displayLogo ? (
                    <img
                      src={displayLogo}
                      alt={startup.name}
                      style={{
                        width:        "28px",
                        height:       "28px",
                        borderRadius: "7px",
                        objectFit:    "cover",
                        flexShrink:   0,
                        border:       "1px solid rgba(0,0,0,0.07)",
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div
                      style={{
                        width:          "28px",
                        height:         "28px",
                        borderRadius:   "7px",
                        background:     cat.color,
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                        fontFamily:     "var(--font-syne)",
                        fontSize:       "11px",
                        fontWeight:     800,
                        color:          "#fff",
                        flexShrink:     0,
                      }}
                    >
                      {initial}
                    </div>
                  )}

                  <span
                    style={{
                      fontFamily:    "var(--font-syne)",
                      fontSize:      "12.5px",
                      fontWeight:    800,
                      letterSpacing: "-0.025em",
                      textTransform: "uppercase",
                      color:         "#1c1b18",
                      lineHeight:    1.15,
                    }}
                  >
                    {startup.name}
                  </span>
                </div>

                {/* Tagline */}
                <p
                  style={{
                    fontFamily:      "var(--font-syne)",
                    fontSize:        "10px",
                    fontWeight:      700,
                    color:           "#888780",
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
                    borderTop:      "1px solid #e2e0d8",
                    paddingTop:     "8px",
                    marginTop:      "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "8px",
                      color:         "#c0bdb5",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {startup.viewCount ?? 0} VIEWS
                  </span>
                  <span
                    className="view-arrow"
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "8px",
                      color:         cat.color,
                      letterSpacing: "0.05em",
                      opacity:       0,
                      transition:    "opacity 0.18s, transform 0.18s",
                      transform:     "translateX(-4px)",
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
                  background: cat.color,
                  transition: "width 0.35s ease",
                  flexShrink: 0,
                }}
              />
            </a>
          );
        })}
      </div>

      <style>{`
        .signal-card:hover .view-arrow {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
        .signal-card:hover .accent-line {
          width: 100% !important;
        }

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