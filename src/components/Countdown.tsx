"use client";

import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    
    const targetDate = new Date("2026-02-17T15:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    /* flex-wrap ensures it doesn't break on mobile screens */
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 py-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div 
          key={label} 
          className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl p-3 md:p-5 rounded-2xl border border-white/10 min-w-[70px] md:min-w-[90px] shadow-2xl transition-transform hover:scale-105"
        >
          <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">
            {value.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs uppercase font-bold text-blue-500/80 tracking-widest mt-1">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}