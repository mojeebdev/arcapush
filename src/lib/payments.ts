import { ethers } from "ethers";
import * as solanaWeb3 from "@solana/web3.js";
import { AdminConfig } from "./adminConfig";

export interface PaymentVerification {
  verified: boolean;
  chain: string;
  txHash: string;
  amount: string;
  currency: string;
}


const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"; 

export async function verifyBasePayment(txHash: string): Promise<PaymentVerification> {
  try {
    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) throw new Error("Invalid receipt");

    
    const usdcLog = receipt.logs.find(log => 
      log.address.toLowerCase() === USDC_BASE_ADDRESS.toLowerCase() &&
      log.topics[0] === TRANSFER_TOPIC &&
      log.topics[2].toLowerCase().includes(AdminConfig.PAYMENT_WALLET_BASE.toLowerCase().replace('0x', ''))
    );

    if (!usdcLog) throw new Error("No matching USDC transfer to your vault found");

    return {
      verified: true,
      chain: "base",
      txHash,
      amount: "Verified", 
      currency: "USDC",
    };
  } catch (err) {
    console.error("Base Verification Fail:", err);
    return { verified: false, chain: "base", txHash, amount: "0", currency: "USDC" };
  }
}

export async function verifySolanaPayment(txHash: string): Promise<PaymentVerification> {
  try {
    const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const tx = await connection.getParsedTransaction(txHash, { 
      maxSupportedTransactionVersion: 0 
    });

    if (!tx || tx.meta?.err) throw new Error("Transaction not found or failed");

    
    const destinationFound = tx.transaction.message.instructions.some((ix: any) => 
      ix.parsed?.info?.destination === AdminConfig.PAYMENT_WALLET_SOL ||
      ix.parsed?.info?.newAccount === AdminConfig.PAYMENT_WALLET_SOL
    );

    if (!destinationFound) throw new Error("Receiver does not match your vault");

    return {
      verified: true,
      chain: "solana",
      txHash,
      amount: "Verified",
      currency: "USDC/SOL",
    };
  } catch (err) {
    console.error("Solana Verification Fail:", err);
    return { verified: false, chain: "solana", txHash, amount: "0", currency: "SOL" };
  }
}

export function generatePaymentId(): string {
  return `vs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}