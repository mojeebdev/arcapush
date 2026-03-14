"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineLightBulb,
  HiOutlineRocketLaunch,
  HiOutlineChartBar,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineArrowUpRight,
  HiOutlineCheckCircle,
} from "react-icons/hi2";


function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-24 px-6 max-w-7xl mx-auto ${className}`}>
      {children}
    </section>
  );
}


export function ProblemBlock() {
  const problems = [
    {
      icon: <HiOutlineRocketLaunch className="w-6 h-6" />,
      label: "The Situation",
      heading: "You built something real.",
      body: "Months of late nights, shipped features, real users. But Google doesn't know you exist and VCs can't find you.",
    },
    {
      icon: <HiOutlineLightBulb className="w-6 h-6" />,
      label: "The Problem",
      heading: "Vibe coders don't market.",
      body: "You code fast. Marketing is a second job you didn't sign up for. Most tools reward marketing skill, not product quality.",
    },
    {
      icon: <HiOutlineCheckCircle className="w-6 h-6" />,
      label: "The Fix",
      heading: "One listing. Permanent visibility.",
      body: "Arcapush creates an indexed, structured page for your product. Your problem statement becomes the signal investors actually trust.",
      accent: true,
    },
  ];

  return (
    <Section>
      <div className="text-center mb-16">
        <p className="ap-label mb-3">Why Arcapush</p>
        <h2
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          The Problem with<br />
          <span style={{ color: "var(--accent)" }}>Discovery</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="p-8 rounded-2xl"
            style={{
              background: item.accent ? "var(--accent-dim)" : "var(--bg-2)",
              border: `1px solid ${item.accent ? "var(--accent-border)" : "var(--border)"}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{
                background: item.accent ? "var(--accent)" : "var(--bg-3)",
                color: item.accent ? "#0a0a0a" : "var(--accent)",
              }}
            >
              {item.icon}
            </div>
            <p className="ap-label mb-3">{item.label}</p>
            <h3
              className="text-xl font-black uppercase tracking-tighter mb-3"
              style={{ color: item.accent ? "var(--accent)" : "var(--text-primary)" }}
            >
              {item.heading}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}


export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Sign in",
      body: "Google or GitHub. No passwords. 10 seconds.",
    },
    {
      step: "02",
      title: "Write your problem statement",
      body: "What specific problem does your product solve? This is mandatory — and it's what VCs actually read.",
    },
    {
      step: "03",
      title: "Submit once",
      body: "We create a structured, SEO-optimized page. JSON-LD schema. Canonical URL. Indexed automatically.",
    },
    {
      step: "04",
      title: "Get discovered",
      body: "Your product appears in Google search. VCs browsing the registry find you. Zero ongoing effort required.",
    },
  ];

  return (
    <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <Section>
        <div className="text-center mb-16">
          <p className="ap-label mb-3">The Process</p>
          <h2
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            How It <span style={{ color: "var(--accent)" }}>Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-8 rounded-2xl"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}
            >
              {/* Step number */}
              <div
                className="text-6xl font-black tracking-tighter leading-none mb-6 select-none"
                style={{ color: "var(--accent-border)" }}
              >
                {step.step}
              </div>
              <h3
                className="text-lg font-black uppercase tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {step.body}
              </p>

              {/* Connector line (not on last) */}
              {i < steps.length - 1 && (
                <div
                  className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block text-xs font-black"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/submit" className="ap-btn-primary">
            Start Now — It's Free →
          </Link>
        </div>
      </Section>
    </div>
  );
}


export function InvestorPanel() {
  const signals = [
    "Every listing includes a verified problem statement",
    "Founders are real — authenticated via Google/GitHub",
    "Product pages have structured data (JSON-LD schema)",
    "Search engine indexed within 48 hours of listing",
    "Problem statements prove market intent, not just hype",
    "Request direct pitch deck access from any listing",
  ];

  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="ap-label mb-4">For Investors</p>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            VC-Grade<br />
            <span style={{ color: "var(--accent)" }}>Discovery Tooling</span>
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            Arcapush gives institutional investors a curated, signal-dense feed of vibe-coded products —
            each one required to articulate the problem they solve. No noise. No marketing fluff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/investors" className="ap-btn-primary">
              VC Access Panel →
            </Link>
            <Link href="/registry" className="ap-btn-ghost">
              Browse Registry
            </Link>
          </div>
        </motion.div>

        {/* Right — signal list */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="p-8 rounded-2xl space-y-4"
          style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
        >
          <p className="ap-label mb-2">What investors get</p>
          {signals.map((signal, i) => (
            <div key={i} className="flex items-start gap-3">
              <HiOutlineCheckCircle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {signal}
              </span>
            </div>
          ))}
          <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <Link
              href="/request"
              className="text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              Request Institutional Access
              <HiOutlineArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

      </div>
    </Section>
  );
}

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Permanent indexed listing. Google finds you.",
      perks: [
        "One product listing",
        "SEO-optimized product page",
        "JSON-LD structured data",
        "Problem statement required",
        "Google + AI crawler indexed",
      ],
      cta: "List for Free",
      href: "/submit",
      featured: false,
    },
    {
      name: "Featured",
      price: "$29",
      period: "/ month",
      description: "Homepage placement + VC discovery panel.",
      perks: [
        "Everything in Free",
        "Homepage hero rotation",
        "VC discovery panel listing",
        "Priority search ranking",
        "Featured badge",
      ],
      cta: "Go Featured",
      href: "/pricing",
      featured: true,
    },
    {
      name: "Pro",
      price: "$99",
      period: "/ month",
      description: "Unlimited listings + direct investor intros.",
      perks: [
        "Everything in Featured",
        "Unlimited product listings",
        "Direct investor intro requests",
        "Strategy call (monthly)",
        "Partner network access",
      ],
      cta: "Go Pro",
      href: "/pricing",
      featured: false,
    },
  ];

  return (
    <div style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
      <Section>
        <div className="text-center mb-16">
          <p className="ap-label mb-3">Simple Pricing</p>
          <h2
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            Start Free.<br />
            <span style={{ color: "var(--accent)" }}>Push Further.</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            Plus time-based boost packages via Web3 payment (USDC / SOL) for hero placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-8 rounded-2xl flex flex-col"
              style={{
                background: tier.featured ? "var(--accent-dim)" : "var(--bg-3)",
                border: `1px solid ${tier.featured ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {tier.featured && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ background: "var(--accent)", color: "#0a0a0a" }}
                >
                  Most Popular
                </div>
              )}

              <p className="ap-label mb-2">{tier.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="text-5xl font-black tracking-tighter"
                  style={{ color: tier.featured ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {tier.price}
                </span>
                <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{tier.period}</span>
              </div>
              <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                {tier.description}
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.perks.map((perk, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--accent)" }}
                    />
                    {perk}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={tier.featured ? "ap-btn-primary text-center" : "ap-btn-ghost text-center"}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-10 text-xs" style={{ color: "var(--text-tertiary)" }}>
          Web3 boost packages (USDC on Base, SOL on Solana) available on the{" "}
          <Link href="/pricing" className="underline underline-offset-4" style={{ color: "var(--text-secondary)" }}>
            Pricing page
          </Link>
          {" "}for hero slot placement.
        </p>
      </Section>
    </div>
  );
}