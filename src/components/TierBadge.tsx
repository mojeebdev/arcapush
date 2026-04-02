import type { StartupTier } from "@/types";

interface TierBadgeProps {
  tier: StartupTier;
  size?: "sm" | "md";
}

const TIER_CONFIG: Record<string, { label: string; bg: string; color: string; border: string } | null> = {
  FREE:     null,
  LAUNCH: {
    label:  "Launch",
    bg:     "rgba(91,43,255,0.08)",
    color:  "#5B2BFF",
    border: "rgba(91,43,255,0.2)",
  },
  PRO: {
    label:  "Supported",
    bg:     "rgba(16,185,129,0.08)",
    color:  "#059669",
    border: "rgba(16,185,129,0.25)",
  },
  PRO_MAX: {
    label:  "Pro Max",
    bg:     "rgba(217,119,6,0.08)",
    color:  "#d97706",
    border: "rgba(217,119,6,0.25)",
  },
};

export function TierBadge({ tier, size = "sm" }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;

  const fontSize = size === "sm" ? "7.5px" : "9px";
  const padding  = size === "sm" ? "2px 7px" : "3px 10px";

  return (
    <span
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           "4px",
        fontFamily:    "var(--font-mono)",
        fontSize,
        fontWeight:    600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding,
        borderRadius:  "4px",
        background:    config.bg,
        color:         config.color,
        border:        `1px solid ${config.border}`,
        whiteSpace:    "nowrap",
      }}
    >
      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: config.color, display: "inline-block", flexShrink: 0 }} />
      {config.label}
    </span>
  );
}
