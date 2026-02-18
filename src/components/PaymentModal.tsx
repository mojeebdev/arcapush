"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AdminConfig } from "@/lib/adminConfig";
import { HiOutlineXMark, HiOutlineBolt, HiOutlineClipboardDocument, HiOutlineGlobeAlt } from "react-icons/hi2";

type Chain = "base" | "solana";

interface PaymentModalProps {
  startupId: string;
  onClose: () => void;
  onSuccess?: (data: { startupName: string; expiresAt: Date; txHash: string; duration: string }) => void;
}

export function PaymentModal({ startupId, onClose, onSuccess }: PaymentModalProps) {
  const [chain, setChain] = useState<Chain>("base");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"package" | "chain" | "pay" | "verify">("package");
  const [selectedPackage, setSelectedPackage] = useState(AdminConfig.PIN_PACKAGES[0]);

  const wallet = chain === "base" ? AdminConfig.PAYMENT_WALLET_BASE : AdminConfig.PAYMENT_WALLET_SOL;
  const price = chain === "base" ? selectedPackage.price : AdminConfig.PIN_PRICE_SOL;
  const currency = chain === "base" ? "USDC" : "SOL";

  const handleVerify = async () => {
    if (!txHash.trim()) return toast.error("Hash required for indexing.");
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
      if (!res.ok) throw new Error(data.error);

      toast.success(`🔥 Signal Boosted: ${selectedPackage.label}!`);
      
      // Trigger the celebration!
      onSuccess?.({
        startupName: data.startup.name,
        expiresAt: new Date(data.expiresAt),
        txHash: txHash.trim(),
        duration: selectedPackage.label
      });
      
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <HiOutlineBolt className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Signal Boost</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><HiOutlineXMark className="w-5 h-5 text-zinc-600" /></button>
          </div>

          <div className="p-8">
            {/* 1. Select Duration */}
            {step === "package" && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Select Duration</p>
                <div className="grid grid-cols-2 gap-3">
                    {AdminConfig.PIN_PACKAGES.map((pkg) => (
                    <button key={pkg.value} onClick={() => { setSelectedPackage(pkg); setStep("chain"); }} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/50 text-left transition-all">
                        <p className="text-white font-black text-[10px] uppercase italic">{pkg.label}</p>
                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest">${pkg.price} USDC</p>
                    </button>
                    ))}
                </div>
              </div>
            )}

            {/* 2. Select Network */}
            {step === "chain" && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Select Network</p>
                <button onClick={() => { setChain("base"); setStep("pay"); }} className="w-full p-5 rounded-2xl border border-white/5 bg-blue-500/5 hover:border-blue-500/50 flex justify-between items-center transition-all">
                  <div className="flex items-center gap-3">
                    <HiOutlineGlobeAlt className="w-5 h-5 text-blue-500" />
                    <span className="text-white font-black text-xs uppercase italic">Base Network</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">USDC</span>
                </button>
                <button onClick={() => { setChain("solana"); setStep("pay"); }} className="w-full p-5 rounded-2xl border border-white/5 bg-purple-500/5 hover:border-purple-500/50 flex justify-between items-center transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 text-[8px] flex items-center justify-center text-purple-400 font-black">S</div>
                    <span className="text-white font-black text-xs uppercase italic">Solana</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">SOL / USDC</span>
                </button>
              </div>
            )}

            {/* 3. Payment Instructions */}
            {step === "pay" && (
              <div className="space-y-6 text-center">
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-3xl font-black text-white tracking-tighter mb-1">{price} {currency}</h4>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6">Target Vault ({chain})</p>
                  <code className="text-[9px] font-mono text-emerald-500/80 break-all block mb-6 p-4 bg-black rounded-xl">{wallet}</code>
                  <button onClick={() => { navigator.clipboard.writeText(wallet || ""); toast.success("Linked!"); }} className="mx-auto flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">
                    <HiOutlineClipboardDocument className="w-4 h-4" /> Copy Address
                  </button>
                </div>
                <button onClick={() => setStep("verify")} className="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">Transmission Sent</button>
              </div>
            )}

            {/* 4. Verification */}
            {step === "verify" && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 text-center">Confirm Hash</p>
                <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="Paste Transaction Hash" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono text-xs focus:border-emerald-500 outline-none" />
                <button onClick={handleVerify} disabled={loading} className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50">
                  {loading ? "Authenticating..." : "Finalize Ascension 🔥"}
                </button>
                <button onClick={() => setStep("pay")} className="w-full text-[10px] font-black text-zinc-700 uppercase tracking-widest">Back</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
