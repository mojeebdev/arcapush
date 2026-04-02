"use client";

import { useState } from "react";

type Tab = "suggest" | "shipped";

interface Suggestion {
  id:        string;
  text:      string;
  votes:     number;
  status:    "open" | "shipped";
  shippedIn?: string;
}

// These would come from DB in production — stubbed for now
const MOCK_SUGGESTIONS: Suggestion[] = [
  { id: "1", text: "Show founder Twitter handle on startup card",           votes: 14, status: "open"    },
  { id: "2", text: "Dark mode support",                                     votes: 31, status: "shipped", shippedIn: "v2.0" },
  { id: "3", text: "Filter registry by category",                           votes: 22, status: "shipped", shippedIn: "v1.4" },
  { id: "4", text: "Weekly digest email for new listings",                  votes: 9,  status: "open"    },
  { id: "5", text: "Add review count visible on cards",                     votes: 17, status: "shipped", shippedIn: "v2.0" },
  { id: "6", text: "Mobile bottom navigation bar",                          votes: 28, status: "shipped", shippedIn: "v2.0" },
  { id: "7", text: "Most viewed of the week / month leaderboard",           votes: 11, status: "shipped", shippedIn: "v2.0" },
  { id: "8", text: "Suggestion box with shipped tab",                       votes: 6,  status: "shipped", shippedIn: "v2.0" },
];

export function SuggestionBox() {
  const [tab, setTab]         = useState<Tab>("suggest");
  const [voted, setVoted]     = useState<Set<string>>(new Set());
  const [newText, setNewText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const open    = MOCK_SUGGESTIONS.filter((s) => s.status === "open").sort((a, b) => b.votes - a.votes);
  const shipped = MOCK_SUGGESTIONS.filter((s) => s.status === "shipped").sort((a, b) => b.votes - a.votes);

  const handleVote = (id: string) => {
    setVoted((prev) => new Set([...prev, id]));
  };

  const handleSubmit = () => {
    if (!newText.trim()) return;
    setSubmitted(true);
    setNewText("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily:    "var(--font-mono)",
    fontSize:      "0.6rem",
    fontWeight:    600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding:       "6px 16px",
    borderRadius:  "6px",
    cursor:        "pointer",
    border:        "1px solid transparent",
    background:    active ? "var(--accent)" : "transparent",
    color:         active ? "#fff" : "var(--text-tertiary)",
    transition:    "all 0.15s",
  });

  return (
    <div
      style={{
        background:   "var(--bg-2)",
        border:       "1px solid var(--border)",
        borderRadius: "20px",
        padding:      "24px",
        maxWidth:     "600px",
        margin:       "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            Community Feedback
          </h3>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>
            Suggest · Vote · We ship
          </p>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-3)", padding: "3px", borderRadius: "8px" }}>
          <button style={tabStyle(tab === "suggest")} onClick={() => setTab("suggest")}>Suggest</button>
          <button style={tabStyle(tab === "shipped")} onClick={() => setTab("shipped")}>
            Shipped ✓
          </button>
        </div>
      </div>

      {tab === "suggest" && (
        <>
          {/* Input */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Suggest a feature or improvement..."
              style={{
                flex:         1,
                background:   "var(--bg)",
                border:       "1px solid var(--border-2)",
                borderRadius: "8px",
                padding:      "10px 14px",
                fontFamily:   "var(--font-mono)",
                fontSize:     "0.65rem",
                color:        "var(--text-primary)",
                outline:      "none",
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                background:   "var(--accent)",
                color:        "#fff",
                border:       "none",
                borderRadius: "8px",
                padding:      "10px 16px",
                fontFamily:   "var(--font-mono)",
                fontSize:     "0.6rem",
                fontWeight:   600,
                letterSpacing:"0.08em",
                textTransform:"uppercase",
                cursor:       "pointer",
                whiteSpace:   "nowrap",
              }}
            >
              {submitted ? "Sent ✓" : "Submit"}
            </button>
          </div>

          {/* Open suggestions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {open.map((s) => (
              <div
                key={s.id}
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "12px",
                  background:   "var(--bg)",
                  border:       "1px solid var(--border)",
                  borderRadius: "10px",
                  padding:      "10px 14px",
                }}
              >
                <button
                  onClick={() => !voted.has(s.id) && handleVote(s.id)}
                  disabled={voted.has(s.id)}
                  style={{
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    gap:            "1px",
                    background:     voted.has(s.id) ? "var(--accent-dim)" : "var(--bg-2)",
                    border:         `1px solid ${voted.has(s.id) ? "var(--accent-border)" : "var(--border)"}`,
                    borderRadius:   "6px",
                    padding:        "4px 8px",
                    cursor:         voted.has(s.id) ? "default" : "pointer",
                    color:          voted.has(s.id) ? "var(--accent)" : "var(--text-tertiary)",
                    minWidth:       "36px",
                    flexShrink:     0,
                  }}
                >
                  <span style={{ fontSize: "8px" }}>▲</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700 }}>
                    {voted.has(s.id) ? s.votes + 1 : s.votes}
                  </span>
                </button>
                <span style={{ fontFamily: "var(--font-syne)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "shipped" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {shipped.map((s) => (
            <div
              key={s.id}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "12px",
                background:   "rgba(16,185,129,0.04)",
                border:       "1px solid rgba(16,185,129,0.15)",
                borderRadius: "10px",
                padding:      "10px 14px",
              }}
            >
              <span style={{ fontSize: "14px", flexShrink: 0 }}>✓</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-syne)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.4 }}>
                  {s.text}
                </p>
                {s.shippedIn && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Shipped in {s.shippedIn}
                  </span>
                )}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text-tertiary)", flexShrink: 0 }}>
                {s.votes} votes
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
