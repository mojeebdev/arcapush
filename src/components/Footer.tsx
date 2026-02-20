"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full pt-24 pb-16 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-zinc-900" />
            <span className="text-[10px] font-black tracking-[0.8em] text-zinc-600 uppercase">
              Vibe Code | Venture Capital
            </span>
            <div className="h-[1px] w-12 bg-zinc-900" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center gap-6 group">
            <p className="text-[10px] font-black tracking-[0.4em] text-zinc-700 uppercase">Powered by</p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-40">
                <img 
                  src="/base-logo.png" 
                  alt="Base" 
                  className="h-3 w-3 grayscale invert" 
                />
                <span className="text-[9px] font-black tracking-[0.2em] text-white">BASE</span>
              </div>

              <div className="h-3 w-px bg-white/5" />

              <div className="flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-40">
                <img 
                  src="https://cryptologos.cc/logos/solana-sol-logo.png?v=024" 
                  alt="Solana" 
                  className="h-3 w-3 brightness-0 invert" 
                />
                <span className="text-[9px] font-black tracking-[0.2em] text-white">SOLANA</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Innovation by</span>
              <a 
                href="https://labs.mojeeb.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] font-black text-zinc-400 hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-[0.3em] relative group/link"
              >
                BlindspotLabs
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover/link:w-full" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}