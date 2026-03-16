"use client";

type Startup = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  logoUrl: string | null;
  category: string;
  viewCount: number | null;
};

export function SignalsGrid({ startups }: { startups: Startup[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <a
          key={startup.id}
          href={`/startups/${startup.slug}`}
          className="group flex flex-col gap-3 p-6 rounded-2xl transition-all"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            {startup.logoUrl ? (
              <img
                src={startup.logoUrl}
                alt={startup.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                style={{ border: "1px solid var(--border)" }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "var(--accent)", color: "#fff",
                  fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700,
                }}
              >
                {startup.name[0]}
              </div>
            )}
            <div className="min-w-0">
              <p className="ap-display truncate" style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                {startup.name}
              </p>
              <p className="ap-mono" style={{ fontSize: "0.6rem", color: "var(--accent)" }}>
                {startup.category}
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-xs line-clamp-2 flex-grow"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", lineHeight: 1.6 }}
          >
            {startup.tagline}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="ap-mono" style={{ fontSize: "0.58rem", color: "var(--text-secondary)" }}>
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
      ))}
    </div>
  );
}