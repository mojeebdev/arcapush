"use client";

import Link from "next/link";
import { 
  HiOutlineBookOpen, 
  HiOutlineRocketLaunch, 
  HiOutlineLockClosed, 
  HiOutlineSparkles,
  HiOutlineArrowUpRight,
  HiOutlineCreditCard
} from "react-icons/hi2";

const sections = [
  {
    title: "The Vibe Code Protocol",
    icon: <HiOutlineSparkles className="w-6 h-6 text-[#D4AF37]" />,
    content: "VibeStream is a curated encyclopedia of high-signal startups. We categorize food items based on technical brilliance and market potential.",
    linkText: "View Encyclopedia",
    href: "/"
  },
  {
    title: "Founder Submission",
    icon: <HiOutlineRocketLaunch className="w-6 h-6 text-[#4E24CF]" />,
    content: "Founders can list their projects via our intake portal. Initial listings are indexed in the Discovery Ticker for immediate visibility.",
    linkText: "Submit Project",
    href: "/submit"
  },
  {
    title: "Investor Clearance",
    icon: <HiOutlineLockClosed className="w-6 h-6 text-[#D4AF37]" />,
    content: "To maintain confidentiality, pitch decks are gated. Investors must submit institutional credentials to receive an encrypted access key.",
    linkText: "Get Clearance",
    href: "/request"
  },
  {
    title: "Premium Pinned Status",
    icon: <HiOutlineCreditCard className="w-6 h-6 text-[#4E24CF]" />,
    content: "Elevate your signal to the Featured Tier. Pinned status grants top-of-page placement and prioritized indexing in the VibeStream ecosystem.",
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
                <p className="text-zinc-500 leading-relaxed font-medium mb-6">
                  {section.content}
                </p>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4E24CF] group-hover:text-[#D4AF37] transition-colors">
                  Execute: {section.linkText} —
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-b from-[#4E24CF]/10 to-transparent border border-[#4E24CF]/20 text-center">
        <h3 className="text-sm font-black uppercase tracking-[0.5em] mb-4">Need Human Assistance?</h3>
        <p className="text-zinc-400 mb-8 font-playfair italic">Our Guardians are standing by for institutional inquiries.</p>
        <a href="mailto:support@vibestream.cc" className="royal-button inline-block">
          Contact Support
        </a>
      </div>
    </div>
  );
}