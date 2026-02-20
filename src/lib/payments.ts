
import { ethers } from "ethers";
import { AdminConfig } from "./adminConfig";
import { Connection, PublicKey } from "@solana/web3.js";

export interface PaymentVerification {
  verified: boolean;
  chain: string;
  txHash: string;
  amount: string;
  currency: string;
}

const USDC_BASE_ADDRESS = AdminConfig.USDC_CONTRACT_BASE;
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"; 

export async function verifyBasePayment(txHash: string): Promise<PaymentVerification> {
  try {
    
    const provider = new ethers.JsonRpcProvider("https://base-mainnet.public.blastapi.io");
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) throw new Error("Invalid or failed receipt");

    const targetWallet = AdminConfig.PAYMENT_WALLET_BASE?.toLowerCase();
    if (!targetWallet) throw new Error("Base Payment Vault is not configured.");

    const usdcLog = receipt.logs.find(log => {
      const isUSDC = log.address.toLowerCase() === USDC_BASE_ADDRESS.toLowerCase();
      const isTransfer = log.topics[0] === TRANSFER_TOPIC;
      const toAddress = log.topics[2] ? ethers.getAddress(`0x${log.topics[2].slice(26)}`).toLowerCase() : "";
      return isUSDC && isTransfer && toAddress === targetWallet;
    });

    if (!usdcLog) throw new Error("No matching USDC transfer to your vault found");

    return {
      verified: true,
      chain: "base",
      txHash,
      amount: "Verified", 
      currency: "USDC",
    };
  } catch (err) {
    console.error("🛡️ Base Verification Failure:", err);
    return { verified: false, chain: "base", txHash, amount: "0", currency: "USDC" };
  }
}

export async function verifySolanaPayment(txHash: string): Promise<PaymentVerification> {
  try {
    
    const connection = new Connection("https://solana-mainnet.g.allthatnode.com", "confirmed");
    
    const tx = await connection.getParsedTransaction(txHash, { 
      maxSupportedTransactionVersion: 0 
    });

    if (!tx) throw new Error("Transaction not found on ledger yet");
    if (tx.meta?.err) throw new Error("Transaction marked as failed on-chain");

    const solVault = AdminConfig.PAYMENT_WALLET_SOLANA;
    if (!solVault) throw new Error("Solana Payment Vault is not configured.");

    
    const destinationFound = tx.transaction.message.instructions.some((ix: any) => {
      
      const isNativeMatch = ix.parsed?.info?.destination === solVault;
      
      
      const isTokenMatch = tx.meta?.postTokenBalances?.some((b: any) => 
        b.owner === solVault && 
        (Number(b.uiTokenAmount.amount) > Number(tx.meta?.preTokenBalances?.find((pb: any) => pb.owner === solVault)?.uiTokenAmount.amount || 0))
      );
      
      return isNativeMatch || isTokenMatch;
    });

    
    const balanceIncreased = (tx.meta?.postBalances[tx.transaction.message.accountKeys.findIndex(k => k.pubkey.toBase58() === solVault)] || 0) > 
                             (tx.meta?.preBalances[tx.transaction.message.accountKeys.findIndex(k => k.pubkey.toBase58() === solVault)] || 0);

    if (!destinationFound && !balanceIncreased) throw new Error("Vault balance did not increase in this transaction");

    return {
      verified: true,
      chain: "solana",
      txHash,
      amount: "Verified",
      currency: "SOL/USDC",
    };
  } catch (err) {
    console.error("🛡️ Solana Verification Failure:", err);
    return { verified: false, chain: "solana", txHash, amount: "0", currency: "SOL" };
  }
}

export function generatePaymentId(): string {
  return `vs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
