"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AdminConfig } from "@/lib/adminConfig";
import { HiOutlineXMark, HiOutlineBolt, HiOutlineShieldCheck, HiOutlineLockClosed } from "react-icons/hi2";
import { useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import * as solanaWeb3 from "@solana/web3.js";

type Chain = "base" | "solana";

interface PaymentModalProps {
  startupId: string;
  status: string; 
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

export function PaymentModal({ startupId, status, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"package" | "chain">("package");
  const [selectedPackage, setSelectedPackage] = useState(AdminConfig.PIN_PACKAGES[0]);

  const isApproved = status === "APPROVED";
  const { mutateAsync: sendBaseTx } = useSendTransaction();

  
  const handleBasePay = async () => {
    setLoading(true);
    const toastId = toast.loading("Initiating Base Handshake...");
    try {
      const hash = await sendBaseTx({
        to: AdminConfig.PAYMENT_WALLET_BASE as `0x${string}`,
        value: parseUnits(selectedPackage.price.toString(), 6), 
      });

      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, chain: "base", txHash: hash, packageValue: selectedPackage.value }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("🔥 Signal Boosted on Base!", { id: toastId });
      onSuccess?.(data);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Base Transmission Failed", { id: toastId });
    } finally { setLoading(false); }
  };

  
  const handleSolanaPay = async () => {
    if (!window.solana) return toast.error("Please install Phantom or Solflare.");
    setLoading(true);
    const toastId = toast.loading("Fetching SOL Market Price...");

    try {
      // 1. Get Market Price
      const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const solAmount = selectedPackage.price / priceData.solana.usd;
      const lamports = Math.floor(solAmount * solanaWeb3.LAMPORTS_PER_SOL);

      // 2. Transaction Handshake
      const resp = await window.solana.connect();
      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
      const { blockhash } = await connection.getLatestBlockhash();
      
      const transaction = new solanaWeb3.Transaction({
        recentBlockhash: blockhash,
        feePayer: resp.publicKey
      }).add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: resp.publicKey,
          toPubkey: new solanaWeb3.PublicKey(AdminConfig.PAYMENT_WALLET_SOLANA),
          lamports: lamports,
        })
      );

      const { signature } = await window.solana.signAndSendTransaction(transaction);
      toast.loading("Verifying Solana Signal...", { id: toastId });

      
      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, chain: "solana", txHash: signature, packageValue: selectedPackage.value }),
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

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      >
        <motion.div 
          className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden" 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isApproved ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                {isApproved ? <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" /> : <HiOutlineLockClosed className="w-5 h-5 text-red-500" />}
              </div>
              <h3 className="text-lg font-black text-white uppercase italic">{isApproved ? "Ascension" : "Locked"}</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><HiOutlineXMark className="w-5 h-5 text-zinc-600" /></button>
          </div>

          <div className="p-8">
            {!isApproved ? (
              <div className="text-center py-10 space-y-6">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Guardian verification pending.</p>
                <button onClick={onClose} className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-black text-[10px] uppercase">Exit Terminal</button>
              </div>
            ) : (
              <div className="space-y-6">
                {step === "package" ? (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Choose Duration</p>
                    <div className="grid grid-cols-2 gap-3">
                      {AdminConfig.PIN_PACKAGES.map((pkg) => (
                        <button key={pkg.value} onClick={() => { setSelectedPackage(pkg); setStep("chain"); }} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#D4AF37] text-left">
                          <p className="text-white font-black text-[10px] uppercase">{pkg.label}</p>
                          <p className="text-[10px] text-[#D4AF37] font-bold">${pkg.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select Protocol</p>
                    <button onClick={handleBasePay} disabled={loading} className="w-full p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <HiOutlineGlobeAlt className="w-5 h-5 text-blue-500" />
                        <span className="text-white font-black text-xs uppercase italic">Base One-Tap</span>
                      </div>
                      {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                    </button>
                    
                    <button onClick={handleSolanaPay} disabled={loading} className="w-full p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <HiOutlineBolt className="w-5 h-5 text-purple-500" />
                        <span className="text-white font-black text-xs uppercase italic">Solana One-Tap</span>
                      </div>
                    </button>
                    <button onClick={() => setStep("package")} className="w-full text-[9px] font-black text-zinc-700 uppercase pt-4">Change Package</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


function HiOutlineGlobeAlt(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}