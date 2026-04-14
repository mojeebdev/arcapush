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
  HiOutlineXMark,
  HiOutlinePencilSquare,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineGlobeAlt,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineChatBubbleBottomCenterText,
} from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";

export interface AdminDashboardProps {
  guardianPin: string;
}

interface StartupSubmission {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  problemStatement?: string;
  bannerUrl?: string;
  logoUrl?: string;
  category: string;
  website?: string;
  twitter?: string;
  founderName: string;
  founderEmail: string;
  founderTwitter?: string;
  founderLinkedIn?: string;
  pitchDeckUrl?: string;
  tier?: string;
  viewCount?: number;
  createdAt: string;
  approved: boolean;
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

function RejectModal({ startup, onClose, onConfirm }: {
  startup: StartupSubmission;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const SUGGESTIONS = [
    "Problem statement is too vague — needs a specific, real-world pain point.",
    "Product website is unavailable or under construction.",
    "Tagline doesn't clearly describe what the product does.",
    "Listing appears to be a duplicate of an existing entry.",
    "Insufficient detail — please add more context about the solution.",
  ];

  async function handleConfirm() {
    if (!reason.trim()) return;
    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-xl rounded-[2.5rem] p-8 space-y-6 relative"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}>
          <HiOutlineXMark className="w-5 h-5" />
        </button>
        <div className="space-y-1 pr-8">
          <p className="ap-label" style={{ color: "#f87171" }}>Reject Listing</p>
          <h3 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: "var(--text-primary)" }}>
            {startup.name}
          </h3>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Feedback will be emailed to <span style={{ color: "var(--text-secondary)" }}>{startup.founderEmail}</span>
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>Quick reasons</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => setReason(s)}
                className="text-xs px-3 py-1.5 rounded-full transition-all text-left"
                style={{
                  background: reason === s ? "var(--accent-dim)" : "color-mix(in srgb, var(--bg-3) 80%, transparent)",
                  border: `1px solid ${reason === s ? "var(--accent-border)" : "var(--border)"}`,
                  color: reason === s ? "var(--accent)" : "var(--text-tertiary)",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
            <HiOutlinePencilSquare className="inline w-3.5 h-3.5 mr-1" />Your feedback to the founder
          </p>
          <textarea rows={4}
            placeholder="Be specific — what needs to improve before resubmitting?"
            value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full p-4 rounded-2xl text-sm outline-none resize-none transition-all"
            style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{reason.length} / 500</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={!reason.trim() || loading}
            className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40"
            style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
            {loading ? "Sending…" : "Reject & Notify Founder"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailDrawer({ startup }: { startup: StartupSubmission }) {
  const missing = (val?: string | null) => !val || val.trim() === "";
  return (
    <div className="border-t px-8 pb-8 pt-6 space-y-6"
      style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg-3) 40%, transparent)" }}>
      {!missing(startup.bannerUrl) && (
        <div className="w-full h-36 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <img src={startup.bannerUrl!} alt={`${startup.name} banner`}
            className="w-full h-full object-cover"
            onError={(e) => ((e.currentTarget as HTMLElement).style.display = "none")} />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black mb-2 flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
              <HiOutlineChatBubbleBottomCenterText className="w-3.5 h-3.5" />Problem Statement
            </p>
            {missing(startup.problemStatement) ? (
              <p className="text-xs italic px-4 py-3 rounded-xl"
                style={{ color: "#f87171", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)" }}>
                ⚠ Not provided — consider rejecting until this is filled in.
              </p>
            ) : (
              <p className="text-sm leading-relaxed px-4 py-3 rounded-xl"
                style={{ color: "var(--text-secondary)", background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}>
                {startup.problemStatement}
              </p>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black mb-1" style={{ color: "var(--text-tertiary)" }}>Tagline</p>
            <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
              {missing(startup.tagline) ? <span style={{ color: "#f87171" }}>⚠ Missing</span> : startup.tagline}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black mb-1 flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
              <HiOutlineTag className="w-3 h-3" />Category
            </p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{startup.category}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black mb-1" style={{ color: "var(--text-tertiary)" }}>Submitted</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {new Date(startup.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl p-5 space-y-3"
            style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}>
            <p className="text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
              <HiOutlineUser className="w-3.5 h-3.5" />Founder
            </p>
            <p className="text-base font-black uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>{startup.founderName}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{startup.founderEmail}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              {!missing(startup.founderTwitter) ? (
                <a href={startup.founderTwitter!.startsWith("http") ? startup.founderTwitter! : `https://x.com/${startup.founderTwitter!.replace("@", "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>
                  <FaXTwitter className="w-3.5 h-3.5" />
                  {startup.founderTwitter!.replace(/^https?:\/\/(x|twitter)\.com\//, "").replace("@", "")}
                </a>
              ) : (
                <span className="text-xs italic" style={{ color: "#f87171" }}>⚠ No X handle</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: "var(--text-tertiary)" }}>Links</p>
            {!missing(startup.website) ? (
              <a href={startup.website!} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold transition-colors group"
                style={{ color: "var(--accent)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}>
                <HiOutlineGlobeAlt className="w-4 h-4 flex-shrink-0" />
                {startup.website!.replace(/^https?:\/\//, "")}
                <HiOutlineArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ) : (
              <p className="text-xs italic" style={{ color: "#f87171" }}>⚠ No website URL</p>
            )}
            {!missing(startup.twitter) && (
              <a href={startup.twitter!.startsWith("http") ? startup.twitter! : `https://x.com/${startup.twitter}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>
                <FaXTwitter className="w-3.5 h-3.5 flex-shrink-0" />
                {startup.twitter!.replace(/^https?:\/\/(x|twitter)\.com\//, "")}
              </a>
            )}
            {!missing(startup.pitchDeckUrl) && (
              <a href={startup.pitchDeckUrl!} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}>
                <HiOutlineDocumentText className="w-3.5 h-3.5 flex-shrink-0" />
                Pitch Deck <HiOutlineArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
          {!missing(startup.logoUrl) && (
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: "var(--text-tertiary)" }}>Logo</p>
              <img src={startup.logoUrl!} alt="logo" className="w-14 h-14 rounded-xl object-cover"
                style={{ border: "1px solid var(--border)" }}
                onError={(e) => ((e.currentTarget as HTMLElement).style.display = "none")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardView({ guardianPin }: AdminDashboardProps) {
  const [view, setView] = useState<"SUBMISSIONS" | "SIGNALS">("SUBMISSIONS");
  const [startups, setStartups] = useState<StartupSubmission[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "ALL">("PENDING");
  const [rejectTarget, setRejectTarget] = useState<StartupSubmission | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [startupRes, requestRes] = await Promise.all([
        fetch("/api/startups", { headers: { "x-guardian-pin": guardianPin } }),
        fetch("/api/access-request", { headers: { "x-guardian-pin": guardianPin } }),
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED", adminSecret: guardianPin }),
      });
      const data = await res.json();
      if (res.ok) { toast.success("Listing approved and founder notified."); fetchData(); }
      else toast.error(data.error || "Approval failed.");
    } catch { toast.error("Approval failed."); }
  };

  const handleRejectStartup = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/startups/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, adminSecret: guardianPin }),
      });
      const data = await res.json();
      if (res.ok) { toast.success("Listing rejected. Founder notified."); setRejectTarget(null); fetchData(); }
      else toast.error(data.error || "Rejection failed.");
    } catch { toast.error("Rejection failed."); }
  };

  const handleApproveInvestor = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/access-request/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, adminSecret: guardianPin }),
      });
      const data = await res.json();
      if (res.ok) { toast.success(action === "APPROVED" ? "Investor access granted." : "Request rejected."); fetchData(); }
      else toast.error(data.error || "Action failed.");
    } catch { toast.error("Action failed."); }
  };

  const filteredStartups = startups.filter((s) =>
    filter === "ALL" ? true : filter === "APPROVED" ? s.approved : !s.approved);
  const filteredRequests = requests.filter((r) =>
    filter === "ALL" ? true : filter === "APPROVED" ? r.status === "APPROVED" : r.status === "PENDING");

  const hoverAccent = (e: React.MouseEvent) =>
    ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)");
  const resetBorder = (e: React.MouseEvent) =>
    ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)");

  return (
    <>
      {rejectTarget && (
        <RejectModal startup={rejectTarget} onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => handleRejectStartup(rejectTarget.id, reason)} />
      )}
      <div className="space-y-8">
        <div className="flex p-1 rounded-3xl w-fit"
          style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)" }}>
          {(["SUBMISSIONS", "SIGNALS"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className="px-8 py-3 rounded-2xl text-xs font-black tracking-widest transition-all"
              style={{ background: view === v ? "var(--accent)" : "transparent", color: view === v ? "#fff" : "var(--text-tertiary)" }}
              onMouseEnter={(e) => { if (view !== v) (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { if (view !== v) (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)"; }}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {(["PENDING", "APPROVED", "ALL"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all"
              style={{
                background: filter === s ? "var(--accent)" : "color-mix(in srgb, var(--bg-3) 80%, transparent)",
                border: `1px solid ${filter === s ? "var(--accent)" : "var(--border)"}`,
                color: filter === s ? "#fff" : "var(--text-tertiary)",
              }}>
              {s}
            </button>
          ))}
          <button onClick={fetchData} className="ml-auto p-3 rounded-full transition-all"
            style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)" }}
            onMouseEnter={hoverAccent} onMouseLeave={resetBorder}>
            <HiOutlineArrowPath className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-[2.5rem] animate-pulse"
                style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {view === "SUBMISSIONS" ? (
              filteredStartups.length === 0 ? <EmptyState message="No Submissions Found" /> :
              filteredStartups.map((startup) => {
                const isOpen = expanded === startup.id;
                return (
                  <div key={startup.id} className="rounded-[2.5rem] overflow-hidden transition-all"
                    style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
                    onMouseEnter={hoverAccent} onMouseLeave={resetBorder}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {startup.logoUrl ? (
                          <img src={startup.logoUrl} alt={startup.name}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            style={{ border: "1px solid var(--border)" }}
                            onError={(e) => ((e.currentTarget as HTMLElement).style.display = "none")} />
                        ) : (
                          <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black"
                            style={{ background: "color-mix(in srgb, var(--accent) 10%, var(--bg-3))", border: "1px solid var(--border)", color: "var(--accent)" }}>
                            {startup.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full border text-xs font-black uppercase"
                              style={startup.approved
                                ? { color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }
                                : { color: "var(--accent)", borderColor: "var(--accent-border)" }}>
                              {startup.approved ? "LIVE" : "PENDING"}
                            </span>
                            <span className="ap-label" style={{ color: "var(--accent)" }}>{startup.category}</span>
                          </div>
                          <h4 className="text-xl font-black italic tracking-tighter uppercase mt-1 truncate" style={{ color: "var(--text-primary)" }}>
                            {startup.name}
                          </h4>
                          <p className="text-xs italic truncate" style={{ color: "var(--text-secondary)" }}>{startup.tagline}</p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                            by <span style={{ color: "var(--text-secondary)" }}>{startup.founderName}</span> · {startup.founderEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={() => setExpanded(isOpen ? null : startup.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                          style={{
                            background: isOpen ? "var(--accent-dim)" : "color-mix(in srgb, var(--bg-3) 80%, transparent)",
                            border: `1px solid ${isOpen ? "var(--accent-border)" : "var(--border)"}`,
                            color: isOpen ? "var(--accent)" : "var(--text-tertiary)",
                          }}>
                          Review
                          {isOpen ? <HiOutlineChevronUp className="w-3.5 h-3.5" /> : <HiOutlineChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {startup.approved ? (
                          <Link href={`/startup/${startup.slug ?? startup.id}`} target="_blank"
                            className="p-3 rounded-2xl transition-all"
                            style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
                            <HiOutlineArrowUpRight className="w-5 h-5" />
                          </Link>
                        ) : (
                          <>
                            <button onClick={() => handleApproveStartup(startup.id)} className="ap-btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
                              Approve
                            </button>
                            <button onClick={() => setRejectTarget(startup)}
                              className="p-3 rounded-2xl transition-all"
                              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.15)")}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)")}>
                              <HiOutlineXCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isOpen && <DetailDrawer startup={startup} />}
                  </div>
                );
              })
            ) : (
              filteredRequests.length === 0 ? <EmptyState message="No Investor Requests" /> :
              filteredRequests.map((req) => (
                <div key={req.id} className="group rounded-[2.5rem] p-8 transition-all"
                  style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
                  onMouseEnter={hoverAccent} onMouseLeave={resetBorder}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full border text-xs font-black uppercase"
                          style={req.status === "APPROVED"
                            ? { color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }
                            : { color: "var(--accent)", borderColor: "var(--accent-border)" }}>
                          {req.status}
                        </span>
                        <span className="ap-label">Investor Request</span>
                      </div>
                      <h4 className="text-3xl font-black italic tracking-tighter uppercase" style={{ color: "var(--text-primary)" }}>
                        {req.requesterName} @ {req.requesterFirm}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase italic" style={{ color: "var(--text-secondary)" }}>
                        <HiOutlineBuildingOffice2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        Target:{" "}
                        {req.startup ? (
                          <Link href={`/startup/${req.startup.slug ?? req.startup.id}`} target="_blank"
                            className="flex items-center gap-1 transition-colors" style={{ color: "var(--text-primary)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}>
                            {req.startup.name}<HiOutlineArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : <span style={{ color: "var(--text-primary)" }}>General Access</span>}
                      </div>
                    </div>
                    {req.status === "PENDING" && (
                      <div className="flex gap-3">
                        <button onClick={() => handleApproveInvestor(req.id, "APPROVED")} className="ap-btn-primary"
                          style={{ padding: "0.9rem 1.75rem" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4ade80")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}>
                          Grant Access
                        </button>
                        <button onClick={() => handleApproveInvestor(req.id, "REJECTED")}
                          className="p-4 rounded-2xl transition-colors"
                          style={{ background: "color-mix(in srgb, var(--bg-3) 80%, transparent)", color: "var(--text-tertiary)", border: "1px solid var(--border)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#f87171")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}>
                          <HiOutlineXCircle className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[3rem] p-32 text-center shadow-2xl"
      style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}>
      <HiOutlineClock className="w-16 h-16 mx-auto mb-6" style={{ color: "var(--text-tertiary)" }} />
      <p className="ap-label">{message}</p>
    </div>
  );
}
