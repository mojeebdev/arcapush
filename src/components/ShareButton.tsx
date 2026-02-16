"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineShare, HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";

interface ShareButtonProps {
  startup: { id: string; name: string; tagline: string };
}

export function ShareButton({ startup }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://vibestream.cc"}/startup/${startup.id}`;
  const text = `🚀 Check out ${startup.name} on @VibeStreamCC — ${startup.tagline}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
    setOpen(false);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary text-sm flex items-center gap-1.5"
      >
        <HiOutlineShare className="w-4 h-4" />
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full mb-2 right-0 z-50 w-48 glass-strong rounded-xl p-2 space-y-1">
            <button
              onClick={shareTwitter}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-surface-300 transition-all"
            >
              <FaXTwitter className="w-4 h-4" />
              Post on X
            </button>
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-surface-300 transition-all"
            >
              <HiOutlineClipboardDocument className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}