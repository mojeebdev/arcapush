"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRotation } from "@/hooks/useRotation";
import { useTicker } from "@/hooks/useTicker";
import { AdminConfig } from "@/lib/adminConfig";
import { StartupCard } from "./StartupCard";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

interface TickerStartup {
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
  viewCount: number;
  createdAt: string;
}

interface DiscoveryTickerProps {
  startups: TickerStartup[];
}

export function DiscoveryTicker({ startups }: DiscoveryTickerProps) {
  const { currentItem, currentIndex, total } = useRotation({
    items: startups,
    intervalMs: AdminConfig.TICKER_ROTATION_MS,
    enabled: startups.length > 1,
  });

  const { progress } = useTicker(AdminConfig.TICKER_ROTATION_MS);

  if (startups.length === 0) {
    return (
      <section className="mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <HiOutlineRocketLaunch className="w-4 h-4 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-white">Discovery Feed</h2>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-white/40">
            No community startups yet. Be the first to{" "}
            <a href="/submit" className="text-accent hover:underline">
              submit yours
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <HiOutlineRocketLaunch className="w-4 h-4 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-white">Discovery Feed</h2>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-white/30 font-mono">
            {currentIndex + 1}/{total}
          </span>
          <div className="w-20 h-1 bg-surface-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/60 rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Ticker display */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 60, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -60, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StartupCard startup={currentItem} variant="ticker" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All startups grid (static) */}
      {startups.length > 3 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-6">
            All Community Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                variant="grid"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}