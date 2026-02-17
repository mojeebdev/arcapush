"use client";
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminStartup() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    if (!pin) return;
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok && (data.authorized || data.success)) {
        setIsAuthorized(true);
        toast.success("Signal Verified"); 
      } else {
        setError(true);
        setPin("");
        toast.error("Access Denied");
      }
    } catch (err) {
      console.error("Connection failed");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 selection:bg-purple-500/30">
        <Toaster position="top-center" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black pointer-events-none" />
        
        <div className="z-10 w-full max-w-sm flex flex-col items-center text-center">
          <div className="mb-8 p-4 rounded-full bg-white/5 border border-white/10 animate-pulse">
            <img src="/logo.png" alt="Guardian" className="h-8 w-8 opacity-80" />
          </div>

          <h1 className="text-sm font-black tracking-[0.5em] uppercase text-zinc-500 mb-8">
            Guardian Access
          </h1>

          <div className="w-full space-y-4">
            <input 
              type="password" 
              placeholder="••••" 
              autoFocus
              disabled={loading}
              className={`w-full bg-zinc-900/50 border ${error ? 'border-red-500/50 animate-shake' : 'border-white/10'} p-5 rounded-2xl text-center text-3xl tracking-[0.5em] focus:outline-none focus:border-purple-500/50 transition-all font-mono text-white`}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if(error) setError(false);
              }}
              onKeyDown={handleKeyDown}
            />
            
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Decrypting..." : "Initialize Startup"}
            </button>
          </div>

          {error && (
            <p className="mt-6 text-[10px] text-red-500 font-bold uppercase tracking-[0.2em]">
              Invalid Access Key - Signal Terminated
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-green-500 uppercase">System Live</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              VibeStream <span className="text-zinc-500">Dashboard</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setIsAuthorized(false)}
            className="text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            Lock Terminal
          </button>
        </header>

        <main className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Waitlist Entries</h3>
              <p className="text-5xl font-black">0</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}