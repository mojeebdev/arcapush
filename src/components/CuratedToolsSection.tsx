"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CURATED_TOOLS, CuratedTool } from "@/lib/curated-tools";

type ToolMeta = {
  image: string | null;
  description: string | null;
};

function ToolCard({ tool }: { tool: CuratedTool }) {
  const [meta, setMeta] = useState<ToolMeta>({ image: null, description: null });

  useEffect(() => {
    fetch(`/api/og-meta?url=${encodeURIComponent(tool.url)}`)
      .then((r) => r.json())
      .then((data) => setMeta(data))
      .catch(() => {});
  }, [tool.url]);

  const description = tool.description ?? meta.description ?? "No description available.";
  const origin = new URL(tool.url).origin;
  const favicon = `https://www.google.com/s2/favicons?domain=${origin}&sz=128`;
  const logo = meta.image && !meta.image.includes("google.com/s2") ? meta.image : favicon;

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 rounded-2xl transition-all group"
      style={{
        background: "var(--bg-2)",
        border: tool.builtByArcapush
          ? "1px solid var(--accent-border)"
          : "1px solid var(--border)",
        textDecoration: "none",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = tool.builtByArcapush
          ? "var(--accent-border)"
          : "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {tool.builtByArcapush && (
        <div
          className="absolute top-0 right-4 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-b-lg"
          style={{
            background: "var(--accent)",
            color: "#0a0a0a",
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
          }}
        >
          By Arcapush
        </div>
      )}

      {/* Logo */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden mb-4"
        style={{ background: "var(--bg-3)", border: "1px solid var(--border)", flexShrink: 0 }}
      >
        {logo ? (
          <img
            src={logo}
            alt={tool.name}
            className="w-full h-full object-contain rounded-xl p-1"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = favicon;
            }}
          />
        ) : (
          <span style={{ fontSize: "1.2rem" }}>{tool.name[0]}</span>
        )}
      </div>

      {/* Name + category */}
      <div className="flex items-center justify-between mb-1">
        <span className="ap-display" style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
          {tool.name}
        </span>
        <span
          className="px-2 py-1 rounded"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
          }}
        >
          {tool.category}
        </span>
      </div>

      {/* Description */}
      <p
        className="leading-relaxed line-clamp-2"
        style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}
      >
        {description}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-4 pt-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-tertiary)" }}>
          {new URL(tool.url).hostname.replace("www.", "")}
        </span>
        <span
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--accent)", letterSpacing: "0.06em" }}
        >
          Visit →
        </span>
      </div>
    </a>
  );
}

export function CuratedToolsSection() {
  const arcapushTools = CURATED_TOOLS.filter((t) => t.builtByArcapush);
  const communityTools = CURATED_TOOLS.filter((t) => !t.builtByArcapush);

  return (
    <section className="px-6 lg:px-12 py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">

        {/* Built by Arcapush */}
        {arcapushTools.length > 0 && (
          <div className="mb-16">
            <div
              className="mb-3 flex items-center gap-3"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
              Built by Arcapush
            </div>
            <h2 className="ap-display mb-10" style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              Tools we ship.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {arcapushTools.map((tool) => (
                <ToolCard key={tool.url} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Curated vibe tools */}
        {communityTools.length > 0 && (
          <div>
            <div
              className="mb-3 flex items-center gap-3"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              <span className="inline-block w-6 h-px" style={{ background: "var(--accent)" }} />
              Curated Vibe Tools
            </div>
            <h2 className="ap-display mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
              Tools we recommend.
            </h2>
            <p className="mb-10 text-lg" style={{ color: "var(--text-secondary)", maxWidth: 520 }}>
              Hand-picked by Arcapush for vibe coders and solo founders.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {communityTools.map((tool) => (
                <ToolCard key={tool.url} tool={tool} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}