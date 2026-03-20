"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMagnifyingGlass, HiOutlineXMark, HiOutlineArrowLeft } from "react-icons/hi2";

interface Startup {
  id:           string;
  slug:         string | null;
  categorySlug: string;
  name:         string;
  tagline:      string;
  category:     string;
  tier:         string;
  logoUrl:      string | null;
  faviconUrl:   string | null;
  viewCount:    number;
  scrapedAt:    string | Date | null;
  createdAt:    string | Date;
}

interface Props {
  startups:     Startup[];
  categorySlug: string;
  realCategory: string;
}

export function CategoryGrid({ startups, categorySlug, realCategory }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    startups.filter((s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase())
    ),
    [search, startups]
  );

  return (
    <div className="space-y-8">

      {/* back + search row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/registry"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize:   "0.65rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          All categories
        </Link>

        {/* search */}
        <div className="relative w-full sm:max-w-xs">
          <HiOutlineMagnifyingGlass
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${realCategory}...`}
            className="w-full py-2.5 pl-10 pr-8 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
              border:     "1px solid var(--border)",
              color:      "var(--text-primary)",
              fontFamily: "var(--font-syne)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-tertiary)" }}
            >
              <HiOutlineXMark className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* result count when searching */}
      {search && (
        <p
          className="ap-mono"
          style={{ fontSize: "0.6rem", color: "var(--text-tertiary)" }}
        >
          <span style={{ color: "var(--accent)" }}>{filtered.length}</span>{" "}
          result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {/* grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((startup) => {
            const displayLogo = startup.logoUrl || startup.faviconUrl;
            const isIndexed   = !!startup.scrapedAt;

            return (
              <Link
                key={startup.id}
                href={`/startup/${startup.categorySlug}/${startup.slug ?? startup.id}`}
                className="group block p-7 rounded-2xl transition-all"
                style={{
                  background:     "color-mix(in srgb, var(--bg-2) 80%, transparent)",
                  border:         "1px solid var(--border)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background  = "color-mix(in srgb, var(--bg-3) 85%, transparent)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.transform   = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background  = "color-mix(in srgb, var(--bg-2) 80%, transparent)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform   = "translateY(0)";
                }}
              >
                {/* header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {displayLogo ? (
                      <div
                        className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ border: "1px solid var(--border)", background: "var(--bg)" }}
                      >
                        <Image
                          src={displayLogo}
                          alt={startup.name}
                          width={36} height={36}
                          className="object-contain w-full h-full"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                        style={{
                          background: "var(--accent-dim)",
                          border:     "1px solid var(--accent-border)",
                          color:      "var(--accent)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {startup.name[0]}
                      </div>
                    )}
                    <span
                      style={{
                        fontFamily:    "var(--font-mono)",
                        fontSize:      "0.55rem",
                        color:         "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight:    700,
                      }}
                    >
                      {startup.category}
                    </span>
                  </div>

                  {/* indexed dot */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${!isIndexed ? "animate-pulse" : ""}`}
                    style={{ background: isIndexed ? "#4ade80" : "#16a34a" }}
                    title={isIndexed ? "Indexed" : "Pending index"}
                  />
                </div>

                {/* name + tagline */}
                <h3
                  className="ap-display mb-2"
                  style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}
                >
                  {startup.name}
                </h3>
                <p
                  className="text-sm leading-relaxed line-clamp-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {startup.tagline}
                </p>

                {/* footer */}
                <div
                  className="flex items-center justify-between mt-5 pt-4"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize:   "0.55rem",
                      color:      "var(--text-tertiary)",
                    }}
                  >
                    {startup.viewCount.toLocaleString()} views
                  </span>
                  {startup.tier === "PINNED" && (
                    <span
                      style={{
                        fontFamily:    "var(--font-mono)",
                        fontSize:      "0.55rem",
                        color:         "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight:    700,
                      }}
                    >
                      Boosted
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div
          className="py-24 text-center rounded-2xl border border-dashed"
          style={{
            borderColor: "var(--border)",
            background:  "color-mix(in srgb, var(--bg-2) 80%, transparent)",
          }}
        >
          <p className="ap-label mb-3">No products found</p>
          <button
            onClick={() => setSearch("")}
            className="ap-btn-ghost"
            style={{ padding: "0.65rem 1.5rem" }}
          >
            Clear search
          </button>
        </div>
      )}

    </div>
  );
}