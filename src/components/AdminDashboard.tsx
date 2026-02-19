"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineCheckBadge, 
  HiOutlineUser,
  HiOutlineEnvelope
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

interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterFirm: string;
  requesterRole: string;
  status: string;
  startup?: { name: string };
}

export default function AdminDashboardView({ guardianPin }: AdminDashboardProps) {
  const [view, setView] = useState<"SUBMISSIONS" | "SIGNALS">("SUBMISSIONS");
  const [startups, setStartups] = useState<StartupSubmission[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "ALL">("PENDING");

  const fetchData = async () => {
    setLoading(true);
    try {
      
      const [startupRes, requestRes] = await Promise.all([
        fetch(`/api/startups`, { headers: { "x-guardian-pin": guardianPin } }),
        fetch(`/api/access-request`, { headers: { "x-guardian-pin": guardianPin } })
      ]);

      const startupData = await startupRes.json();
      const requestData = await requestRes.json();

      if (startupRes.ok) setStartups(startupData.startups || []);
      if (requestRes.ok) setRequests(requestData.requests || []);
    } catch {
      toast.error("Guardian Stream Interrupted");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [guardianPin]);

  
  const handleApproveStartup = async (id: string) => {
    const res = await fetch(`/api/admin/startups/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-guardian-pin": guardianPin },
      body: JSON.stringify({ approved: true }),
    });
    if (res.ok) {
      toast.success("Food Item Authorized");
      fetchData();
    }
  };

  const handleApproveInvestor = async (id: string, action: "APPROVED" | "REJECTED") => {
    const res = await fetch(`/api/access-request/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action, adminSecret: guardianPin }),
    });
    if (res.ok) {
      toast.success(action === "APPROVED" ? "Investor Authorized" : "Signal Silenced");
      fetchData();
    }
  };

  
  const filteredStartups = startups.filter(s => 
    filter === "ALL" ? true : filter === "APPROVED" ? s.approved : !s.approved
  );

  const filteredRequests = requests.filter(r => 
    filter === "ALL" ? true : filter === "APPROVED" ? r.status === "APPROVED" : r.status === "PENDING"
  );

  return (
    <div className="space-y-8">
      {/* 🛡️ Primary View Toggle */}
      <div className="flex bg-zinc-900/50 p-1 rounded-3xl border border-white/5 w-fit">
        {["SUBMISSIONS", "SIGNALS"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${
              view === v ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {(["PENDING", "APPROVED", "ALL"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              filter === s ? "bg-[#4E24CF] border-[#4E24CF] text-white" : "bg-zinc-900 text-zinc-500 border-white/5"
            }`}
          >
            {s}
          </button>
        ))}
        <button onClick={fetchData} className="ml-auto p-3 bg-zinc-900 border border-white/5 rounded-full">
          <HiOutlineArrowPath className={`w-4 h-4 text-zinc-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => <div key={i} className="h-40 bg-zinc-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />)}
        </div>
      ) : (
        <div className="grid gap-6">
          {view === "SUBMISSIONS" ? (
            filteredStartups.map((startup) => (
              <div key={startup.id} className="group bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-[#4E24CF]/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase ${startup.approved ? 'text-emerald-400 border-emerald-400/20' : 'text-[#D4AF37] border-[#D4AF37]/20'}`}>
                        {startup.approved ? "LIVE" : "UNAUTHORIZED"}
                      </span>
                      <span className="text-[9px] font-black text-[#4E24CF] uppercase tracking-widest">{startup.category}</span>
                    </div>
                    <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">{startup.name}</h4>
                    <p className="text-zinc-500 text-sm">{startup.tagline}</p>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-bold uppercase pt-2">
                      <span className="text-white">Founder: {startup.founderName}</span>
                      <span>{startup.founderEmail}</span>
                    </div>
                  </div>
                  {!startup.approved && (
                    <button onClick={() => handleApproveStartup(startup.id)} className="px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase hover:bg-[#D4AF37] transition-all">
                      Authorize Entry
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className="group bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-[#D4AF37]/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase ${req.status === 'APPROVED' ? 'text-emerald-400 border-emerald-400/20' : 'text-[#D4AF37] border-[#D4AF37]/20'}`}>
                        {req.status}
                      </span>
                      <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Investor Signal</span>
                    </div>
                    <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">{req.requesterName} @ {req.requesterFirm}</h4>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase">
                      <HiOutlineBuildingOffice2 className="w-4 h-4 text-[#4E24CF]" />
                      Target: <span className="text-white">{req.startup?.name || "General Access"}</span>
                    </div>
                  </div>
                  {req.status === "PENDING" && (
                    <div className="flex gap-3">
                      <button onClick={() => handleApproveInvestor(req.id, "APPROVED")} className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-400 transition-all">Grant Access</button>
                      <button onClick={() => handleApproveInvestor(req.id, "REJECTED")} className="p-4 bg-zinc-900 text-zinc-600 hover:text-red-500 rounded-2xl"><HiOutlineXCircle className="w-6 h-6" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}