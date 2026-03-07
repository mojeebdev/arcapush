"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRotation } from "@/hooks/useRotation";
import { useTicker } from "@/hooks/useTicker";
import { AdminConfig } from "@/lib/adminConfig";
import { StartupCard } from "./StartupCard";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

interface TickerStartup {
  id: string;
  slug?: string | null;       // SEO slug — pass through to StartupCard
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
      <section className="mt-24">
        <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
          <HiOutlineRocketLaunch className="w-5 h-5 text-zinc-500" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500">Discovery Feed</h2>
        </div>
        <div className="bg-zinc-900/20 border border-dashed border-white/10 rounded-[2rem] p-20 text-center">
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
            No community signals detected.{" "}
            <a href="/submit" className="text-white hover:text-[#D4AF37] transition-colors">
              Transmit yours
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-24">
      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <HiOutlineRocketLaunch className="w-5 h-5 text-[#4E24CF] animate-pulse" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white">Live Signals</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-zinc-600 tracking-tighter">
            <span className="text-[#D4AF37]">{String(currentIndex + 1).padStart(2, '0')}</span>
            {" "}/ {String(total).padStart(2, '0')}
          </span>
          <div className="w-24 h-[1px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#D4AF37]"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Main Rotation Display */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <StartupCard startup={currentItem} variant="ticker" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All Projects Grid */}
      {startups.length > 3 && (
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5" />
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">
              All <span className="text-[#4E24CF]">Community</span> Projects
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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