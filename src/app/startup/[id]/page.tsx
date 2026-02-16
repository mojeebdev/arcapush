"use client";
import { useParams } from 'next/navigation';

export default function StartupDetailsPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Startup Profile
        </h1>
        <div className="p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
          <p className="text-gray-400 mb-2">Registration ID:</p>
          <code className="text-purple-400 font-mono text-xl">{id}</code>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Status: Active</h2>
            <p className="text-gray-300">
              This startup is currently being reviewed by the VibeStream Guardian system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}