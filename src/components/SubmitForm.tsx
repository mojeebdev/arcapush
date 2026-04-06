"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { track } from "@vercel/analytics";
import confetti from "canvas-confetti";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { HiOutlineGlobeAlt, HiOutlineSparkles, HiOutlineRocketLaunch, HiOutlineMagnifyingGlass, HiOutlineBolt } from "react-icons/hi2";

const CATEGORIES = [
  "Select Category",
  // AI & Tech
  "AI / ML",
  "AI x Crypto",
  "DeAI (Decentralized AI)",
  "Developer Tools",
  "Infrastructure",
  "No-Code / Low-Code",
  "Open Source",
  // Business & Finance
  "SaaS",
  "FinTech",
  "DeFi",
  "RWA (Real World Assets)",
  "Payments",
  "Insurance Tech",
  // Consumer
  "Productivity",
  "Lifestyle",
  "Social",
  "Gaming / GameFi",
  "Creator Economy",
  "Media & Content",
  // Industry Verticals
  "HealthTech",
  "Bio-Tech & Longevity",
  "EdTech",
  "CleanTech / Climate",
  "LegalTech",
  "HRTech",
  "PropTech",
  "AgriTech",
  "LogisticsTech",
  // Web3 Native
  "DAO Tooling",
  "NFT & Digital Assets",
  "Privacy & Security",
  "Wallet & Identity",
  "Cross-Chain",
  "E-commerce",
  "Other",
];

