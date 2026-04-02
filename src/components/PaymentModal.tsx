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
  HiOutlineCreditCard,
} from "react-icons/hi2";
import { useAccount } from "wagmi";
import { useBoost } from "@/hooks/useBoost";
import {
  Connection, PublicKey, Transaction,
  SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram,
} from "@solana/web3.js";

interface PaymentModalProps {
  startupId:  string;
  status:     string;
  onClose:    () => void;
  onSuccess?: (data: any) => void;
}

type Step = "package" | "method" | "card-email";

export function PaymentModal({ startupId, status, onClose, onSuccess }: PaymentModalProps) {
  const [mounted, setMounted]               = useState(false);
  const [step, setStep]                     = useState<Step>("package");
  const [selectedPackage, setSelectedPackage] = useState(
    AdminConfig.PIN_PACKAGES.find((p) => p.price > 0) ?? AdminConfig.PIN_PACKAGES[1]
  );
  const [email, setEmail]                   = useState("");
  const [cardLoading, setCardLoading]       = useState(false);

  const { isConnected }                          = useAccount();
  const { purchaseBoost, isProcessing: loading } = useBoost();

  useEffect(() => { setMounted(true); }, []);

  // ── USDC on Base ────────────────────────────────────────────────────────────
  const handleBasePay = async () => {
    await purchaseBoost({
      startupId,
      packageValue: selectedPackage.value,
      price:        selectedPackage.price,
      onSuccess:    (data) => { onSuccess?.(data); onClose(); },
    });
  };

  // ── SOL on Solana ───────────────────────────────────────────────────────────
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
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: resp.publicKey }).add(
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
        body:    JSON.stringify({
          startupId,
          chain:        "solana",
          txHash:       signature,
          packageValue: selectedPackage.value,
        }),
      });

      if (!res.ok) throw new Error("Database sync failed.");
      toast.success("Solana boost active!", { id: toastId });
      onSuccess?.(await res.json());
      onClose();
    } catch {
      toast.error("Payment failed. Check your SOL balance.", { id: toastId });
    }
  };

  // ── Card via Paystack ───────────────────────────────────────────────────────
  const handleCardPay = async () => {
    if (!email) return toast.error("Enter your email first.");
    setCardLoading(true);
    const toastId = toast.loading("Redirecting to payment...");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email,
          startupId,
          packageValue: selectedPackage.value,
        }),
      });
      const data = await res.json();
      if (!data.authorizationUrl) throw new Error(data.error || "Init failed");
      toast.dismiss(toastId);
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      toast.error(err.message || "Card payment failed.", { id: toastId });
    }
    setCardLoading(false);
  };

  if (!mounted) return null;

  const isLoading = loading || cardLoading;

  // ── Shared styles ───────────────────────────────────────────────────────────
  const monoSm  = { fontFamily: "var(--font-mono)", fontSize: "0.6rem",  letterSpacing: "0.12em", textTransform: "uppercase" as const };
  const monoMd  = { fontFamily: "var(--font-mono)", fontSize: "0.7rem",  fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em" };
  const dimText = { ...monoSm, color: "rgba(255,255,255,0.3)" };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <HiOutlineShieldCheck className="w-5 h-5" style={{ color: "#fff" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
                  Boost Your Product
                </h3>
                <p style={{ ...dimText, marginTop: "2px" }}>
                  Arcapush · v{AdminConfig.ARCAPUSH_VERSION}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full transition-colors"
              style={{ color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}>
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">

            {/* Step 1 — Pick plan */}
            {step === "package" && (
              <div className="space-y-4">
                <p style={dimText}>Select plan</p>
                <div className="grid grid-cols-1 gap-3">
                  {AdminConfig.PIN_PACKAGES.filter((p) => p.price > 0).map((pkg) => (
                    <button key={pkg.value}
                      onClick={() => { setSelectedPackage(pkg); setStep("method"); }}
                      className="p-4 rounded-2xl text-left transition-all w-full"
                      style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", cursor: "pointer" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.background = "rgba(91,43,255,0.05)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ ...monoMd, color: "#fff" }}>{pkg.label}</p>
                        <p style={{ ...monoSm, color: "var(--accent)", fontWeight: 700 }}>
                          ${pkg.price}{pkg.billingType === "yearly" ? "/yr" : " once"}
                        </p>
                      </div>
                      <p style={{ ...monoSm, color: "rgba(255,255,255,0.3)", marginTop: "4px", fontSize: "0.55rem" }}>
                        {pkg.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Pick payment method */}
            {step === "method" && (
              <div className="space-y-3">
                <p style={dimText}>
                  {selectedPackage.label} · ${selectedPackage.price}{selectedPackage.billingType === "yearly" ? "/yr" : " once"}
                </p>

                {/* USDC Base */}
                <button onClick={handleBasePay} disabled={isLoading}
                  className="w-full p-5 rounded-2xl flex justify-between items-center transition-all disabled:opacity-40"
                  style={{ border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.05)", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(96,165,250,0.05)"; }}>
                  <div className="flex items-center gap-3">
                    <HiOutlineGlobeAlt className="w-5 h-5" style={{ color: "#60a5fa" }} />
                    <span style={{ ...monoMd, color: "#fff" }}>USDC on Base</span>
                  </div>
                  {isLoading
                    ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                    : <span style={{ ...monoSm, color: "rgba(96,165,250,0.5)" }}>EVM</span>
                  }
                </button>

                {/* SOL */}
                <button onClick={handleSolanaPay} disabled={isLoading}
                  className="w-full p-5 rounded-2xl flex justify-between items-center transition-all disabled:opacity-40"
                  style={{ border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.05)", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(167,139,250,0.05)"; }}>
                  <div className="flex items-center gap-3">
                    <HiOutlineBolt className="w-5 h-5" style={{ color: "#a78bfa" }} />
                    <span style={{ ...monoMd, color: "#fff" }}>SOL on Solana</span>
                  </div>
                  {isLoading
                    ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
                    : <span style={{ ...monoSm, color: "rgba(167,139,250,0.5)" }}>SOL</span>
                  }
                </button>

                {/* Card */}
                <button onClick={() => setStep("card-email")} disabled={isLoading}
                  className="w-full p-5 rounded-2xl flex justify-between items-center transition-all disabled:opacity-40"
                  style={{ border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.05)"; }}>
                  <div className="flex items-center gap-3">
                    <HiOutlineCreditCard className="w-5 h-5" style={{ color: "#34d399" }} />
                    <span style={{ ...monoMd, color: "#fff" }}>Card / Apple Pay</span>
                  </div>
                  <span style={{ ...monoSm, color: "rgba(16,185,129,0.5)" }}>Paystack</span>
                </button>

                <button onClick={() => setStep("package")}
                  style={{ ...dimText, width: "100%", paddingTop: "12px", background: "transparent", border: "none", cursor: "pointer", textAlign: "center" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}>
                  ← Back to plans
                </button>
              </div>
            )}

            {/* Step 3 — Card email entry */}
            {step === "card-email" && (
              <div className="space-y-4">
                <p style={dimText}>
                  {selectedPackage.label} · ${selectedPackage.price}{selectedPackage.billingType === "yearly" ? "/yr" : " once"} · Card
                </p>
                <p style={{ ...monoSm, color: "rgba(255,255,255,0.5)", fontSize: "0.6rem" }}>
                  Enter your email to receive the payment receipt.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCardPay()}
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: "14px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                    outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button onClick={handleCardPay} disabled={cardLoading || !email}
                  className="w-full p-4 rounded-2xl transition-all disabled:opacity-40"
                  style={{ background: "var(--accent)", color: "#fff", border: "none", cursor: email ? "pointer" : "not-allowed", ...monoMd }}>
                  {cardLoading ? "Redirecting..." : `Pay $${selectedPackage.price} with Card →`}
                </button>
                <button onClick={() => setStep("method")}
                  style={{ ...dimText, width: "100%", paddingTop: "8px", background: "transparent", border: "none", cursor: "pointer", textAlign: "center" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}>
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