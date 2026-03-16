"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const BOOST_PERKS: Record<string, string[]> = {
  "30m": ["Permanent indexed listing", "Search engine indexed", "90 rotations"],
  "1d":  ["Everything in 30m", "2,880 rotations", "X storytelling post", "Pinned to the Hero", "Featured badge"],
  "3d":  ["Everything in 1d", "8,640 rotations", "Priority support", "3-day featured badge"],
  "1w":  ["Everything in 3d", "20,160 rotations", "1-on-1 strategy call", "Verified badge"],
  "2w":  ["Everything in 1w", "40,320 rotations", "2× X posts", "Partner network intro"],
  "1m":  ["Everything in 2w", "86,400 rotations", "VC access channel", "Founder strategy retainer"],
};

export default function PricingPage() {
  const [isProcessing, setIsProcessing]           = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [approvedStartups, setApprovedStartups]   = useState<any[]>([]);
  const [gridVisible, setGridVisible]             = useState(false);

  const { isConnected, chainId } = useAccount();
  const { switchChainAsync }     = useSwitchChain();
  const { writeContractAsync }   = useWriteContract();

  useEffect(() => {
    fetch("/api/startups?status=APPROVED")
      .then((r) => r.json())
      .then((d) => setApprovedStartups(d.startups || []));

    const t = setTimeout(() => setGridVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

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
      className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* ── Hero grid ───────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: gridVisible ? 0.5 : 0,
          backgroundImage:
            "linear-gradient(var(--rule, #D6D2C8) 1px, transparent 1px), linear-gradient(90deg, var(--rule, #D6D2C8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Glow blobs ──────────────────────────────────────────────────────── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(91,43,255,0.06)", filter: "blur(100px)", animation: "drift 12s ease-in-out infinite alternate" }}
      />
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: "rgba(91,43,255,0.04)", filter: "blur(80px)", animation: "drift 12s ease-in-out infinite alternate", animationDelay: "-4s" }}
      />

      {/* ── Top + bottom fades ──────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />

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

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-3 flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Boost Packages
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="ap-display mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Pin to the Top.<br />
            <span style={{ color: "var(--accent)" }}>Pay On-Chain.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}
          >
           Boost your product to the hero slot for a limited time — verified on-chain instantly. Pay with USDC on Base or SOL on Solana.
          </motion.p>
        </div>

        {/* ── Product selector ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mb-14 max-w-sm mx-auto"
        >
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
        </motion.div>

        {/* ── Boost packages grid ─────────────────────────────────────────── */}
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

              <h3 className="ap-display mb-1" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                {plan.label}
              </h3>
              <p className="ap-label mb-5">{plan.description}</p>

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
          On-chain verified · Free permanent listing · Boost duration varies by package
        </p>

      </div>
    </main>
  );
}