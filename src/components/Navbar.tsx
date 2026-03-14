"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineWallet,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useAccount, useConnect, useDisconnect, useChainId, useConnectors } from "wagmi";
import { base } from "wagmi/chains";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data: session, status } = useSession();

  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const activeChainId = useChainId();
  const connectors = useConnectors();
  const { connect: connectEvm } = useConnect();

  const { publicKey, connected: isSolConnected, disconnect: disconnectSol } = useWallet();
  const { setVisible: setSolModalVisible } = useWalletModal();

  useEffect(() => { setMounted(true); }, []);

  const handleWalletConnect = () => {
    if (isEvmConnected || isSolConnected) {
      if (confirm("Disconnect wallet?")) {
        if (isEvmConnected) disconnectEvm();
        if (isSolConnected) disconnectSol();
      }
      return;
    }
    if (connectors.length > 0) connectEvm({ connector: connectors[0] });
  };

  const walletDisplay = !mounted
    ? null
    : isEvmConnected
    ? `${evmAddress?.slice(0, 4)}…${evmAddress?.slice(-4)}`
    : isSolConnected
    ? `${publicKey?.toBase58().slice(0, 4)}…${publicKey?.toBase58().slice(-4)}`
    : null;

  const isWalletConnected = mounted && (isEvmConnected || isSolConnected);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">

          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <span
              className="text-xl font-black uppercase tracking-tighter"
              style={{ color: "var(--text-primary)" }}
            >
              Arca<span style={{ color: "var(--accent)" }}>push</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-black uppercase tracking-widest transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:block">
            <GlobalSearch />
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3 shrink-0">

            {/* Wallet — payment only */}
            {mounted && (
              <div
                className="flex items-center gap-2 pr-3"
                style={{ borderRight: "1px solid var(--border)" }}
              >
                {!isEvmConnected && (
                  <button
                    onClick={() => setSolModalVisible(true)}
                    className="text-xs font-black uppercase px-2 py-1 rounded-lg transition-colors"
                    style={{
                      color: isSolConnected ? "var(--accent)" : "var(--text-tertiary)",
                      background: isSolConnected ? "var(--accent-dim)" : "transparent",
                    }}
                  >
                    SOL
                  </button>
                )}
                <button
                  onClick={handleWalletConnect}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest transition-colors"
                  style={{ color: isWalletConnected ? "var(--accent)" : "var(--text-tertiary)" }}
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
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div
                      className="absolute top-full right-0 mt-2 z-50 w-48 rounded-2xl p-2 shadow-2xl"
                      style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)" }}
                    >
                      <Link
                        href="/submit"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                          (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        List a Product
                      </Link>
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{ color: "var(--text-tertiary)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#ff6b6b";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,60,60,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
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
                onClick={() => signIn()}
                className="text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all"
                style={{
                  background: "var(--bg-3)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                Sign In
              </button>
            ) : null}

            {/* Primary CTA */}
            <Link
              href="/submit"
              className="ap-btn-primary"
              style={{ padding: "0.65rem 1.5rem" }}
            >
              List Product
            </Link>

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
                onClick={() => signIn()}
                className="text-xs font-black uppercase tracking-widest py-3 rounded-xl"
                style={{ color: "var(--text-secondary)", background: "var(--bg-3)", border: "1px solid var(--border)" }}
              >
                Sign In
              </button>
            )}
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="ap-btn-primary text-center"
            >
              List Product
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}