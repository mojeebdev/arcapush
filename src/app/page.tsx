import Countdown from '@/components/Countdown';
import WaitlistForm from '@/components/WaitlistForm';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black px-4 overflow-hidden">
      
      {/* 1. Ambient Background Effects */}
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

      {/* 4. Lead Capture Section */}
      <div className="z-10 mt-12 w-full flex flex-col items-center">
        <h2 className="text-zinc-400 text-sm mb-4 font-mono">REQUEST EARLY ACCESS</h2>
        <WaitlistForm />
      </div>

      {/* 5. Footer / Chains */}
      <div className="z-10 absolute bottom-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <span className="text-xs font-bold tracking-widest">POWERED BY BASE</span>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-xs font-bold tracking-widest">SOLANA ARCHITECTURE</span>
        </div>
      </div>

    </main>
  );
}