export default function SubmitStartup() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    problemStatement: "",
    category: "",
    website: "",
    twitter: "",
    bannerUrl: "",
    logoUrl: "",
    pitchDeckUrl: "",
    founderName: session?.user?.name || "",
    founderEmail: session?.user?.email || "",
    founderTwitter: "",
  });

  const [loading, setLoading]   = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scraped, setScraped]   = useState(false);

  const handleScrape = useCallback(async (url: string) => {
    if (!url || url.length < 4) return;
    setScraping(true);
    setScraped(false);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Could not scrape URL.");
        return;
      }
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        name:      data.name      || prev.name,
        tagline:   data.tagline   || prev.tagline,
        bannerUrl: data.bannerUrl || prev.bannerUrl,
        logoUrl:   data.logoUrl   || prev.logoUrl,
      }));
      setScraped(true);
      toast.success("Metadata pulled from your site.");
    } catch {
      toast.error("Scrape failed. Fill in manually.");
    } finally {
      setScraping(false);
    }
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="ap-mono animate-pulse">Checking auth...</p>
      </div>
    );
  }

  // ── Unauthenticated — rich landing state for SEO + conversion ─────────────
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="mb-16">
            <p className="ap-label mb-3">Free Listing</p>
            <h1
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              List Your<br />
              <span style={{ color: "var(--accent)" }}>Product.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: "var(--text-secondary)" }}>
              Arcapush is the definitive registry for vibe-coded products — AI-native startups
              built by solo founders. Submit your product once and get a permanent, Google-indexed
              page with structured data, a problem statement, and direct visibility to VCs actively
              sourcing the next wave of AI-native startups. Free forever.
            </p>
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/submit" })}
              className="ap-btn-primary"
              style={{ padding: "1rem 2rem" }}
            >
              Sign In to List Your Product{" "}
              <HiOutlineArrowRight className="w-4 h-4 inline ml-2" />
            </button>
          </div>

          {/* What happens after you submit */}
          <div className="mb-16">
            <p className="ap-label mb-8">What happens after you submit</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <HiOutlineSparkles className="w-6 h-6" style={{ color: "var(--accent)" }} />,
                  step: "01",
                  title: "Reviewed in 6 Hours",
                  body: "Every submission is manually reviewed by the Arcapush team. We check that the problem statement is substantive and the product is genuinely vibe-coded.",
                },
                {
                  icon: <HiOutlineMagnifyingGlass className="w-6 h-6" style={{ color: "var(--accent)" }} />,
                  step: "02",
                  title: "Indexed on Google",
                  body: "Approved listings get a dedicated page with structured data, Open Graph metadata, and JSON-LD schema — everything Google needs to index and surface your product in search.",
                },
                {
                  icon: <HiOutlineRocketLaunch className="w-6 h-6" style={{ color: "var(--accent)" }} />,
                  step: "03",
                  title: "Pushed to the Feed",
                  body: "Your product enters the Signals grid — the live feed that VCs, angel investors, and fellow builders check to discover what's being built in the vibe coding ecosystem.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 rounded-[2rem] space-y-4"
                  style={{
                    background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    {item.icon}
                    <span className="ap-label">{item.step}</span>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What you need */}
          <div
            className="mb-16 p-10 rounded-[2.5rem]"
            style={{
              background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <p className="ap-label mb-6">What you need to list</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Product name and one-line tagline",
                "A clear problem statement — what specific problem does this solve?",
                "Your product URL (we auto-pull metadata from it)",
                "Category — choose from 35 verticals including AI/ML, DeFi, SaaS, and more",
                "Founder name and email for review correspondence",
                "Optional: Twitter/X URL, logo, banner image, pitch deck",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", flexShrink: 0, marginTop: "2px" }}>→</span>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16 space-y-4">
            <p className="ap-label mb-6">Frequently Asked Questions</p>
            {[
              {
                q: "Is listing on Arcapush really free?",
                a: "Yes. The base listing is free and permanent. You submit once, we review it, and your product stays indexed on Arcapush indefinitely. Paid plans (Launch, Pro, Pro Max) are available if you want to pin your listing to the top of the Signals grid.",
              },
              {
                q: "What is a problem statement and why is it required?",
                a: "A problem statement is a clear, specific description of the real-world problem your product solves. It's required because it's the signal VCs actually use when evaluating early-stage products — not the marketing copy. This is what differentiates Arcapush from generic launch platforms.",
              },
              {
                q: "What does vibe-coded mean?",
                a: "Vibe coding is a software development approach where builders use AI tools like Cursor, Lovable, Replit, and Bolt to create apps through natural language prompts — coined by Andrej Karpathy in February 2025. If you used AI tools to build your product, it qualifies.",
              },
              {
                q: "How long does review take?",
                a: "Listings are reviewed within 6 hours. You'll receive an email confirmation when your product is approved and live on the registry.",
              },
              {
                q: "Can I update my listing after submission?",
                a: "Yes. Sign in with the same Google or GitHub account and you'll be able to edit your listing details at any time.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl"
                style={{
                  background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3 className="text-sm font-black uppercase tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
                  {item.q}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="ap-label mb-4">Ready?</p>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Sign in with Google or GitHub. Takes 30 seconds.
            </p>
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/submit" })}
              className="ap-btn-primary"
              style={{ padding: "1rem 2.5rem" }}
            >
              Sign In and List for Free{" "}
              <HiOutlineBolt className="w-4 h-4 inline ml-2" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Authenticated — full submission form ───────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || formData.category === "Select Category") {
      toast.error("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/startups", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...formData, userId: session?.user?.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed.");
      }

      const result = await res.json();
      console.log("[SubmitForm] Startup submission result:", result);

      if (!result.id) {
        console.warn("[SubmitForm] WARNING: result.id is missing. Notify email may fail.");
      }

      const notifyPayload = {
        founderEmail: formData.founderEmail,
        founderName:  formData.founderName,
        startupName:  formData.name,
        startupId:    result.id ?? null,
      };

      console.log("[SubmitForm] Sending notify-submission with payload:", notifyPayload);

      const notifyRes  = await fetch("/api/notify-submission", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(notifyPayload),
      });
      const notifyData = await notifyRes.json();
      console.log("[SubmitForm] Notify response — status:", notifyRes.status, "body:", notifyData);

      if (!notifyRes.ok) {
        console.error("[SubmitForm] Notify email failed:", notifyData);
      }

      track("Product Submitted");

      confetti({
        particleCount: 150,
        spread:        70,
        origin:        { y: 0.6 },
        colors:        ["#e8ff47", "#f0ede8", "#888580"],
      });

      toast.success("Product received. We'll index it shortly.");
      setTimeout(() => router.push("/success"), 3000);

    } catch (error: any) {
      console.error("[SubmitForm] Submit error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 overflow-x-hidden relative z-10">
      <Toaster
        toastOptions={{
          style: {
            background:  "var(--bg-2)",
            color:       "var(--text-primary)",
            border:      "1px solid var(--border)",
            fontFamily:  "var(--font-mono)",
            fontSize:    "0.72rem",
          },
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="ap-label mb-3">Free Listing</p>
          <h1
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            List Your<br />
            <span style={{ color: "var(--accent)" }}>Product.</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Signed in as{" "}
            <span style={{ color: "var(--text-primary)" }}>{session?.user?.email}</span>.
            {" "}Listings are reviewed within 6 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 00 — URL Scraper */}
          <div
            className="md:col-span-2 p-8 rounded-2xl"
            style={{
              background: "color-mix(in srgb, var(--accent) 6%, var(--bg-2))",
              border:     "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))",
            }}
          >
            <h3
              className="ap-label flex items-center gap-2"
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1.25rem" }}
            >
              <HiOutlineSparkles className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
              00. Autofill from your website
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
              Paste your product URL — we'll pull your title, description, banner, and logo automatically.
            </p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <HiOutlineGlobeAlt
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  type="url"
                  placeholder="https://yourproduct.com"
                  className="ap-input pl-9 w-full"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setFormData((prev) => ({ ...prev, website: e.target.value }));
                      handleScrape(e.target.value);
                    }
                  }}
                />
              </div>
              <button
                type="button"
                disabled={scraping || !formData.website}
                onClick={() => handleScrape(formData.website)}
                className="ap-btn-primary disabled:opacity-40 whitespace-nowrap"
                style={{ padding: "0 1.25rem" }}
              >
                {scraping ? (
                  <span className="animate-pulse">Pulling...</span>
                ) : scraped ? (
                  "Re-fetch"
                ) : (
                  <>Autofill <HiOutlineSparkles className="w-3.5 h-3.5 inline ml-1.5" /></>
                )}
              </button>
            </div>

            {scraped && (formData.bannerUrl || formData.logoUrl) && (
              <div
                className="mt-5 flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              >
                {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="logo preview"
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    style={{ border: "1px solid var(--border)" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {formData.name || "—"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                    {formData.tagline || "—"}
                  </p>
                </div>
                {formData.bannerUrl && (
                  <img src={formData.bannerUrl} alt="banner preview"
                    className="w-20 h-12 rounded-lg object-cover flex-shrink-0"
                    style={{ border: "1px solid var(--border)" }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            )}
          </div>

          {/* 01 — Identity */}
          <div
            className="space-y-5 p-8 rounded-2xl"
            style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
          >
            <h3 className="ap-label" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              01. Product Identity
            </h3>
            <div className="relative">
              <input type="text" required placeholder="Product Name" className="ap-input w-full"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              {scraped && formData.name && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--accent)" }}>auto</span>
              )}
            </div>
            <div className="relative">
              <input type="text" required placeholder="One-line tagline" className="ap-input w-full"
                value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
              {scraped && formData.tagline && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--accent)" }}>auto</span>
              )}
            </div>
            <textarea required
              placeholder="What specific problem does this product solve? (Required — this is your investor signal)"
              className="ap-input h-32 resize-none"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            />
          </div>

          {/* 02 — Classification */}
          <div
            className="space-y-5 p-8 rounded-2xl"
            style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
          >
            <h3 className="ap-label" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              02. Classification
            </h3>
            <select required className="ap-input appearance-none cursor-pointer"
              value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat === "Select Category" ? "" : cat} className="bg-black">{cat}</option>
              ))}
            </select>
            <input type="url" placeholder="Startup Twitter/X URL" className="ap-input"
              value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
            <div className="relative">
              <input type="url" placeholder="Logo URL (auto-filled from site)" className="ap-input w-full"
                value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} />
              {scraped && formData.logoUrl && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--accent)" }}>auto</span>
              )}
            </div>
            <div className="relative">
              <input type="url" placeholder="Banner Image URL (auto-filled from OG)" className="ap-input w-full"
                value={formData.bannerUrl} onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })} />
              {scraped && formData.bannerUrl && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--accent)" }}>auto</span>
              )}
            </div>
          </div>

          {/* 03 — Founder Info */}
          <div
            className="md:col-span-2 space-y-5 p-8 rounded-2xl"
            style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
          >
            <h3 className="ap-label" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              03. Founder Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" required placeholder="Founder Name" className="ap-input"
                value={formData.founderName} onChange={(e) => setFormData({ ...formData, founderName: e.target.value })} />
              <input type="email" required placeholder="Founder Email" className="ap-input"
                value={formData.founderEmail} onChange={(e) => setFormData({ ...formData, founderEmail: e.target.value })} />
              <input type="url" placeholder="Founder Twitter/X URL" className="ap-input"
                value={formData.founderTwitter} onChange={(e) => setFormData({ ...formData, founderTwitter: e.target.value })} />
              <input type="url" placeholder="Pitch Deck URL (optional)" className="ap-input"
                value={formData.pitchDeckUrl} onChange={(e) => setFormData({ ...formData, pitchDeckUrl: e.target.value })} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="md:col-span-2 ap-btn-primary w-full disabled:opacity-40 text-center"
            style={{ padding: "1.25rem 2rem" }}
          >
            {loading ? "Submitting..." : "List Product on Arcapush"}
            {!loading && <HiOutlineArrowRight className="w-4 h-4 inline ml-2" />}
          </button>

        </form>
      </div>
    </div>
  );
}