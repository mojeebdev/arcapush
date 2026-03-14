"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useWriteContract, useAccount, useSwitchChain } from "wagmi";
import { parseUnits } from "viem";
import { base } from "wagmi/chains";
import { AdminConfig } from "@/lib/adminConfig";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram } from "@solana/web3.js";

const BOOST_PACKAGES = [
  {
    label: "30 Minutes", price: "5",  value: "30m",
    rotations: "90",     description: "Instant push — 30 mins at the top.",
    perks: ["90 rotations", "Permanent indexed listing", "Search engine indexed"],
    featured: false,
  },
  {
    label: "1 Day",      price: "25", value: "1d",
    rotations: "4,320",  description: "24 hours featured + VC discovery panel.",
    perks: ["4,320 rotations", "X storytelling post", "Discovery feed priority", "Featured badge"],
    featured: true,
  },
  {
    label: "3 Days",     price: "60", value: "3d",
    rotations: "12,960", description: "Weekend domination — 3 days pinned.",
    perks: ["12,960 rotations", "X storytelling post", "Priority support", "Featured badge"],
    featured: false,
  },
  {
    label: "1 Week",     price: "100", value: "1w",
    rotations: "30,240", description: "Full week push — maximum signal.",
    perks: ["30,240 rotations", "X storytelling post", "1-on-1 strategy call", "Verified badge"],
    featured: false,
  },
  {
    label: "2 Weeks",    price: "175", value: "2w",
    rotations: "60,480", description: "Sustained exposure — 14 days.",
    perks: ["60,480 rotations", "2× X posts", "Strategy retainer", "Partner network intro"],
    featured: false,
  },
  {
    label: "1 Month",    price: "299", value: "1m",
    rotations: "129,600", description: "30-day domination — VC magnet.",
    perks: ["129,600 rotations", "Lifetime indexed entry", "VC access channel", "Founder strategy retainer"],
    featured: false,
  },
];

const USDC_ABI = [
  {
    name: "transfer", type: "function", stateMutability: "nonpayable",
    inputs: [{ name: "recipient", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [approvedStartups, setApprovedStartups] = useState<any[]>([]);
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    fetch("/api/startups?status=APPROVED")
      .then((r) => r.json())
      .then((d) => setApprovedStartups(d.startups || []));
  }, []);

  const handleBasePayment = async (plan: any) => {
    if (!selectedStartupId) return toast.error("Select your product first.");
    if (!isConnected) return toast.error("Connect your wallet.");
    const destination = AdminConfig.PAYMENT_WALLET_BASE;
    setIsProcessing(true);
    const toastId = toast.loading("Processing Base USDC...");
    try {
      if (chainId !== base.id) await switchChainAsync({ chainId: base.id });
      const hash = await writeContractAsync({
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        abi: USDC_ABI,
        functionName: "transfer",
        args: [destination as `0x${string}`, parseUnits(plan.price.replace(",", ""), 6)],
      });
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "base", txHash: hash, packageValue: plan.value }),
      });
      toast.success("🚀 Boost active!", { id: toastId });
    } catch { toast.error("Payment failed.", { id: toastId }); }
    finally { setIsProcessing(false); }
  };

  const handleSolanaPayment = async (plan: any) => {
    if (!selectedStartupId || !(window as any).solana) return toast.error("Check selection/wallet.");
    setIsProcessing(true);
    const toastId = toast.loading("Processing SOL...");
    try {
      const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const lamports = Math.floor((Number(plan.price.replace(",", "")) / priceData.solana.usd) * LAMPORTS_PER_SOL);
      const resp = await (window as any).solana.connect();
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: resp.publicKey }).add(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25000 }),
        SystemProgram.transfer({ fromPubkey: resp.publicKey, toPubkey: new PublicKey(AdminConfig.PAYMENT_WALLET_SOLANA), lamports })
      );
      const { signature } = await (window as any).solana.signAndSendTransaction(transaction);
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "solana", txHash: signature, packageValue: plan.value }),
      });
      toast.success("🔥 SOL boost active!", { id: toastId });
    } catch { toast.error("Payment failed.", { id: toastId }); }
    finally { setIsProcessing(false); }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: "var(--bg-2)", color: "var(--text-primary)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }
      }} />

      {/* Header */}
      <div className="text-center mb-16">
        <p className="ap-label mb-3">Boost Packages</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>
          Push Your Product <span style={{ color: "var(--accent)" }}>Further.</span>
        </h1>
        <p className="text-sm mt-4 font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
          On-chain verified · USDC on Base · SOL on Solana
        </p>
      </div>

      {/* Product selector */}
      <section className="mb-12 max-w-xl mx-auto">
        <label className="ap-label ml-2 mb-2 block">Select Your Product</label>
        <select
          value={selectedStartupId}
          onChange={(e) => setSelectedStartupId(e.target.value)}
          className="w-full rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest outline-none"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <option value="">Choose a product...</option>
          {approvedStartups.map((s) => (
            <option key={s.id} value={s.id} className="bg-black">{s.name}</option>
          ))}
        </select>
        {!selectedStartupId && (
          <p className="ap-label ml-2 mt-2">Your product must be approved before boosting.</p>
        )}
      </section>

      {/* Packages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BOOST_PACKAGES.map((plan) => (
          <motion.div
            key={plan.label}
            whileHover={{ y: -8 }}
            className="relative rounded-[3rem] p-10 flex flex-col"
            style={{
              background: "var(--bg-2)",
              border: `1px solid ${plan.featured ? "var(--accent)" : "var(--border)"}`,
              boxShadow: plan.featured ? "0 0 40px rgba(232,255,71,0.08)" : "none",
            }}
          >
            {plan.featured && (
              <span
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase italic whitespace-nowrap"
                style={{ background: "var(--accent)", color: "#0a0a0a" }}
              >
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-black uppercase italic mb-1" style={{ color: "var(--text-primary)" }}>{plan.label}</h3>
            <p className="ap-label mb-6">{plan.description}</p>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black" style={{ color: plan.featured ? "var(--accent)" : "var(--text-primary)" }}>
                ${plan.price}
              </span>
              <span className="ap-label">USD</span>
            </div>
            <p className="ap-label mb-8">{plan.rotations} rotations</p>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-black uppercase" style={{ color: "var(--text-secondary)" }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="space-y-3 mt-auto">
              <button
                onClick={() => handleBasePayment(plan)}
                disabled={isProcessing || !selectedStartupId}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.1)"; (e.currentTarget as HTMLElement).style.color = "#60a5fa"; }}
              >
                Pay with Base USDC
              </button>
              <button
                onClick={() => handleSolanaPayment(plan)}
                disabled={isProcessing || !selectedStartupId}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)", color: "#0a0a0a" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f5ff6e")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
              >
                Pay with Solana SOL
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center ap-label mt-16">
        On-chain verified · Permanent indexed listing · Cancel anytime
      </p>
    </main>
  );
}