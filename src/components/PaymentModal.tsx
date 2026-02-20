"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AdminConfig } from "@/lib/adminConfig";
import { 
  HiOutlineXMark, 
  HiOutlineBolt, 
  HiOutlineShieldCheck, 
  HiOutlineGlobeAlt 
} from "react-icons/hi2";
import { useWriteContract } from 'wagmi'; 
import { parseUnits } from 'viem';
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

interface PaymentModalProps {
  startupId: string;
  status: string; 
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

export function PaymentModal({ startupId, status, onClose, onSuccess }: PaymentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"package" | "chain">("package");
  const [selectedPackage, setSelectedPackage] = useState(AdminConfig.PIN_PACKAGES[0]);

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBasePay = async () => {
    
    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_BASE;
    const usdcContract = process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS;

    if (!destination || !usdcContract) {
      return toast.error("Guardian configuration incomplete for Base.");
    }

    setLoading(true);
    const toastId = toast.loading("Verifying Base USDC Path...");
    try {
      
      const hash = await writeContractAsync({
        address: usdcContract as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [
          destination as `0x${string}`,
          parseUnits(selectedPackage.price.toString(), 6), 
        ],
      });

      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startupId, 
          chain: "base", 
          txHash: hash, 
          packageValue: selectedPackage.value 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("🚀 Signal Boosted on Base!", { id: toastId });
      onSuccess?.(data);
      onClose();
    } catch (err: any) {
      console.error("Payment Error:", err);
      toast.error(err.shortMessage || err.message || "Handshake Rejected", { id: toastId });
    } finally { setLoading(false); }
  };

  const handleSolanaPay = async () => {
    if (!window.solana) return toast.error("Please install Phantom or Solflare.");
    
    
    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOLANA;
    if (!destination) {
      return toast.error("Guardian configuration incomplete for Solana.");
    }

    setLoading(true);
    const toastId = toast.loading("Fetching SOL Market Price...");

    try {
      const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const solAmount = selectedPackage.price / priceData.solana.usd;
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

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
      toast.loading("Verifying Solana Signal...", { id: toastId });

      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startupId, 
          chain: "solana", 
          txHash: signature, 
          packageValue: selectedPackage.value 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("🔥 Signal Boosted on Solana!", { id: toastId });
      onSuccess?.(data);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Solana Transmission Failed", { id: toastId });
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      >
        <motion.div 
          className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl" 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-emerald-500/10 border-emerald-500/20">
                <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase italic leading-none">Ascension</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Signal Terminal</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <HiOutlineXMark className="w-5 h-5 text-zinc-600" />
            </button>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {step === "package" ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Choose Duration</p>
                  <div className="grid grid-cols-2 gap-3">
                    {AdminConfig.PIN_PACKAGES.map((pkg) => (
                      <button 
                        key={pkg.value} 
                        onClick={() => { setSelectedPackage(pkg); setStep("chain"); }} 
                        className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37] hover:bg-white/[0.05] text-left transition-all group"
                      >
                        <p className="text-white font-black text-[10px] uppercase group-hover:text-[#D4AF37]">{pkg.label}</p>
                        <p className="text-[10px] text-zinc-500 font-bold">${pkg.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select Protocol</p>
                  
                  <button onClick={handleBasePay} disabled={loading} className="w-full p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 flex justify-between items-center group transition-all disabled:opacity-30">
                    <div className="flex items-center gap-3">
                      <HiOutlineGlobeAlt className="w-5 h-5 text-blue-500" />
                      <span className="text-white font-black text-xs uppercase italic">Base One-Tap</span>
                    </div>
                    {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <span className="text-[9px] text-blue-500/50 font-black">USDC</span>}
                  </button>
                  
                  <button onClick={handleSolanaPay} disabled={loading} className="w-full p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 flex justify-between items-center group transition-all disabled:opacity-30">
                    <div className="flex items-center gap-3">
                      <HiOutlineBolt className="w-5 h-5 text-purple-500" />
                      <span className="text-white font-black text-xs uppercase italic">Solana One-Tap</span>
                    </div>
                    {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <span className="text-[9px] text-purple-500/50 font-black">SOL</span>}
                  </button>

                  <button onClick={() => setStep("package")} className="w-full text-[9px] font-black text-zinc-700 hover:text-zinc-500 uppercase pt-4 transition-colors">
                    ← Change Package ({selectedPackage.label})
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}