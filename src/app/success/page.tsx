// ─────────────────────────────────────────────────────────────────────────────
// src/app/success/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineSparkles, HiOutlineCheckCircle } from "react-icons/hi2";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-32" style={{ backgroundColor: "#0f0f12" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full text-center">

        <div className="flex justify-center mb-8">
          <div className="relative bg-[#16161b] border border-white/10 p-6 rounded-[2.5rem] shadow-card">
            <HiOutlineCheckCircle className="w-16 h-16 text-[#4E24CF]" />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <HiOutlineSparkles className="w-3 h-3 text-black" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
          Signal <span className="text-[#4E24CF]">Received.</span>
        </h1>

        <p className="text-xl text-gray-300 font-serif italic mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Vibe Code is in the queue. Guardian review activated.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { title: "What Happens Next", text: "Guardian reviews your submission within 24-48 hours. You'll receive an email confirmation." },
            { title: "Boost Your Signal", text: "Get to the front of the queue and unlock premium visibility with Signal Boost." },
          ].map((card) => (
            <div key={card.title} className="bg-[#16161b] border border-white/8 p-6 rounded-2xl text-left shadow-sm">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-2">{card.title}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pricing"
            className="bg-[#4E24CF] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#6B3FE0] transition-all">
            Boost Signal →
          </Link>
          <Link href="/registry"
            className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-colors px-12 py-4 border border-white/10 rounded-2xl">
            Browse Registry
          </Link>
        </div>

      </motion.div>
    </div>
  );
}