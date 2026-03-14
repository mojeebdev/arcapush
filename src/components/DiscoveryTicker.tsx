"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRotation } from "@/hooks/useRotation";
import { useTicker } from "@/hooks/useTicker";
import { AdminConfig } from "@/lib/adminConfig";
import { StartupCard } from "./StartupCard";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

interface TickerStartup {
  id: string;
  slug?: string | null;
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
        <div
          className="flex items-center gap-4 mb-10 pb-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <HiOutlineRocketLaunch className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
          <h2 className="ap-mono">Discovery Feed</h2>
        </div>
        <div
          className="rounded-[2rem] p-20 text-center border border-dashed"
          style={{ background: "rgba(255,255,255,0.01)", borderColor: "var(--border)" }}
        >
          <p className="ap-label">
            No products indexed yet.{" "}
            <a
              href="/submit"
              className="transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
            >
              List yours
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-24">
      {/* Header row */}
      <div
        className="flex items-center justify-between mb-10 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-4">
          <HiOutlineRocketLaunch
            className="w-5 h-5 animate-pulse"
            style={{ color: "var(--accent)" }}
          />
          <h2
            className="text-sm font-black uppercase tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            Live Signals
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-tighter" style={{ color: "var(--text-tertiary)" }}>
            <span style={{ color: "var(--accent)" }}>{String(currentIndex + 1).padStart(2, "0")}</span>
            {" "}/ {String(total).padStart(2, "0")}
          </span>
          <div
            className="w-24 h-px rounded-full overflow-hidden"
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
        </div>
      </div>

      {/* Main rotation */}
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

      {/* All projects grid */}
      {startups.length > 3 && (
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, var(--border))" }} />
            <h3 className="ap-label">
              All <span style={{ color: "var(--accent)" }}>Products</span>
            </h3>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, var(--border))" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} variant="grid" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}