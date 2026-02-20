"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass, 
  HiOutlineShieldCheck,
  HiOutlineWallet
} from "react-icons/hi2";
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { base } from 'wagmi/chains';


export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const activeChainId = useChainId();

  useEffect(() => { setMounted(true); }, []);

  const handleWalletClick = () => {
    if (isConnected) {
      if (confirm("Disconnect Signal Terminal?")) disconnect();
    } else {
      
      connect({ connector: connectors[0] });
    }
  };

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
                width={220} 
                height={55} 
                priority 
                className="h-10 w-auto object-contain brightness-200"
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
            <Link href="/admin" className="opacity-0 hover:opacity-100 transition-opacity">
               <HiOutlineShieldCheck className="w-4 h-4 text-zinc-800 hover:text-[#4E24CF]" />
            </Link>
          </div>

          {/* Search Bar */}
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
            </div>
          </div>

          {/* 🎖️ Action Center */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {/*  CONNECT WALLET */}
            {mounted && (
              <button 
                onClick={handleWalletClick}
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors pr-4 border-r border-white/10 group"
              >
                <HiOutlineWallet className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-blue-500'}`} />
                {isConnected ? (
                  <span className="flex items-center gap-2">
                    {address?.slice(0, 4)}...{address?.slice(-4)}
                    {activeChainId === base.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                  </span>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            )}
            
            {/* 🚀 Primary Conversion Button */}
            <Link 
              href="/submit" 
              className="bg-white text-black rounded-xl text-[10px] font-black px-6 py-2.5 uppercase tracking-widest hover:bg-[#D4AF37] hover:scale-[1.05] transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Get Started
            </Link>
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
              <Link href="/about" onClick={() => setMobileOpen(false)} className="text-zinc-400 text-sm font-black uppercase tracking-widest">About</Link>
              <Link href="/submit" onClick={() => setMobileOpen(false)} className="text-zinc-400 text-sm font-black uppercase tracking-widest">Submit Startup</Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="text-zinc-400 text-sm font-black uppercase tracking-widest">Pricing</Link>
              
              {/* Mobile Wallet Toggle */}
              <button 
                onClick={() => { handleWalletClick(); setMobileOpen(false); }}
                className="text-[#D4AF37] text-sm font-black uppercase tracking-widest border-t border-white/5 pt-4 text-left"
              >
                {isConnected ? `Wallet: ${address?.slice(0, 6)}...` : "Connect Wallet"}
              </button>

              <Link 
                href="/submit" 
                onClick={() => setMobileOpen(false)}
                className="bg-white text-black text-center py-4 rounded-xl text-xs font-black uppercase tracking-widest"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}