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
          {/* ⚡ Empty Slot Icon - Royal Purple */}
          <div className="w-20 h-20 rounded-3xl bg-[#4E24CF]/10 border border-[#4E24CF]/20 flex items-center justify-center mx-auto mb-8">
            <HiOutlineBolt className="w-10 h-10 text-[#4E24CF]" />
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
            className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all active:scale-95 shadow-2xl shadow-[#4E24CF]/10"
          >
            <HiOutlineFire className="w-4 h-4 inline mr-2" />
            Pin Signal — {AdminConfig.PIN_PRICE_BASE_USDC} USDC
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
    
      {total > 1 && (
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-[#D4AF37]"
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
          className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_-12px_rgba(78,36,207,0.3)]"
        >
          {/* Visual Layer */}
          <div className="relative h-[400px] sm:h-[480px] lg:h-[600px]">
            <Image
              src={currentItem.bannerUrl}
              alt={currentItem.name}
              fill
              className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* 🎖️ Badge Array -*/}
            <div className="absolute top-8 left-8 z-20 flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] text-black shadow-lg">
                <HiOutlineFire className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Pinned</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black text-white/70 uppercase tracking-widest">
                {currentItem.category}
              </div>
            </div>

            {/* Information Layer */}
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-20">
              <div className="max-w-3xl">
                {/* Typography */}
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
                  {currentItem.name}
                </h2>
                <p className="text-lg sm:text-xl text-zinc-400 mb-10 font-medium line-clamp-2 max-w-xl">
                  {currentItem.tagline}
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/startup/${currentItem.id}`}
                    className="px-10 py-5 bg-[#4E24CF] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-[#4E24CF]/20"
                  >
                    Request Access
                    <HiOutlineArrowRight className="w-4 h-4 inline ml-2" />
                  </Link>
                  
                  {/* Share Button */}
                  <ShareButton startup={currentItem} /> 

                  {currentItem.website && (
                    <a
                      href={currentItem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-[#D4AF37]/50 transition-all"
                    >
                      Visit Signal
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 🕹️ Navigation Controls*/}
          {total > 1 && (
            <>
              <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4E24CF] text-white">
                <HiOutlineChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4E24CF] text-white">
                <HiOutlineChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}