"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineLockClosed, HiOutlineFingerPrint } from "react-icons/hi2";
import AdminDashboardView from "@/components/AdminDashboard";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!pin) return;
    setLoading(true);

    try {
      
      const response = await fetch("/admin/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await response.json();

      
      if (response.ok && data.authorized) {
        setIsAuthorized(true);
        toast.success("Guardian Identified");
      } else {
        toast.error(data.error || "Invalid Guardian Pin");
        setPin("");
      }
    } catch (err) {
      console.error("📡 Signal Failure:", err);
      toast.error("Signal Lost");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 relative">
        <Toaster position="top-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4E24CF]/10 via-transparent to-transparent opacity-50" />
        <div className="z-10 w-full max-w-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 mb-10 shadow-2xl">
            <HiOutlineLockClosed className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-[10px] font-black tracking-[0.6em] uppercase text-zinc-500 mb-10">Guardian Protocol</h1>
          <input 
            type="password" 
            placeholder="PIN" 
            autoFocus
            className="w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl text-center text-3xl tracking-[0.8em] focus:outline-none focus:border-[#4E24CF]/50 transition-all font-mono shadow-2xl placeholder:text-zinc-900"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] mt-6 hover:bg-[#D4AF37] transition-all shadow-2xl flex items-center justify-center gap-2"
          >
            {loading ? "Decrypting..." : <>Verify Identity <HiOutlineFingerPrint className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto relative">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase">Guardian Stream: Synchronized</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">
              Vibe <span className="text-[#4E24CF]">Stream</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsAuthorized(false)} 
            className="text-[9px] font-black tracking-[0.3em] uppercase px-10 py-4 border border-white/5 rounded-full bg-zinc-950 hover:bg-red-500/10 hover:text-red-500 transition-all shadow-2xl"
          >
            Lock Terminal
          </button>
        </header>
        <main className="mt-20">
          <AdminDashboardView guardianPin={pin} />
        </main>
      </div>
    </div>
  );
}
