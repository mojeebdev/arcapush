"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import * as solanaWeb3 from "@solana/web3.js";
import { 
  HiCheck, 
  HiOutlineArchiveBox, 
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineFire,
  HiOutlineGlobeAlt,
  HiOutlineBolt
} from "react-icons/hi2";

const BASE_RECEIVER = "0x16a067b833d37f198b04ea685b3e89a0280eac7c";
const SOL_RECEIVER = "7FHgVSbCptaLFNBcUouDXWUboChNnDSbF7Au71LMkwgr";
const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_SOL_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

const plans = [
  { label: "30 Mins", price: "25", rotations: "90", perks: ["90 Rotations (20s each)", "Permanent Encyclopedia Entry", "Search Engine Indexed"], featured: false },
  { label: "1 Day", price: "150", rotations: "4,320", perks: ["4,320 Rotations", "Thoughtful X Storytelling Post", "Permanent Presence", "Discovery Feed Priority"], featured: true },
  { label: "1 Week", price: "600", rotations: "30,240", perks: ["30,240 Rotations", "X Storytelling Post", "1-on-1 Marketing Call", "Verified Vibe Badge"], featured: false },
  { label: "1 Month", price: "1,800", rotations: "129,600", perks: ["129,600 Rotations", "Lifetime Encyclopedia Entry", "VC Access Channel", "Founder Strategy Retainer"], featured: false }
];

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const payWithBase = async (amount: string) => {
    if (!window.ethereum) throw new Error("Please install Coinbase Wallet or MetaMask");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    
    const abi = ["function transfer(address to, uint256 amount) returns (bool)"];
    const usdcContract = new ethers.Contract(USDC_BASE_ADDRESS, abi, signer);
    
    const tokens = ethers.parseUnits(amount, 6);
    const tx = await usdcContract.transfer(BASE_RECEIVER, tokens);
    return tx.wait();
  };

  
  const payWithSolana = async (amount: string) => {
    if (!window.solana) throw new Error("Please install Phantom or Solflare");
    
    const resp = await window.solana.connect();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));
    
   
    toast.info("Check your Phantom wallet for the USDC request");
  };

  const handlePayment = async (chain: 'BASE' | 'SOLANA', price: string) => {
    setIsProcessing(true);
    const toastId = toast.loading(`Preparing ${chain} Transmission...`);

    try {
      if (chain === 'BASE') {
        await payWithBase(price);
      } else {
        await payWithSolana(price);
      }
      
      toast.success("Signal Verified. Transaction Indexed.", { id: toastId });
      
    } catch (err: any) {
      toast.error(err.message || "Transaction Aborted", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Toaster position="bottom-right" />
      
      {/* 🌌 Perpetual Value Banner */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 p-8 rounded-[3rem] bg-zinc-900/10 border border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
            <HiOutlineShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-[0.3em]">The Perpetual Standard</h4>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Every Vibe Code is indexed forever. Presence is non-negotiable.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.label}
            className={`relative rounded-[3rem] p-10 bg-zinc-950/80 border ${plan.featured ? 'border-[#4E24CF] shadow-[#4E24CF]/10 shadow-2xl' : 'border-white/5'} flex flex-col group backdrop-blur-md`}
          >
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">{plan.label}</h3>
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{plan.rotations} Rots.</span>
            </div>
            
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">USDC</span>
            </div>

            <ul className="space-y-4 mb-12 flex-grow">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <HiCheck className={`w-4 h-4 mt-0.5 shrink-0 ${plan.featured ? 'text-[#4E24CF]' : 'text-zinc-700'}`} />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <button 
                onClick={() => handlePayment('BASE', plan.price)}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-blue-600 text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineGlobeAlt className="w-4 h-4" /> Base USDC
              </button>
              
              <button 
                onClick={() => handlePayment('SOLANA', plan.price)}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-white text-black hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineBolt className="w-4 h-4" /> Solana USDC
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}