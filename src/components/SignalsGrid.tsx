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

export function SignalsGrid({ startups }: { startups: SignalStartup[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => {
        const isIndexed   = !!startup.scrapedAt;
        const displayLogo = startup.logoUrl || startup.faviconUrl || null;

        return (
          <a
            key={startup.id}
            href={buildStartupUrl(startup)}
            onClick={() => incrementStartupView(startup.id)}
            className="group flex flex-col gap-3 p-6 rounded-2xl transition-all"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            {/* Logo + Name */}
            <div className="flex items-center gap-3">
              {displayLogo ? (
                <img
                  src={displayLogo}
                  alt={startup.name}
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                  style={{ border: "1px solid var(--border)" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: "var(--accent)",
                    color:      "#0e0e0c",
                    fontFamily: "var(--font-mono)",
                    fontSize:   "0.65rem",
                    fontWeight: 700,
                  }}
                >
                  {startup.name[0]}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="ap-display truncate"
                    style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}
                  >
                    {startup.name}
                  </p>
                  {isIndexed && (
                    <span
                      title="Indexed"
                      style={{
                        width:        "6px",
                        height:       "6px",
                        borderRadius: "50%",
                        background:   "#4ade80",
                        flexShrink:   0,
                        display:      "inline-block",
                      }}
                    />
                  )}
                </div>
                <p className="ap-mono" style={{ fontSize: "0.6rem", color: "var(--accent)" }}>
                  {startup.category}
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p
              className="text-xs line-clamp-2 flex-grow"
              style={{
                color:      "var(--text-secondary)",
                fontFamily: "var(--font-syne)",
                lineHeight: 1.6,
              }}
            >
              {startup.tagline}
            </p>

            {/* Footer */}
            <div
              className="flex items-center justify-between pt-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span
                className="ap-mono"
                style={{ fontSize: "0.58rem", color: "var(--text-secondary)" }}
              >
                {startup.viewCount ?? 0} views
              </span>
              <span
                className="ap-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontSize: "0.58rem", color: "var(--accent)" }}
              >
                View →
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}