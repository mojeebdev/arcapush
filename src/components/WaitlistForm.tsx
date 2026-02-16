"use client";

import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // For tomorrow's launch, we'll just simulate a save
    // We can connect this to Supabase/Resend later tonight
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="w-full max-w-sm mt-8">
      {status === 'success' ? (
        <div className="text-blue-400 font-medium text-center animate-bounce">
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
            className="w-full bg-zinc-900/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'JOIN'}
          </button>
        </form>
      )}
    </div>
  );
}