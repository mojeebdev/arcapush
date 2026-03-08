"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  Explore: [
    { href: "/registry",  label: "Registry"       },
    { href: "/blog",      label: "Blog"            },
    { href: "/pricing",   label: "Signal Boost"    },
    { href: "/about",     label: "About"           },
    { href: "/docs",      label: "Documentation"   },
  ],
  Founders: [
    { href: "/submit",    label: "Submit Startup"  },
    { href: "/request",   label: "Request Access"  },
    { href: "/success",   label: "Success Stories" },
    { href: "/pricing",   label: "Pricing"         },
  ],
  Intelligence: [
    { href: "/blog/what-is-vibe-coding",                label: "What is Vibe Coding?"         },
    { href: "/blog/andrej-karpathy-vibe-coding",        label: "Origin of Vibe Coding"        },
    { href: "/blog/vc-backed-vibe-coding-startups",     label: "VC-Backed Startups"           },
    { href: "/blog/best-vibe-coding-tools-2026",        label: "Best Tools 2026"              },
    { href: "/blog/claude-vs-chatgpt-vibe-coding",      label: "Claude vs ChatGPT"            },
    { href: "/blog/cursor-vs-github-copilot",           label: "Cursor vs Copilot"            },
  ],
  Connect: [
    { href: "https://twitter.com/vibestreamcc", label: "X / Twitter", external: true },
    { href: "https://mojeeb.xyz",               label: "Founder",     external: true },
  ],
};

export function Footer() {
  return (
    <footer className="w-full pt-24 pb-16 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top — Brand + Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-white font-black text-lg uppercase tracking-tighter">
                Vibe<span className="text-[#4E24CF]">Stream</span>
              </span>
            </Link>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Where the next unicorn gets discovered.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-5">
                {section}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-12" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Powered By */}
          <div className="flex items-center gap-6">
            <p className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase">
              Powered by
            </p>
            <div className="flex items-center gap-5">
              {/* Base */}
              <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <img
                  src="/base-logo.png"
                  alt="Base"
                  className="h-4 w-4 object-contain"
                  style={{ filter: "none" }}
                />
                <span className="text-[9px] font-black tracking-[0.2em] text-zinc-300 uppercase">
                  Base
                </span>
              </div>

              <div className="h-3 w-px bg-white/10" />

              {/* Solana */}
              <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <img
                  src="https://cryptologos.cc/logos/solana-sol-logo.png?v=024"
                  alt="Solana"
                  className="h-4 w-4 object-contain"
                  style={{ filter: "none" }}
                />
                <span className="text-[9px] font-black tracking-[0.2em] text-zinc-300 uppercase">
                  Solana
                </span>
              </div>
            </div>
          </div>

          {/* Copyright + Innovation */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                Innovation by
              </span>
              <a
                href="https://blindspotlab.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-black text-zinc-400 hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-[0.3em] relative group/link"
              >
                BlindspotLab
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover/link:w-full" />
              </a>
            </div>
            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Vibestream. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}