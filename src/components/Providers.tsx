"use client";

import { SessionProvider } from "next-auth/react";
import { Web3Provider } from "@/components/Web3Provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Web3Provider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background:    "var(--bg)",
              color:         "var(--text-primary)",
              border:        "1px solid var(--border)",
              fontFamily:    "var(--font-mono)",
              fontSize:      "0.72rem",
              letterSpacing: "0.04em",
              boxShadow:     "0 4px 24px rgba(10,10,15,0.08)",
            },
          }}
        />
      </Web3Provider>
    </SessionProvider>
  );
}