import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 md:p-24 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-[#C3FF00]">Privacy Policy</h1>
        <p className="text-gray-400 mb-8 italic">Last Updated: March 14, 2026</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              At Arcapush, we respect your privacy. This policy explains how we collect, use, and protect your data when you use our indexing and propulsion engine.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><span className="text-white font-medium">Account Info:</span> Email and profile data provided via Google or GitHub authentication.</li>
              <li><span className="text-white font-medium">Submission Data:</span> Project names, descriptions, and URLs you submit for indexing.</li>
              <li><span className="text-white font-medium">Technical Data:</span> IP addresses and browser types collected for security and analytics.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Data Usage</h2>
            <p className="text-gray-300 leading-relaxed">
              We use your data to facilitate site indexing, provide "push" analytics, and communicate platform updates. We do not sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Third-Party Integrations</h2>
            <p className="text-gray-300 leading-relaxed">
              Arcapush integrates with Google Search Console and other AI tools. Data shared with these services is governed by their respective privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
            <p className="text-gray-300 italic">For any data-related queries, reach us at hello@arcapush.com.</p>
          </div>
        </section>
      </div>
    </main>
  );
}