"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useWriteContract, useAccount, useSwitchChain } from "wagmi";
import { parseUnits } from "viem";
import { base } from "wagmi/chains";
import { AdminConfig } from "@/lib/adminConfig";
import {
  Connection, PublicKey, Transaction,
  SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram,
} from "@solana/web3.js";

const USDC_ABI = [
  {
    name: "transfer", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "recipient", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// ── Perks per boost package (derived from label) ─────────────────────────────
const BOOST_PERKS: Record<string, string[]> = {
  "30m": ["Permanent indexed listing", "Search engine indexed", "90 rotations"],
  "1d":  ["Everything in 30m", "X storytelling post", "Discovery feed priority", "Featured badge"],
  "3d":  ["Everything in 1d", "Priority support", "3-day featured badge"],
  "1w":  ["Everything in 3d", "1-on-1 strategy call", "Verified badge"],
  "2w":  ["Everything in 1w", "2× X posts", "Partner network intro"],
  "1m":  ["Everything in 2w", "VC access channel", "Founder strategy retainer"],
};

export default function PricingPage() {
  const [isProcessing, setIsProcessing]       = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [approvedStartups, setApprovedStartups]   = useState<any[]>([]);

  const { isConnected, chainId } = useAccount();
  const { switchChainAsync }     = useSwitchChain();
  const { writeContractAsync }   = useWriteContract();

  useEffect(() => {
    fetch("/api/startups?status=APPROVED")
      .then((r) => r.json())
      .then((d) => setApprovedStartups(d.startups || []));
  }, []);

  // ── Base USDC payment ──────────────────────────────────────────────────────
  const handleBasePayment = async (plan: typeof AdminConfig.PIN_PACKAGES[number]) => {
    if (!selectedStartupId) return toast.error("Select your product first.");
    if (!isConnected)       return toast.error("Connect your wallet.");
    setIsProcessing(true);
    const toastId = toast.loading("Processing Base USDC...");
    try {
      if (chainId !== base.id) await switchChainAsync({ chainId: base.id });
      const hash = await writeContractAsync({
        address:      AdminConfig.USDC_CONTRACT_BASE,
        abi:          USDC_ABI,
        functionName: "transfer",
        args: [
          AdminConfig.PAYMENT_WALLET_BASE as `0x${string}`,
          parseUnits(String(plan.price), 6),
        ],
      });
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "base", txHash: hash, packageValue: plan.value }),
      });
      toast.success("🚀 Boost active!", { id: toastId });
    } catch {
      toast.error("Payment failed.", { id: toastId });
    } finally { setIsProcessing(false); }
  };

  // ── Solana SOL payment ────────────────────────────────────────────────────
  const handleSolanaPayment = async (plan: typeof AdminConfig.PIN_PACKAGES[number]) => {
    if (!selectedStartupId || !(window as any).solana)
      return toast.error("Check selection / wallet.");
    setIsProcessing(true);
    const toastId = toast.loading("Processing SOL...");
    try {
      const priceRes  = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const lamports  = Math.floor((plan.price / priceData.solana.usd) * LAMPORTS_PER_SOL);
      const resp      = await (window as any).solana.connect();
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: resp.publicKey,
      }).add(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25000 }),
        SystemProgram.transfer({
          fromPubkey: resp.publicKey,
          toPubkey:   new PublicKey(AdminConfig.PAYMENT_WALLET_SOLANA),
          lamports,
        })
      );
      const { signature } = await (window as any).solana.signAndSendTransaction(transaction);
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "solana", txHash: signature, packageValue: plan.value }),
      });
      toast.success("🔥 SOL boost active!", { id: toastId });
    } catch {
      toast.error("Payment failed.", { id: toastId });
    } finally { setIsProcessing(false); }
  };

  return (
    <main
      className="min-h-screen pt-32 pb-24 px-6"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background:  "var(--bg)",
            color:       "var(--text-primary)",
            border:      "1px solid var(--border)",
            fontFamily:  "var(--font-mono)",
            fontSize:    "0.72rem",
            boxShadow:   "0 4px 24px rgba(10,10,15,0.08)",
          },
        }}
      />

      <div className="max-w-6xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <div className="mb-3 flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Pricing
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          </div>
          <h1 className="ap-display mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Start Free.<br />
            <span style={{ color: "var(--accent)" }}>Push Further.</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}>
            Free listings get permanently indexed. Boost packages put you front-row for VCs browsing right now.
          </p>
        </div>

        {/* ── Section 1: Listing tiers ────────────────────────────────────── */}
        <div className="mb-24">
          <div className="mb-3 flex items-center gap-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-tertiary)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--border)" }} />
            Listing Plans
          </div>
          <h2 className="ap-display mb-10" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            Choose your visibility tier
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
            {AdminConfig.LISTING_TIERS.map((tier, i) => {
              const isPopular = tier.name === "Featured";
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-10 rounded-2xl flex flex-col"
                  style={{
                    background:  isPopular ? "var(--ink, #0A0A0F)" : "var(--bg-2)",
                    border:      `1px solid ${isPopular ? "var(--ink, #0A0A0F)" : "var(--border)"}`,
                    boxShadow:   isPopular ? "0 8px 40px rgba(10,10,15,0.12)" : "none",
                  }}
                >
                  {isPopular && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full"
                      style={{ background: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", fontWeight: 700 }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  {/* Tier name */}
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: isPopular ? "rgba(247,246,242,0.4)" : "var(--text-tertiary)", marginBottom: "0.75rem" }}>
                    {tier.name}
                  </div>

                  {/* Price */}
                  <div className="ap-display mb-1" style={{ fontSize: "3rem", color: isPopular ? "#F7F6F2" : "var(--text-primary)", lineHeight: 1 }}>
                    ${tier.price === 0 ? "0" : tier.price}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: isPopular ? "rgba(247,246,242,0.35)" : "var(--text-tertiary)", letterSpacing: "0.06em", marginBottom: "1rem" }}>
                    {tier.price === 0 ? "forever" : "/ month"}
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-8 leading-relaxed" style={{ color: isPopular ? "rgba(247,246,242,0.6)" : "var(--text-secondary)", fontFamily: "var(--font-syne)" }}>
                    {tier.description}
                  </p>

                  <Link
                    href={tier.price === 0 ? "/submit" : "/submit"}
                    className="block w-full text-center py-3.5 rounded-xl transition-all mt-auto"
                    style={{
                      fontFamily:    "var(--font-mono)",
                      fontSize:      "0.65rem",
                      fontWeight:    700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      background:    isPopular ? "var(--accent)" : "transparent",
                      color:         isPopular ? "#fff"          : "var(--text-secondary)",
                      border:        isPopular ? "1px solid var(--accent)" : "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isPopular) {
                        (e.currentTarget as HTMLElement).style.background   = "var(--bg-3)";
                        (e.currentTarget as HTMLElement).style.color        = "var(--text-primary)";
                        (e.currentTarget as HTMLElement).style.borderColor  = "var(--border-2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isPopular) {
                        (e.currentTarget as HTMLElement).style.background   = "transparent";
                        (e.currentTarget as HTMLElement).style.color        = "var(--text-secondary)";
                        (e.currentTarget as HTMLElement).style.borderColor  = "var(--border)";
                      }
                    }}
                  >
                    {tier.price === 0 ? "List Free →" : `Get ${tier.name} →`}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div className="ap-divider mb-24" />

        {/* ── Section 2: Boost packages ───────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center gap-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-tertiary)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--border)" }} />
            On-chain Boost Packages
          </div>
          <h2 className="ap-display mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            Pin to the top. Pay on-chain.
          </h2>
          <p className="text-base mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: 520 }}>
            Boost your product to the hero slot — verified on-chain before the registry updates. Pay with USDC on Base or SOL on Solana.
          </p>

          {/* Product selector */}
          <div className="mb-10 max-w-sm">
            <label className="ap-label mb-2 block">Select Your Product</label>
            <select
              value={selectedStartupId}
              onChange={(e) => setSelectedStartupId(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none transition-all"
              style={{
                background: "#fff",
                border:     "1px solid var(--border)",
                color:      "var(--text-primary)",
                fontFamily: "var(--font-mono)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <option value="">Choose a product...</option>
              {approvedStartups.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {!selectedStartupId && (
              <p className="ap-label mt-2">Product must be approved before boosting.</p>
            )}
          </div>

          {/* Packages grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AdminConfig.PIN_PACKAGES.map((plan, i) => (
              <motion.div
                key={plan.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative p-8 rounded-2xl flex flex-col"
                style={{
                  background: "var(--bg-2)",
                  border:     `1px solid ${plan.featured ? "var(--accent)" : "var(--border)"}`,
                  boxShadow:  plan.featured ? "0 0 40px rgba(91,43,255,0.08)" : "none",
                }}
              >
                {plan.featured && (
                  <span
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full whitespace-nowrap"
                    style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}
                  >
                    Most Popular
                  </span>
                )}

                {/* Label + description */}
                <h3 className="ap-display mb-1" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                  {plan.label}
                </h3>
                <p className="ap-label mb-5">{plan.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="ap-display"
                    style={{ fontSize: "2.75rem", color: plan.featured ? "var(--accent)" : "var(--text-primary)", lineHeight: 1 }}
                  >
                    ${plan.price}
                  </span>
                  <span className="ap-label">USD</span>
                </div>
                <p className="ap-label mb-6">
                  {plan.minutes < 60
                    ? `${plan.minutes} min`
                    : plan.minutes < 1440
                    ? `${plan.minutes / 60}h`
                    : plan.minutes < 10080
                    ? `${plan.minutes / 1440}d`
                    : plan.minutes < 43200
                    ? `${Math.round(plan.minutes / 10080)}w`
                    : "30 days"
                  } pinned
                </p>

                {/* Perks */}
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {(BOOST_PERKS[plan.value] || []).map((perk, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
                    >
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", flexShrink: 0, marginTop: "1px" }}>→</span>
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* Payment buttons */}
                <div className="space-y-2 mt-auto">
                  <button
                    onClick={() => handleBasePayment(plan)}
                    disabled={isProcessing || !selectedStartupId}
                    className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      fontFamily:  "var(--font-mono)",
                      background:  "rgba(37,99,235,0.08)",
                      border:      "1px solid rgba(37,99,235,0.2)",
                      color:       "#2563eb",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.08)"; (e.currentTarget as HTMLElement).style.color = "#2563eb"; }}
                  >
                    Pay with Base USDC
                  </button>
                  <button
                    onClick={() => handleSolanaPayment(plan)}
                    disabled={isProcessing || !selectedStartupId}
                    className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "var(--ink, #0A0A0F)",
                      color:      "#F7F6F2",
                      border:     "1px solid var(--ink, #0A0A0F)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--ink, #0A0A0F)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--ink, #0A0A0F)"; (e.currentTarget as HTMLElement).style.color = "#F7F6F2"; }}
                  >
                    Pay with Solana SOL
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="ap-label text-center mt-12">
            On-chain verified · Permanent indexed listing · No recurring fees for boosts
          </p>
        </div>

      </div>
    </main>
  );
}