"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function SubmitStartup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requesterName: formData.name, 
          requesterEmail: formData.email,
          requesterFirm: formData.firm 
        }),
      });

      if (res.ok) {
        toast.success("Signal Received. Welcome to the VibeStream.");
        setTimeout(() => router.push('/'), 2000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signal Lost");
      }
    } catch (error) {
      toast.error("Transmission failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden">
      <Toaster 
        toastOptions={{
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' },
        }} 
      />
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-lg p-10 border border-white/10 rounded-[2.5rem] bg-zinc-900/20 backdrop-blur-2xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <img src="/wordmark.png" alt="VibeStream" className="h-8 mb-6 opacity-80" />
          <h1 className="text-sm font-black tracking-[0.4em] uppercase text-zinc-500">
            Request Access
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-4 font-bold">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Satoshi Nakamoto" 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-4 font-bold">Professional Email</label>
            <input 
              type="email" 
              required
              placeholder="name@firm.cc" 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-4 font-bold">Startup / Firm Name</label>
            <input 
              type="text" 
              required
              placeholder="The name of your venture" 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium"
              value={formData.firm}
              onChange={(e) => setFormData({...formData, firm: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Transmitting..." : "Initialize Application"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold">
          Vibe Code Verified Security
        </p>
      </div>
    </div>
  );
}