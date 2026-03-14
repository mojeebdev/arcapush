"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { track } from "@vercel/analytics";
import confetti from "canvas-confetti";
import { HiOutlineArrowRight } from "react-icons/hi2";

const CATEGORIES = [
  "Select Category",
  "SaaS", "FinTech", "AI / ML", "Productivity", "Lifestyle",
  "DeAI (Decentralized AI)", "E-commerce", "HealthTech",
  "Bio-Tech & Longevity", "EdTech", "DeFi", "Infrastructure",
  "Gaming / GameFi", "Social", "DAO Tooling", "AI x Crypto",
  "RWA", "Privacy", "Developer Tools", "Other",
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


  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="ap-mono animate-pulse">Checking auth...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg)" }}>
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
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: session?.user?.id,
        }),
      });

      if (res.ok) {
        const result = await res.json();

        await fetch("/api/notify-submission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            founderEmail: formData.founderEmail,
            founderName: formData.founderName,
            startupName: formData.name,
            startupId: result.id,
          }),
        });

        track("Product Submitted");

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#e8ff47", "#f0ede8", "#888580"],
        });

        toast.success("Product received. We'll index it shortly.");
        setTimeout(() => router.push("/success"), 3000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div
      className="min-h-screen pt-32 pb-20 px-6 overflow-x-hidden"
      style={{ background: "var(--bg)" }}
    >
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
            Signed in as <span style={{ color: "var(--text-primary)" }}>{session?.user?.email}</span>.
            {" "}Listings are reviewed within 6 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* 01 — Identity */}
          <div
            className="space-y-5 p-8 rounded-2xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <h3 className="ap-label" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              01. Product Identity
            </h3>
            <input
              type="text" required placeholder="Product Name"
              className="ap-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text" required placeholder="One-line tagline"
              className="ap-input"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
            <textarea
              required
              placeholder="What specific problem does this product solve? (Required — this is your investor signal)"
              className="ap-input h-32 resize-none"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            />
          </div>

          {/* 02 — Classification */}
          <div
            className="space-y-5 p-8 rounded-2xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <h3 className="ap-label" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              02. Classification
            </h3>
            <select
              required
              className="ap-input appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat === "Select Category" ? "" : cat} className="bg-black">
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="url" required placeholder="Website URL"
              className="ap-input"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
            <input
              type="url" placeholder="Startup Twitter/X URL"
              className="ap-input"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
            />
            <input
              type="url" placeholder="Logo URL (square, recommended)"
              className="ap-input"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            />
            <input
              type="url" placeholder="Banner Image URL"
              className="ap-input"
              value={formData.bannerUrl}
              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
            />
          </div>

          {/* 03 — Founder Info */}
          <div
            className="md:col-span-2 space-y-5 p-8 rounded-2xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
          >
            <h3 className="ap-label" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              03. Founder Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text" required placeholder="Founder Name"
                className="ap-input"
                value={formData.founderName}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
              />
              <input
                type="email" required placeholder="Founder Email"
                className="ap-input"
                value={formData.founderEmail}
                onChange={(e) => setFormData({ ...formData, founderEmail: e.target.value })}
              />
              <input
                type="url" placeholder="Founder Twitter/X URL"
                className="ap-input"
                value={formData.founderTwitter}
                onChange={(e) => setFormData({ ...formData, founderTwitter: e.target.value })}
              />
              <input
                type="url" placeholder="Pitch Deck URL (optional)"
                className="ap-input"
                value={formData.pitchDeckUrl}
                onChange={(e) => setFormData({ ...formData, pitchDeckUrl: e.target.value })}
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
          </button>
        </form>
      </div>
    </div>
  );
}