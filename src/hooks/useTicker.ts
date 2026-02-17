"use client";

import { useState, useEffect } from "react";

export function useTicker(durationMs: number) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  
  useEffect(() => {
    setStartTime(Date.now());
    setElapsed(0);
  }, [durationMs]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = now - startTime;
      
      
      const progress = Math.min(diff / durationMs, 1);
      setElapsed(progress);

      
      if (progress >= 1) {
        setStartTime(Date.now());
        setElapsed(0);
      }
    };

    
    const interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, [startTime, durationMs]);

  return {
    progress: elapsed,
    remainingMs: Math.max(0, durationMs - (Date.now() - startTime)),
    reset: () => {
      setStartTime(Date.now());
      setElapsed(0);
    },
  };
}