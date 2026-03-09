"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useWriteContract, useAccount, useSwitchChain } from 'wagmi';
import { parseUnits } from 'viem';
import { base } from 'wagmi/chains';
import { AdminConfig } from "@/lib/adminConfig";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram } from "@solana/web3.js";

const PIN_PACKAGES = [
  {
    label: "30 Mins",
    price: "5",
    value: 30,
    rotations: "90",
    description: "Instant momentum. Perpetual archive.",
    perks: ["90 Rotations (20s each)", "Permanent Encyclopedia Entry", "Search Engine Indexed"],
    accent: "zinc-500"
  },
  {
    label: "1 Day",
    price: "25",
    value: 1440,
    rotations: "4,320",
    description: "The 'X-Factor' package with Social Push.",
    perks: ["4,320 Rotations", "Thoughtful X Storytelling Post", "Permanent Presence", "Discovery Feed Priority"],
    accent: "[#4E24CF]",
    featured: true
  },
  {
    label: "3 Days",
    price: "60",
    value: 4320,
    rotations: "12,960",
    description: "Extended exposure for maximum resonance.",
    perks: ["12,960 Rotations", "X Storytelling Post", "Priority Support", "Featured Startup Badge"],
    accent: "blue-500"
  },
  {
    label: "1 Week",
    price: "100",
    value: 10080,
    rotations: "30,240",
    description: "Full market immersion and strategy alignment.",
    perks: ["30,240 Rotations", "X Storytelling Post", "1-on-1 Marketing Call", "Verified Vibe Badge"],
    accent: "[#D4AF37]"
  },
  {
    label: "2 Weeks",
    price: "175",
    value: 20160,
    rotations: "60,480",
    description: "Sustained dominance across the ecosystem.",
    perks: ["60,480 Rotations", "2x X Storytelling Posts", "Strategy Retainer", "Partner Network Intro"],
    accent: "purple-500"
  },
  {
    label: "1 Month",
    price: "299",
    value: 43200,
    rotations: "129,600",
    description: "Total Encyclopedia domination and partnership.",
    perks: ["129,600 Rotations", "Lifetime Encyclopedia Entry", "VC Access Channel", "Founder Strategy Retainer"],
    accent: "white"
  }
];

const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const;

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [approvedStartups, setApprovedStartups] = useState<any[]>([]);
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    fetch('/api/startups?status=APPROVED')
      .then(res => res.json())
      .then(data => setApprovedStartups(data.startups || []));
  }, []);

  const handleBasePayment = async (plan: any) => {
    if (!selectedStartupId) return toast.error("Select a target.");
    if (!isConnected) return toast.error("Connect Wallet.");
    const destination = AdminConfig.PAYMENT_WALLET_BASE;
    setIsProcessing(true);
    const toastId = toast.loading("Processing Base USDC...");
    try {
      if (chainId !== base.id) await switchChainAsync({ chainId: base.id });
      const hash = await writeContractAsync({
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [destination as `0x${string}`, parseUnits(plan.price.replace(',', ''), 6)],
      });
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "base", txHash: hash, packageValue: plan.value })
      });
      toast.success("🚀 Boost Active!", { id: toastId });
    } catch {
      toast.error("Failed.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSolanaPayment = async (plan: any) => {
    if (!selectedStartupId || !window.solana) return toast.error("Check selection/wallet.");
    setIsProcessing(true);
    const toastId = toast.loading("Processing SOL...");
    try {
      const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const lamports = Math.floor((Number(plan.price.replace(',', '')) / priceData.solana.usd) * LAMPORTS_PER_SOL);
      const resp = await window.solana.connect();
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: resp.publicKey })
        .add(
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25000 }),
          SystemProgram.transfer({
            fromPubkey: resp.publicKey,
            toPubkey: new PublicKey(AdminConfig.PAYMENT_WALLET_SOLANA),
            lamports
          })
        );
      const { signature } = await window.solana.signAndSendTransaction(transaction);
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "solana", txHash: signature, packageValue: plan.value })
      });
      toast.success("🔥 SOL Boost Active!", { id: toastId });
    } catch {
      toast.error("Failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen bg-black text-white">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">Signal Boost</span>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-2">
          Amplify Your <span className="text-[#4E24CF]">Vibe Code.</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-4 font-bold uppercase tracking-widest">
          Early access pricing — locked in for life when you boost today.
        </p>
      </div>

      {/* Startup Selector */}
      <section className="mb-12 max-w-xl mx-auto">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2 mb-2 block">
          Select Your Startup
        </label>
        <select
          value={selectedStartupId}
          onChange={(e) => setSelectedStartupId(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-black text-white uppercase tracking-widest outline-none focus:border-[#4E24CF] transition-colors"
        >
          <option value="">Choose a Startup...</option>
          {approvedStartups.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {!selectedStartupId && (
          <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest mt-2 ml-2">
            Your startup must be approved before boosting.
          </p>
        )}
      </section>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PIN_PACKAGES.map((plan) => (
          <motion.div
            key={plan.label}
            whileHover={{ y: -8 }}
            className={`relative rounded-[3rem] p-10 bg-zinc-950 border flex flex-col ${
              plan.featured ? 'border-[#4E24CF] shadow-[0_0_40px_rgba(78,36,207,0.15)]' : 'border-white/5'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4E24CF] px-4 py-1 rounded-full text-[10px] font-black uppercase italic whitespace-nowrap">
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-black uppercase italic mb-1">{plan.label}</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">{plan.description}</p>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black">${plan.price}</span>
              <span className="text-zinc-700 text-[10px] font-black">USD</span>
            </div>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-8">
              {plan.rotations} rotations
            </p>

            <ul className="space-y-4 mb-10">
              {plan.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="space-y-3 mt-auto">
              <button
                onClick={() => handleBasePayment(plan)}
                disabled={isProcessing || !selectedStartupId}
                className="w-full py-4 rounded-2xl font-black text-[10px] bg-blue-600/10 border border-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Pay with Base USDC
              </button>
              <button
                onClick={() => handleSolanaPayment(plan)}
                disabled={isProcessing || !selectedStartupId}
                className="w-full py-4 rounded-2xl font-black text-[10px] bg-white text-black hover:bg-[#D4AF37] hover:text-white transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Pay with Solana SOL
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Footer */}
      <p className="text-center text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] mt-16">
        On-chain verified · Permanent encyclopedia entry · Cancel anytime
      </p>
    </main>
  );
}
