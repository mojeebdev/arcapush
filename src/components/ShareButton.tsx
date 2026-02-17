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
    toast.success("Signal Link Copied!");
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
        className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95"
      >
        <HiOutlineShare className="w-4 h-4" />
        Share
      </button>

      {open && (
        <>
          {/* Guardian Overlay for click-away behavior */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          
          <div className="absolute bottom-full mb-3 right-0 z-50 w-56 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={shareTwitter}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <FaXTwitter className="w-4 h-4 text-white" />
              Post on X
            </button>
            
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <HiOutlineClipboardDocument className="w-4 h-4 text-white" />
              Copy Signal
            </button>
          </div>
        </>
      )}
    </div>
  );
}