"use client";

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      {status === 'success' ? (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 text-center animate-in fade-in zoom-in duration-500">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
            Access Granted. See you at launch. 🚀
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative group p-1 bg-white/[0.02] rounded-[2rem] border border-white/5 transition-all hover:border-white/10">
          <input
            type="email"
            required
            placeholder="Enter your email (Founder or VC)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-white px-6 py-5 rounded-[1.8rem] focus:outline-none transition-all placeholder:text-zinc-600 pr-32 font-bold text-sm tracking-tight"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="absolute right-2 top-2 bottom-2 bg-white text-black px-8 rounded-[1.5rem] text-[10px] font-black tracking-widest transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase shadow-2xl"
          >
            {status === 'loading' ? (
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-black rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : 'Join List'}
          </button>
        </form>
      )}
      <p className="text-[9px] text-zinc-600 text-center mt-4 font-black uppercase tracking-widest">
        No Spam. Only High-Signal Updates.
      </p>
    </div>
  );
}