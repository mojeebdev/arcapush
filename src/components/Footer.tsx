"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-16 border-t border-[#4E24CF]/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* 🔗 Multichain Power Signal - Royal Purple Accents */}
        <div className="flex flex-col md:flex-row items-center gap-6 group">
          <p className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase">Powered by</p>
          
          <div className="flex items-center gap-6">
            {/* Base Logo */}
            <div className="flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-60">
              <img 
                src="/base-logo.png" 
                alt="Base" 
                className="h-3.5 w-3.5 grayscale invert group-hover:grayscale-0 group-hover:invert-0 transition-all" 
              />
              <span className="text-[10px] font-black tracking-[0.2em] text-white">BASE</span>
            </div>

            <div className="h-4 w-px bg-white/5" />

            {/* Solana Logo  */}
            <div className="flex items-center gap-2.5 transition-opacity hover:opacity-100 opacity-60">
              <img 
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" 
                alt="Solana" 
                onError={(e) => {
                  e.currentTarget.src = "https://cryptologos.cc/logos/solana-sol-logo.png?v=024";
                }}
                className="h-3.5 w-3.5 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" 
              />
              <span className="text-[10px] font-black tracking-[0.2em] text-white">SOLANA</span>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Innovation by</span>
            <a 
              href="https://labs.mojeeb.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-white hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-[0.3em] relative group/link"
            >
              BlindspotLabs
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover/link:w-full" />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}