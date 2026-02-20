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
    if (!categories || categories.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      
      const currentCat = categories[i];
      setPlaceholder(`Search Category: ${currentCat}...`);
      i = (i + 1) % categories.length;
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    
    router.push(`/registry?search=${encodeURIComponent(query)}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="relative group w-full max-w-md"
    >
      {/* 🛡️ Visual Identity: Magnifying Glass */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <HiOutlineMagnifyingGlass className="w-4 h-4 text-zinc-500 group-focus-within:text-[#D4AF37] transition-all duration-300" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900/40 backdrop-blur-md border border-white/5 py-2.5 pl-11 pr-14 rounded-full text-xs text-white outline-none focus:border-[#4E24CF]/40 focus:bg-zinc-900/80 focus:ring-4 focus:ring-[#4E24CF]/10 transition-all placeholder:text-zinc-600 placeholder:transition-opacity group-focus-within:placeholder:opacity-0"
      />

      {/* 🛡️ UI Hint: Terminal "Enter" Key */}
      <div className="absolute right-4 inset-y-0 flex items-center pointer-events-none">
        <span className="text-[7px] font-black text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded uppercase tracking-tighter bg-black/50 group-focus-within:border-[#D4AF37]/30 group-focus-within:text-[#D4AF37] transition-all">
          Enter
        </span>
      </div>
    </form>
  );
}