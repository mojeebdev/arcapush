"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  HiOutlineRocketLaunch,
  HiOutlineShare,
  HiOutlineClock,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

interface SuccessProps {
  startupName: string;
  expiresAt: Date;
  txHash: string;
  duration: string;
  startupSlug?: string | null;
  startupId?: string;
  onClose?: () => void;
}

export function AscensionSuccess({
  startupName, expiresAt, txHash, duration,
  startupSlug, startupId, onClose,
}: SuccessProps) {
  const [timeLeft, setTimeLeft]   = useState("");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setInterval(() => {
      const distance = new Date(expiresAt).getTime() - Date.now();
      if (distance < 0) { setTimeLeft("EXPIRED"); clearInterval(timer); return; }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const startupPath = startupSlug ?? startupId;
  const startupUrl  = startupPath
    ? `https://arcapush.com/startup/${startupPath}`
    : "https://arcapush.com/registry";

  const shareOnX = () => {
    const text = `🚀 Just boosted ${startupName} to the top of @arcapush!\n\nDiscover it here 👇\n${startupUrl}\n\n#Arcapush #VibeCoding #BuildInPublic`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        colors={[
          "var(--accent)" as string,
          "#0A0A0F",
          "#5B2BFF",
          "#8A8580",
          "#EFEDE6",
        ]}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full text-center"
      >
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: "var(--accent-border)" }}
            />
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 50px rgba(91,43,255,0.2)",
              }}
            >
              <HiOutlineRocketLaunch className="w-10 h-10" style={{ color: "#fff" }} />
            </div>
          </div>
        </div>

        <h1 className="ap-display mb-2" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", color: "var(--text-primary)" }}>
          Boost <span style={{ color: "var(--accent)" }}>Active</span>
        </h1>
        <p className="text-xl mb-10" style={{ color: "var(--text-secondary)", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
          {startupName} is now pinned to the top of the registry.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-6 rounded-[2rem]"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <HiOutlineClock className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--accent)" }} />
            <p className="ap-label mb-1">Time Remaining</p>
            <p className="text-xl font-black font-mono tracking-tighter" style={{ color: "var(--text-primary)" }}>
              {timeLeft}
            </p>
          </div>
          <div className="p-6 rounded-[2rem]"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <HiOutlineShieldCheck className="w-5 h-5 mx-auto mb-2" style={{ color: "#16a34a" }} />
            <p className="ap-label mb-1">Status</p>
            <p className="text-xl font-black uppercase italic tracking-tighter" style={{ color: "#16a34a" }}>
              Verified
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button onClick={shareOnX} className="ap-btn-primary w-full flex items-center justify-center gap-3">
            <HiOutlineShare className="w-5 h-5" /> Share on X
          </button>
          <button
            onClick={onClose || (() => (window.location.href = "/"))}
            className="ap-btn-ghost w-full"
          >
            Return to Registry
          </button>
        </div>

        <div className="mt-12">
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.06em", color: "var(--text-tertiary)", wordBreak: "break-all", textTransform: "uppercase" }}>
            TX: {txHash}
          </code>
        </div>
      </motion.div>
    </div>
  );
}