"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiOutlineBars3, HiOutlineXMark,
  HiOutlineShieldCheck, HiOutlineWallet
} from "react-icons/hi2";
import GlobalSearch from "./GlobalSearch";
import { useAccount, useConnect, useDisconnect, useChainId, useConnectors } from 'wagmi';
import { base } from 'wagmi/chains';
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const NAV_LINKS = [
  { href: "/about",    label: "About"    },
  { href: "/registry", label: "Registry" },
  { href: "/blog",     label: "Blog"     },
  { href: "/pricing",  label: "Pricing"  },
  { href: "/submit",   label: "Submit"   },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
    if (isEvmConnected || isSolConnected) { handleDisconnect(); return; }
    if (connectors.length > 0) connectEvm({ connector: connectors[0] });
  };

  const displayAddress = !mounted
    ? "Connect Wallet"
    : isEvmConnected
      ? `${evmAddress?.slice(0, 4)}...${evmAddress?.slice(-4)}`
      : isSolConnected
      ? `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
      : "Connect Wallet";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0f0f12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 shrink-0 group">
            <Image
              src="/wordmark.png"
              alt="VibeStream Logo"
              width={180} height={45}
              priority
              className="h-10 w-auto object-contain"
              style={{ filter: "invert(1) brightness(1.2)" }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href} href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <HiOutlineShieldCheck className="w-4 h-4 text-gray-500 hover:text-[#4E24CF] transition-colors" />
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <GlobalSearch />
          </div>

          {/* Wallet + CTA */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {mounted && (
              <div className="flex items-center gap-3 pr-4 border-r border-black/10">
                {!isEvmConnected && (
                  <button
                    onClick={() => setSolModalVisible(true)}
                    className={`p-2 rounded-lg transition-colors ${isSolConnected ? 'bg-purple-500/10 text-purple-600' : 'text-zinc-400 hover:text-purple-500'}`}
                  >
                    <span className="text-[9px] font-bold">SOL</span>
                  </button>
                )}
                <button
                  onClick={handleConnect}
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors group"
                >
                  <HiOutlineWallet className={`w-3.5 h-3.5 ${(isEvmConnected || isSolConnected) ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-blue-500'}`} />
                  <span className="flex items-center gap-2">
                    {displayAddress}
                    {isEvmConnected && activeChainId === base.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    {isSolConnected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    )}
                  </span>
                </button>
              </div>
            )}

            <Link
              href="/submit"
              className="bg-[#4E24CF] text-white rounded-xl text-[10px] font-black px-6 py-2.5 uppercase tracking-widest hover:bg-[#6B3FE0] hover:scale-[1.05] transition-all shadow-sm active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white">
            {mobileOpen ? <HiOutlineXMark className="w-7 h-7" /> : <HiOutlineBars3 className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#1a1a21]/98 backdrop-blur-xl px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/8">
            <GlobalSearch />
          </div>
          <Link
            href="/submit"
            onClick={() => setMobileOpen(false)}
            className="w-full bg-zinc-900 text-white rounded-xl text-[10px] font-black px-6 py-3 uppercase tracking-widest hover:bg-[#4E24CF] transition-all text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}