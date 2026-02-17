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
    intervalMs: AdminConfig.HERO_ROTATION_MS || 5000,
    enabled: startups.length > 1,
  });

  const { progress } = useTicker(AdminConfig.HERO_ROTATION_MS || 5000);

  
  if (startups.length === 0) {
    return (
      <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/20 backdrop-blur-xl min-h-[420px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
        <div className="text-center px-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <HiOutlineBolt className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
            Hero Slot Open
          </h3>
          <p className="text-zinc-500 max-w-md mb-10 text-sm font-medium leading-relaxed">
            Dominate the discovery feed for 30 minutes. 
            Maximum signal strength for your community project.
          </p>
          <button 
            onClick={() => setShowPayment(true)} 
            className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-emerald-500/10"
          >
            <HiOutlineFire className="w-4 h-4 inline mr-2" />
            Pin Signal — {AdminConfig.PIN_PRICE_BASE_USDC} USDC
          </button>
        </div>

        {showPayment && (
          <PaymentModal 
            onClose={() => setShowPayment(false)} 
            startupId="hero-empty-slot" 
            onSuccess={() => window.location.reload()} 
          />
        )}
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div className="relative group">
      {/* Progress Signal */}
      {total > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.99, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.01, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl"
        >
          {/* Visual Layer */}
          <div className="relative h-[400px] sm:h-[480px] lg:h-[560px]">
            <Image
              src={currentItem.bannerUrl}
              alt={currentItem.name}
              fill
              className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Badge Array */}
            <div className="absolute top-8 left-8 z-20 flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-black shadow-lg">
                <HiOutlineFire className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pinned</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black text-white/70 uppercase tracking-widest">
                {currentItem.category}
              </div>
            </div>

            {/* Information Layer */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-20">
              <div className="max-w-3xl">
                <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter uppercase">
                  {currentItem.name}
                </h2>
                <p className="text-lg sm:text-xl text-zinc-400 mb-8 font-medium line-clamp-2">
                  {currentItem.tagline}
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/startup/${currentItem.id}`}
                    className="px-8 py-4 bg-emerald-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all"
                  >
                    Request Access
                    <HiOutlineArrowRight className="w-4 h-4 inline ml-2" />
                  </Link>
                  
                  {/* Memory: Auto-Share Functionalify Integrated */}
                  <ShareButton startup={currentItem} /> 

                  {currentItem.website && (
                    <a
                      href={currentItem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Visit Signal
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls for the Traditionalist persona */}
          {total > 1 && (
            <>
              <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                <HiOutlineChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                <HiOutlineChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}