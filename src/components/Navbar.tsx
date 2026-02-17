"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { motion, AnimatePresence } from "framer-motion";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Wordmark Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative transition-transform group-hover:scale-105 active:scale-95">
              
              <Image 
                src="/wordmark.png" 
                alt="VibeStream Logo" 
                width={150} 
                height={40} 
                priority 
                className="h-8 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Actions - Right Aligned */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/submit"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
            >
              Submit Project
            </Link>
            
            <Link
              href="/admin"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors border-l border-white/10 pl-6"
            >
              Admin
            </Link>

            {/* Wallet Connector (The "Launch" Icon) */}
            <div className="pl-4 border-l border-white/10">
               <DynamicWidget variant="dropdown" />
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-3 rounded-xl bg-white/5 border border-white/5 text-white"
          >
            {mobileOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl p-6 space-y-4"
          >
            <div className="py-2 flex justify-center">
               <DynamicWidget variant="modal" />
            </div>
            <Link href="/submit" className="block p-4 text-center text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              Submit Project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}