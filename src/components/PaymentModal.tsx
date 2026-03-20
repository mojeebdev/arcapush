"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { AdminConfig } from "@/lib/adminConfig";
import {
  HiOutlineXMark,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { useAccount } from "wagmi";
import { useBoost } from "@/hooks/useBoost";
import {
  Connection, PublicKey, Transaction,
  SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram,
} from "@solana/web3.js";

interface PaymentModalProps {
  startupId: string;
  status:    string;
  onClose:   () => void;
  onSuccess?: (data: any) => void;
}

export function PaymentModal({ startupId, status, onClose, onSuccess }: PaymentModalProps) {
  const [mounted, setMounted]                   = useState(false);
  const [step, setStep]                         = useState<"package" | "chain">("package");
  const [selectedPackage, setSelectedPackage]   = useState(AdminConfig.PIN_PACKAGES[0]);

  const { isConnected } = useAccount();
  const { purchaseBoost, isProcessing: loading } = useBoost();

  useEffect(() => { setMounted(true); }, []);

  
  const handleBasePay = async () => {
    await purchaseBoost({
      startupId,
      packageValue: selectedPackage.value,
      price:        selectedPackage.price,
      onSuccess:    (data) => { onSuccess?.(data); onClose(); },
    });
  };

  
  const handleSolanaPay = async () => {
    const provider    = (window as any)?.solana;
    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOLANA;
    const solanaRpc   = process.env.NEXT_PUBLIC_ALCHEMY_RPC_SOLANA || "https://api.mainnet-beta.solana.com";
    if (!provider?.isPhantom) return toast.error("Phantom wallet not detected.");
    if (!destination)         return toast.error("Solana config missing.");

    const toastId = toast.loading("Connecting to Solana...");
    try {
      const resp       = await provider.connect();
      const connection = new Connection(solanaRpc, "confirmed");
      const priceRes   = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData  = await priceRes.json();
      const lamports   = Math.floor((selectedPackage.price / priceData.solana.usd) * LAMPORTS_PER_SOL);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: resp.publicKey,
      }).add(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 15000 }),
        SystemProgram.transfer({
          fromPubkey: resp.publicKey,
          toPubkey:   new PublicKey(destination),
          lamports,
        })
      );
      const { signature } = await provider.signAndSendTransaction(transaction);
      toast.loading("Verifying on ledger...", { id: toastId });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
      const res = await fetch("/api/pin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ startupId, chain: "solana", txHash: signature, packageValue: selectedPackage.value }),
      });
      if (!res.ok) throw new Error("Database sync failed.");
      toast.success("🔥 Solana boost active!", { id: toastId });
      onSuccess?.(await res.json());
      onClose();
    } catch {
      toast.error("Payment failed. Check your SOL balance.", { id: toastId });
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{ background: "#0F0F12", border: "1px solid rgba(255,255,255,0.08)" }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <HiOutlineShieldCheck className="w-5 h-5" style={{ color: "#fff" }} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic leading-none" style={{ color: "#fff" }}>
                  Ascension
                </h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "0.25rem" }}>
                  Signal Terminal v23.2.02
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">
            {step === "package" ? (
              <div className="space-y-4">
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Select Signal Duration
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {AdminConfig.PIN_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.value}
                      onClick={() => { setSelectedPackage(pkg); setStep("chain"); }}
                      className="p-4 rounded-2xl text-left transition-all"
                      style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                    >
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {pkg.label}
                      </p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", marginTop: "0.25rem" }}>
                        ${pkg.price}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Select Protocol
                </p>

                {/* Base */}
                <button
                  onClick={handleBasePay}
                  disabled={loading}
                  className="w-full p-5 rounded-2xl flex justify-between items-center transition-all disabled:opacity-40"
                  style={{ border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.05)"; }}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineGlobeAlt className="w-5 h-5" style={{ color: "#60a5fa" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Base One-Tap (USDC)
                    </span>
                  </div>
                  {loading
                    ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                    : <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(96,165,250,0.5)" }}>EVM</span>
                  }
                </button>

                {/* Solana */}
                <button
                  onClick={handleSolanaPay}
                  disabled={loading}
                  className="w-full p-5 rounded-2xl flex justify-between items-center transition-all disabled:opacity-40"
                  style={{ border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.05)"; }}
                >
                  <div className="flex items-center gap-3">
                    <HiOutlineBolt className="w-5 h-5" style={{ color: "#a78bfa" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Solana One-Tap (SOL)
                    </span>
                  </div>
                  {loading
                    ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                    : <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(167,139,250,0.5)" }}>SOL</span>
                  }
                </button>

                <button
                  onClick={() => setStep("package")}
                  className="w-full pt-4 transition-colors"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)")}
                >
                  ← Back to Plans
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}