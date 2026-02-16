import "@/globals.css";
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
        <main className="relative min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}