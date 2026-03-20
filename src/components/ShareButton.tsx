"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineShare, HiOutlineClipboardDocument } from "react-icons/hi2";
import { FaXTwitter } from "react-icons/fa6";

interface ShareButtonProps {
  startup: {
    id:            string;
    slug?:         string | null;
    categorySlug?: string;
    name:          string;
    tagline:       string;
    category?:     string;
  };
}

function buildShareUrl(startup: ShareButtonProps["startup"]): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://arcapush.com";
  const cat  = startup.categorySlug
    ?? startup.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ?? "startup";
  const path = startup.slug ?? startup.id;
  return `${base}/startup/${cat}/${path}`;
}

export function ShareButton({ startup }: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  const url  = buildShareUrl(startup);
  const text = `Check out ${startup.name} on @arcapush — ${startup.tagline}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
    setOpen(false);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="ap-btn-ghost flex items-center gap-2 active:scale-95"
        style={{ padding: "0.75rem 1.25rem" }}
      >
        <HiOutlineShare className="w-4 h-4" />
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute bottom-full mb-3 right-0 z-50 w-52 rounded-2xl p-2 shadow-2xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)" }}
          >
            <button
              onClick={shareTwitter}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <FaXTwitter className="w-4 h-4" style={{ color: "var(--text-primary)" }} />
              Post on X
            </button>

            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <HiOutlineClipboardDocument className="w-4 h-4" style={{ color: "var(--text-primary)" }} />
              Copy Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}