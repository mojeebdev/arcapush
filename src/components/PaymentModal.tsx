"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AdminConfig } from "@/lib/adminConfig";
import {
  HiOutlineXMark,
  HiOutlineBolt,
  HiOutlineClipboardDocument,
  HiOutlineCheckCircle,
} from "react-icons/hi2";


type PaymentPackage = {
  readonly label: string;
  readonly value: string;
  readonly price: string;
  readonly minutes: number;
};

type Chain = "base" | "solana";

interface PaymentModalProps {
  startupId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PaymentModal({ startupId, onClose, onSuccess }: PaymentModalProps) {
  
  const [chain, setChain] = useState<Chain>("base");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"package" | "chain" | "pay" | "verify">("package");

  
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage>(
    AdminConfig.PIN_PACKAGES[0]
  );

  
  const price = chain === "base" ? selectedPackage.price : AdminConfig.PIN_PRICE_SOL;
  const currency = chain === "base" ? "USDC" : "SOL";
  const wallet = chain === "base" ? AdminConfig.PAYMENT_WALLET_BASE : AdminConfig.PAYMENT_WALLET_SOL;

  const handleVerify = async () => {
    if (!txHash.trim()) {
      toast.error("Please enter the transaction hash");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startupId, 
          chain, 
          txHash: txHash.trim(),
          packageValue: selectedPackage.value 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      toast.success(`🔥 Signal Boosted for ${selectedPackage.label}!`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Transmission interrupted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <HiOutlineBolt className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Signal Boost</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {step === "package" ? "Select Duration" : `${selectedPackage.label} Priority`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <HiOutlineXMark className="w-6 h-6 text-zinc-600" />
            </button>
          </div>

          <div className="p-8">
            {/* STEP 1: Package Selection */}
            {step === "package" && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 text-center">Select Duration Package</p>
                <div className="grid grid-cols-2 gap-3">
                  {AdminConfig.PIN_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.value}
                      onClick={() => { setSelectedPackage(pkg); setStep("chain"); }}
                      className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/50 transition-all text-left group"
                    >
                      <p className="text-white font-black text-xs uppercase tracking-tighter group-hover:text-emerald-400">{pkg.label}</p>
                      <p className="text-[10px] text-zinc-500 font-bold">{pkg.price} USDC</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Chain Selection */}
            {step === "chain" && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 text-center">Select Transmission Network</p>
                {[
                  { id: "base", name: "Base", sub: "USDC (L2)", style: "bg-blue-500/10 text-blue-400" },
                  { id: "solana", name: "Solana", sub: "SOL (Native)", style: "bg-purple-500/10 text-purple-400" }
                ].map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { setChain(n.id as Chain); setStep("pay"); }}
                    className="w-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black ${n.style}`}>{n.name[0]}</div>
                      <div className="text-left">
                        <p className="font-bold text-white uppercase text-xs tracking-widest">{n.name}</p>
                        <p className="text-[9px] text-zinc-500 font-bold tracking-tighter uppercase">{n.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{n.id === 'base' ? selectedPackage.price : AdminConfig.PIN_PRICE_SOL}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase">{n.id === 'base' ? 'USDC' : 'SOL'}</p>
                    </div>
                  </button>
                ))}
                <button onClick={() => setStep("package")} className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center mt-4">Back to Packages</button>
              </div>
            )}

            {/* STEP 3: Payment Details */}
            {step === "pay" && (
              <div className="space-y-6 text-center">
                <div>
                  <h4 className="text-4xl font-black text-white tracking-tighter mb-2">{price} {currency}</h4>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{selectedPackage.label} Boost</p>
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group relative">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Target Vault ({chain})</p>
                  <code className="text-[10px] font-mono text-emerald-500/80 break-all block px-4 mb-4">{wallet}</code>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(wallet || ""); toast.success("Vault Linked!"); }}
                    className="mx-auto flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    <HiOutlineClipboardDocument className="w-4 h-4" />
                    Copy Address
                  </button>
                </div>

                <button onClick={() => setStep("verify")} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                  Signal Sent
                </button>
                <button onClick={() => setStep("chain")} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                    Change Network
                </button>
              </div>
            )}

            {/* STEP 4: Verification */}
            {step === "verify" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Awaiting Hash Confirmation</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Transaction Hash</label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="Paste Transaction ID / Hash"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <button 
                  onClick={handleVerify} 
                  disabled={loading}
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                >
                  {loading ? "Verifying Signal..." : "Verify & Boost 🔥"}
                </button>
                <button onClick={() => setStep("pay")} className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Back</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
