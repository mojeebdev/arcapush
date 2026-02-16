import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VibeStream.cc | Connecting Vibe Code to Venture Capital',
  description: 'The premier matchmaking engine for elite founders and investors on Base & Solana.',
  openGraph: {
    title: 'VibeStream.cc',
    description: 'Vibe Code meets Venture Capital.',
    url: 'https://vibestream.cc',
    siteName: 'VibeStream',
    images: [
      {
        url: '/wordmark.png', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeStream.cc',
    description: 'The Founder-VC Bridge on Base & Solana.',
    images: ['/wordmark.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}