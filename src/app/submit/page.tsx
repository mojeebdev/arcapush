"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function SubmitStartup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Welcome to the VibeStream Waitlist!");
        setTimeout(() => router.push('/'), 2000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Join the Stream</h1>
        <p className="text-gray-400 mb-8">Secure your spot in the VibeStream ecosystem.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            required
            placeholder="Enter your professional email" 
            className="w-full bg-white/10 border border-white/20 p-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Registering..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}