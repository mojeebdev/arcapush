"use client";

import { useState } from "react";
import { useWriteContract, useAccount, useSwitchChain } from "wagmi";
import { parseUnits } from "viem";
import { base } from "wagmi/chains";
import toast from "react-hot-toast";

// ─── ABIs ─────────────────────────────────────────────────────────────────────

const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount",  type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const ARCAPUSH_BOOST_ABI = [
  {
    name: "boost",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "startupId", type: "string" },
      { name: "tier",      type: "string" }, // LAUNCH | PRO | PRO_MAX
    ],
    outputs: [],
  },
] as const;



const USDC_BASE     = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;


const BOOST_CONTRACT = "0x345366072b05EE611b076348b5f25F9fd244394a" as `0x${string}`;



interface PurchaseBoostParams {
  startupId:    string;
  packageValue: string;  // LAUNCH | PRO | PRO_MAX
  price:        number;
  onSuccess?:   (data: any) => void;
}



export function useBoost() {
  const [isProcessing, setIsProcessing] = useState(false);

  const { isConnected, chainId } = useAccount();
  const { switchChainAsync }     = useSwitchChain();
  const { writeContractAsync }   = useWriteContract();

  const purchaseBoost = async ({
    startupId,
    packageValue,
    price,
    onSuccess,
  }: PurchaseBoostParams) => {
    if (!isConnected) return toast.error("Connect your wallet first.");
    if (!startupId)   return toast.error("Select your product first.");
    if (price <= 0)   return toast.error("Invalid package price.");

    setIsProcessing(true);
    const toastId = toast.loading("Preparing boost...");

    try {
      
      if (chainId !== base.id) {
        toast.loading("Switching to Base...", { id: toastId });
        await switchChainAsync({ chainId: base.id });
      }

      const amount = parseUnits(String(price), 6); // USDC = 6 decimals

      
      toast.loading("Step 1/2 — Approve USDC...", { id: toastId });
      const approveTx = await writeContractAsync({
        chainId:      base.id,
        address:      USDC_BASE,
        abi:          USDC_ABI,
        functionName: "approve",
        args:         [BOOST_CONTRACT, amount],
      });

      toast.loading("Confirming approval...", { id: toastId });
      await waitForTx(approveTx);

      // Step 2 — Call boost() on contract
      toast.loading("Step 2/2 — Activating boost...", { id: toastId });
      const boostTx = await writeContractAsync({
        chainId:      base.id,
        address:      BOOST_CONTRACT,
        abi:          ARCAPUSH_BOOST_ABI,
        functionName: "boost",
        args:         [startupId, packageValue],
      });

      // Step 3 — Sync with DB
      toast.loading("Syncing with registry...", { id: toastId });
      const res = await fetch("/api/pin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          startupId,
          chain:        "base",
          txHash:       boostTx,
          packageValue,
        }),
      });

      if (!res.ok) throw new Error("Registry sync failed.");

      toast.success("Boost active!", { id: toastId });
      onSuccess?.(await res.json());

    } catch (err: any) {
      const msg =
        err?.message?.includes("User rejected") ? "Transaction cancelled."     :
        err?.message?.includes("insufficient")  ? "Insufficient USDC balance." :
        err?.shortMessage                       ?? "Boost failed. Try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return { purchaseBoost, isProcessing };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function waitForTx(hash: string, attempts = 15): Promise<void> {
  const rpc = process.env.NEXT_PUBLIC_ALCHEMY_RPC_BASE || "https://mainnet.base.org";
  for (let i = 0; i < attempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const res  = await fetch(rpc, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          jsonrpc: "2.0", id: 1,
          method:  "eth_getTransactionReceipt",
          params:  [hash],
        }),
      });
      const data = await res.json();
      if (data?.result?.status === "0x1") return;
      if (data?.result?.status === "0x0") throw new Error("Approval tx reverted.");
    } catch (e: any) {
      if (e.message?.includes("reverted")) throw e;
    }
  }
  throw new Error("Approval tx timed out.");
}