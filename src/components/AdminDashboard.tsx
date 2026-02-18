"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineLockClosed,
  HiOutlineFingerPrint
} from "react-icons/hi2";

// 1. Define the props interface clearly for the compiler
interface DashboardProps {
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
    name: string;
  };
}

// 2. Apply the interface to the component
function AdminDashboardView({ guardianPin }: DashboardProps) {
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
        body: JSON.stringify({ status: action, adminSecret: guardianPin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Signal ${action === "APPROVED" ? "Broadcasted" : "Silenced"}`);
      fetchRequests(); 
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
    APPROVED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-2.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase transition-all border ${
              filter === s 
                ? "bg-white text-black border-white shadow-xl shadow-white/5" 
                : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
        <button onClick={fetchRequests} className="ml-auto p-3 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-full transition-all">
          <HiOutlineArrowPath className={`w-4 h-4 text-zinc-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
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
                    <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[req.status] || "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"}`}>
                      {req.status}
                    </span>
                    <span className="text-[9px] font-black text-[#4E24CF] uppercase tracking-[0.2em]">{req.requesterRole} Access</span>
                  </div>
                  <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                    {req.requesterName} <span className="text-zinc-700 not-italic font-light">@</span> {req.requesterFirm}
                  </h4>
                  <div className="flex flex-wrap gap-6 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <HiOutlineBuildingOffice2 className="w-4 h-4 text-[#D4AF37]" />
                      Startup: <span className="text-white">{req.startup?.name || "The Waitlist"}</span>
                    </div>
                    <span className="font-mono text-zinc-600 lowercase tracking-normal">{req.requesterEmail}</span>
                  </div>
                </div>

                {req.status === "PENDING" ? (
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleAction(req.id, "APPROVED")} className="px-12 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-2xl active:scale-95">
                      Authorize
                    </button>
                    <button onClick={() => handleAction(req.id, "REJECTED")} className="p-4 bg-zinc-900 text-zinc-600 hover:text-red-500 border border-white/5 rounded-2xl transition-all">
                      <HiOutlineXCircle className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest mb-1">Processed Signal</p>
                    <p className="text-[10px] font-mono text-zinc-600">{new Date(req.createdAt).toLocaleString()}</p>
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

// --- Main Page Component ---
export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!pin) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthorized(true);
        toast.success("Guardian Identified");
      } else {
        toast.error("Invalid Guardian Pin");
        setPin("");
      }
    } catch {
      toast.error("Signal Lost");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 relative">
        <Toaster position="top-center" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4E24CF]/10 via-transparent to-transparent opacity-50" />
        <div className="z-10 w-full max-w-sm flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 mb-10 shadow-2xl">
            <HiOutlineLockClosed className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-[10px] font-black tracking-[0.6em] uppercase text-zinc-500 mb-10">Guardian Protocol</h1>
          <input 
            type="password" 
            placeholder="PIN" 
            autoFocus
            className="w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl text-center text-3xl tracking-[0.8em] focus:outline-none focus:border-[#4E24CF]/50 transition-all font-mono shadow-2xl placeholder:text-zinc-900"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} disabled={loading} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] mt-6 hover:bg-[#D4AF37] transition-all shadow-2xl flex items-center justify-center gap-2">
            {loading ? "Decrypting..." : <>Verify Identity <HiOutlineFingerPrint className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto relative">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] text-emerald-500 uppercase">Guardian Stream: Synchronized</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">Vibe <span className="text-[#4E24CF]">Stream</span></h1>
          </div>
          <button onClick={() => setIsAuthorized(false)} className="text-[9px] font-black tracking-[0.3em] uppercase px-10 py-4 border border-white/5 rounded-full bg-zinc-950 hover:bg-red-500/10 hover:text-red-500 transition-all shadow-2xl">Lock Terminal</button>
        </header>
        <main className="mt-20">
          <AdminDashboardView guardianPin={pin} />
        </main>
      </div>
      
    </div>
  );
}