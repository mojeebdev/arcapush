import React from 'react';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 md:p-24 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-[#C3FF00]">Terms of Service</h1>
        <p className="text-gray-400 mb-8 italic">Effective Date: March 14, 2026</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing Arcapush.com, you agree to be bound by these terms. If you disagree with any part of the terms, you may not use our service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
            <p className="text-gray-300 mb-2">As a user, you agree not to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Submit malicious URLs, malware, or phishing links.</li>
              <li>Attempt to scrape or DDoS the Arcapush engine.</li>
              <li>Use the service for any illegal or unauthorized purpose.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Service Limitations</h2>
            <p className="text-gray-300 leading-relaxed">
              Arcapush provides indexing "pushes." While we maximize visibility, we do not guarantee specific ranking positions in search engines as they are controlled by third-party algorithms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              The Arcapush brand, logo (Propulsion Prism), and indexing logic are the exclusive property of Arcapush.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to terminate accounts that violate these terms or engage in spamming activities.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}