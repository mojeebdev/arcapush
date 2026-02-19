"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineCheckBadge, 
  HiOutlineUser
} from "react-icons/hi2";


export interface AdminDashboardProps {
  guardianPin: string;
}


interface StartupSubmission {
  id: string;
  name: string;
  tagline: string;
  founderName: string;
  founderEmail: string;
  category: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminDashboardView({ guardianPin }: AdminDashboardProps) {
  const [startups, setStartups] = useState<StartupSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "ALL">("PENDING");

  const fetchStartups = async () => {
    setLoading(true);
    try {
      
      const res = await fetch(`/api/startups`, {
        headers: { "x-guardian-pin": guardianPin }
      });
      const data = await res.json();
      
      if (res.ok) {
        
        const list = data.startups || [];
        if (filter === "PENDING") setStartups(list.filter((s: any) => !s.approved));
        else if (filter === "APPROVED") setStartups(list.filter((s: any) => s.approved));
        else setStartups(list);
      } else {
        toast.error(data.error || "Signal Interrupted");
      }
    } catch {
      toast.error("Failed to connect to Guardian Stream");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [filter, guardianPin]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/startups/${id}/approve`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-guardian-pin": guardianPin 
        },
        body: JSON.stringify({ approved: true }),
      });
      if (res.ok) {
        toast.success("Food Item Authorized for Feed");
        fetchStartups();
      }
    } catch (err) {
      toast.error("Approval failed.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {(["PENDING", "APPROVED", "ALL"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-2.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase transition-all border ${
              filter === s ? "bg-white text-black border-white" : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
        <button onClick={fetchStartups} className="ml-auto p-3 bg-zinc-900 border border-white/5 rounded-full">
          <HiOutlineArrowPath className={`w-4 h-4 text-zinc-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : startups.length === 0 ? (
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-32 text-center shadow-2xl">
          <HiOutlineClock className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
          <p className="text-zinc-700 font-black uppercase tracking-[0.5em] text-[10px]">Registry is empty</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {startups.map((startup) => (
            <div key={startup.id} className="group bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-[#4E24CF]/30 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${startup.approved ? 'text-emerald-400 border-emerald-400/20' : 'text-[#D4AF37] border-[#D4AF37]/20'}`}>
                      {startup.approved ? "LIVE" : "UNAUTHORIZED"}
                    </span>
                    <span className="text-[9px] font-black text-[#4E24CF] uppercase tracking-[0.2em]">{startup.category}</span>
                  </div>
                  <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">{startup.name}</h4>
                  <p className="text-zinc-500 text-sm italic">{startup.tagline}</p>
                  
                  <div className="flex flex-wrap gap-6 text-[11px] text-zinc-500 font-bold uppercase tracking-widest pt-2">
                    <div className="flex items-center gap-2"><HiOutlineUser className="w-4 h-4" /> Founder: <span className="text-white">{startup.founderName}</span></div>
                    <span className="font-mono text-zinc-600 lowercase tracking-normal">{startup.founderEmail}</span>
                  </div>
                </div>

                {!startup.approved && (
                  <button 
                    onClick={() => handleApprove(startup.id)}
                    className="px-12 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all"
                  >
                    Authorize Entry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}