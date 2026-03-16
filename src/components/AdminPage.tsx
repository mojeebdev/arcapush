
"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineLockClosed, HiOutlineFingerPrint } from "react-icons/hi2";
import AdminDashboardView from "@/components/AdminDashboard";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!pin) return;
    setLoading(true);

    try {
      const response = await fetch("/admin/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.authorized) {
        setIsAuthorized(true);
        toast.success("Access granted");
      } else {
        toast.error(data.error || "Invalid PIN");
        setPin("");
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 relative"
        style={{ background: "var(--bg)" }}
      >
        <Toaster position="top-center" />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(232,255,71,0.04) 0%, transparent 60%)",
          }}
        />

        <div className="z-10 w-full max-w-sm flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-10 shadow-2xl"
            style={{
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <HiOutlineLockClosed className="w-7 h-7" style={{ color: "var(--accent)" }} />
          </div>

          <p className="ap-label mb-10">Admin Access</p>

          <input
            type="password"
            placeholder="PIN"
            autoFocus
            className="w-full p-6 rounded-3xl text-center text-3xl tracking-[0.8em] outline-none transition-all font-mono"
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-border)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] mt-5 transition-all shadow-2xl flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: "var(--accent)", color: "#0a0a0a" }}
          >
            {loading ? "Verifying..." : (
              <>Verify Identity <HiOutlineFingerPrint className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 md:p-24 overflow-x-hidden"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <header
          className="flex flex-col md:flex-row md:items-end justify-between pb-16 gap-8"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: "var(--accent)", boxShadow: "0 0 10px rgba(232,255,71,0.5)" }}
              />
              <span className="ap-label" style={{ color: "var(--accent)" }}>Admin Panel — Active</span>
            </div>
            <h1
              className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8]"
              style={{ color: "var(--text-primary)" }}
            >
              Arca<span style={{ color: "var(--accent)" }}>push</span>
            </h1>
          </div>

          <button
            onClick={() => setIsAuthorized(false)}
            className="text-xs font-black tracking-[0.3em] uppercase px-10 py-4 rounded-full transition-all"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-3)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#ff6b6b";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,60,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            Lock Terminal
          </button>
        </header>

        <main className="mt-20">
          <AdminDashboardView guardianPin={pin} />
        </main>
      </div>
    </div>
  );
}