"use client";
import { useState } from 'react';

export default function AdminStartup() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLogin = () => {
   
    if (pin === "2897") { 
      setIsAuthorized(true);
    } else {
      alert("Invalid Guardian PIN");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-2xl font-bold mb-4">VibeStream Guardian Access</h1>
        <input 
          type="password" 
          placeholder="Enter Admin PIN" 
          className="bg-white/10 border border-white/20 p-3 rounded-lg text-center text-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button 
          onClick={handleLogin}
          className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-2 rounded-full font-bold hover:scale-105 transition-transform"
        >
          Initialize Startup
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold">VibeStream Dashboard</h1>
      <p className="text-green-400 mt-2">● Startup Engine Online</p>
      {/* Your list of food items (waitlist) will load here */}
    </div>
  );
}