"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
} from "react-icons/hi2";

interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterFirm: string;
  requesterRole: string;
  requesterLinkedIn: string;
  status: string;
  createdAt: string;
  startup: { id: string; name: string };
}

export function AdminDashboard({ adminSecret }: { adminSecret: string }) {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests?secret=${adminSecret}&status=${filter}`);
      const data = await res.json();
      if (res.ok) setRequests(data.requests || []);
      else toast.error(data.error);
    } catch {
      toast.error("Failed to load requests");
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
        body: JSON.stringify({ status: action, adminSecret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Request ${action.toLowerCase()}`);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10",
    APPROVED: "text-emerald-400 bg-emerald-400/10",
    REJECTED: "text-red-400 bg-red-400/10",
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-white/50 hover:text-white"
            }`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
        <button onClick={fetchRequests} className="ml-auto p-2 rounded-xl hover:bg-white/10 transition-colors">
          <HiOutlineArrowPath className={`w-4 h-4 text-white/50 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-3" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <HiOutlineClock className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No {filter.toLowerCase()} requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-semibold text-white">{req.requesterName}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/40 mb-1">
                    <HiOutlineBuildingOffice2 className="w-3.5 h-3.5" />
                    {req.requesterFirm} · {req.requesterRole}
                  </div>
                  <p className="text-xs text-white/30 mb-1">{req.requesterEmail}</p>
                  <a
                    href={req.requesterLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(req.id, "APPROVED")}
                      className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                    >
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "REJECTED")}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <HiOutlineXCircle className="w-6 h-6" />
                    </button>
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
