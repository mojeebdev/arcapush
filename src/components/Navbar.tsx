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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative transition-transform group-hover:scale-105 active:scale-95">
              <Image 
                src="/wordmark.png" 
                alt="VibeStream Logo" 
                width={120} 
                height={30} 
                priority 
                className="h-6 w-auto object-contain brightness-200"
              />
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/docs"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-zinc-500 hover:text-[#4E24CF] transition-colors pl-4 border-l border-white/10"
            >
              Admin
            </Link>
          </div>

          {/* 🎖️ Right: High-Status Actions */}
          <div className="hidden md:flex items-center gap-4">
             <Link
              href="/submit"
              className="text-xs font-bold px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white hover:bg-[#4E24CF] transition-all duration-300"
            >
              Submit Signal
            </Link>
            <div className="flex items-center border-l border-white/10 pl-4">
              {/* Gold accent wrapper for the Wallet */}
              <div className="[&>button]:bg-white [&>button]:text-black [&>button]:!rounded-lg [&>button]:!text-xs [&>button]:!font-black [&>button]:!px-4 [&>button]:!py-2 hover:opacity-90 transition-opacity">
                <DynamicWidget variant="dropdown" />
              </div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white"
          >
            {mobileOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
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
            className="md:hidden border-t border-white/5 bg-black overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              <Link href="/docs" className="text-zinc-400 text-sm font-medium">Documentation</Link>
              <Link href="/pricing" className="text-zinc-400 text-sm font-medium">Pricing</Link>
              <Link href="/submit" className="text-white text-sm font-bold bg-[#4E24CF] p-4 rounded-xl text-center">
                Submit Project
              </Link>
              <div className="pt-4 border-t border-white/5">
                 <DynamicWidget variant="modal" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}