"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { motion, AnimatePresence } from "framer-motion";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass, 
  HiOutlineShieldCheck
} from "react-icons/hi2";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* 🏛️ Wordmark Logo */}
          <Link href="/" className="flex items-center gap-4 shrink-0 group">
            <div className="relative transition-transform duration-500 group-hover:scale-[1.02] active:scale-95">
              <Image 
                src="/wordmark.png" 
                alt="VibeStream Logo" 
                width={180} 
                height={45} 
                priority 
                className="h-8 w-auto object-contain brightness-200"
              />
            </div>
          </Link>

          {/* 🌌 Strategic Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/submit" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
              Submit
            </Link>
            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
              Pricing
            </Link>
            {/* Hidden Admin Entry for the Guardian */}
            <Link href="/admin" className="opacity-0 hover:opacity-100 transition-opacity">
               <HiOutlineShieldCheck className="w-4 h-4 text-zinc-800 hover:text-[#4E24CF]" />
            </Link>
          </div>

          {/* Search Bar - The Encyclopedia Portal */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <HiOutlineMagnifyingGlass className={`absolute left-4 w-4 h-4 transition-colors ${searchFocused ? 'text-[#4E24CF]' : 'text-zinc-500'}`} />
              <input 
                type="text"
                placeholder="Search Encyclopedia..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-[11px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#4E24CF]/50 focus:ring-1 focus:ring-[#4E24CF]/10 transition-all font-medium"
              />
              <div className="absolute right-3 px-1.5 py-0.5 rounded border border-white/10 bg-black text-[9px] text-zinc-700 font-mono">
                ⌘K
              </div>
            </div>
          </div>

          {/* 🎖️ Authentication & Investor Deck */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
             <Link href="/request" className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-[#D4AF37] transition-colors pr-4 border-r border-white/10">
              Investor Access
            </Link>
            <div className="[&>button]:bg-white [&>button]:text-black [&>button]:!rounded-xl [&>button]:!text-[10px] [&>button]:!font-black [&>button]:!px-6 [&>button]:!py-2.5 [&>button]:!uppercase [&>button]:!tracking-widest hover:scale-[1.02] transition-transform shadow-xl shadow-white/5">
              <DynamicWidget variant="dropdown" />
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400"
          >
            {mobileOpen ? <HiOutlineXMark className="w-7 h-7" /> : <HiOutlineBars3 className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-black overflow-hidden"
          >
            <div className="p-8 flex flex-col gap-6">
              <div className="relative flex items-center">
                <HiOutlineMagnifyingGlass className="absolute left-4 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Search Encyclopedia..."
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/about" onClick={() => setMobileOpen(false)} className="text-zinc-400 text-sm font-black uppercase tracking-widest py-2">About</Link>
                <Link href="/submit" onClick={() => setMobileOpen(false)} className="text-zinc-400 text-sm font-black uppercase tracking-widest py-2">Submit Startup</Link>
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="text-zinc-400 text-sm font-black uppercase tracking-widest py-2">Pricing</Link>
                <Link href="/request" onClick={() => setMobileOpen(false)} className="text-[#D4AF37] text-sm font-black uppercase tracking-widest py-2 border-t border-white/5 pt-4">Investor Access</Link>
              </div>
              <div className="pt-4">
                 <DynamicWidget variant="modal" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}