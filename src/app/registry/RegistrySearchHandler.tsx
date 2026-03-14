"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

export function RegistrySearchHandler({ initialStartups }: { initialStartups: any[] }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setActiveCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const filteredStartups = useMemo(() =>
    initialStartups.filter((item) => {
      const matchesSearch = !searchTerm || (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCategory = !activeCategory || item.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    }),
    [searchTerm, activeCategory, initialStartups]
  );

  const clearFilters = () => {
    window.history.replaceState(null, "", "/registry");
    setSearchTerm("");
    setActiveCategory("");
  };

  const hasFilters = searchTerm || activeCategory;

  return (
    <div className="space-y-8">
      {hasFilters && (
        <div className="flex items-center gap-4 ap-label">
          {searchTerm && <span>Results for: <span style={{ color: "var(--accent)" }}>{searchTerm}</span></span>}
          {activeCategory && <span>Category: <span style={{ color: "var(--accent)" }}>{activeCategory}</span></span>}
          <button onClick={clearFilters} className="underline underline-offset-4 transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
          >
            [ Clear ]
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.length > 0 ? (
          filteredStartups.map((startup) => (
            <Link
              href={`/startup/${startup.slug ?? startup.id}`}
              key={startup.id}
              className="p-8 rounded-[2.5rem] transition-all group"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="ap-label" style={{ color: "var(--accent)" }}>{startup.category}</span>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
              </div>
              <h3
                className="text-xl font-black uppercase mb-2 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {startup.name}
              </h3>
              <p className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>{startup.tagline}</p>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed rounded-[2.5rem]" style={{ borderColor: "var(--border)" }}>
            <p className="ap-label">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}


