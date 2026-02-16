"use client";

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call for the 9-5 Professional UX
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    /* Added mx-auto to guarantee horizontal centering within parent containers */
    <div className="w-full max-w-sm mx-auto mt-8">
      {status === 'success' ? (
        <div className="text-blue-400 font-medium text-center animate-pulse py-3">
          You're on the list. See you at launch. 🚀
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="email"
            required
            placeholder="Enter your email (Founder or VC)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-4 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600 pr-24"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl text-xs font-black tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'JOIN'}
          </button>
        </form>
      )}
    </div>
  );
}