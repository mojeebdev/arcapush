"use client";

import Countdown from '@/components/Countdown';
import WaitlistForm from '@/components/WaitlistForm';
export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center px-4 overflow-hidden">
      
      {/* 1. Ambient Background Effects (The Vibe) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* 2. Brand Section */}
      <div className="z-10 flex flex-col items-center mb-12">
        <img 
          src="/wordmark.png" 
          alt="VibeStream.cc" 
          className="h-16 md:h-20 w-auto drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-transform hover:scale-105 duration-700"
        />
        <p className="mt-4 text-zinc-500 text-sm md:text-base font-medium tracking-[0.2em] uppercase">
          Venture Capital <span className="text-zinc-700 mx-2">|</span> Vibe Code
        </p>
      </div>

      {/* 3. Countdown Section */}
      <div className="z-10 scale-90 md:scale-100">
        <Countdown />
      </div>

      {/* 4. Lead Capture Section (Waitlist) */}
      <div className="z-10 mt-12 w-full flex flex-col items-center">
        <h2 className="text-zinc-400 text-sm mb-4 font-mono tracking-widest">REQUEST EARLY ACCESS</h2>
        <WaitlistForm />
      </div>

      {/* 5. Institutional Footer (Base & Solana Integration) */}
      <div className="z-10 mt-24 mb-10 flex flex-col items-center gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-6 px-6 py-3 rounded-full opacity-60 hover:opacity-100 transition-all duration-500 group">
          
          {/* Base Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/white/base-symbol-white.png" 
              alt="Base" 
              className="h-4 w-4 transition-transform group-hover:rotate-12" 
            />
            <span className="text-[10px] font-black tracking-[0.2em] text-white">BASE</span>
          </div>

          <div className="h-3 w-px bg-white/20" />

          {/* Solana Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" 
              alt="Solana" 
              className="h-4 w-4 brightness-0 invert transition-transform group-hover:-rotate-12" 
            />
            <span className="text-[10px] font-black tracking-[0.2em] text-white">SOLANA</span>
          </div>
        </div>
        <p className="text-[8px] text-zinc-600 tracking-[0.5em] uppercase font-bold">Vibe Code Verified</p>
      </div>
    </div>
    
  );
}