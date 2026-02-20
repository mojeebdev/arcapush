"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass, 
  HiOutlineShieldCheck,
  HiOutlineWallet
} from "react-icons/hi2";


import { useAccount, useConnect, useDisconnect, useChainId, useConnectors } from 'wagmi';
import { base } from 'wagmi/chains';
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const activeChainId = useChainId();
  const connectors = useConnectors();
  const { connect: connectEvm } = useConnect();

  
  const { publicKey, connected: isSolConnected, disconnect: disconnectSol } = useWallet();
  const { setVisible: setSolModalVisible } = useWalletModal();

  useEffect(() => { setMounted(true); }, []);

  const handleDisconnect = () => {
    if (confirm("Disconnect Signal Terminal?")) {
      if (isEvmConnected) disconnectEvm();
      if (isSolConnected) disconnectSol();
    }
  };

  const handleConnect = () => {
    if (isEvmConnected || isSolConnected) {
      handleDisconnect();
      return;
    }
    if (connectors.length > 0) {
      connectEvm({ connector: connectors[0] });
    }
  };

  const displayAddress = !mounted 
    ? "Connect Wallet" 
    : isEvmConnected 
      ? `${evmAddress?.slice(0, 4)}...${evmAddress?.slice(-4)}`
      : isSolConnected 
      ? `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
      : "Connect Wallet";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          <Link href="/" className="flex items-center gap-4 shrink-0 group">
            <Image 
              src="/wordmark.png" 
              alt="VibeStream Logo" 
              width={220} 
              height={55} 
              priority 
              className="h-10 w-auto object-contain brightness-200"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">About</Link>
            <Link href="/submit" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Submit</Link>
            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Pricing</Link>
            <Link href="/admin" className="opacity-0 hover:opacity-100 transition-opacity">
               <HiOutlineShieldCheck className="w-4 h-4 text-zinc-800 hover:text-[#4E24CF]" />
            </Link>
          </div>

          {/* Search Encyclopedia */}
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

          {/* 🛡️ THE UNIFIED TERMINAL */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {mounted && (
              <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                {!isEvmConnected && (
                  <button 
                    onClick={() => setSolModalVisible(true)}
                    className={`p-2 rounded-lg transition-colors ${isSolConnected ? 'bg-purple-500/10 text-purple-400' : 'text-zinc-600 hover:text-purple-400'}`}
                  >
                    <span className="text-[9px] font-bold">SOL</span>
                  </button>
                )}

                <button 
                  onClick={handleConnect}
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors group"
                >
                  <HiOutlineWallet className={`w-3.5 h-3.5 ${(isEvmConnected || isSolConnected) ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-blue-500'}`} />
                  <span className="flex items-center gap-2">
                    {displayAddress}
                    {isEvmConnected && activeChainId === base.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                    {isSolConnected && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                  </span>
                </button>
              </div>
            )}
            
            <Link 
              href="/submit" 
              className="bg-white text-black rounded-xl text-[10px] font-black px-6 py-2.5 uppercase tracking-widest hover:bg-[#D4AF37] hover:scale-[1.05] transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-zinc-400">
            {mobileOpen ? <HiOutlineXMark className="w-7 h-7" /> : <HiOutlineBars3 className="w-7 h-7" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
