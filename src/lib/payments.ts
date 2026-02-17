import { AdminConfig } from "./adminConfig";

export interface PaymentVerification {
  verified: boolean;
  chain: string;
  txHash: string;
  amount: string;
  currency: string;
}

export const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
] as const;

export async function verifyBasePayment(txHash: string): Promise<PaymentVerification> {
  try {
    
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