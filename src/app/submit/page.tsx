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

export default function SubmitStartup() {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    problemStatement: "",
    category: "",
    website: "",
    twitter: "",
    bannerUrl: "",
    logoUrl: "", 
    pitchDeckUrl: "",
    founderName: "",
    founderEmail: "",
    founderTwitter: ""
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
          body: JSON.stringify({
            founderEmail: formData.founderEmail,
            founderName: formData.founderName,
            startupName: formData.name,
            startupId: result.id 
          }),
        });

        track('Vibe Code Submitted'); 
        
        confetti({ 
          particleCount: 150, 
          spread: 70, 
          origin: { y: 0.6 }, 
          colors: ['#4E24CF', '#D4AF37'] 
        });

        toast.success("Vibe Code Received. Guardian notified for fast-track verification.");
        console.log("🚀 Milestone: New Signal Registered in Encyclopedia!");
        
        setTimeout(() => router.push('/success'), 3000); 
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Transmission Interrupted");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Submission Failure:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 overflow-x-hidden">
      <Toaster toastOptions={{ style: { background: '#09090b', color: '#fff', border: '1px solid #27272a' } }} />
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4E24CF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">Encyclopedia Entry</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-2">
            Register Your <span className="text-[#4E24CF]">Vibe Code.</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-4 font-bold uppercase tracking-widest">
            Guardian verification protocol: Active. Fast-track approvals enabled.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Identity */}
          <div className="space-y-6 bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">01. Identity</h3>
            <div className="space-y-4">
              <input 
                type="text" required placeholder="Startup Name" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="text" required placeholder="One-line Tagline" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
              />
              <textarea 
                required placeholder="What problem does this Vibe Code solve?" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm h-32 focus:border-[#D4AF37] outline-none transition-all resize-none placeholder:text-zinc-700"
                value={formData.problemStatement}
                onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
              />
            </div>
          </div>

          {/* Section 2: Classification */}
          <div className="space-y-6 bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">02. Classification</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-zinc-600 font-black ml-2">Vertical</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-zinc-300 text-sm focus:border-[#D4AF37] outline-none cursor-pointer appearance-none"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  value={formData.category}
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat === "Select Category" ? "" : cat} className="bg-black text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <input 
                type="url" required placeholder="Website URL" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
              <input 
                type="url" placeholder="Startup Twitter URL" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.twitter}
                onChange={(e) => setFormData({...formData, twitter: e.target.value})}
              />
              <input 
                type="url" placeholder="Logo URL (Square recommended)" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.logoUrl}
                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
              />
              <input 
                type="url" placeholder="Banner Image URL" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
              />
            </div>
          </div>

          {/* Section 3: Contact Information */}
          <div className="md:col-span-2 space-y-6 bg-zinc-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4">03. Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" required placeholder="Founder Full Name" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.founderName}
                onChange={(e) => setFormData({...formData, founderName: e.target.value})}
              />
              <input 
                type="email" required placeholder="Founder Email Address" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.founderEmail}
                onChange={(e) => setFormData({...formData, founderEmail: e.target.value})}
              />
              <input 
                type="url" placeholder="Founder Twitter URL" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.founderTwitter}
                onChange={(e) => setFormData({...formData, founderTwitter: e.target.value})}
              />
              <input 
                type="url" placeholder="Pitch Deck URL (Optional)" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#D4AF37] outline-none transition-all placeholder:text-zinc-700"
                value={formData.pitchDeckUrl}
                onChange={(e) => setFormData({...formData, pitchDeckUrl: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="md:col-span-2 w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#D4AF37] transition-all disabled:opacity-50 shadow-xl active:scale-[0.98]"
          >
            {loading ? "Transmitting to Encyclopedia..." : "Submit Startup"}
          </button>
        </form>
      </div>
    </div>
  );
}
