"use client";
import Link from "next/link";
import { HiOutlineShieldCheck, HiOutlineRocketLaunch, HiOutlineChartBar } from "react-icons/hi2";
import confetti from 'canvas-confetti';
import { useEffect } from "react";

export default function SubmissionSuccess() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4E24CF', '#D4AF37']
    });
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Guardian Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4E24CF]/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-zinc-950 border border-white/10 p-6 rounded-[2.5rem]">
              <HiOutlineShieldCheck className="w-16 h-16 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
          Signal <span className="text-[#4E24CF]">Received.</span>
        </h1>
        
        <p className="text-xl text-zinc-400 font-serif italic mb-12">
          Your "Vibe Code" has been transmitted to the Encyclopedia. <br />
          The Guardian is now performing manual verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl text-left">
            <HiOutlineRocketLaunch className="w-5 h-5 text-[#4E24CF] mb-3" />
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Standard Entry</h4>
            <p className="text-zinc-500 text-[10px] leading-relaxed">Indexed in the discovery ticker once approved. Verification time: 2-6 hours.</p>
          </div>
          <Link href="/pricing" className="bg-zinc-950/50 border border-[#D4AF37]/30 p-6 rounded-2xl text-left hover:bg-[#D4AF37]/5 transition-colors group">
            <HiOutlineChartBar className="w-5 h-5 text-[#D4AF37] mb-3" />
            <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">Boost Signal</h4>
            <p className="text-zinc-500 text-[10px] leading-relaxed group-hover:text-zinc-300 transition-colors">Skip the queue and pin your startup to the top for maximum investor eyes.</p>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link 
            href="/" 
            className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-colors"
          >
            ← Return to Encyclopedia
          </Link>
          <Link 
            href="/pricing"
            className="bg-white text-black px-12 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all shadow-2xl"
          >
            View Featured Options
          </Link>
        </div>
      </div>
    </div>
  );
}