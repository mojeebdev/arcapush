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
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <HiOutlineLockClosed className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Request Access</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  To {startupName} Signal
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <HiOutlineXMark className="w-6 h-6 text-zinc-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <HiOutlineUser className="w-3 h-3" /> Name
                </label>
                <input
                  type="text"
                  required
                  value={form.requesterName}
                  onChange={(e) => updateField("requesterName", e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <HiOutlineEnvelope className="w-3 h-3" /> Email
                </label>
                <input
                  type="email"
                  required
                  value={form.requesterEmail}
                  onChange={(e) => updateField("requesterEmail", e.target.value)}
                  placeholder="jane@firm.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <HiOutlineBuildingOffice2 className="w-3 h-3" /> Firm
                </label>
                <input
                  type="text"
                  required
                  value={form.requesterFirm}
                  onChange={(e) => updateField("requesterFirm", e.target.value)}
                  placeholder="Sequoia"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <HiOutlineBriefcase className="w-3 h-3" /> Role
                </label>
                <input
                  type="text"
                  required
                  value={form.requesterRole}
                  onChange={(e) => updateField("requesterRole", e.target.value)}
                  placeholder="Partner"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                <HiOutlineLink className="w-3 h-3" /> LinkedIn
              </label>
              <input
                type="url"
                required
                value={form.requesterLinkedIn}
                onChange={(e) => updateField("requesterLinkedIn", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Submit Access Request"}
            </button>

            <p className="text-[10px] text-zinc-600 text-center font-bold uppercase tracking-tighter">
              Shared only with the founder for verification.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}