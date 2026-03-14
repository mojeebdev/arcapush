"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingOffice2,
  HiOutlineArrowPath,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";

export interface AdminDashboardProps {
  guardianPin: string;
}

interface StartupSubmission {
  id: string;
  slug?: string;
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
  startup?: { name: string; id: string; slug?: string };
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
        fetch(`/api/access-request`, { headers: { "x-guardian-pin": guardianPin } }),
      ]);
      const startupData = await startupRes.json();
      const requestData = await requestRes.json();
      if (startupRes.ok) setStartups(startupData.startups || []);
      if (requestRes.ok) setRequests(requestData.requests || []);
    } catch {
      toast.error("Data fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [guardianPin]);

  const handleApproveStartup = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/startups/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-guardian-pin": guardianPin },
        body: JSON.stringify({ approved: true }),
      });
      if (res.ok) {
        toast.success("Listing approved and founder notified.");
        fetchData();
      }
    } catch {
      toast.error("Approval failed.");
    }
  };

  const handleApproveInvestor = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/access-request/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, adminSecret: guardianPin }),
      });
      if (res.ok) {
        toast.success(action === "APPROVED" ? "Investor access granted." : "Request rejected.");
        fetchData();
      }
    } catch {
      toast.error("Action failed.");
    }
  };

  const filteredStartups = startups.filter((s) =>
    filter === "ALL" ? true : filter === "APPROVED" ? s.approved : !s.approved
  );
  const filteredRequests = requests.filter((r) =>
    filter === "ALL" ? true : filter === "APPROVED" ? r.status === "APPROVED" : r.status === "PENDING"
  );

  // ── Shared button hover helpers ──────────────────────────
  const hoverAccent = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
  };
  const resetBorder = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
  };

  return (
    <div className="space-y-8">

      {/* View toggle */}
      <div
        className="flex p-1 rounded-3xl w-fit"
        style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
      >
        {(["SUBMISSIONS", "SIGNALS"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-8 py-3 rounded-2xl text-xs font-black tracking-widest transition-all"
            style={{
              background: view === v ? "var(--accent)" : "transparent",
              color: view === v ? "#fff" : "var(--text-tertiary)",
            }}
            onMouseEnter={(e) => {
              if (view !== v) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (view !== v) (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2">
        {(["PENDING", "APPROVED", "ALL"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all"
            style={{
              background: filter === s ? "var(--accent)" : "var(--bg-3)",
              border: `1px solid ${filter === s ? "var(--accent)" : "var(--border)"}`,
              color: filter === s ? "#fff" : "var(--text-tertiary)",
            }}
          >
            {s}
          </button>
        ))}

        {/* Refresh */}
        <button
          onClick={fetchData}
          className="ml-auto p-3 rounded-full transition-all"
          style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
          onMouseEnter={hoverAccent}
          onMouseLeave={resetBorder}
        >
          <HiOutlineArrowPath
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 rounded-[2.5rem] animate-pulse"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">

          {/* SUBMISSIONS tab */}
          {view === "SUBMISSIONS" ? (
            filteredStartups.length === 0 ? (
              <EmptyState message="No Submissions Found" />
            ) : (
              filteredStartups.map((startup) => (
                <div
                  key={startup.id}
                  className="group rounded-[2.5rem] p-8 transition-all"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                  onMouseEnter={hoverAccent}
                  onMouseLeave={resetBorder}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3">

                      {/* Status + category */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full border text-xs font-black uppercase"
                          style={startup.approved
                            ? { color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }
                            : { color: "var(--accent)", borderColor: "var(--accent-border)" }
                          }
                        >
                          {startup.approved ? "LIVE" : "PENDING"}
                        </span>
                        <span className="ap-label" style={{ color: "var(--accent)" }}>
                          {startup.category}
                        </span>
                      </div>

                      <h4
                        className="text-3xl font-black italic tracking-tighter uppercase"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {startup.name}
                      </h4>
                      <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
                        {startup.tagline}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-xs font-bold uppercase" style={{ color: "var(--text-primary)" }}>
                          Founder: {startup.founderName}
                        </span>
                        <span className="ap-label">{startup.founderEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {startup.approved && (
                        <Link
                          href={`/startup/${startup.slug ?? startup.id}`}
                          target="_blank"
                          className="p-4 rounded-2xl transition-all"
                          title="View live listing"
                          style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                          }}
                        >
                          <HiOutlineArrowUpRight className="w-5 h-5" />
                        </Link>
                      )}
                      {!startup.approved && (
                        <button
                          onClick={() => handleApproveStartup(startup.id)}
                          className="ap-btn-primary"
                          style={{ padding: "0.9rem 2rem" }}
                        >
                          Approve Listing
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )

          /* SIGNALS tab */
          ) : (
            filteredRequests.length === 0 ? (
              <EmptyState message="No Investor Requests" />
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="group rounded-[2.5rem] p-8 transition-all"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
                  onMouseEnter={hoverAccent}
                  onMouseLeave={resetBorder}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3">

                      {/* Status */}
                      <div className="flex items-center gap-4">
                        <span
                          className="px-3 py-1 rounded-full border text-xs font-black uppercase"
                          style={req.status === "APPROVED"
                            ? { color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }
                            : { color: "var(--accent)", borderColor: "var(--accent-border)" }
                          }
                        >
                          {req.status}
                        </span>
                        <span className="ap-label">Investor Request</span>
                      </div>

                      <h4
                        className="text-3xl font-black italic tracking-tighter uppercase"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {req.requesterName} @ {req.requesterFirm}
                      </h4>

                      <div className="flex items-center gap-2 text-xs font-bold uppercase italic" style={{ color: "var(--text-secondary)" }}>
                        <HiOutlineBuildingOffice2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        Target:{" "}
                        {req.startup ? (
                          <Link
                            href={`/startup/${req.startup.slug ?? req.startup.id}`}
                            target="_blank"
                            className="flex items-center gap-1 transition-colors"
                            style={{ color: "var(--text-primary)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                          >
                            {req.startup.name}
                            <HiOutlineArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span style={{ color: "var(--text-primary)" }}>General Access</span>
                        )}
                      </div>
                    </div>

                    {req.status === "PENDING" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveInvestor(req.id, "APPROVED")}
                          className="ap-btn-primary"
                          style={{ padding: "0.9rem 1.75rem" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4ade80")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
                        >
                          Grant Access
                        </button>
                        <button
                          onClick={() => handleApproveInvestor(req.id, "REJECTED")}
                          className="p-4 rounded-2xl transition-colors"
                          style={{ background: "var(--bg-3)", color: "var(--text-tertiary)", border: "1px solid var(--border)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#f87171")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
                        >
                          <HiOutlineXCircle className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="rounded-[3rem] p-32 text-center shadow-2xl"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
    >
      <HiOutlineClock className="w-16 h-16 mx-auto mb-6" style={{ color: "var(--text-tertiary)" }} />
      <p className="ap-label">{message}</p>
    </div>
  );
}