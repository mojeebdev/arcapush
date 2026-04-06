"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAccount } from "wagmi";
import { AdminConfig } from "@/lib/adminConfig";
import { useBoost } from "@/hooks/useBoost";
import { TierBadge } from "@/components/TierBadge";
import type { StartupTier } from "@/types";
import {
  Connection, PublicKey, Transaction,
  SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram,
} from "@solana/web3.js";

export default function PricingPage() {
  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [email, setEmail]                         = useState("");
  const [approvedStartups, setApprovedStartups]   = useState<any[]>([]);
  const [gridVisible, setGridVisible]             = useState(false);
  const [payingFor, setPayingFor]                 = useState<string | null>(null);
  const [payMethod, setPayMethod]                 = useState<"crypto" | "card">("crypto");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const tier   = params.get("tier");
    if (status === "success") toast.success(`${tier} plan activated! Welcome aboard.`);
    if (status === "failed")  toast.error("Payment failed. Please try again.");
  }, []);

  const { isConnected } = useAccount();
  const { purchaseBoost, isProcessing } = useBoost();

  useEffect(() => {
    fetch("/api/startups?status=APPROVED")
      .then((r) => r.json())
      .then((d) => setApprovedStartups(d.startups || []));
    const t = setTimeout(() => setGridVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleBasePayment = async (plan: typeof AdminConfig.PIN_PACKAGES[number]) => {
    if (!selectedStartupId) return toast.error("Select your product first.");
    setPayingFor(plan.value);
    await purchaseBoost({ startupId: selectedStartupId, packageValue: plan.value, price: plan.price });
    setPayingFor(null);
  };

  const handleSolanaPayment = async (plan: typeof AdminConfig.PIN_PACKAGES[number]) => {
    if (!selectedStartupId || !(window as any).solana)
      return toast.error("Check selection / Phantom wallet.");
    setPayingFor(plan.value);
    const toastId = toast.loading("Processing SOL...");
    try {
      const priceRes  = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const lamports  = Math.floor((plan.price / priceData.solana.usd) * LAMPORTS_PER_SOL);
      const resp      = await (window as any).solana.connect();
      const connection = new Connection(
        process.env.NEXT_PUBLIC_ALCHEMY_RPC_SOLANA || "https://api.mainnet-beta.solana.com", "confirmed"
      );
      const { blockhash } = await connection.getLatestBlockhash();
      const transaction = new Transaction({ recentBlockhash: blockhash, feePayer: resp.publicKey }).add(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25000 }),
        SystemProgram.transfer({ fromPubkey: resp.publicKey, toPubkey: new PublicKey(AdminConfig.PAYMENT_WALLET_SOLANA), lamports })
      );
      const { signature } = await (window as any).solana.signAndSendTransaction(transaction);
      await fetch("/api/pin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "solana", txHash: signature, packageValue: plan.value }),
      });
      toast.success(`${plan.label} activated!`, { id: toastId });
    } catch {
      toast.error("Payment failed.", { id: toastId });
    }
    setPayingFor(null);
  };

  const handleCardPayment = async (plan: typeof AdminConfig.PIN_PACKAGES[number]) => {
    if (!selectedStartupId) return toast.error("Select your product first.");
    if (!email)             return toast.error("Enter your email for the receipt.");
    setPayingFor(plan.value);
    const toastId = toast.loading("Redirecting to payment...");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, startupId: selectedStartupId, packageValue: plan.value }),
      });
      const data = await res.json();
      if (!data.authorizationUrl) throw new Error(data.error || "Failed to initialize");
      toast.dismiss(toastId);
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      toast.error(err.message || "Card payment failed.", { id: toastId });
    }
    setPayingFor(null);
  };

  const TIER_BORDER: Record<string, string> = {
    FREE:    "var(--border)",
    LAUNCH:  "rgba(91,43,255,0.3)",
    PRO:     "rgba(16,185,129,0.3)",
    PRO_MAX: "rgba(217,119,6,0.3)",
  };

  return (
    <main
      className="relative min-h-screen pt-32 pb-32 px-6 overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >

      {/* ── SEO Content Block (visually hidden, crawler readable) ── */}
      <section className="sr-only" aria-label="Arcapush pricing explained">
        <h2>How Arcapush Pricing Works</h2>
        <p>
          Arcapush is the definitive registry for vibe-coded products — built for solo founders
          who want their product discovered without becoming full-time marketers. Every product
          listed on Arcapush gets a permanent, Google-indexed page with structured data, a
          problem statement, and a direct link into the feed of VCs actively looking for
          AI-native startups.
        </p>
        <p>
          The Free plan is permanent — list once, stay indexed forever. Paid plans amplify
          your visibility: Launch pins you in the Signals grid for three weeks, Pro gives you
          a hero pin for a full month plus content amplification across BlindspotLab channels,
          and Pro Max gives you the full BlindspotLab studio behind your product for an entire
          year. Payments are accepted via USDC on Base, SOL on Solana, or card via Paystack.
          Apple Pay is supported for card payments.
        </p>
        <h3>Who is Arcapush for?</h3>
        <p>
          Arcapush is built for three audiences: vibe coders and solo founders who want
          discoverability without marketing overhead, VCs and angel investors actively
          sourcing the next wave of AI-native startups, and developers who want to study
          the stacks and patterns powering the best products being built right now.
        </p>
        <h3>Frequently Asked Questions</h3>
        <dl>
          <dt>Is the Free listing really permanent?</dt>
          <dd>Yes. Submit once and your product stays indexed on Arcapush indefinitely at no cost.</dd>
          <dt>What does pinning do?</dt>
          <dd>Pinned products appear at the top of the Signals grid — the most-visited section of the registry — for the full duration of your plan.</dd>
          <dt>What payment methods are accepted?</dt>
          <dd>USDC on Base Mainnet, SOL on Solana Mainnet, and card payments via Paystack. Apple Pay is supported on card.</dd>
          <dt>What is Pro Max?</dt>
          <dd>Pro Max is a yearly plan that gives you the full BlindspotLab studio — strategy, content amplification, and visibility support — behind your product for twelve months.</dd>
          <dt>Can I upgrade my plan later?</dt>
          <dd>Yes. Start on Free and upgrade to Launch, Pro, or Pro Max at any time from this page.</dd>
        </dl>
      </section>

      {/* ── Grid backdrop ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: gridVisible ? 0.4 : 0,
          backgroundImage: "linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg)", color: "var(--text-primary)",
            border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "0.72rem",
          },
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-3 flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
            Pricing
            <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="ap-display mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Get Listed.<br />
            <span style={{ color: "var(--accent)" }}>Get Found. Get Backed.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}
          >
            Every plan starts with a permanent indexed listing. Pay once to amplify.
            Pro Max gives you the full BlindspotLab studio behind you.
          </motion.p>
        </div>

        {/* ── Payment method toggle ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "32px" }}
        >
          {(["crypto", "card"] as const).map((method) => (
            <button key={method} onClick={() => setPayMethod(method)}
              style={{
                padding: "8px 20px", borderRadius: "20px", cursor: "pointer",
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s",
                background: payMethod === method ? "var(--accent)" : "var(--bg-2)",
                color:      payMethod === method ? "#fff" : "var(--text-tertiary)",
                border:     payMethod === method ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              {method === "crypto" ? "Pay with Crypto" : "Pay with Card"}
            </button>
          ))}
        </motion.div>

        {/* ── Product selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto 40px" }}
        >
          <select
            value={selectedStartupId} onChange={(e) => setSelectedStartupId(e.target.value)}
            style={{ width: "100%", borderRadius: "12px", padding: "12px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <option value="">Select your product...</option>
            {approvedStartups.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {payMethod === "card" && (
            <input
              type="email" placeholder="Your email (for receipt)" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", borderRadius: "12px", padding: "12px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          )}
        </motion.div>

        {/* ── Pricing grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "start" }}>
          {AdminConfig.PIN_PACKAGES.map((plan, i) => {
            const isPaying   = payingFor === plan.value && isProcessing;
            const tierBorder = TIER_BORDER[plan.value] || "var(--border)";

            return (
              <motion.div
                key={plan.value}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{
                  background: "var(--bg-2)",
                  border: `1px solid ${plan.featured ? tierBorder : "var(--border)"}`,
                  borderRadius: "20px", padding: "28px 24px",
                  display: "flex", flexDirection: "column", position: "relative",
                  boxShadow: plan.featured ? `0 0 40px -12px ${tierBorder}` : "none",
                }}
              >
                {plan.featured && (
                  <span style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                    Most Popular
                  </span>
                )}

                {plan.value !== "FREE" && (
                  <div style={{ marginBottom: "12px" }}>
                    <TierBadge tier={plan.value as StartupTier} size="md" />
                  </div>
                )}

                <h3 className="ap-display" style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{plan.label}</h3>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                  {plan.description}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "4px" }}>
                  <span className="ap-display" style={{ fontSize: "2.5rem", color: plan.value === "FREE" ? "var(--text-primary)" : "var(--accent)", lineHeight: 1 }}>
                    ${plan.price}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", textTransform: "uppercase" }}>
                    {plan.billingType === "yearly" ? "/ yr" : plan.price === 0 ? "forever" : "one-time"}
                  </span>
                </div>

                <div style={{ height: "1px", background: "var(--border)", margin: "16px 0" }} />

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  {plan.perks.map((perk, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", flexShrink: 0, marginTop: "1px" }}>→</span>
                      <span style={{ fontFamily: "var(--font-syne)", fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{perk}</span>
                    </li>
                  ))}
                </ul>

                {/* ── CTAs ── */}
                {plan.value === "FREE" ? (
                  <a href="/submit"
                    style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", textDecoration: "none" }}>
                    List for free →
                  </a>
                ) : payMethod === "crypto" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                      onClick={() => handleBasePayment(plan)}
                      disabled={isPaying || !selectedStartupId}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)", color: "#2563eb", fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: !selectedStartupId ? "not-allowed" : "pointer", opacity: !selectedStartupId ? 0.4 : 1, transition: "all 0.15s" }}
                      onMouseEnter={(e) => { if (selectedStartupId) { (e.currentTarget as HTMLElement).style.background = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.06)"; (e.currentTarget as HTMLElement).style.color = "#2563eb"; }}
                    >
                      {isPaying ? "Processing..." : "Pay with USDC (Base)"}
                    </button>
                    <button
                      onClick={() => handleSolanaPayment(plan)}
                      disabled={isPaying || !selectedStartupId}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--text-primary)", color: "var(--bg)", border: "1px solid var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: !selectedStartupId ? "not-allowed" : "pointer", opacity: !selectedStartupId ? 0.4 : 1, transition: "all 0.15s" }}
                      onMouseEnter={(e) => { if (selectedStartupId) { (e.currentTarget as HTMLElement).style.background = "var(--accent)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)"; }}
                    >
                      Pay with SOL (Solana)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                      onClick={() => handleCardPayment(plan)}
                      disabled={isPaying || !selectedStartupId || !email}
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: (!selectedStartupId || !email) ? "not-allowed" : "pointer", opacity: (!selectedStartupId || !email) ? 0.4 : 1, transition: "all 0.15s" }}
                    >
                      {isPaying ? "Redirecting..." : `Pay $${plan.price} with Card`}
                    </button>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Apple Pay supported at checkout
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="ap-label text-center mt-14" style={{ lineHeight: 2 }}>
          Card payments via Paystack · Crypto via Base USDC or Solana · Apple Pay supported
          <br />
          <a href="https://blindspotlab.xyz" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
            blindspotlab.xyz →
          </a>
        </p>

      </div>
    </main>
  );
}