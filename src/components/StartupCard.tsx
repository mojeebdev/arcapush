"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShareButton } from "./ShareButton";
import { HiOutlineArrowUpRight, HiOutlineEye } from "react-icons/hi2";

interface StartupCardProps {
  startup: {
    id: string;
    slug?: string | null;
    name: string;
    tagline: string;
    problemStatement: string;
    bannerUrl: string;
    logoUrl: string | null;
    category: string;
    website: string | null;
    twitter: string | null;
    viewCount: number;
  };
  variant: "ticker" | "grid";
}

export function StartupCard({ startup, variant }: StartupCardProps) {
  const startupUrl = `/startup/${startup.slug ?? startup.id}`;

  if (variant === "ticker") {
    return (
      <div
        className="rounded-[2rem] overflow-hidden group shadow-sm"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col lg:flex-row">

          {/* Visual */}
          <div className="relative lg:w-1/2 h-[220px] lg:h-[380px] overflow-hidden">
            <Image
              src={startup.bannerUrl}
              alt={`${startup.name} banner`}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Light-theme gradient — fades into cream bg */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background: "linear-gradient(to right, var(--bg-2) 0%, rgba(239,237,230,0.5) 40%, transparent 100%)",
              }}
            />
            <div
              className="absolute inset-0 lg:hidden"
              style={{
                background: "linear-gradient(to top, var(--bg-2) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Data */}
          <div className="flex-1 p-8 lg:p-14 flex flex-col justify-center"
            style={{ background: "var(--bg-2)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                style={{
                  background: "var(--accent-dim)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent)",
                }}
              >
                {startup.category}
              </span>
              <span className="flex items-center gap-1 ap-mono">
                <HiOutlineEye className="w-3 h-3" />
                {startup.viewCount}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              {startup.logoUrl && (
                <div
                  className="w-12 h-12 rounded-2xl overflow-hidden p-1.5"
                  style={{ border: "1px solid var(--border)", background: "var(--bg)" }}
                >
                  <Image
                    src={startup.logoUrl}
                    alt={`${startup.name} logo`}
                    width={48} height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              <h3
                className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {startup.name}
              </h3>
            </div>

            <p className="font-black text-xs mb-3 uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              {startup.tagline}
            </p>
            <p className="text-sm font-medium line-clamp-2 mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {startup.problemStatement}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={startupUrl}
                className="ap-btn-primary flex items-center gap-2"
                style={{ padding: "0.75rem 1.75rem" }}
              >
                View Product
                <HiOutlineArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <ShareButton startup={startup} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid variant ──────────────────────────────────────────────────────────
  return (
    <Link href={startupUrl}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative rounded-[2.5rem] overflow-hidden transition-all h-full flex flex-col"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
      >
        {/* Banner */}
        <div className="relative h-[180px] overflow-hidden">
          <Image
            src={startup.bannerUrl}
            alt={`${startup.name} banner`}
            fill
            className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
          />
          {/* Light-theme gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, var(--bg-2) 0%, rgba(239,237,230,0.3) 50%, transparent 100%)",
            }}
          />
          <div className="absolute top-5 right-5">
            <span
              className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest"
              style={{
                background: "rgba(247,246,242,0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border)",
                color: "var(--accent)",
              }}
            >
              {startup.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-grow">
          <div className="flex items-center gap-3 mb-4">
            {startup.logoUrl && (
              <div
                className="w-10 h-10 rounded-xl overflow-hidden p-1.5 transition-transform group-hover:scale-110"
                style={{ border: "1px solid var(--border)", background: "var(--bg)" }}
              >
                <Image
                  src={startup.logoUrl}
                  alt={`${startup.name} logo`}
                  width={32} height={32}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <h4
              className="font-black text-sm uppercase tracking-tighter truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {startup.name}
            </h4>
          </div>
          <p
            className="text-xs uppercase tracking-tight line-clamp-2 leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            {startup.problemStatement}
          </p>
        </div>

        {/* Accent underline on hover */}
        <div
          className="h-px w-0 group-hover:w-full transition-all duration-500"
          style={{ background: "var(--accent)" }}
        />
      </motion.div>
    </Link>
  );
}