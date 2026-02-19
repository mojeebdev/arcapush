"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineCheckBadge, 
} from "react-icons/hi2";


export interface AdminDashboardProps {
  guardianPin: string;
}

interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterFirm: string;
  requesterRole: string;
  status: string;
  createdAt: string;
  startup?: {
    id: string; 
    name: string;
    approved: boolean; 
  };
}

export default function AdminDashboardView({ guardianPin }: AdminDashboardProps) {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      
      const res = await fetch(`/api/submit/requests?status=${filter}`, {
        headers: { "x-guardian-pin": guardianPin }
      });
      const data = await res.json();
      if (res.ok) setRequests(data.requests || []);
      else toast.error(data.error || "Signal Interrupted");
    } catch {
      toast.error("Failed to connect to Guardian Stream");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter, guardianPin]);

  
  const handleAction = async (requestId: string, action: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/access-request/${requestId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, adminSecret: guardianPin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Investor Signal ${action === "APPROVED" ? "Broadcasted" : "Silenced"}`);
      fetchRequests(); 
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  
  const handleApproveStartup = async (startupId: string) => {
    try {
      const res = await fetch(`/api/admin/startups/${startupId}/approve`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "x-guardian-pin": guardianPin 
        },
        body: JSON.stringify({ approved: true }),
      });
      if (res.ok) {
        toast.success("Vibe Code Authorized for Public Feed");
        fetchRequests();
      }
    } catch (err) {
      toast.error("Failed to push Startup live.");
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
    APPROVED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="space-y-8">
      {/* Tab Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((s) => (
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
        <button onClick={fetchRequests} className="ml-auto p-3 bg-zinc-900 border border-white/5 rounded-full transition-all">
          <HiOutlineArrowPath className={`w-4 h-4 text-zinc-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-32 text-center shadow-2xl">
          <HiOutlineClock className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
          <p className="text-zinc-700 font-black uppercase tracking-[0.5em] text-[10px]">The Stream is Quiet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.id} className="group bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 hover:border-[#4E24CF]/30 transition-all shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[req.status] || "text-zinc-500"}`}>
                      {req.status}
                    </span>
                    <span className="text-[9px] font-black text-[#4E24CF] uppercase tracking-[0.2em]">{req.requesterRole} Access</span>
                  </div>
                  <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">{req.requesterName} @ {req.requesterFirm}</h4>
                  
                  <div className="flex flex-wrap gap-6 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <HiOutlineBuildingOffice2 className="w-4 h-4 text-[#D4AF37]" /> 
                      Startup: <span className="text-white">{req.startup?.name || "The Waitlist"}</span>
                    </div>
                   
                    {req.startup && !req.startup.approved && (
                      <button 
                        onClick={() => handleApproveStartup(req.startup!.id)}
                        className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors"
                      >
                        <HiOutlineCheckBadge className="w-4 h-4" />
                        [PENDING APPROVAL]
                      </button>
                    )}
                  </div>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleAction(req.id, "APPROVED")} className="px-12 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all">Authorize Investor</button>
                    <button onClick={() => handleAction(req.id, "REJECTED")} className="p-4 bg-zinc-900 text-zinc-600 hover:text-red-500 border border-white/5 rounded-2xl transition-all"><HiOutlineXCircle className="w-6 h-6" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}