"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineXMark,
  HiOutlineLockClosed,
  HiOutlineBuildingOffice2,
  HiOutlineLink,
  HiOutlineBriefcase,
  HiOutlineEnvelope,
  HiOutlineUser,
} from "react-icons/hi2";

interface RequestAccessModalProps {
  startupId: string;
  startupName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RequestAccessModal({
  startupId,
  startupName,
  onClose,
  onSuccess,
}: RequestAccessModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterFirm: "",
    requesterRole: "",
    requesterLinkedIn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startupId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      toast.success("Access request submitted! The founder will review it.");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg glass-strong rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <HiOutlineLockClosed className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Request Access</h3>
                <p className="text-xs text-white/40">
                  to {startupName}&apos;s founder details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-300 transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5 text-white/50" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <HiOutlineUser className="w-4 h-4" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.requesterName}
                onChange={(e) => updateField("requesterName", e.target.value)}
                placeholder="Jane Smith"
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <HiOutlineEnvelope className="w-4 h-4" />
                Email *
              </label>
              <input
                type="email"
                required
                value={form.requesterEmail}
                onChange={(e) => updateField("requesterEmail", e.target.value)}
                placeholder="jane@sequoia.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <HiOutlineBuildingOffice2 className="w-4 h-4" />
                Firm / Company *
              </label>
              <input
                type="text"
                required
                value={form.requesterFirm}
                onChange={(e) => updateField("requesterFirm", e.target.value)}
                placeholder="Sequoia Capital"
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <HiOutlineBriefcase className="w-4 h-4" />
                Role *
              </label>
              <input
                type="text"
                required
                value={form.requesterRole}
                onChange={(e) => updateField("requesterRole", e.target.value)}
                placeholder="Partner, Analyst, Scout..."
                className="input-field"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                <HiOutlineLink className="w-4 h-4" />
                LinkedIn Profile *
              </label>
              <input
                type="url"
                required
                value={form.requesterLinkedIn}
                onChange={(e) => updateField("requesterLinkedIn", e.target.value)}
                placeholder="https://linkedin.com/in/janesmith"
                className="input-field"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Request"
                )}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
            </div>

            <p className="text-[11px] text-white/20 text-center pt-1">
              Your info is shared only with the founder for verification purposes.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}