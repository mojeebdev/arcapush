"use client";

import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    // Set your launch date here
    const targetDate = new Date("2026-02-17T00:00:00").getTime();

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
    <div className="flex space-x-4 text-center justify-center py-10">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-[80px]">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-xs uppercase text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  );
}
