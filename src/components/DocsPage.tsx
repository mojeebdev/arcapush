"use client";

import Link from "next/link";
import {
  HiOutlineRocketLaunch, HiOutlineLockClosed, HiOutlineSparkles,
  HiOutlineArrowUpRight, HiOutlineCreditCard, HiOutlineShieldCheck,
  HiOutlineCpuChip, HiOutlineGlobeAlt,
} from "react-icons/hi2";

const sections = [
  {
    title: "The Arcapush Protocol",
    icon: <HiOutlineSparkles className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Arcapush is a curated registry of vibe-coded products. Every listing requires a problem statement — not just marketing copy. This is the signal VCs trust.",
    linkText: "View Registry",
    href: "/registry",
  },
  {
    title: "Multichain Infrastructure",
    icon: <HiOutlineCpuChip className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "We support high-speed Solana (SVM) and secure Base (EVM) transactions. We use Wagmi and @solana/web3.js for non-custodial wallet handshakes — you always retain control of your assets.",
    linkText: "View Pricing",
    href: "/pricing",
  },
  {
    title: "Founder Submission",
    icon: <HiOutlineRocketLaunch className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Founders sign in with Google or GitHub, then list their product via the submission form. Data is validated and stored via Prisma ORM on PostgreSQL before being indexed in the registry.",
    linkText: "List a Product",
    href: "/submit",
  },
  {
    title: "Oracle & API Integrity",
    icon: <HiOutlineGlobeAlt className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "We use Alchemy RPC nodes for real-time ledger syncing and CoinGecko oracles for precise USD-to-crypto pricing. This prevents slippage and ensures accurate boost costs.",
    linkText: "View Boost Options",
    href: "/pricing",
  },
  {
    title: "Investor Access",
    icon: <HiOutlineLockClosed className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Pitch decks are gated. Investors submit institutional credentials to receive an encrypted access key — protecting founder intellectual property at every stage.",
    linkText: "Request Access",
    href: "/request",
  },
  {
    title: "Boost (Pinned Status)",
    icon: <HiOutlineCreditCard className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Boost your product to the hero slot. Pinned status grants top-of-page placement and prioritized indexing. Payments are verified on-chain before the registry updates.",
    linkText: "View Pricing",
    href: "/pricing",
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6" style={{ color: "var(--text-primary)" }}>

      <div className="mb-20 text-center">
        <p className="ap-label mb-4">Documentation</p>
        <h1
          className="text-6xl font-black uppercase italic tracking-tighter mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          System <span style={{ color: "var(--accent)" }}>Docs</span>
        </h1>
        <p className="font-playfair text-2xl italic" style={{ color: "var(--text-secondary)" }}>
          How Arcapush works under the hood.
        </p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-[2rem] transition-all duration-500"
            style={{ border: "1px solid var(--border)", background: "var(--bg-2)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          >
            <div className="flex items-start gap-6">
              <div
                className="p-4 rounded-2xl transition-colors"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
              >
                {section.icon}
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-primary)" }}>
                  {section.title}
                </h2>
                <p className="leading-relaxed font-medium mb-8 text-sm max-w-2xl" style={{ color: "var(--text-secondary)" }}>
                  {section.content}
                </p>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 group/link"
                  style={{ border: "1px solid var(--accent-border)", background: "var(--accent-dim)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(232,255,71,0.2)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-dim)")}
                >
                  <HiOutlineShieldCheck className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span
                    className="text-xs font-black uppercase tracking-widest transition-colors"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {section.linkText}
                  </span>
                  <HiOutlineArrowUpRight className="w-3.5 h-3.5 ml-2" style={{ color: "var(--text-tertiary)" }} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust section */}
      <div
        className="mt-20 p-10 rounded-[3rem] relative overflow-hidden group"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--accent-dim), transparent)" }}
        />
        <p className="ap-label mb-6" style={{ color: "var(--accent)" }}>Trust & Safety</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Non-Custodial",
              body: "Arcapush never stores private keys. All transactions are signed locally via your browser wallet (Phantom/MetaMask).",
            },
            {
              title: "Encrypted Transmission",
              body: "Sensitive metadata is encrypted via SSL and gated by institutional verification filters.",
            },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}>
              <h4 className="ap-label mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="font-playfair italic mb-8" style={{ color: "var(--text-secondary)" }}>Questions? We're here.</p>
        <a
          href="mailto:blindspotlabs1@gmail.com"
          className="ap-btn-ghost"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}


