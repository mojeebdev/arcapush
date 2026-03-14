"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected, coinbaseWallet } from "wagmi/connectors";
import { ReactNode, useState, useMemo, useEffect } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const ALCHEMY_BASE_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_BASE;
const ALCHEMY_SOLANA_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_SOLANA;

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Arcapush", // ← updated
      preference: "all",
    }),
  ],
  transports: {
    [base.id]: http(ALCHEMY_BASE_URL || "https://mainnet.base.org"),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => { setMounted(true); }, []);

  const endpoint = useMemo(
    () => ALCHEMY_SOLANA_URL || "https://api.mainnet-beta.solana.com",
    [ALCHEMY_SOLANA_URL]
  );

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}