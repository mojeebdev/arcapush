"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineWallet,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import GlobalSearch from "./GlobalSearch";

const NAV_LINKS = [
  { href: "/registry", label: "Registry" },
  { href: "/blog",     label: "Blog"     },
  { href: "/pricing",  label: "Boost"    },
  { href: "/about",    label: "About"    },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [mounted, setMounted]             = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [scrolled, setScrolled]           = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const connectors = useConnectors();
  const { connect: connectEvm } = useConnect();

  const { publicKey, connected: isSolConnected, disconnect: disconnectSol } = useWallet();
  const { setVisible: setSolModalVisible } = useWalletModal();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleWalletConnect = () => {
    if (isEvmConnected || isSolConnected) {
      if (confirm("Disconnect wallet?")) {
        if (isEvmConnected) disconnectEvm();
        if (isSolConnected) disconnectSol();
      }
      return;
    }
    setWalletPickerOpen(true);
  };

  const walletDisplay = !mounted ? null
    : isEvmConnected ? `${evmAddress?.slice(0, 4)}…${evmAddress?.slice(-4)}`
    : isSolConnected ? `${publicKey?.toBase58().slice(0, 4)}…${publicKey?.toBase58().slice(-4)}`
    : null;

  const isWalletConnected = mounted && (isEvmConnected || isSolConnected);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
      style={{
        background: "rgba(247,246,242,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "0 2px 24px rgba(10,10,15,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/arcapush-logo.png"
              alt="Arcapush"
              width={140}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-black uppercase tracking-widest transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 hidden md:block">
            <GlobalSearch />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3 shrink-0">

            {/* Wallet button + picker */}
            {mounted && (
              <div className="relative">
                <button
                  onClick={handleWalletConnect}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    color: isWalletConnected ? "var(--accent)" : "var(--text-tertiary)",
                    background: isWalletConnected ? "var(--accent-dim)" : "transparent",
                    border: "1px solid var(--border)",
                  }}
                >
                  <HiOutlineWallet className="w-3.5 h-3.5" />
                  {walletDisplay ?? "Wallet"}
                  {isWalletConnected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </button>

                {/* Wallet picker dropdown */}
                {walletPickerOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setWalletPickerOpen(false)} />
                    <div
                      className="absolute top-full right-0 mt-2 z-50 w-44 rounded-2xl p-2"
                      style={{ background: "var(--bg)", border: "1px solid var(--border-2)" }}
                    >
                      <p
                        className="px-4 pt-2 pb-1 text-xs uppercase tracking-widest"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Select Network
                      </p>
                      <button
                        onClick={() => { setSolModalVisible(true); setWalletPickerOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                      >
                        Solana
                      </button>
                      <button
                        onClick={() => { connectEvm({ connector: connectors[0] }); setWalletPickerOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                      >
                        EVM
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Auth */}
            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  style={{
                    background: "var(--bg-3)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <HiOutlineUser className="w-3.5 h-3.5" />
                  {session.user.name?.split(" ")[0] ?? "Account"}
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div
                      className="absolute top-full right-0 mt-2 z-50 w-48 rounded-2xl p-2 shadow-2xl"
                      style={{ background: "var(--bg)", border: "1px solid var(--border-2)" }}
                    >
                      <Link
                        href="/submit"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                      >
                        List a Product
                      </Link>
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{ color: "var(--text-tertiary)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#dc2626"; (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.05)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <HiOutlineArrowRightOnRectangle className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : status === "unauthenticated" ? (
              <button
                onClick={() => router.push("/auth/signin")}
                className="ap-btn-primary"
                style={{ padding: "0.65rem 1.5rem" }}
              >
                Get Started →
              </button>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {mobileOpen
              ? <HiOutlineXMark className="w-7 h-7" />
              : <HiOutlineBars3 className="w-7 h-7" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 py-6 flex flex-col gap-5"
          style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-black uppercase tracking-widest transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <GlobalSearch />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {mounted && (
              <div className="flex gap-2">
                <button
                  onClick={() => { setSolModalVisible(true); setMobileOpen(false); }}
                  className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl"
                  style={{ color: "var(--text-tertiary)", background: "var(--bg-3)", border: "1px solid var(--border)" }}
                >
                  Solana
                </button>
                <button
                  onClick={() => { connectEvm({ connector: connectors[0] }); setMobileOpen(false); }}
                  className="flex-1 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl"
                  style={{ color: "var(--text-tertiary)", background: "var(--bg-3)", border: "1px solid var(--border)" }}
                >
                  EVM
                </button>
              </div>
            )}
            {status === "authenticated" ? (
              <button
                onClick={() => signOut()}
                className="text-xs font-black uppercase tracking-widest py-3 rounded-xl text-left px-4"
                style={{ color: "var(--text-tertiary)", background: "var(--bg-3)" }}
              >
                Sign Out ({session?.user?.name?.split(" ")[0]})
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth/signin")}
                className="ap-btn-primary text-center py-3 rounded-xl"
              >
                Get Started →
              </button>
            )}
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="ap-btn-ghost text-center"
            >
              List Product
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}