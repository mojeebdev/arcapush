"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { track } from '@vercel/analytics';

const CATEGORIES = [
  "Select Category",
  "SaaS", "FinTech", "AI / ML", "Productivity", "Lifestyle", "DeAI (Decentralized AI)", "E-commerce",
  "HealthTech", "Bio-Tech & Longevity", "EdTech", "DeFi", "Infrastructure",
  "Gaming / GameFi", "Social", "DAO Tooling", "AI x Crypto", "RWA",
  "Privacy", "Developer Tools", "Other"
];

const inputClass = "w-full bg-[#16161b] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#4E24CF]/50 outline-none transition-all placeholder:text-gray-500 shadow-sm";

export default function SubmitStartup() {
  const [formData, setFormData] = useState({
    name: "", tagline: "", problemStatement: "", category: "",
    website: "", twitter: "", bannerUrl: "", logoUrl: "",
    pitchDeckUrl: "", founderName: "", founderEmail: "", founderTwitter: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || formData.category === "Select Category") {
      toast.error("Please select a Vertical for your Vibe Code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const result = await res.json();
        await fetch('/api/notify-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ founderEmail: formData.founderEmail, founderName: formData.founderName, startupName: formData.name, startupId: result.id }),
        });
        track('Vibe Code Submitted');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#4E24CF', '#D4AF37'] });
        toast.success("Vibe Code Received. Guardian notified for fast-track verification.");
        setTimeout(() => router.push('/success'), 3000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Transmission Interrupted");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 overflow-x-hidden" style={{ backgroundColor: "#0f0f12" }}>
      <Toaster toastOptions={{ style: { background: '#16161b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.10)' } }} />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4E24CF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">Encyclopedia Entry</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-2">
            Register Your <span className="text-[#4E24CF]">Vibe Code.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-4 font-bold uppercase tracking-widest">
            Guardian verification protocol: Active. Fast-track approvals enabled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Section 1: Identity */}
          <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-black/8 shadow-card">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-black/8 pb-4">01. Identity</h3>
            <div className="space-y-4">
              <input type="text" required placeholder="Startup Name" className={inputClass}
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="text" required placeholder="One-line Tagline" className={inputClass}
                value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} />
              <textarea required placeholder="What problem does this Vibe Code solve?"
                className={`${inputClass} h-32 resize-none`}
                value={formData.problemStatement} onChange={(e) => setFormData({...formData, problemStatement: e.target.value})} />
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-black/8 shadow-card">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-black/8 pb-4">02. Classification</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-black ml-2">Vertical</label>
                <select
                  className="w-full bg-white border border-black/10 p-4 rounded-xl text-zinc-700 text-sm focus:border-[#4E24CF]/50 outline-none cursor-pointer appearance-none shadow-sm"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  value={formData.category} required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat === "Select Category" ? "" : cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <input type="url" required placeholder="Website URL" className={inputClass}
                value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              <input type="url" placeholder="Startup Twitter URL" className={inputClass}
                value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} />
              <input type="url" placeholder="Logo URL (Square recommended)" className={inputClass}
                value={formData.logoUrl} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} />
              <input type="url" placeholder="Banner Image URL" className={inputClass}
                value={formData.bannerUrl} onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})} />
            </div>
          </div>

          {/* Section 3: Contact */}
          <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-[2.5rem] border border-black/8 shadow-card">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-black/8 pb-4">03. Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Founder Full Name" className={inputClass}
                value={formData.founderName} onChange={(e) => setFormData({...formData, founderName: e.target.value})} />
              <input type="email" required placeholder="Founder Email Address" className={inputClass}
                value={formData.founderEmail} onChange={(e) => setFormData({...formData, founderEmail: e.target.value})} />
              <input type="url" placeholder="Founder Twitter URL" className={inputClass}
                value={formData.founderTwitter} onChange={(e) => setFormData({...formData, founderTwitter: e.target.value})} />
              <input type="url" placeholder="Pitch Deck URL (Optional)" className={inputClass}
                value={formData.pitchDeckUrl} onChange={(e) => setFormData({...formData, pitchDeckUrl: e.target.value})} />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="md:col-span-2 w-full bg-zinc-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#4E24CF] transition-all disabled:opacity-50 shadow-sm active:scale-[0.98]"
          >
            {loading ? "Transmitting to Encyclopedia..." : "Submit Startup"}
          </button>
        </form>
      </div>
    </div>
  );
}