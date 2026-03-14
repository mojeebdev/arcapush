"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineShieldCheck,
  HiOutlineCube,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
} from "react-icons/hi2";

function RequestForm() {
  const searchParams = useSearchParams();
  const startupId   = searchParams.get("startupId") || "general_access";
  const startupName = searchParams.get("name")      || "Arcapush Network";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", firm: "", role: "VC", linkedIn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        requesterName: formData.name,
        requesterEmail: formData.email,
        requesterFirm: formData.firm,
        requesterLinkedIn: formData.linkedIn,
        status: "PENDING",
        startupId,
      };
      const res  = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Access request submitted!");
        setFormData({ name: "", email: "", firm: "", role: "VC", linkedIn: "" });
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}
        >
          <HiOutlineShieldCheck className="w-3 h-3" style={{ color: "var(--accent)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)" }}>
            Identity Verification Required
          </span>
        </div>

        <h1 className="ap-display mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--text-primary)" }}>
          Venture <span style={{ color: "var(--accent)" }}>Access</span>
        </h1>

        <p className="text-base mb-2" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-syne)" }}>
          Requesting terminal clearance for:
        </p>
        <p className="ap-display text-sm" style={{ color: "var(--accent)" }}>
          {startupName}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[2.5rem]"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
      >

        {/* Name */}
        <div className="space-y-2 col-span-2 md:col-span-1">
          <label className="ap-label">Full Name</label>
          <div className="relative">
            <HiOutlineIdentification className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <input
              required className="ap-input pl-11"
              placeholder="Jane Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 col-span-2 md:col-span-1">
          <label className="ap-label">Institutional Email</label>
          <div className="relative">
            <HiOutlineGlobeAlt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <input
              required type="email" className="ap-input pl-11"
              placeholder="name@firm.vc"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Firm */}
        <div className="space-y-2 col-span-2">
          <label className="ap-label">Firm / Family Office</label>
          <div className="relative">
            <HiOutlineCube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <input
              required className="ap-input pl-11"
              placeholder="Sequoia Capital"
              value={formData.firm}
              onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div className="space-y-2 col-span-2">
          <label className="ap-label">LinkedIn Profile URL</label>
          <input
            className="ap-input"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="ap-btn-primary col-span-2 mt-2 w-full flex items-center justify-center gap-3 disabled:opacity-40"
        >
          {loading ? "Submitting..." : (
            <>
              Request Investor Access
              <HiOutlineShieldCheck className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="col-span-2 ap-label text-center">
          Reviewed within 24 hours.
        </p>
      </form>

      <p className="text-center ap-label mt-10">
        Arcapush Security Protocol
      </p>
    </div>
  );
}

export default function InvestorRequestPage() {
  return (
    <main className="min-h-screen px-6 pt-32 pb-20" style={{ background: "var(--bg)" }}>
      <Toaster position="top-center" />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center ap-label animate-pulse">
          Loading...
        </div>
      }>
        <RequestForm />
      </Suspense>
    </main>
  );
}