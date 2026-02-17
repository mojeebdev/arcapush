"use client";

import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  
  const dynamicId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

  return (
    <DynamicContextProvider
      settings={{
        // ── Auth Identity (Official) ─────────────────────
        environmentId: dynamicId || "1e00f190-32cf-4429-9d93-efa45b1e9c82", 
        
        // ── Multichain Connectors (Official) ─────────────
        walletConnectors: [
          EthereumWalletConnectors,
          SolanaWalletConnectors,
        ],
      }}
    >
      {children}
      
      {/* ── Guardian Toast Notifications ─────────────── */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#09090b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "16px 24px",
          },
        }}
      />
    </DynamicContextProvider>
  );
}
