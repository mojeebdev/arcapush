"use client";

import { motion } from "framer-motion";
import { 
  HiCheck, 
  HiOutlineArchiveBox, 
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineFire
} from "react-icons/hi2";

// Aligning with AdminConfig.PIN_PACKAGES for logic consistency
const plans = [
  { 
    label: "30 Mins", 
    price: "25", 
    value: 30, // Matches AdminConfig.minutes
    rotations: "90", 
    description: "Instant momentum. Perpetual archive.",
    perks: ["90 Rotations (20s each)", "Permanent Encyclopedia Entry", "Search Engine Indexed"],
    accent: "zinc-500"
  },
  { 
    label: "1 Day", 
    price: "150", 
    value: 1440,
    rotations: "4,320", 
    description: "The 'X-Factor' package with Social Push.",
    perks: ["4,320 Rotations", "Thoughtful X Storytelling Post", "Permanent Presence", "Discovery Feed Priority"],
    accent: "[#4E24CF]", 
    featured: true 
  },
  { 
    label: "1 Week", 
    price: "600", 
    value: 10080,
    rotations: "30,240", 
    description: "Full market immersion and strategy alignment.",
    perks: ["30,240 Rotations", "X Storytelling Post", "1-on-1 Marketing Call", "Verified Vibe Badge"],
    accent: "[#D4AF37]" 
  },
  { 
    label: "1 Month", 
    price: "1,800", 
    value: 43200,
    rotations: "129,600", 
    description: "Total Encyclopedia domination and partnership.",
    perks: ["129,600 Rotations", "Lifetime Encyclopedia Entry", "VC Access Channel", "Founder Strategy Retainer"],
    accent: "white" 
  }
];

export default function PricingPage() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-x-hidden">
      {/* 🌌 Perpetual Value Banner */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 p-8 rounded-[3rem] bg-zinc-900/10 border border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
            <HiOutlineShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-[0.3em]">The Perpetual Standard</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Every Vibe Code is indexed forever. Presence is non-negotiable.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-3 px-5 py-3 bg-black/40 rounded-2xl border border-white/5 shadow-2xl">
                <HiOutlineArchiveBox className="w-4 h-4 text-zinc-600" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Permanent Index</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-black/40 rounded-2xl border border-white/5 shadow-2xl">
                <HiOutlineMagnifyingGlass className="w-4 h-4 text-zinc-600" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Global Discovery</span>
            </div>
        </div>
      </motion.section>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-[#4E24CF]/5 blur-[150px] rounded-full pointer-events-none" />

        {plans.map((plan, idx) => (
           <motion.div
           key={plan.label}
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: idx * 0.1 }}
           className={`relative rounded-[3rem] p-10 bg-zinc-950/80 border ${plan.featured ? 'border-[#4E24CF] shadow-[#4E24CF]/10 shadow-2xl' : 'border-white/5'} flex flex-col group backdrop-blur-md`}
         >
           {plan.featured && (
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#4E24CF] rounded-full flex items-center gap-2 shadow-lg">
               <HiOutlineFire className="w-3 h-3 text-white" />
               <span className="text-[8px] font-black text-white uppercase tracking-widest">Most Requested</span>
             </div>
           )}

           <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{plan.label}</h3>
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{plan.rotations} Rots.</span>
            </div>
            
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">USD</span>
            </div>

            <ul className="space-y-4 mb-12 flex-grow">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                  <HiCheck className={`w-4 h-4 mt-0.5 shrink-0 ${plan.featured ? 'text-[#4E24CF]' : 'text-zinc-700'}`} />
                  {perk}
                </li>
              ))}
            </ul>

            <button className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl ${
              plan.featured 
              ? 'bg-[#4E24CF] text-white hover:bg-[#5a2edb]' 
              : 'bg-white text-black hover:bg-[#D4AF37]'
            }`}>
              Acquire Entry
            </button>
         </motion.div>
        ))}
      </div>
    </main>
  );
}