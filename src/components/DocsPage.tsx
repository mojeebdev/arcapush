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
    content: "Arcapush is a curated registry of vibe-coded products — AI-native startups built by solo founders using tools like Cursor, Lovable, Replit, and Bolt. Unlike generic launch platforms, every listing on Arcapush requires a structured problem statement, not just marketing copy. This forces founders to articulate what real problem their product solves, which is the signal VCs actually trust when evaluating early-stage products. The registry is permanently indexed on Google, giving every listed product a searchable, structured page that lives beyond launch day.",
    linkText: "View Registry",
    href: "/registry",
  },
  {
    title: "Multichain Infrastructure",
    icon: <HiOutlineCpuChip className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Arcapush supports payments across two blockchains: Base (EVM) and Solana (SVM). On Base, payments are processed in USDC via the ArcapushBoost smart contract deployed at 0x4A3cbd8a1e21ef21C55e43BA4ff7BD2Bf84b8009 on Base Mainnet. The frontend uses wagmi and viem for non-custodial wallet connections — Coinbase Smart Wallet and MetaMask are both supported. On Solana, payments are processed in SOL via Phantom wallet using @solana/web3.js. Both chains use Alchemy RPC nodes for reliable, low-latency transaction submission and confirmation. At no point does Arcapush take custody of user funds — all transactions are signed locally in the browser.",
    linkText: "View Pricing",
    href: "/pricing",
  },
  {
    title: "Founder Submission Flow",
    icon: <HiOutlineRocketLaunch className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Founders authenticate via NextAuth v5 using Google or GitHub OAuth. Once signed in, they complete the submission form — which collects the product name, URL, problem statement, category, tech stack, and a short description. Submissions are validated server-side and written to a PostgreSQL database via Prisma ORM, with Supabase as the hosted database provider. Approved listings are automatically added to the sitemap and eligible for Google indexing within days. The URL scraper built into the submission flow auto-populates metadata by reading the product's Open Graph tags, reducing friction for founders.",
    linkText: "List a Product",
    href: "/submit",
  },
  {
    title: "Oracle & API Integrity",
    icon: <HiOutlineGlobeAlt className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Crypto payment amounts are calculated in real time using CoinGecko's price API — fetching the live USD price of SOL and USDC before every transaction to ensure founders pay exactly the correct USD equivalent. Alchemy RPC nodes handle all on-chain reads and writes, including transaction submission, blockhash fetching, and confirmation polling. This combination prevents slippage, eliminates stale pricing, and ensures every boost payment is verified on-chain before the registry updates the listing's pinned status. Failed or unconfirmed transactions are automatically rejected.",
    linkText: "View Boost Options",
    href: "/pricing",
  },
  {
    title: "Investor Access",
    icon: <HiOutlineLockClosed className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Pitch decks and extended founder materials are gated behind an institutional verification layer. VCs and angel investors submit their credentials — fund name, investment thesis, and contact details — to receive an encrypted access key. This protects founder intellectual property at every stage of the discovery process, ensuring that sensitive product information is only shared with verified capital allocators. The access request flow is handled separately from the public registry to maintain a clear boundary between discovery and diligence.",
    linkText: "Request Access",
    href: "/request",
  },
  {
    title: "Boost & Pinned Status",
    icon: <HiOutlineCreditCard className="w-6 h-6" style={{ color: "var(--accent)" }} />,
    content: "Founders can pay to boost their listing into the Signals grid — the most-visited section of the Arcapush registry. Pinned status grants top-of-page placement for the duration of the selected plan: Launch pins for three weeks, Pro pins for one month with content amplification, and Pro Max delivers the full BlindspotLab studio for twelve months. Every boost payment is verified on-chain before the registry updates. The smart contract emits an event on confirmation, which the backend listens to before setting the listing's pinned flag in the database. Payments are accepted in USDC on Base, SOL on Solana, or card via Paystack — with Apple Pay supported on card checkout.",
    linkText: "View Pricing",
    href: "/pricing",
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 relative z-10" style={{ color: "var(--text-primary)" }}>

      {/* ── Header ── */}
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

      {/* ── Sections ── */}
      <div className="grid gap-8">
        {sections.map((section, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-[2rem] transition-all duration-500"
            style={{ border: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-2) 80%, transparent)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          >
            <div className="flex items-start gap-6">
              <div
                className="p-4 rounded-2xl transition-colors flex-shrink-0"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
              >
                {section.icon}
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-black uppercase tracking-widest mb-3" style={{ color: "var(--text-primary)" }}>
                  {section.title}
                </h2>
                <p className="leading-relaxed font-medium mb-8 text-sm max-w-2xl" style={{ color: "var(--text-secondary)" }}>
                  {section.content}
                </p>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300"
                  style={{ border: "1px solid var(--accent-border)", background: "var(--accent-dim)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(232,255,71,0.2)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-dim)")}
                >
                  <HiOutlineShieldCheck className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                    {section.linkText}
                  </span>
                  <HiOutlineArrowUpRight className="w-3.5 h-3.5 ml-2" style={{ color: "var(--text-tertiary)" }} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stack callout ── */}
      <div
        className="mt-16 p-10 rounded-[2.5rem]"
        style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
      >
        <p className="ap-label mb-6">The Stack</p>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          Arcapush is built entirely on open, production-grade infrastructure. The full stack:
          Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma 7, Supabase (PostgreSQL),
          NextAuth v5, wagmi, viem, @solana/web3.js, Alchemy RPC, Vercel, and @vercel/og
          for dynamic OG image generation. Smart contracts are written in Solidity and deployed
          on Base Mainnet. The codebase was built solo by Mojeeb under BlindspotLab.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js 15", "TypeScript", "Tailwind CSS", "Prisma 7", "Supabase",
            "NextAuth v5", "wagmi", "viem", "Solidity", "Base Mainnet",
            "Solana", "Alchemy", "Vercel", "@vercel/og",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── Trust section ── */}
      <div
        className="mt-8 p-10 rounded-[3rem] relative overflow-hidden group"
        style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
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
              body: "Arcapush never stores private keys or seed phrases. All transactions are signed locally in your browser via Phantom, MetaMask, or Coinbase Smart Wallet. The platform only reads the resulting transaction hash to verify payment.",
            },
            {
              title: "Encrypted Transmission",
              body: "All data transmitted between the client and server is encrypted via SSL/TLS. Sensitive founder metadata and investor credentials are processed server-side and never exposed in client bundles.",
            },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}>
              <h4 className="ap-label mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact ── */}
      <div className="mt-16 text-center">
        <p className="font-playfair italic mb-8" style={{ color: "var(--text-secondary)" }}>
          Questions about the infrastructure? We're here.
        </p>
        <a href="mailto:blindspotlabs1@gmail.com" className="ap-btn-ghost">
          Contact Support
        </a>
      </div>

    </div>
  );
}