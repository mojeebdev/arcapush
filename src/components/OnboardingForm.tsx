"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineUser, HiOutlineLink, HiOutlineDocumentText } from "react-icons/hi2";

interface Props {
  userId: string;
  defaultName: string;
  defaultEmail: string;
}

export function OnboardingForm({ userId, defaultName, defaultEmail }: Props) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: defaultName,
    twitterHandle: "",
    bio: "",
    role: "Solo Founder",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      toast.success("Profile saved. Let's list your product.");
      router.push("/submit");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ROLES = ["Solo Founder", "Co-Founder", "Indie Hacker", "Vibe Coder", "Builder", "Other"];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <div className="space-y-2">
        <label className="ap-label flex items-center gap-2">
          <HiOutlineUser className="w-3 h-3" /> Display Name
        </label>
        <input
          type="text" required className="ap-input" placeholder="Mojeeb"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label className="ap-label">Role</label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r} type="button"
              onClick={() => setForm({ ...form, role: r })}
              className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              style={{
                background:  form.role === r ? "var(--accent)" : "var(--bg-3)",
                color:       form.role === r ? "#fff"          : "var(--text-secondary)",
                border:      "1px solid",
                borderColor: form.role === r ? "var(--accent)" : "var(--border)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Twitter handle */}
      <div className="space-y-2">
        <label className="ap-label flex items-center gap-2">
          <HiOutlineLink className="w-3 h-3" /> X / Twitter Handle
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black"
            style={{ color: "var(--text-tertiary)" }}
          >
            @
          </span>
          <input
            type="text" className="ap-input pl-8" placeholder="mojeebeth"
            value={form.twitterHandle}
            onChange={(e) => setForm({ ...form, twitterHandle: e.target.value.replace("@", "") })}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="ap-label flex items-center gap-2">
          <HiOutlineDocumentText className="w-3 h-3" /> One-line Bio
          <span style={{ color: "var(--text-tertiary)" }} className="normal-case font-normal tracking-normal text-xs">
            (optional)
          </span>
        </label>
        <input
          type="text" className="ap-input"
          placeholder="Building in public. Vibe coder. Web3 strategist."
          maxLength={120}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      {/* Email (read-only) */}
      <div className="p-4 rounded-xl text-sm"
        style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
      >
        <span className="ap-label mr-2">Account</span>
        {defaultEmail}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="ap-btn-primary w-full disabled:opacity-40"
        style={{ marginTop: "0.5rem" }}
      >
        {loading ? "Saving..." : "Save Profile → List Your Product"}
      </button>

    </form>
  );
}