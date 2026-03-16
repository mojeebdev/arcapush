"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineXMark, HiOutlineLockClosed, HiOutlineBuildingOffice2,
  HiOutlineLink, HiOutlineBriefcase, HiOutlineEnvelope, HiOutlineUser,
} from "react-icons/hi2";

interface RequestAccessModalProps {
  startupId: string;
  startupName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RequestAccessModal({ startupId, startupName, onClose, onSuccess }: RequestAccessModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requesterName: "", requesterEmail: "",
    requesterFirm: "", requesterRole: "", requesterLinkedIn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startupId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      toast.success("Access request submitted!");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    type = "text",
    placeholder = "",
    icon?: React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className="ap-label flex items-center gap-2">{icon} {label}</label>
      <input
        type={type} required value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="ap-input"
      />
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        style={{ background: "rgba(10,10,15,0.6)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          style={{ background: "var(--bg)", border: "1px solid var(--border-2)" }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-8 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
              >
                <HiOutlineLockClosed className="w-6 h-6" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter"
                  style={{ color: "var(--text-primary)" }}
                >
                  Request Access
                </h3>
                <p className="ap-label">To {startupName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("requesterName",  "Name",  "text",  "Jane Smith",  <HiOutlineUser className="w-3 h-3" />)}
              {field("requesterEmail", "Email", "email", "jane@firm.com", <HiOutlineEnvelope className="w-3 h-3" />)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("requesterFirm", "Firm", "text", "Sequoia", <HiOutlineBuildingOffice2 className="w-3 h-3" />)}
              {field("requesterRole", "Role", "text", "Partner",  <HiOutlineBriefcase className="w-3 h-3" />)}
            </div>
            {field("requesterLinkedIn", "LinkedIn URL", "url", "https://linkedin.com/in/...", <HiOutlineLink className="w-3 h-3" />)}
            <button type="submit" disabled={loading} className="ap-btn-primary w-full disabled:opacity-40">
              {loading ? "Submitting..." : "Submit Access Request"}
            </button>
            <p className="ap-label text-center">Reviewed within 6-24 hours.</p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}