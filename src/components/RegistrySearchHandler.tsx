"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

interface Startup {
  id: string;
  slug?: string | null;
  name: string;
  tagline: string;
  category: string;
  tier: string;
  logoUrl?: string | null;
}

interface Props {
  initialStartups: Startup[];
  categories: string[];
}

export function RegistrySearchHandler({ initialStartups, categories }: Props) {
  const searchParams        = useSearchParams();
  const [searchTerm, setSearchTerm]         = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setActiveCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const filteredStartups = useMemo(() =>
    initialStartups.filter((item) => {
      const matchesSearch = !searchTerm || (
        item.name.toLowerCase().includes(searchTerm.toLowerCase())     ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCategory =
        !activeCategory ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    }),
    [searchTerm, activeCategory, initialStartups]
  );

  const clearFilters = () => {
    window.history.replaceState(null, "", "/registry");
    setSearchTerm("");
    setActiveCategory("");
    inputRef.current?.focus();
  };

  const hasFilters = searchTerm || activeCategory;

  return (
    <div className="space-y-8">

      {/* ── Search + category filters ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Search input */}
        <div className="relative max-w-md">
          <HiOutlineMagnifyingGlass
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, categories..."
            className="w-full py-3 pl-11 pr-10 rounded-xl text-sm outline-none transition-all"
            style={{
              background:  "#fff",
              border:      "1px solid var(--border)",
              color:       "var(--text-primary)",
              fontFamily:  "var(--font-syne)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("")}
            className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize:   "0.6rem",
              background: !activeCategory ? "var(--ink, #0A0A0F)" : "transparent",
              color:      !activeCategory ? "#F7F6F2"             : "var(--text-tertiary)",
              border:     `1px solid ${!activeCategory ? "var(--ink, #0A0A0F)" : "var(--border)"}`,
            }}
          >
            All
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? "" : cat)}
                className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize:   "0.6rem",
                  background: isActive ? "var(--accent)" : "transparent",
                  color:      isActive ? "#fff"           : "var(--text-tertiary)",
                  border:     `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active filter label + clear */}
        {hasFilters && (
          <div className="flex items-center gap-4 ap-label">
            {searchTerm && (
              <span>
                Results for:{" "}
                <span style={{ color: "var(--accent)" }}>{searchTerm}</span>
              </span>
            )}
            {activeCategory && (
              <span>
                Category:{" "}
                <span style={{ color: "var(--accent)" }}>{activeCategory}</span>
              </span>
            )}
            <span
              className="flex items-center gap-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              —{" "}
              <span style={{ color: "var(--accent)" }}>{filteredStartups.length}</span>
              {" "}result{filteredStartups.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={clearFilters}
              className="underline underline-offset-4 transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Products grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStartups.length > 0 ? (
          filteredStartups.map((startup) => (
            <Link
              href={`/startup/${startup.slug ?? startup.id}`}
              key={startup.id}
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
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {startup.logoUrl ? (
                    <div
                      className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ border: "1px solid var(--border)", background: "var(--bg)" }}
                    >
                      <Image
                        src={startup.logoUrl}
                        alt={startup.name}
                        width={36} height={36}
                        className="object-contain w-full h-full"
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
                    className="text-xs font-black uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--accent)" }}
                  >
                    {startup.category}
                  </span>
                </div>

                {/* Live dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0 mt-1"
                  style={{ background: "#16a34a" }}
                />
              </div>

              {/* Name + tagline */}
              <h3
                className="ap-display mb-2 transition-colors"
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

              {/* Featured badge */}
              {startup.tier === "PINNED" && (
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <span
                    className="text-xs font-black uppercase tracking-widest"
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "0.55rem",
                      color:         "var(--accent)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ⭐ Boosted
                  </span>
                </div>
              )}
            </Link>
          ))
        ) : (
          <div
            className="col-span-full py-24 text-center rounded-2xl border border-dashed"
            style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
          >
            <p className="ap-label mb-3">No products found</p>
            <button
              onClick={clearFilters}
              className="ap-btn-ghost"
              style={{ padding: "0.65rem 1.5rem" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}