"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  Discover: [
    { href: "/registry", label: "Registry"        },
    { href: "/blog",     label: "Blog"            },
    { href: "/pricing",  label: "Boost Listing"   },
    { href: "/about",    label: "About"           },
  ],
  Founders: [
    { href: "/submit",    label: "List a Product" },
    { href: "/pricing",   label: "Pricing"        },
    { href: "/docs",      label: "Docs"           },
    { href: "/investors", label: "VC Panel"       },
  ],
  Intelligence: [
    { href: "/blog/what-is-vibe-coding",            label: "What is Vibe Coding?"    },
    { href: "/blog/andrej-karpathy-vibe-coding",    label: "Origin of Vibe Coding"   },
    { href: "/blog/vc-backed-vibe-coding-startups", label: "VC-Backed Startups"      },
    { href: "/blog/best-vibe-coding-tools-2026",    label: "Best Tools 2026"         },
    { href: "/blog/claude-vs-chatgpt-vibe-coding",  label: "Claude vs ChatGPT"       },
    { href: "/blog/cursor-vs-github-copilot",       label: "Cursor vs Copilot"       },
  ],
  Connect: [
    { href: "https://twitter.com/arcapush",   label: "X / Twitter", external: true },
    { href: "https://mojeeb.xyz",             label: "Founder",      external: true },
    { href: "https://blindspotlab.xyz",       label: "BlindspotLab", external: true },
  ],
};

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-2)",
        borderTop: "1px solid var(--border)",
      }}
      className="w-full pt-20 pb-12"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Top — Brand + Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-black uppercase tracking-tighter" style={{ color: "var(--text-primary)" }}>
                Arca<span style={{ color: "var(--accent)" }}>push</span>
              </span>
            </Link>
            <p className="text-xs font-black uppercase tracking-widest leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Where vibe-coded products get discovered.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="ap-label mb-5">{section}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-widest transition-colors"
                        style={{ color: "var(--text-tertiary)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs font-bold uppercase tracking-widest transition-colors"
                        style={{ color: "var(--text-tertiary)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
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
        <div className="ap-divider mb-10" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Powered by */}
          <div className="flex items-center gap-5">
            <p className="ap-label">Powered by</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <img src="/base-logo.png" alt="Base" className="h-4 w-4 object-contain" />
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Base</span>
              </div>
              <div style={{ width: 1, height: "0.75rem", background: "var(--border)" }} />
              <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <img src="/solana-sol-logo.png" alt="Solana" className="h-4 w-4 object-contain" />
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Solana</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                Built by
              </span>
              <a
                href="https://blindspotlab.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black uppercase tracking-widest relative group/link transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                BlindspotLab
              </a>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
              © {new Date().getFullYear()} Arcapush. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}