import { Suspense } from 'react';
import { prisma } from "@/lib/prisma";
import { RegistrySearchHandler } from "./RegistrySearchHandler";


export const revalidate = 0; 

export default async function RegistryPage() {
  
  const startups = await prisma.startup.findMany({
    
    where: { approved: true }, 
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">Encyclopedia</span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mt-2">
            Verified <span className="text-[#4E24CF]">Signals.</span>
          </h1>
        </div>

        <Suspense fallback={<div className="text-zinc-500 font-black text-[10px] uppercase animate-pulse">Scanning Frequencies...</div>}>
          <RegistrySearchHandler initialStartups={startups} />
        </Suspense>
      </div>
    </main>
  );
}
