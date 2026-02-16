import './globals.css';
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
      <body className={`${inter.className} bg-black text-white antialiased overflow-x-hidden`}>
        {/* The Master Container */}
        <main className="min-h-screen w-full flex flex-col items-center justify-center relative">
          {children}
        </main>
      </body>
    </html>
  );
}