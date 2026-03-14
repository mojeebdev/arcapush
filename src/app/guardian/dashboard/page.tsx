
"use client";

import { useState, useEffect } from "react";
import { AdminConfig } from "@/lib/adminConfig";
import {
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineArrowTrendingUp,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string; 
}

function StatCard({ title, value, icon, accentColor }: StatCardProps) {
  return (
    <div
      className="p-8 rounded-[2rem] relative overflow-hidden group"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
    >
      {/* Background icon */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 opacity-5 transition-transform group-hover:scale-110"
        style={{ color: accentColor }}
      >
        {icon}
      </div>

      <p className="ap-label mb-2">{title}</p>
      <p
        className="text-4xl font-black italic tracking-tighter"
        style={{ color: accentColor }}
      >
        {value}
      </p>
    </div>
  );
}

export default function GuardianDashboard() {
  const [stats, setStats] = useState<{
    totalUsd: number;
    baseCount: number;
    solCount: number;
    recent: any[];
  }>({ totalUsd: 0, baseCount: 0, solCount: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/guardian/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <main
      className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      {/* Header */}
      <header className="mb-12">
        <h1
          className="text-4xl font-black uppercase italic tracking-tighter"
          style={{ color: "var(--text-primary)" }}
        >
          Guardian Command
        </h1>
        <p className="ap-label mt-2">
          Engine Version: {AdminConfig.ARCAPUSH_VERSION}
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalUsd}`}
          icon={<HiOutlineCurrencyDollar className="w-full h-full" />}
          accentColor="var(--accent)"
        />
        <StatCard
          title="Base Boosts"
          value={stats.baseCount}
          icon={<HiOutlineCube className="w-full h-full" />}
          accentColor="#60a5fa"
        />
        <StatCard
          title="Solana Boosts"
          value={stats.solCount}
          icon={<HiOutlineArrowTrendingUp className="w-full h-full" />}
          accentColor="#a78bfa"
        />
      </div>

      {/* Recent boosts table */}
      <section
        className="rounded-[2.5rem] overflow-hidden"
        style={{
          background: "rgba(17,17,17,0.5)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Table header row */}
        <div
          className="p-8 flex justify-between items-center"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h3
            className="text-sm font-black uppercase tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Boosts
          </h3>
          <HiOutlineShieldCheck className="w-6 h-6" style={{ color: "var(--text-tertiary)" }} />
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <p className="ap-label animate-pulse">Loading...</p>
          </div>
        ) : stats.recent.length === 0 ? (
          <div className="p-16 text-center">
            <p className="ap-label">No boosts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead style={{ background: "rgba(255,255,255,0.03)" }}>
                <tr>
                  {["Product", "Network", "Tx Hash", "Expires"].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-4 text-xs font-black uppercase tracking-widest"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((s: any) => (
                  <tr
                    key={s.id}
                    className="transition-colors"
                    style={{ borderTop: "1px solid var(--border)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "transparent")
                    }
                  >
                    <td
                      className="px-8 py-6 font-bold uppercase text-xs tracking-tighter italic"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {s.name}
                    </td>
                    <td
                      className="px-8 py-6 text-xs font-black uppercase"
                      style={{ color: s.pinChain === "base" ? "#60a5fa" : "#a78bfa" }}
                    >
                      {s.pinChain}
                    </td>
                    <td
                      className="px-8 py-6 text-xs font-bold font-mono"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.pinTxHash.slice(0, 10)}...
                    </td>
                    <td
                      className="px-8 py-6 text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {new Date(s.pinnedUntil).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}