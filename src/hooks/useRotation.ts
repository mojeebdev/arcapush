"use client";

import { useState, useEffect, useCallback } from "react";

interface RotationOptions<T> {
  items: T[];
  intervalMs: number;
  enabled?: boolean;
}

export function useRotation<T>({ items, intervalMs, enabled = true }: RotationOptions<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  
  const next = useCallback(() => {
    if (items.length <= 1) return;
    setIsTransitioning(true);
    
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setIsTransitioning(false);
    }, 300);
  }, [items.length]);

  const prev = useCallback(() => {
    if (items.length <= 1) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      setIsTransitioning(false);
    }, 300);
  }, [items.length]);

  
  useEffect(() => {
    if (!enabled || items.length <= 1) return;
    
    const interval = setInterval(next, intervalMs);
    return () => clearInterval(interval);
  }, [enabled, items.length, intervalMs, next]);

  
  useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  return {
    currentItem: items[currentIndex] ?? null,
    currentIndex,
    isTransitioning,
    next,
    prev,
    total: items.length,
  };
}