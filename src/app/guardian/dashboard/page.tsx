"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminConfig } from "@/lib/adminConfig";
import { HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineArrowTrendingUp, HiOutlineShieldCheck } from "react-icons/hi2";

export default function GuardianDashboard() {
  const [stats, setStats] = useState({ totalUsd: 0, baseCount: 0, solCount: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/guardian/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard Sync Failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Guardian Command</h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Engine Version: {AdminConfig.VIBE_STREAM_VERSION}</p>
      </header>

      {/* 📊 STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Revenue" value={`$${stats.totalUsd}`} icon={<HiOutlineCurrencyDollar />} color="text-[#D4AF37]" />
        <StatCard title="Base Signals" value={stats.baseCount} icon={<HiOutlineCube />} color="text-blue-500" />
        <StatCard title="Solana Signals" value={stats.solCount} icon={<HiOutlineArrowTrendingUp />} color="text-purple-500" />
      </div>

      {/* 📜 RECENT ASCENSIONS */}
      <section className="bg-zinc-950/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Ascensions</h3>
          <HiOutlineShieldCheck className="text-zinc-700 w-6 h-6" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Startup</th>
                <th className="px-8 py-4">Protocol</th>
                <th className="px-8 py-4">Package</th>
                <th className="px-8 py-4">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recent.map((s: any) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 font-bold text-white uppercase text-xs tracking-tighter italic">{s.name}</td>
                  <td className={`px-8 py-6 text-[10px] font-black uppercase ${s.pinChain === 'base' ? 'text-blue-500' : 'text-purple-500'}`}>{s.pinChain}</td>
                  <td className="px-8 py-6 text-zinc-400 text-[10px] font-bold">{s.pinTxHash.slice(0, 10)}...</td>
                  <td className="px-8 py-6 text-zinc-500 text-[10px]">{new Date(s.pinnedUntil).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5 relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 opacity-5 transition-transform group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{title}</p>
      <p className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}