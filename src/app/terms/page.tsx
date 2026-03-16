import React from "react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-24 relative z-10" style={{ color: "var(--text-primary)" }}>
      <div className="max-w-3xl mx-auto">
        <p className="ap-label mb-3">Legal</p>
        <h1 className="ap-display mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--accent)" }}>
          Terms of Service
        </h1>
        <p className="ap-label mb-16">Effective Date: March 14, 2026</p>

        <div className="space-y-12" style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>
          {[
            {
              num: "01",
              title: "Acceptance of Terms",
              body: "By accessing Arcapush.com, you agree to be bound by these terms. If you disagree with any part of the terms, you may not use our service.",
            },
            {
              num: "02",
              title: "User Responsibilities",
              intro: "As a user, you agree not to:",
              items: [
                "Submit malicious URLs, malware, or phishing links.",
                "Attempt to scrape or DDoS the Arcapush engine.",
                "Use the service for any illegal or unauthorized purpose.",
              ],
            },
            {
              num: "03",
              title: "Service Limitations",
              body: "Arcapush provides indexing pushes. While we maximize visibility, we do not guarantee specific ranking positions in search engines as they are controlled by third-party algorithms.",
            },
            {
              num: "04",
              title: "Intellectual Property",
              body: "The Arcapush brand, logo (Propulsion Prism), and indexing logic are the exclusive property of Arcapush.",
            },
            {
              num: "05",
              title: "Termination",
              body: "We reserve the right to terminate accounts that violate these terms or engage in spamming activities.",
            },
          ].map((section, i) => (
            <div key={i} className="pb-12" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-start gap-6">
                <span className="ap-display select-none" style={{ fontSize: "3rem", color: "var(--border-2)", lineHeight: 1, flexShrink: 0 }}>
                  {section.num}
                </span>
                <div className="flex-1 pt-1">
                  <h2 className="ap-display mb-4" style={{ fontSize: "1.25rem", color: "var(--text-primary)" }}>
                    {section.title}
                  </h2>
                  {section.body && (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.body}</p>
                  )}
                  {section.intro && (
                    <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{section.intro}</p>
                  )}
                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginTop: "1px", flexShrink: 0 }}>→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}