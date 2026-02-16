"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AdminConfig } from "@/lib/adminConfig";
import {
  HiOutlineSparkles,
  HiOutlinePlusCircle,
  HiOutlineCog6Tooth,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
              <HiOutlineSparkles className="w-4 h-4 text-white" />
              <div className="absolute inset-0 rounded-lg bg-accent/20 blur-lg group-hover:blur-xl transition-all" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">{AdminConfig.SITE_NAME.slice(0, 4)}</span>
              <span className="text-gradient">{AdminConfig.SITE_NAME.slice(4)}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-surface-300 transition-all duration-200"
            >
              <HiOutlinePlusCircle className="w-4 h-4" />
              Submit Startup
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-surface-300 transition-all duration-200"
            >
              <HiOutlineCog6Tooth className="w-4 h-4" />
              Admin
            </Link>
            <Link href="/submit" className="btn-primary text-sm ml-2">
              Launch Your Project
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-surface-300 transition-colors"
          >
            {mobileOpen ? (
              <HiOutlineXMark className="w-5 h-5 text-white" />
            ) : (
              <HiOutlineBars3 className="w-5 h-5 text-white" />
            )}
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
            className="md:hidden border-t border-white/[0.06] glass-strong"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-surface-300 transition-all"
              >
                <HiOutlinePlusCircle className="w-5 h-5" />
                Submit Startup
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-surface-300 transition-all"
              >
                <HiOutlineCog6Tooth className="w-5 h-5" />
                Admin Dashboard
              </Link>
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center text-sm mt-2"
              >
                Launch Your Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}