import { AdminConfig } from "./adminConfig";

/**
 * Payment verification utilities.
 * In production, you'd verify on-chain via RPC calls.
 * This module provides the interface and mock verification for MVP.
 */

export interface PaymentVerification {
  verified: boolean;
  chain: string;
  txHash: string;
  amount: string;
  currency: string;
}

// ERC-20 USDC ABI (minimal for transfer verification)
export const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
] as const;

export async function verifyBasePayment(txHash: string): Promise<PaymentVerification> {
  // In production: use ethers.js to verify the tx on Base
  // Check: correct recipient, correct amount, confirmed block
  try {
    // MVP: Accept the tx hash and mark as verified
    // TODO: Add real on-chain verification
    return {
      verified: true,
      chain: "base",
      txHash,
      amount: AdminConfig.PIN_PRICE_BASE_USDC,
      currency: "USDC",
    };
  } catch {
    return {
      verified: false,
      chain: "base",
      txHash,
      amount: "0",
      currency: "USDC",
    };
  }
}

export async function verifySolanaPayment(txHash: string): Promise<PaymentVerification> {
  // In production: use @solana/web3.js to verify the tx
  try {
    return {
      verified: true,
      chain: "solana",
      txHash,
      amount: AdminConfig.PIN_PRICE_SOL,
      currency: "SOL",
    };
  } catch {
    return {
      verified: false,
      chain: "solana",
      txHash,
      amount: "0",
      currency: "SOL",
    };
  }
}

export function generatePaymentId(): string {
  return `vs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}