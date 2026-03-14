"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { 
  HiOutlineShieldCheck, 
  HiOutlineCube, 
  HiOutlineGlobeAlt,
  HiOutlineIdentification
} from "react-icons/hi2";

function RequestForm() {
  const searchParams = useSearchParams();
  
  const startupId = searchParams.get("startupId") || "general_access";
  const startupName = searchParams.get("name") || "Arcapush Network";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: "",
    role: "VC",
    linkedIn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
     
      const payload = {
        requesterName: formData.name,     
        requesterEmail: formData.email,   
        requesterFirm: formData.firm,      
        requesterLinkedIn: formData.linkedIn, 
        status: "PENDING",                 
        startupId: startupId,              
      };

      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signal Encrypted & Transmitted");
        setFormData({ name: "", email: "", firm: "", role: "VC", linkedIn: "" });
      } else {
        throw new Error(data.error || "Transmission Failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12" style={{ backgroundColor: "#0f0f12" }}>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 mb-6">
          <HiOutlineShieldCheck className="w-3 h-3 text-[#D4AF37]" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Identity Verification Required</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 text-white">
          Venture <span className="text-[#4E24CF]">Access</span>
        </h1>
        
        <p className="font-playfair text-xl text-gray-400 mb-2">
          Requesting terminal clearance for:
        </p>
        <p className="text-[#D4AF37] font-black uppercase tracking-widest text-sm">
          {startupName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="space-y-2 col-span-2 md:col-span-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Full Name</label>
          <div className="relative">
            <HiOutlineIdentification className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
            <input 
              required
              className="vibe-input pl-14" 
              placeholder="JOHN DOE"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2 col-span-2 md:col-span-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Institutional Email</label>
          <div className="relative">
            <HiOutlineGlobeAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
            <input 
              required
              type="email"
              className="vibe-input pl-14" 
              placeholder="NAME@FIRM.VC"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Firm / Family Office</label>
          <div className="relative">
            <HiOutlineCube className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
            <input 
              required
              className="vibe-input pl-14" 
              placeholder="VIBE CAPITAL PARTNERS"
              value={formData.firm}
              onChange={(e) => setFormData({...formData, firm: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">LinkedIn Profile URL</label>
          <input 
            className="vibe-input" 
            placeholder="HTTPS://LINKEDIN.COM/IN/USERNAME"
            value={formData.linkedIn}
            onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
          />
        </div>

        <button 
          disabled={loading}
          className="royal-button col-span-2 mt-4 flex items-center justify-center gap-3 group"
        >
          {loading ? "INITIALIZING..." : (
            <>
              Request Digital Key
              <HiOutlineShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </form>
      
      <p className="text-center text-[9px] text-zinc-700 font-bold uppercase tracking-[0.4em] mt-12">
        Arcapush Security Protocol 
      </p>
    </div>
  );
}

export default function InvestorRequestPage() {
  return (
    <main className="min-h-screen bg-black px-6">
      <Toaster position="top-center" />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-zinc-500 font-black uppercase tracking-widest animate-pulse">
          Decrypting Terminal...
        </div>
      }>
        <RequestForm />
      </Suspense>
    </main>
  );
}
