"use client";

import Link from "next/link";
import { 
  HiOutlineBookOpen, 
  HiOutlineRocketLaunch, 
  HiOutlineLockClosed, 
  HiOutlineSparkles,
  HiOutlineArrowUpRight,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt
} from "react-icons/hi2";

const sections = [
  {
    title: "The Vibe Code Protocol",
    icon: <HiOutlineSparkles className="w-6 h-6 text-[#D4AF37]" />,
    content: "VibeStream is a curated encyclopedia of high-signal startups. We categorize 'food items' (projects) based on technical brilliance and market potential using the proprietary Whate Engine logic.",
    linkText: "View Encyclopedia",
    href: "/"
  },
  {
    title: "Multichain Infrastructure",
    icon: <HiOutlineCpuChip className="w-6 h-6 text-[#4E24CF]" />,
    content: "Our architecture supports high-speed Solana (SVM) and secure Base (EVM) transactions. We use Wagmi and @solana/web3.js for non-custodial wallet handshakes, ensuring you always retain control of your assets.",
    linkText: "Network Specs",
    href: "/pricing"
  },
  {
    title: "Founder Submission",
    icon: <HiOutlineRocketLaunch className="w-6 h-6 text-[#D4AF37]" />,
    content: "Founders can list projects via our intake portal. Data is validated and stored via Prisma ORM on a secure PostgreSQL layer before being indexed in the Discovery Ticker.",
    linkText: "Submit Project",
    href: "/submit"
  },
  {
    title: "Oracle & API Integrity",
    icon: <HiOutlineGlobeAlt className="w-6 h-6 text-[#4E24CF]" />,
    content: "We utilize Alchemy RPC nodes for real-time ledger syncing and CoinGecko Oracles for precise USD-to-crypto pricing. This prevents slippage and ensures fair 'Ascension' costs.",
    linkText: "Verify Oracles",
    href: "/pricing"
  },
  {
    title: "Investor Clearance",
    icon: <HiOutlineLockClosed className="w-6 h-6 text-[#D4AF37]" />,
    content: "To maintain confidentiality, pitch decks are gated. Investors must submit institutional credentials to receive an encrypted access key, protecting founder intellectual property.",
    linkText: "Get Clearance",
    href: "/request"
  },
  {
    title: "Premium Pinned Status",
    icon: <HiOutlineCreditCard className="w-6 h-6 text-[#4E24CF]" />,
    content: "Elevate your signal to the Featured Tier. Pinned status grants top-of-page placement and prioritized indexing. Payments are verified on-chain before the Registry updates.",
    linkText: "View Pricing",
    href: "/pricing"
  }
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="mb-20 text-center">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-6">
          System <span className="text-[#4E24CF]">Docs</span>
        </h1>
        <p className="font-playfair text-2xl text-zinc-400 italic">
          Mastering the VibeStream Venture Ecosystem
        </p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, index) => (
          <Link 
            key={index} 
            href={section.href}
            className="group relative p-8 rounded-[2rem] border border-white/5 bg-zinc-950/30 hover:bg-zinc-900/40 transition-all duration-500 block"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-black border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors">
                {section.icon}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
                    {section.title}
                  </h2>
                  <HiOutlineArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                </div>
                <p className="text-zinc-500 leading-relaxed font-medium mb-6 text-sm">
                  {section.content}
                </p>
                <div className="flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-3 h-3 text-[#4E24CF]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4E24CF] group-hover:text-[#D4AF37] transition-colors">
                    Execute: {section.linkText}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Safety Disclosure Section */}
      <div className="mt-20 p-10 rounded-[3rem] bg-zinc-950 border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4E24CF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h3 className="text-xs font-black uppercase tracking-[0.5em] mb-6 text-[#D4AF37]">Trust & Safety Protocol</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-4 rounded-xl bg-black/50 border border-white/5">
            <h4 className="text-[10px] font-black text-white uppercase mb-2">Non-Custodial</h4>
            <p className="text-zinc-500 text-[10px] leading-relaxed">VibeStream never stores private keys. All transactions are signed locally via your browser extension (Phantom/MetaMask).</p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5">
            <h4 className="text-[10px] font-black text-white uppercase mb-2">Encrypted Transmission</h4>
            <p className="text-zinc-500 text-[10px] leading-relaxed">Sensitive metadata is encrypted via industry-standard SSL and gated by institutional verification filters.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-zinc-600 mb-8 font-playfair italic">Our Guardians are standing by for institutional inquiries.</p>
        <a href="mailto:blindspotlabs1@gmail.com" className="bg-zinc-900 hover:bg-white hover:text-black text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-500">
          Contact Support
        </a>
      </div>
    </div>
  );
}