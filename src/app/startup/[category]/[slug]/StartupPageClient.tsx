"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineGlobeAlt, HiOutlineShare } from "react-icons/hi2";
import { RiTwitterXLine } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";

interface Startup {
  id:               string;
  name:             string;
  tagline:          string;
  problemStatement: string;
  category:         string;
  website:          string | null;
  twitter:          string | null;
  bannerUrl:        string | null;
  logoUrl:          string | null;
  ogImage:          string | null;
  faviconUrl:       string | null;
  founderName:      string;
  founderTwitter:   string | null;
  viewCount:        number;
  createdAt:        Date;
  scrapedAt:        Date | null;
  slug:             string | null;
  tier:             string;
}

interface Props {
  startup: Startup;
}

export default function StartupPageClient({ startup }: Props) {
  const [copied, setCopied] = useState(false);

  const categorySlug = startup.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success("Link copied — share it everywhere.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link.");
    }
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out ${startup.name} on @arcapush — "${startup.tagline}"\n\n`
  )}&url=${encodeURIComponent(pageUrl)}`;

  const displayLogo = startup.logoUrl || startup.faviconUrl;
  const displayBanner = startup.bannerUrl || startup.ogImage;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative z-10">
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

      <div className="max-w-3xl mx-auto">

        {/* back nav */}
        <Link
          href={`/startup/${categorySlug}`}
          className="inline-flex items-center gap-2 text-xs mb-10 transition-opacity hover:opacity-60"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          {startup.category}
        </Link>

        {/* banner */}
        {displayBanner && (
          <div
            className="w-full h-52 rounded-2xl overflow-hidden mb-8"
            style={{ border: "1px solid var(--border)" }}
          >
            <img
              src={displayBanner}
              alt={`${startup.name} banner`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* header row */}
        <div className="flex items-start gap-5 mb-8">
          {displayLogo && (
            <img
              src={displayLogo}
              alt={`${startup.name} logo`}
              className="w-16 h-16 rounded-xl flex-shrink-0 object-cover"
              style={{ border: "1px solid var(--border)" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1
                className="text-3xl font-black uppercase tracking-tighter leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {startup.name}
              </h1>
              {startup.scrapedAt && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    background: "color-mix(in srgb, #4ade80 10%, transparent)",
                    color: "#4ade80",
                    border: "1px solid color-mix(in srgb, #4ade80 25%, transparent)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#4ade80",
                      display: "inline-block",
                    }}
                  />
                  Indexed
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {startup.tagline}
            </p>
          </div>
        </div>

        {/* action bar */}
        <div className="flex flex-wrap gap-3 mb-10">
          {startup.website && (
            <a
              href={startup.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ap-btn-primary flex items-center gap-2"
              style={{ padding: "0.6rem 1.25rem" }}
            >
              <HiOutlineGlobeAlt className="w-4 h-4" />
              Visit site
            </a>
          )}
          {startup.twitter && (
            <a
              href={startup.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="ap-btn-secondary flex items-center gap-2"
              style={{ padding: "0.6rem 1.25rem" }}
            >
              <RiTwitterXLine className="w-4 h-4" />
              Follow on X
            </a>
          )}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ap-btn-secondary flex items-center gap-2"
            style={{ padding: "0.6rem 1.25rem" }}
          >
            <RiTwitterXLine className="w-4 h-4" />
            Share on X
          </a>
          <button
            onClick={handleShare}
            className="ap-btn-secondary flex items-center gap-2"
            style={{ padding: "0.6rem 1.25rem" }}
          >
            <HiOutlineShare className="w-4 h-4" />
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        {/* content sections */}
        <div className="space-y-6">
          {/* problem statement */}
          <div
            className="p-7 rounded-2xl"
            style={{
              background: "color-mix(in srgb, var(--bg-2) 80%, transparent)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="ap-label mb-4"
              style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.875rem" }}
            >
              Problem statement
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {startup.problemStatement}
            </p>
          </div>

          {/* meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Category", value: startup.category },
              { label: "Founder", value: startup.founderName },
              { label: "Views", value: startup.viewCount.toLocaleString() },
              {
                label: "Listed",
                value: new Date(startup.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                }),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-xl"
                style={{
                  background: "color-mix(in srgb, var(--bg-2) 60%, transparent)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
                >
                  {label}
                </p>
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* founder Twitter */}
          {startup.founderTwitter && (
            <div
              className="flex items-center justify-between p-5 rounded-xl"
              style={{
                background: "color-mix(in srgb, var(--bg-2) 60%, transparent)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  className="text-xs mb-0.5"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
                >
                  Founder
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {startup.founderName}
                </p>
              </div>
              <a
                href={startup.founderTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="ap-btn-secondary flex items-center gap-2 text-xs"
                style={{ padding: "0.5rem 1rem" }}
              >
                <RiTwitterXLine className="w-3.5 h-3.5" />
                Follow founder
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}