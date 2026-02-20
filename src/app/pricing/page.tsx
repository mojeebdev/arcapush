"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineGlobeAlt, HiOutlineBolt, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useWriteContract } from 'wagmi'; 
import { parseUnits } from 'viem';
import { AdminConfig } from "@/lib/adminConfig";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";

const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [approvedStartups, setApprovedStartups] = useState<any[]>([]);
  
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch('/api/startups?status=APPROVED');
        const data = await res.json();
        setApprovedStartups(data.startups || []);
      } catch (err) {
        console.error("Guardian Log: Startup fetch failed", err);
      }
    };
    fetchApproved();
  }, []);

  const handleBasePayment = async (plan: any) => {
    if (!selectedStartupId) return toast.error("Select a startup first.");
    
    
    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_BASE;
    const usdcContract = process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS;

    if (!destination || !usdcContract) {
      console.error("Guardian Error: Environment keys missing", { destination, usdcContract });
      return toast.error("Guardian wallet configuration incomplete.");
    }

    setIsProcessing(true);
    const toastId = toast.loading("Verifying USDC Handshake...");
    
    try {
      
      const hash = await writeContractAsync({
        address: usdcContract as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [
          destination as `0x${string}`,
          parseUnits(plan.price.toString(), 6) 
        ],
      });

      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startupId: selectedStartupId, 
          chain: "base", 
          txHash: hash, 
          packageValue: plan.value 
        }),
      });

      toast.success("🚀 Base Ascension Complete!", { id: toastId });
    } catch (err: any) {
      console.error("Base Payment Fault:", err);
      toast.error(err.shortMessage || "Handshake Rejected", { id: toastId });
    } finally { setIsProcessing(false); }
  };

  const handleSolanaPayment = async (plan: any) => {
    if (!selectedStartupId) return toast.error("Select a startup first.");
    if (!window.solana) return toast.error("Phantom/Solana wallet not detected.");

    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOLANA;
    if (!destination) return toast.error("Solana destination not set.");

    setIsProcessing(true);
    const toastId = toast.loading("Fetching Market Oracle...");

    try {
      const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const solPriceInUsd = priceData.solana.usd;

      const solAmount = plan.price / solPriceInUsd;
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

      toast.loading(`Transmitting ${solAmount.toFixed(4)} SOL...`, { id: toastId });

      const resp = await window.solana.connect();
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
      const { blockhash } = await connection.getLatestBlockhash();
      
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: resp.publicKey
      }).add(
        SystemProgram.transfer({
          fromPubkey: resp.publicKey,
          toPubkey: new PublicKey(destination),
          lamports: lamports,
        })
      );

      const { signature } = await window.solana.signAndSendTransaction(transaction);
      
      await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "solana", txHash: signature, packageValue: plan.value }),
      });

      toast.success("🔥 Solana Ascension Complete!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Solana Error", { id: toastId });
    } finally { setIsProcessing(false); }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen bg-black text-white">
      <Toaster position="bottom-right" />
      
      {/* Selector Container */}
      <section className="mb-12 max-w-xl mx-auto">
        <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl text-center shadow-2xl">
          <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-4 block">Select Food Item to Boost</label>
          <div className="relative">
             <select 
               value={selectedStartupId} 
               onChange={(e) => setSelectedStartupId(e.target.value)} 
               className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-xs font-bold text-white outline-none appearance-none cursor-pointer"
             >
                <option value="">Choose Startup...</option>
                {approvedStartups.map(s => (
                  <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                ))}
             </select>
             <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AdminConfig.PIN_PACKAGES.map((plan) => (
          <motion.div 
            key={plan.label} 
            whileHover={{ y: -5 }}
            className={`relative rounded-[3rem] p-10 bg-zinc-950/80 border ${plan.featured ? 'border-[#4E24CF]' : 'border-white/5'} flex flex-col`}
          >
            <h3 className="text-2xl font-black text-white uppercase italic mb-6">{plan.label}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black text-white">${plan.price}</span>
              <span className="text-zinc-600 text-[10px] font-black italic">USD VALUE</span>
            </div>
            
            <div className="space-y-3 mt-auto">
              <button 
                onClick={() => handleBasePayment(plan)} 
                disabled={isProcessing || !selectedStartupId} 
                className="w-full py-4 rounded-2xl font-black text-[10px] bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center gap-2 uppercase tracking-widest transition-all disabled:opacity-20"
              >
                <HiOutlineGlobeAlt className="w-5 h-5" /> Pay USDC (Base)
              </button>

              <button 
                onClick={() => handleSolanaPayment(plan)} 
                disabled={isProcessing || !selectedStartupId} 
                className="w-full py-4 rounded-2xl font-black text-[10px] bg-white text-black hover:bg-[#D4AF37] flex items-center justify-center gap-2 uppercase tracking-widest transition-all disabled:opacity-20"
              >
                <HiOutlineBolt className="w-5 h-5" /> Pay SOL (Dynamic)
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}