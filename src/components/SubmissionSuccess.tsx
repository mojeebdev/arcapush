"use client";

import Link from "next/link";
import { HiOutlineShieldCheck, HiOutlineRocketLaunch, HiOutlineChartBar } from "react-icons/hi2";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function SubmissionSuccess() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#5b2bff", "#f0ede8", "#888580"],
    });
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-2xl w-full text-center">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-pulse blur-3xl"
              style={{ background: "rgba(232,255,71,0.1)" }}
            />
            <div
              className="relative p-6 rounded-[2.5rem]"
              style={{ background: "var(--bg-2)", border: "1px solid var(--accent-border)" }}
            >
              <HiOutlineShieldCheck className="w-16 h-16" style={{ color: "var(--accent)" }} />
            </div>
          </div>
        </div>

        <h1
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Listing <span style={{ color: "var(--accent)" }}>Received.</span>
        </h1>

        <p
          className="text-xl mb-12 leading-relaxed"
          style={{ color: "var(--text-secondary)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
        >
          Your product has been submitted to the Arcapush registry.<br />
          We review all listings within 6 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div
            className="p-6 rounded-2xl text-left"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <HiOutlineRocketLaunch className="w-5 h-5 mb-3" style={{ color: "var(--accent)" }} />
            <h4 className="ap-label mb-1">Free Listing</h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Indexed in the registry once approved. Verification: 2–6 hours.
            </p>
          </div>

          <Link
            href="/pricing"
            className="p-6 rounded-2xl text-left transition-all group"
            style={{
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <HiOutlineChartBar className="w-5 h-5 mb-3" style={{ color: "var(--accent)" }} />
            <h4 className="ap-label mb-1" style={{ color: "var(--accent)" }}>Boost Listing</h4>
            <p
              className="text-xs leading-relaxed transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Pin your product to the hero slot for maximum VC visibility. USDC or SOL.
            </p>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link href="/" className="ap-label transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
          >
            ← Return to Registry
          </Link>
          <Link href="/pricing" className="ap-btn-primary">
            View Boost Options
          </Link>
        </div>

      </div>
    </div>
  );
}