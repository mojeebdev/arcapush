"use client";

import { useEffect, useState } from "react";
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

interface PinnedStartup {
  id: string;
  name: string;
  tagline: string;
  problemStatement: string;
  bannerUrl: string;
  logoUrl: string | null;
  category: string;
  website: string | null;
  twitter: string | null;
  tier: string;
  pinnedAt: string | null;
  pinnedUntil: string | null;
  viewCount: number;
}

interface HeroPinProps {
  startups: PinnedStartup[];
}

export function HeroPin({ startups }: HeroPinProps) {
  const [showPayment, setShowPayment] = useState(false);

  const { currentItem, currentIndex, next, prev, total } = useRotation({
    items: startups,
    intervalMs: AdminConfig.HERO_ROTATION_MS,
    enabled: startups.length > 1,
  });

  const { progress } = useTicker(AdminConfig.HERO_ROTATION_MS);

  if (!currentItem && startups.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden glass glow-accent min-h-[420px] flex flex-col items-center justify-center">
        <div className="text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <HiOutlineBolt className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Hero Pin Available
          </h3>
          <p className="text-white/40 max-w-md mb-6">
            Get your startup featured at the top of VibeStream for 30 minutes.
            Maximum visibility. Maximum impact.
          </p>
          <button onClick={() => setShowPayment(true)} className="btn-gold">
            <HiOutlineFire className="w-4 h-4 inline mr-2" />
            Pin Your Startup — {AdminConfig.PIN_PRICE_BASE_USDC} USDC
          </button>
        </div>
        {showPayment && (
          <PaymentModal onClose={() => setShowPayment(false)} startupId="" />
        )}
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="relative">
      {/* Progress bar */}
      {total > 1 && (
        <div className="absolute top-0 left-0 right-0 z-20 h-0.5 bg-surface-300 rounded-full overflow-hidden">
          <div
            className="progress-bar h-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden glass glow-gold group"
        >
          {/* Banner Image */}
          <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden">
            <Image
              src={currentItem.bannerUrl}
              alt={currentItem.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface/40 to-transparent" />

            {/* Pinned badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 backdrop-blur-md border border-gold/30">
                <HiOutlineFire className="w-3.5 h-3.5 text-gold-light" />
                <span className="text-xs font-semibold text-gold-light tracking-wide uppercase">
                  Pinned
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1.5 rounded-full glass text-xs font-medium text-white/70">
                {currentItem.category}
              </div>
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <div className="flex items-start gap-4">
                {currentItem.logoUrl && (
                  <div className="hidden sm:block w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-surface-200">
                    <Image
                      src={currentItem.logoUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                    {currentItem.name}
                  </h2>
                  <p className="text-base sm:text-lg text-white/60 mb-4 line-clamp-1">
                    {currentItem.tagline}
                  </p>
                  <p className="text-sm text-white/40 max-w-2xl line-clamp-2 mb-5">
                    {currentItem.problemStatement}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/startup/${currentItem.id}`}
                      className="btn-primary text-sm"
                    >
                      Request Access
                      <HiOutlineArrowRight className="w-4 h-4 inline ml-2" />
                    </Link>
                    <ShareButton startup={currentItem} />
                    {currentItem.website && (
                      <a
                        href={currentItem.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm"
                      >
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-300"
              >
                <HiOutlineChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-300"
              >
                <HiOutlineChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {startups.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}