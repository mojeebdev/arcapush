"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { track } from "@vercel/analytics";
import confetti from "canvas-confetti";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { HiOutlineGlobeAlt, HiOutlineSparkles } from "react-icons/hi2";

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

  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scraped, setScraped] = useState(false);

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
        name: data.name || prev.name,
        tagline: data.tagline || prev.tagline,
        bannerUrl: data.bannerUrl || prev.bannerUrl,
        logoUrl: data.logoUrl || prev.logoUrl,
      }));

      setScraped(true);
      toast.success("Metadata pulled from your site.");
    } catch {
      toast.error("Scrape failed. Fill in manually.");
    } finally {
      setScraping(false);
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="ap-mono animate-pulse">Checking auth...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="ap-label mb-4">Sign In Required</p>
          <h1
            className="text-4xl font-black uppercase tracking-tighter leading-none mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            List Your<br />
            <span style={{ color: "var(--accent)" }}>Product</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            Sign in with Google or GitHub to list your product on Arcapush.
            Takes 30 seconds. Free forever.
          </p>
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/submit" })}
            className="ap-btn-primary"
          >
            Sign In to Continue <HiOutlineArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || formData.category === "Select Category") {
      toast.error("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Submit the startup
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed.");
      }

      const result = await res.json();

      // DEBUG: Log the full result to verify result.id exists
      console.log("[SubmitForm] Startup submission result:", result);

      if (!result.id) {
        console.warn("[SubmitForm] WARNING: result.id is missing. Notify email may fail.");
      }

      // Step 2: Send notification emails
      const notifyPayload = {
        founderEmail: formData.founderEmail,
        founderName: formData.founderName,
        startupName: formData.name,
        startupId: result.id ?? null,
      };

      console.log("[SubmitForm] Sending notify-submission with payload:", notifyPayload);

      const notifyRes = await fetch("/api/notify-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifyPayload),
      });

      
      const notifyData = await notifyRes.json();
      console.log("[SubmitForm] Notify response — status:", notifyRes.status, "body:", notifyData);

      if (!notifyRes.ok) {
        
        console.error("[SubmitForm] Notify email failed:", notifyData);
      }

     
      track("Product Submitted");

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e8ff47", "#f0ede8", "#888580"],
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
            background: "var(--bg-2)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
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
              border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))",
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
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
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
                  <>
                    Autofill <HiOutlineSparkles className="w-3.5 h-3.5 inline ml-1.5" />
                  </>
                )}
              </button>
            </div>

            {/* Live preview strip — shows after scrape */}
            {scraped && (formData.bannerUrl || formData.logoUrl) && (
              <div
                className="mt-5 flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              >
                {formData.logoUrl && (
                  <img
                    src={formData.logoUrl}
                    alt="logo preview"
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
                  <img
                    src={formData.bannerUrl}
                    alt="banner preview"
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
            <h3
              className="ap-label"
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}
            >
              01. Product Identity
            </h3>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Product Name"
                className="ap-input w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {scraped && formData.name && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  auto
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="One-line tagline"
                className="ap-input w-full"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
              {scraped && formData.tagline && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  auto
                </span>
              )}
            </div>
            <textarea
              required
              placeholder="What specific problem does this product solve? (Required — this is your investor signal)"
              className="ap-input h-32 resize-none"
              value={formData.problemStatement}
              onChange={(e) =>
                setFormData({ ...formData, problemStatement: e.target.value })
              }
            />
          </div>

          {/* 02 — Classification */}
          <div
            className="space-y-5 p-8 rounded-2xl"
            style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
          >
            <h3
              className="ap-label"
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}
            >
              02. Classification
            </h3>
            <select
              required
              className="ap-input appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option
                  key={cat}
                  value={cat === "Select Category" ? "" : cat}
                  className="bg-black"
                >
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="url"
              placeholder="Startup Twitter/X URL"
              className="ap-input"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            />
            <div className="relative">
              <input
                type="url"
                placeholder="Logo URL (auto-filled from site)"
                className="ap-input w-full"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              />
              {scraped && formData.logoUrl && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  auto
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="url"
                placeholder="Banner Image URL (auto-filled from OG)"
                className="ap-input w-full"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              />
              {scraped && formData.bannerUrl && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--accent)" }}
                >
                  auto
                </span>
              )}
            </div>
          </div>

          {/* 03 — Founder Info */}
          <div
            className="md:col-span-2 space-y-5 p-8 rounded-2xl"
            style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
          >
            <h3
              className="ap-label"
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}
            >
              03. Founder Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                required
                placeholder="Founder Name"
                className="ap-input"
                value={formData.founderName}
                onChange={(e) =>
                  setFormData({ ...formData, founderName: e.target.value })
                }
              />
              <input
                type="email"
                required
                placeholder="Founder Email"
                className="ap-input"
                value={formData.founderEmail}
                onChange={(e) =>
                  setFormData({ ...formData, founderEmail: e.target.value })
                }
              />
              <input
                type="url"
                placeholder="Founder Twitter/X URL"
                className="ap-input"
                value={formData.founderTwitter}
                onChange={(e) =>
                  setFormData({ ...formData, founderTwitter: e.target.value })
                }
              />
              <input
                type="url"
                placeholder="Pitch Deck URL (optional)"
                className="ap-input"
                value={formData.pitchDeckUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pitchDeckUrl: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
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