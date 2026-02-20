"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { 
  HiOutlineRocketLaunch, 
  HiOutlineShare, 
  HiOutlineClock, 
  HiOutlineShieldCheck 
} from "react-icons/hi2";

interface SuccessProps {
  startupName: string;
  expiresAt: Date;
  txHash: string;
  duration: string;
  onClose?: () => void; 

export function AscensionSuccess({ startupName, expiresAt, txHash, duration, onClose }: SuccessProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiresAt).getTime() - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const shareOnX = () => {
    const text = `🚀 Just ascended to PINNED status on VibeStream! \n\nCheck out ${startupName} in the Encyclopedia. \n\n#VibeStream #BuildInPublic`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black p-6 overflow-hidden">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} colors={['#4E24CF', '#D4AF37', '#ffffff']} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/30"
            />
            <div className="w-24 h-24 rounded-full bg-[#4E24CF] flex items-center justify-center shadow-[0_0_50px_rgba(78,36,207,0.5)]">
              <HiOutlineRocketLaunch className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase mb-2">
          Signal <span className="text-[#D4AF37]">Ascended</span>
        </h1>
        <p className="font-playfair text-xl text-zinc-400 italic mb-10">
          {startupName} is now live in the global rotation.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
            <HiOutlineClock className="w-5 h-5 text-[#4E24CF] mx-auto mb-2" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Time Remaining</p>
            <p className="text-xl font-black text-white font-mono tracking-tighter">{timeLeft}</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
            <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xl font-black text-emerald-500 uppercase italic tracking-tighter">Verified</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={shareOnX}
            className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-colors"
          >
            <HiOutlineShare className="w-5 h-5" /> Blast to X
          </button>
          
          
          <button 
            onClick={onClose || (() => window.location.href = '/')}
            className="w-full py-5 rounded-2xl bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-colors"
          >
            Confirm & Return
          </button>
        </div>

        <div className="mt-12">
          <code className="text-[9px] text-zinc-700 font-mono break-all uppercase">
            INDEX_HASH: {txHash}
          </code>
        </div>
      </motion.div>
    </div>
  );
}