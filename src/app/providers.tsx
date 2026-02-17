"use client";

import {
  DynamicContextProvider,
  FilterChain,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { 
  BitcoinIcon, 
  EthereumIcon, 
  SolanaIcon,
} from "@dynamic-labs/iconic"; 
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  
  const dynamicId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

  return (
    <DynamicContextProvider
      settings={{
        
        environmentId: dynamicId || "f157a943-8c02-444e-8e07-fba55842b4c0", 
        
        
        walletConnectors: [
          EthereumWalletConnectors,
          SolanaWalletConnectors,
        ],

        
        overrides: {
          views: [
            {
              type: 'wallet-list',
              tabs: {
                items: [
                  {
                    label: { text: 'All chains' },
                  },
                  {
                    label: { icon: <EthereumIcon /> },
                    walletsFilter: FilterChain('EVM'),
                    recommendedWallets: [
                      { walletKey: 'metamask' },
                      { walletKey: 'walletconnect' }, 
                    ],
                  },
                  {
                    label: { icon: <SolanaIcon /> },
                    walletsFilter: FilterChain('SOL'),
                    recommendedWallets: [
                      { walletKey: 'phantom' },
                    ],
                  },
                  {
                    label: { icon: <BitcoinIcon /> },
                    walletsFilter: FilterChain('BTC'),
                  },
                ]
              }
            }
          ]
        }
      }}
    >
      {children}
      
      {/* ── Guardian Toast Notifications ──────────────── */}
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
