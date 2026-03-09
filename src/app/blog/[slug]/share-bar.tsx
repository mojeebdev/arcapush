"use client";

import { useState } from "react";
import { AdminConfig } from "@/lib/adminConfig";

interface ShareBarProps {
  title: string;
  slug: string;
}

export function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url = `${AdminConfig.SITE_URL}/blog/${slug}`;
  const tweetText = encodeURIComponent(`${title} — via @vibestreamcc\n${url}`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
        Share
      </span>

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-950 hover:border-white/30 hover:bg-zinc-900 transition-all group"
      >
        <svg className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">X</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-950 hover:border-blue-500/40 hover:bg-zinc-900 transition-all group"
      >
        <svg className="w-3 h-3 text-zinc-400 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-blue-400 transition-colors">LinkedIn</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        title="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-950 hover:border-[#D4AF37]/40 hover:bg-zinc-900 transition-all group cursor-pointer"
      >
        {copied ? (
          <>
            <svg className="w-3 h-3 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-3 h-3 text-zinc-400 group-hover:text-[#D4AF37] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#D4AF37] transition-colors">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
