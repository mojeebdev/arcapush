"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AdminConfig } from '@/lib/adminConfig';

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search Encyclopedia...");
  const router = useRouter();

  useEffect(() => {
    const categories = AdminConfig.CATEGORIES;
    if (!categories?.length) return;
    let i = 0;
    const interval = setInterval(() => {
      const currentCat = categories[i];
      if (currentCat) setPlaceholder(`Search Category: ${currentCat}...`);
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
        <HiOutlineMagnifyingGlass className="w-4 h-4 text-zinc-400 group-focus-within:text-[#4E24CF] transition-all duration-300" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-black/10 py-2.5 pl-11 pr-16 rounded-full text-xs text-zinc-900 outline-none focus:border-[#4E24CF]/40 focus:ring-4 focus:ring-[#4E24CF]/8 transition-all placeholder:text-zinc-400 shadow-sm"
      />

      <div className="absolute right-2 inset-y-0 flex items-center">
        <button
          type="submit"
          className="text-[7px] font-black text-zinc-400 border border-zinc-200 px-2 py-1 rounded uppercase tracking-tighter bg-zinc-50
                     hover:border-[#4E24CF]/40 hover:text-[#4E24CF] hover:bg-white
                     active:scale-90 transition-all cursor-pointer
                     group-focus-within:border-[#4E24CF]/30 group-focus-within:text-[#4E24CF]"
        >
          Enter
        </button>
      </div>
    </form>
  );
}