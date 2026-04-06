"use client";

import { useState, useEffect } from "react";

type Tab = "suggest" | "shipped";

interface Suggestion {
  id:        string;
  text:      string;
  votes:     number;
  status:    string;
  shippedIn?: string | null;
  createdAt: string;
}

export function SuggestionBox() {
  const [tab, setTab]             = useState<Tab>("suggest");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [voted, setVoted]         = useState<Set<string>>(new Set());
  const [newText, setNewText]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  // ── Fetch suggestions on mount ─────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/suggestions")
      .then((r) => r.json())
      .then((d) => {
        setSuggestions(d.suggestions || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load suggestions.");
        setLoading(false);
      });
  }, []);

  const open    = suggestions.filter((s) => s.status === "open").sort((a, b) => b.votes - a.votes);
  const shipped = suggestions.filter((s) => s.status === "shipped").sort((a, b) => b.votes - a.votes);

  // ── Submit new suggestion ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    const text = newText.trim();
    if (!text || text.length < 5) return;

    setSubmitting(true);
    setError("");

    try {
      const res  = await fetch("/api/suggestions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Submission failed.");
        return;
      }

      setSuggestions((prev) => [data.suggestion, ...prev]);
      setNewText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Vote on a suggestion ───────────────────────────────────────────────────
  const handleVote = async (id: string) => {
    if (voted.has(id)) return;

    // Optimistic update
    setVoted((prev) => new Set([...prev, id]));
    setSuggestions((prev) =>
      prev.map((s) => s.id === id ? { ...s, votes: s.votes + 1 } : s)
    );

    try {
      const res = await fetch(`/api/suggestions/${id}/vote`, { method: "PATCH" });
      if (!res.ok) {
        // Revert on failure
        setVoted((prev) => { const next = new Set(prev); next.delete(id); return next; });
        setSuggestions((prev) =>
          prev.map((s) => s.id === id ? { ...s, votes: s.votes - 1 } : s)
        );
      }
    } catch {
      // Revert on network error
      setVoted((prev) => { const next = new Set(prev); next.delete(id); return next; });
      setSuggestions((prev) =>
        prev.map((s) => s.id === id ? { ...s, votes: s.votes - 1 } : s)
      );
    }
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

      {/* Error */}
      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#f87171", marginBottom: "12px", letterSpacing: "0.05em" }}>
          {error}
        </p>
      )}

      {tab === "suggest" && (
        <>
          {/* Input */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
              placeholder="Suggest a feature or improvement..."
              maxLength={300}
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
              disabled={submitting || !newText.trim() || newText.trim().length < 5}
              style={{
                background:    submitted ? "rgba(16,185,129,0.8)" : "var(--accent)",
                color:         "#fff",
                border:        "none",
                borderRadius:  "8px",
                padding:       "10px 16px",
                fontFamily:    "var(--font-mono)",
                fontSize:      "0.6rem",
                fontWeight:    600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor:        submitting || !newText.trim() ? "not-allowed" : "pointer",
                whiteSpace:    "nowrap",
                opacity:       submitting || !newText.trim() ? 0.5 : 1,
                transition:    "all 0.15s",
              }}
            >
              {submitting ? "Saving..." : submitted ? "Sent ✓" : "Submit"}
            </button>
          </div>

          {/* Open suggestions */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: "48px", borderRadius: "10px", background: "var(--bg)", border: "1px solid var(--border)", opacity: 0.4 }} />
              ))}
            </div>
          ) : open.length === 0 ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", textAlign: "center", padding: "24px 0", letterSpacing: "0.08em" }}>
              No suggestions yet. Be the first.
            </p>
          ) : (
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
                    onClick={() => handleVote(s.id)}
                    disabled={voted.has(s.id)}
                    style={{
                      display:       "flex",
                      flexDirection: "column",
                      alignItems:    "center",
                      gap:           "1px",
                      background:    voted.has(s.id) ? "var(--accent-dim)" : "var(--bg-2)",
                      border:        `1px solid ${voted.has(s.id) ? "var(--accent-border)" : "var(--border)"}`,
                      borderRadius:  "6px",
                      padding:       "4px 8px",
                      cursor:        voted.has(s.id) ? "default" : "pointer",
                      color:         voted.has(s.id) ? "var(--accent)" : "var(--text-tertiary)",
                      minWidth:      "36px",
                      flexShrink:    0,
                      transition:    "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "8px" }}>▲</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700 }}>
                      {s.votes}
                    </span>
                  </button>
                  <span style={{ fontFamily: "var(--font-syne)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "shipped" && (
        <>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ height: "56px", borderRadius: "10px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.15)", opacity: 0.4 }} />
              ))}
            </div>
          ) : shipped.length === 0 ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-tertiary)", textAlign: "center", padding: "24px 0", letterSpacing: "0.08em" }}>
              Nothing shipped yet. Soon.
            </p>
          ) : (
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
        </>
      )}
    </div>
  );
}
