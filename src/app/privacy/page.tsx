import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-24" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      <div className="max-w-3xl mx-auto">

        <p className="ap-label mb-3">Legal</p>
        <h1 className="ap-display mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--accent)" }}>
          Privacy Policy
        </h1>
        <p className="ap-label mb-16">Last Updated: March 14, 2026</p>

        <div className="space-y-12" style={{ borderTop: "1px solid var(--border)", paddingTop: "3rem" }}>

          {[
            {
              num: "01",
              title: "Introduction",
              body: "At Arcapush, we respect your privacy. This policy explains how we collect, use, and protect your data when you use our indexing and propulsion engine.",
            },
            {
              num: "02",
              title: "Information We Collect",
              items: [
                { label: "Account Info", text: "Email and profile data provided via Google or GitHub authentication." },
                { label: "Submission Data", text: "Project names, descriptions, and URLs you submit for indexing." },
                { label: "Technical Data", text: "IP addresses and browser types collected for security and analytics." },
              ],
            },
            {
              num: "03",
              title: "Data Usage",
              body: "We use your data to facilitate site indexing, provide push analytics, and communicate platform updates. We do not sell your personal data to third parties.",
            },
            {
              num: "04",
              title: "Third-Party Integrations",
              body: "Arcapush integrates with Google Search Console and other AI tools. Data shared with these services is governed by their respective privacy policies.",
            },
            {
              num: "05",
              title: "Contact",
              body: "For any data-related queries, reach us at hello@arcapush.com.",
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
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {section.body}
                    </p>
                  )}
                  {section.items && (
                    <ul className="space-y-3 mt-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginTop: "1px", flexShrink: 0 }}>→</span>
                          <span><strong style={{ color: "var(--text-primary)" }}>{item.label}:</strong> {item.text}</span>
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