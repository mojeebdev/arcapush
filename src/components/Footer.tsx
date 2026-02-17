"use client";

/** * VibeStream.cc | VibeStream Engine v6.96.0
 * [Milestone: Multichain Global Footer]
 * Logic: Permanent brand visibility with network-specific iconography.
 */

export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Multichain Power Signal */}
        <div className="flex items-center gap-6 group">
          <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Powered by</p>
          
          <div className="flex items-center gap-4">
            {/* Base Logo */}
            <div className="flex items-center gap-2">
              <img 
                src="/base-logo.png" 
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
        </div>

        {/* Clickable Labs Credit */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Innovation by:</span>
          <a 
            href="https://labs.mojeeb.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-black text-white hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] border-b border-white/10 pb-0.5"
          >
            BlindspotLabs
          </a>
        </div>
        
      </div>
    </footer>
  );
}