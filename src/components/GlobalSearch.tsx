"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AdminConfig } from "@/lib/adminConfig";

export default function GlobalSearch() {
  const [query, setQuery]             = useState("");
  const [placeholder, setPlaceholder] = useState("Search registry...");
  const router = useRouter();

  useEffect(() => {
    const categories = AdminConfig.CATEGORIES;
    if (!categories?.length) return;
    let i = 0;
    const interval = setInterval(() => {
      const current = categories[i];
      if (current) setPlaceholder(`Search: ${current}...`);
      i = (i + 1) % categories.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    router.push(`/registry?search=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group w-full max-w-md mx-auto md:mx-0">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <HiOutlineMagnifyingGlass
          className="w-4 h-4 transition-colors"
          style={{ color: "var(--text-tertiary)" }}
        />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 pl-11 pr-16 rounded-full text-xs outline-none transition-all"
        style={{
          background:    "#fff",
          border:        "1px solid var(--border)",
          color:         "var(--text-primary)",
          fontFamily:    "var(--font-mono)",
          letterSpacing: "0.04em",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
        onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
      />

      <div className="absolute right-2 inset-y-0 flex items-center">
        <button
          type="submit"
          className="text-xs font-black px-2 py-1 rounded uppercase tracking-tighter transition-all cursor-pointer"
          style={{
            color:      "var(--text-tertiary)",
            border:     "1px solid var(--border)",
            background: "var(--bg-2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color       = "var(--accent)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color       = "var(--text-tertiary)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
        >
          Enter
        </button>
      </div>
    </form>
  );
}