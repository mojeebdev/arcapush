"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRotation } from "@/hooks/useRotation";
import { useTicker } from "@/hooks/useTicker";
import { AdminConfig } from "@/lib/adminConfig";
import { ShareButton } from "./ShareButton";
import { PaymentModal } from "./PaymentModal";
import {
  HiOutlineFire,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

interface HeroPinProps {
  startups: any[];
}

export function HeroPin({ startups }: HeroPinProps) {
  const [showPayment, setShowPayment] = useState(false);

  const { currentItem, prev, next, total } = useRotation({
    items: startups,
    intervalMs: AdminConfig.HERO_ROTATION_MS,
    enabled: startups.length > 1,
  });

  const { progress } = useTicker(AdminConfig.HERO_ROTATION_MS);

  
  if (startups.length === 0) {
    return (
      <div
        className="relative rounded-[2.5rem] overflow-hidden min-h-[420px] flex flex-col items-center justify-center"
        style={{
          border: "1px solid var(--border)",
          background: "var(--bg-2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="text-center px-8 relative z-10">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <HiOutlineBolt className="w-10 h-10" style={{ color: "var(--accent)" }} />
          </div>
          <h3
            className="text-3xl font-black mb-4 uppercase tracking-tighter"
            style={{ color: "var(--text-primary)" }}
          >
            Hero Slot Open
          </h3>
          <p className="max-w-md mb-10 text-sm font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Pin your product to the top of the registry for 30 minutes.
            Maximum visibility for VCs browsing right now.
          </p>
          <button
            onClick={() => setShowPayment(true)}
            className="ap-btn-primary"
          >
            <HiOutlineFire className="w-4 h-4 inline mr-2" />
            Boost Now — {AdminConfig.PIN_PRICE_BASE_USDC} USDC
          </button>
        </div>

        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            startupId="hero-empty-slot"
            status="APPROVED"
            onSuccess={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="relative group">

      {/* Progress bar */}
      {total > 1 && (
        <div
          className="absolute top-0 left-0 right-0 z-30 h-[2px] overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <motion.div
            className="h-full"
            style={{ background: "var(--accent)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 10, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(15px)" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{
            border: "1px solid var(--border-2)",
            background: "var(--bg)",
            boxShadow: "0 0 50px -12px rgba(232,255,71,0.1)",
          }}
        >
          {/* Visual */}
          <div className="relative h-[400px] sm:h-[480px] lg:h-[600px]">
            <Image
              src={currentItem.bannerUrl}
              alt={currentItem.name}
              fill
              className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, var(--bg), rgba(10,10,10,0.6), transparent)" }}
            />

            {/* Badges */}
            <div className="absolute top-8 left-8 z-20 flex gap-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
                style={{ background: "var(--accent)", color: "#0a0a0a" }}
              >
                <HiOutlineFire className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Boosted</span>
              </div>
              <div
                className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                style={{
                  background: "rgba(10,10,10,0.6)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--border)",
                  color: "rgba(240,237,232,0.7)",
                }}
              >
                {currentItem.category}
              </div>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-20">
              <div className="max-w-3xl">
                <h2
                  className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {currentItem.name}
                </h2>
                <p className="text-lg sm:text-xl mb-10 font-medium line-clamp-2 max-w-xl" style={{ color: "var(--text-secondary)" }}>
                  {currentItem.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/startup/${currentItem.slug ?? currentItem.id}`}
                    className="ap-btn-primary flex items-center gap-2"
                  >
                    View Product
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </Link>

                  <ShareButton startup={currentItem} />

                  {currentItem.website && (
                    <a
                      href={currentItem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ap-btn-ghost"
                    >
                      Visit Site
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nav controls */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                style={{
                  background: "rgba(10,10,10,0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-dim)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,0.6)")}
              >
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                style={{
                  background: "rgba(10,10,10,0.6)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-dim)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(10,10,10,0.6)")}
              >
                <HiOutlineChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}