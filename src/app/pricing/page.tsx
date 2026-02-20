"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  HiOutlineGlobeAlt, 
  HiOutlineBolt, 
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck 
} from "react-icons/hi2";
import { useWriteContract, useAccount, useSwitchChain } from 'wagmi'; 
import { parseUnits } from 'viem';
import { base } from 'wagmi/chains';
import { AdminConfig } from "@/lib/adminConfig";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram 
} from "@solana/web3.js";

const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [approvedStartups, setApprovedStartups] = useState<any[]>([]);
  
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch('/api/startups?status=APPROVED');
        const data = await res.json();
        setApprovedStartups(data.startups || []);
      } catch (err) {
        console.error("Guardian Log: Startup fetch failed", err);
      }
    };
    fetchApproved();
  }, []);

  const handleBasePayment = async (plan: any) => {
    if (!selectedStartupId) return toast.error("Select a food item to boost first.");
    if (!isConnected) return toast.error("Connect your wallet in the navbar first.");
    
    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_BASE;
    const usdcContract = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; 

    setIsProcessing(true);
    const toastId = toast.loading("Verifying Base USDC Handshake...");
    
    try {
      if (chainId !== base.id) {
        toast.loading("Switching to Base Mainnet...", { id: toastId });
        await switchChainAsync({ chainId: base.id });
      }

      const hash = await writeContractAsync({
        address: usdcContract as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [
          destination as `0x${string}`,
          parseUnits(plan.price.toString(), 6) 
        ],
       
        gas: BigInt(80000), 
      });

      toast.loading("Syncing with Signal Registry...", { id: toastId });
      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "base", txHash: hash, packageValue: plan.value }),
      });

      if (!res.ok) throw new Error("Database verification delayed.");
      toast.success("🚀 Base Ascension Complete!", { id: toastId });
    } catch (err: any) {
     
      const errorMsg = err.message?.includes("insufficient funds") ? "Insufficient USDC on Base." : (err.shortMessage || "Handshake Rejected");
      toast.error(errorMsg, { id: toastId });
    } finally { setIsProcessing(false); }
  };

  const handleSolanaPayment = async (plan: any) => {
    if (!selectedStartupId) return toast.error("Select a food item first.");
    if (!window.solana) return toast.error("Phantom/Solana wallet not detected.");

    const destination = process.env.NEXT_PUBLIC_PAYMENT_WALLET_SOLANA;
    if (!destination) return toast.error("Solana destination configuration missing.");

    setIsProcessing(true);
    const toastId = toast.loading("Accessing Market Oracle...");

    try {
      const priceRes = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      const priceData = await priceRes.json();
      const solAmount = plan.price / priceData.solana.usd;
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

      const resp = await window.solana.connect();
      
      
      const connection = new Connection("https://solana-mainnet.g.allthatnode.com", "confirmed");
      
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: resp.publicKey
      }).add(
        
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 8000 }),
        SystemProgram.transfer({
          fromPubkey: resp.publicKey,
          toPubkey: new PublicKey(destination),
          lamports: lamports,
        })
      );

      const { signature } = await window.solana.signAndSendTransaction(transaction);
      
      toast.loading("Confirming on Solana Ledger...", { id: toastId });
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });

      const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId: selectedStartupId, chain: "solana", txHash: signature, packageValue: plan.value }),
      });

      if (!res.ok) throw new Error("Database sync failed.");
      toast.success("🔥 Solana Ascension Complete!", { id: toastId });
    } catch (err: any) {
      console.error("Solana Fault:", err);
      toast.error("Solana Network Busy. Please try again.", { id: toastId });
    } finally { setIsProcessing(false); }
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen bg-black text-white">
      <Toaster position="bottom-right" />
      
      <section className="mb-12 max-w-xl mx-auto">
        <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 backdrop-blur-xl text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-4 block italic">Boost Target Selection</label>
          <div className="relative">
             <select 
               value={selectedStartupId} 
               onChange={(e) => setSelectedStartupId(e.target.value)} 
               className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-black text-white outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors uppercase tracking-widest"
             >
                <option value="">Choose Food Item...</option>
                {approvedStartups.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
             </select>
             <HiOutlineMagnifyingGlass className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AdminConfig.PIN_PACKAGES.map((plan) => (
          <motion.div 
            key={plan.label} 
            whileHover={{ y: -8 }}
            className={`relative rounded-[3rem] p-10 bg-zinc-950 border ${plan.featured ? 'border-[#4E24CF] shadow-[0_0_40px_rgba(78,36,207,0.15)]' : 'border-white/5'} flex flex-col transition-all duration-500`}
          >
            <h3 className="text-2xl font-black text-white uppercase italic mb-2">{plan.label}</h3>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
              <span className="text-zinc-700 text-[9px] font-black uppercase">USD</span>
            </div>
            
            <div className="space-y-3 mt-auto">
              <button onClick={() => handleBasePayment(plan)} disabled={isProcessing || !selectedStartupId} className="w-full py-4 rounded-2xl font-black text-[10px] bg-blue-600/10 border border-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-all disabled:opacity-10">
                <HiOutlineGlobeAlt className="w-5 h-5" /> Base USDC
              </button>
              <button onClick={() => handleSolanaPayment(plan)} disabled={isProcessing || !selectedStartupId} className="w-full py-4 rounded-2xl font-black text-[10px] bg-white text-black hover:bg-[#D4AF37] hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-all disabled:opacity-10">
                <HiOutlineBolt className="w-5 h-5" /> Solana SOL
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/50 border border-white/5">
          <HiOutlineShieldCheck className="w-4 h-4 text-[#D4AF37]" />
        </div>
      </div>
    </main>
  );
}
