"use client";

import Link from "next/link";
import Image from "next/image";

type FooterLink = { href: string; label: string; external?: boolean; };
type FooterLinks = { [section: string]: FooterLink[]; };

const FOOTER_LINKS: FooterLinks = {
  Discover: [
    { href: "//how-arcapush-works", label: "How It Works"  },
    { href: "/registry",     label: "Registry"      },
    { href: "/blog",         label: "Blog"          },
    { href: "/about",        label: "About"         },
  ],
  Founders: [
    { href: "/submit",    label: "List a Product" },
    { href: "/pricing",   label: "Boost"          },
    { href: "/docs",      label: "Docs"           },
  ],
  Products: [  
    { href: "https://promptrank.arcapush.com", label: "PromptRank" },
    { href: "https://arcaprompt.arcapush.com", label: "ArcaPrompt" },
  ],
  Intelligence: [
    { href: "/blog/What-is-vibe-coding",            label: "What is Vibe Coding?"  },
    { href: "/blog/andrej-karpathy-vibe-coding",    label: "Origin of Vibe Coding" },
    { href: "/blog/vc-backed-vibe-coding-startups", label: "VC-Backed Startups"    },
    { href: "/blog/best-vibe-coding-tools-2026",    label: "Best Tools 2026"       },
    { href: "/blog/claude-vs-chatgpt-vibe-coding",  label: "Claude vs ChatGPT"     },
    { href: "/blog/cursor-vs-github-copilot",       label: "Cursor vs Copilot"     },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy"   },
    { href: "/terms",   label: "Terms of Service" },
  ],
  Connect: [
    { href: "https://twitter.com/arcapush", label: "X / Twitter",  external: true },
    { href: "https://mojeeb.xyz",           label: "Founder",      external: true },
    { href: "https://blindspotlab.xyz",     label: "BlindspotLab", external: true },
  ],
};

const linkStyle = {
  fontFamily:     "var(--font-mono)",
  fontSize:       "0.58rem",
  fontWeight:     700,
  letterSpacing:  "0.13em",
  textTransform:  "uppercase" as const,
  color:          "var(--text-tertiary)",
};
const linkHover = { color: "var(--text-primary)" };

function FooterLink({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
        onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, linkHover)}
        onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, linkStyle)}
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link
      href={link.href}
      style={linkStyle}
      onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, linkHover)}
      onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, linkStyle)}
    >
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer
      className="w-full pt-20 pb-12 relative overflow-hidden"
      style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

      {/* Fade grid at top + bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom,
              var(--bg-2) 0%,
              transparent 12%,
              transparent 80%,
              var(--bg-2) 100%
            )
          `,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Top — Brand + Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Image
                src="/arcapush-logo.png"
                alt="Arcapush"
                width={120}
                height={32}
                className="h-7 w-auto object-contain"
              />
              <span
                style={{
                  fontFamily:    "var(--font-mono)",
                  fontSize:      "0.7rem",
                  fontWeight:    700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color:         "var(--text-primary)",
                }}
              >
                Arcapush
              </span>
            </Link>
            <p
              style={{
                fontFamily:    "var(--font-mono)",
                fontSize:      "0.58rem",
                fontWeight:    700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                lineHeight:    1.7,
                color:         "var(--text-tertiary)",
              }}
            >
              Where vibe-coded products get discovered.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p
                style={{
                  fontFamily:    "var(--font-mono)",
                  fontSize:      "0.55rem",
                  fontWeight:    700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         "var(--accent)",
                  marginBottom:  "1.25rem",
                }}
              >
                {section}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <FooterLink link={link} />
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
            <p
              style={{
                fontFamily:    "var(--font-mono)",
                fontSize:      "0.55rem",
                fontWeight:    700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color:         "var(--text-tertiary)",
              }}
            >
              Powered by
            </p>
            <div className="flex items-center gap-4">
              {[
                { src: "/base-logo.png",       alt: "Base",   label: "Base"   },
                { src: "/solana-sol-logo.png",  alt: "Solana", label: "Solana" },
              ].map((chain, i) => (
                <div key={chain.alt} className="flex items-center gap-4">
                  {i > 0 && (
                    <div style={{ width: 1, height: "0.75rem", background: "var(--border)" }} />
                  )}
                  <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <img src={chain.src} alt={chain.alt} className="h-4 w-4 object-contain" />
                    <span
                      style={{
                        fontFamily:    "var(--font-mono)",
                        fontSize:      "0.58rem",
                        fontWeight:    700,
                        letterSpacing: "0.13em",
                        textTransform: "uppercase",
                        color:         "var(--text-secondary)",
                      }}
                    >
                      {chain.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily:    "var(--font-mono)",
                  fontSize:      "0.55rem",
                  fontWeight:    700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color:         "var(--text-tertiary)",
                }}
              >
                Built by
              </span>
              <a
                href="https://blindspotlab.xyz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily:    "var(--font-mono)",
                  fontSize:      "0.55rem",
                  fontWeight:    700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color:         "var(--text-secondary)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
              >
                BlindspotLab
              </a>
            </div>
            <p
              style={{
                fontFamily:    "var(--font-mono)",
                fontSize:      "0.55rem",
                fontWeight:    700,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color:         "var(--text-tertiary)",
              }}
            >
              © {new Date().getFullYear()} Arcapush. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}