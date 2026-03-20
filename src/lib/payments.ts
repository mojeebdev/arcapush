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

// ─── Constants ────────────────────────────────────────────────────────────────

const USDC_BASE_ADDRESS  = AdminConfig.USDC_CONTRACT_BASE;
const BOOST_CONTRACT     = "0x4A3cbd8a1e21ef21C55e43BA4ff7BD2Bf84b8009";
const TRANSFER_TOPIC     = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// ─── Base Verification ────────────────────────────────────────────────────────
// Now looks for transferFrom: USDC log where
//   from  = boost contract (it pulled from user)
//   to    = your vault

export async function verifyBasePayment(txHash: string): Promise<PaymentVerification> {
  try {
    const alchemyUrl = process.env.ALCHEMY_RPC_BASE || "https://base-mainnet.public.blastapi.io";
    const provider   = new ethers.JsonRpcProvider(alchemyUrl);
    const receipt    = await provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) throw new Error("Invalid or failed receipt");

    const targetWallet = AdminConfig.PAYMENT_WALLET_BASE?.toLowerCase();
    if (!targetWallet) throw new Error("Base Payment Vault is not configured.");

    // Find the USDC Transfer log going TO your vault
    // works for both direct transfer and transferFrom via contract
    const usdcLog = receipt.logs.find((log) => {
      const isUSDC     = log.address.toLowerCase() === USDC_BASE_ADDRESS.toLowerCase();
      const isTransfer = log.topics[0] === TRANSFER_TOPIC;
      const toAddress  = log.topics[2]
        ? ethers.getAddress(`0x${log.topics[2].slice(26)}`).toLowerCase()
        : "";
      return isUSDC && isTransfer && toAddress === targetWallet;
    });

    if (!usdcLog) throw new Error("No matching USDC transfer to vault found");

    // Decode the amount from the log data
    const amount = ethers.formatUnits(usdcLog.data, 6);

    return {
      verified: true,
      chain:    "base",
      txHash,
      amount,
      currency: "USDC",
    };
  } catch (err) {
    console.error("Base verification failure:", err);
    return { verified: false, chain: "base", txHash, amount: "0", currency: "USDC" };
  }
}

// ─── Solana Verification (unchanged) ─────────────────────────────────────────

export async function verifySolanaPayment(txHash: string): Promise<PaymentVerification> {
  try {
    const solanaRpc  =
      process.env.NEXT_PUBLIC_ALCHEMY_RPC_SOLANA || "https://api.mainnet-beta.solana.com";
    const connection = new Connection(solanaRpc, "confirmed");

    const tx = await connection.getParsedTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx)        throw new Error("Transaction not found on ledger yet");
    if (tx.meta?.err) throw new Error("Transaction marked as failed on-chain");

    const solVault = AdminConfig.PAYMENT_WALLET_SOLANA;
    if (!solVault) throw new Error("Solana Payment Vault is not configured.");

    const accountKeys = tx.transaction.message.accountKeys.map((k) => k.pubkey.toBase58());
    const vaultIndex  = accountKeys.indexOf(solVault);

    if (vaultIndex === -1) throw new Error("Vault address not involved in this transaction.");

    const preBalance  = tx.meta?.preBalances[vaultIndex]  || 0;
    const postBalance = tx.meta?.postBalances[vaultIndex] || 0;
    const solIncreased = postBalance > preBalance;

    const tokenIncreased = tx.meta?.postTokenBalances?.some((b: any) =>
      b.owner === solVault &&
      Number(b.uiTokenAmount.amount) >
        Number(
          tx.meta?.preTokenBalances?.find((pb: any) => pb.owner === solVault)
            ?.uiTokenAmount.amount || 0
        )
    );

    if (!solIncreased && !tokenIncreased) {
      throw new Error("Vault balance did not increase in this transaction");
    }

    const solReceived = ((postBalance - preBalance) / 1e9).toFixed(6);

    return {
      verified: true,
      chain:    "solana",
      txHash,
      amount:   solReceived,
      currency: "SOL",
    };
  } catch (err) {
    console.error("Solana verification failure:", err);
    return { verified: false, chain: "solana", txHash, amount: "0", currency: "SOL" };
  }
}



export function generatePaymentId(): string {
  return `ap_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}