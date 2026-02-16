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

interface PaymentModalProps {
  startupId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type Chain = "base" | "solana";

export function PaymentModal({ startupId, onClose, onSuccess }: PaymentModalProps) {
  const [chain, setChain] = useState<Chain>("base");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select" | "pay" | "verify">("select");

  const price = chain === "base" ? AdminConfig.PIN_PRICE_BASE_USDC : AdminConfig.PIN_PRICE_SOL;
  const currency = chain === "base" ? "USDC" : "SOL";
  const wallet = chain === "base" ? AdminConfig.PAYMENT_WALLET_BASE : AdminConfig.PAYMENT_WALLET_SOL;

  const copyWallet = () => {
    navigator.clipboard.writeText(wallet);
    toast.success("Wallet address copied!");
  };

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
        body: JSON.stringify({ startupId, chain, txHash: txHash.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      toast.success("🔥 Startup pinned! You're live on the Hero section.");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md glass-strong rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <HiOutlineBolt className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pin Your Startup</h3>
                <p className="text-xs text-white/40">
                  30 min Hero placement
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-300 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5 text-white/50" />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Chain Selection */}
            {step === "select" && (
              <div className="space-y-4">
                <p className="text-sm text-white/50 mb-4">
                  Choose your payment network:
                </p>

                <button
                  onClick={() => { setChain("base"); setStep("pay"); }}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left group hover:border-blue-500/50 hover:bg-blue-500/5 ${
                    chain === "base" ? "border-blue-500/50 bg-blue-500/5" : "border-white/[0.06] bg-surface-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-lg font-bold text-blue-400">
                        B
                      </div>
                      <div>
                        <p className="font-semibold text-white">Base (USDC)</p>
                        <p className="text-xs text-white/40">ERC-20 Stablecoin</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {AdminConfig.PIN_PRICE_BASE_USDC} <span className="text-sm text-white/40">USDC</span>
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => { setChain("solana"); setStep("pay"); }}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left group hover:border-purple-500/50 hover:bg-purple-500/5 ${
                    chain === "solana" ? "border-purple-500/50 bg-purple-500/5" : "border-white/[0.06] bg-surface-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-400">
                        S
                      </div>
                      <div>
                        <p className="font-semibold text-white">Solana (SOL)</p>
                        <p className="text-xs text-white/40">Native Token</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {AdminConfig.PIN_PRICE_SOL} <span className="text-sm text-white/40">SOL</span>
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2: Payment Instructions */}
            {step === "pay" && (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">
                    {price} <span className="text-lg text-white/50">{currency}</span>
                  </p>
                  <p className="text-xs text-white/30">
                    on {chain === "base" ? "Base Network" : "Solana"}
                  </p>
                </div>

                <div className="bg-surface-200 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Send to this wallet:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-accent font-mono break-all">
                      {wallet}
                    </code>
                    <button
                      onClick={copyWallet}
                      className="p-2 rounded-lg hover:bg-surface-300 transition-colors flex-shrink-0"
                    >
                      <HiOutlineClipboardDocument className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                </div>

                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                  <p className="text-xs text-gold/80">
                    ⚡ Send exactly <strong>{price} {currency}</strong> to the address above.
                    After sending, paste your transaction hash below.
                  </p>
                </div>

                <button
                  onClick={() => setStep("verify")}
                  className="btn-gold w-full"
                >
                  I&apos;ve Sent the Payment
                </button>

                <button
                  onClick={() => setStep("select")}
                  className="text-sm text-white/30 hover:text-white/50 transition-colors w-full text-center"
                >
                  ← Choose different network
                </button>
              </div>
            )}

            {/* Step 3: Verify */}
            {step === "verify" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 bg-emerald/5 border border-emerald/20 rounded-xl">
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald flex-shrink-0" />
                  <p className="text-sm text-emerald/80">
                    Paste your transaction hash to verify payment.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/60 mb-2 block">
                    Transaction Hash *
                  </label>
                  <input
                    type="text"
                    required
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x... or base58 signature"
                    className="input-field font-mono text-xs"
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading || !txHash.trim()}
                  className="btn-gold w-full"
                >
                  {loading ? "Verifying..." : "Verify & Pin 🔥"}
                </button>

                <button
                  onClick={() => setStep("pay")}
                  className="text-sm text-white/30 hover:text-white/50 transition-colors w-full text-center"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}