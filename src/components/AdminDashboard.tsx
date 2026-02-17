"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineShare,
} from "react-icons/hi2";


interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterFirm: string;
  status: string;
  createdAt: string;
}

export function AdminDashboard({ guardianPin, adminSecret }: { guardianPin: string, adminSecret: string }) {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");

  
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests?status=${filter}`, {
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
  }, [filter]);

  
  const handleAction = async (requestId: string, action: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/access-request/${requestId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: action, 
          adminSecret: adminSecret 
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`Entry ${action.toLowerCase()}`);
      
      
      if (action === "APPROVED") {
        console.log("🚀 Automated social broadcast initiated for:", requestId);
        
      }

      fetchRequests(); 
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    APPROVED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${
              filter === s 
                ? "bg-white text-black border-white" 
                : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
        <button 
          onClick={fetchRequests} 
          className="ml-auto p-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl transition-all"
          title="Refresh Feed"
        >
          <HiOutlineArrowPath className={`w-4 h-4 text-zinc-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Requests Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] p-24 text-center">
          <HiOutlineClock className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">
            No {filter} Signals Detected
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div 
              key={req.id} 
              className="group bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 hover:bg-zinc-900/60 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-white tracking-tight">{req.requesterName}</h4>
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-tighter ${statusColors[req.status] || "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"}`}>
                      {req.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-medium">
                    <div className="flex items-center gap-1.5 italic">
                      <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
                      {req.requesterFirm}
                    </div>
                    <span className="font-mono text-[10px] opacity-70">{req.requesterEmail}</span>
                  </div>
                </div>

                {req.status === "PENDING" ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction(req.id, "APPROVED")}
                      className="px-8 py-3 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "REJECTED")}
                      className="p-3 bg-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 border border-white/5 rounded-2xl transition-all"
                    >
                      <HiOutlineXCircle className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-zinc-700">
                    <span className="text-[9px] font-mono uppercase italic">
                      Processed: {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    {req.status === "APPROVED" && (
                      <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500/50" />
                    )}
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
