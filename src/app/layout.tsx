import "../globals.css";
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VibeStream.cc | Connecting Vibe Code to Venture Capital',
  description: 'The premier matchmaking engine for elite founders and investors on Base & Solana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* REMOVED: items-center justify-center from the main tag.
            REASON: It was squashing children and causing layout "invisible" errors.
            ADDED: min-h-screen to body for a consistent dark background.
        */}
        <main className="relative min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}