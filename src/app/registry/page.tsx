import { Suspense } from 'react';
import { prisma } from "@/lib/prisma";
import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';


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

"use client";

function RegistrySearchHandler({ initialStartups }: { initialStartups: any[] }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const query = searchParams.get('search');
    setSearchTerm(query || "");
  }, [searchParams]);

  const filteredStartups = useMemo(() => {
    return initialStartups.filter((item) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchStr) ||
        item.category.toLowerCase().includes(searchStr) ||
        item.tagline.toLowerCase().includes(searchStr)
      );
    });
  }, [searchTerm, initialStartups]);

  return (
    <div className="space-y-8">
      {searchTerm && (
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <span>Results for: <span className="text-[#D4AF37]">{searchTerm}</span></span>
          <button onClick={() => window.history.replaceState(null, '', '/registry')} className="text-white hover:text-[#4E24CF] transition-colors underline underline-offset-4">[ Clear ]</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.length > 0 ? (
          filteredStartups.map((startup) => (
            <Link 
              href={`/startup/${startup.id}`} 
              key={startup.id} 
              className="bg-zinc-950/50 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] text-[#4E24CF] font-black uppercase tracking-widest">{startup.category}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-white uppercase mb-2 group-hover:text-[#D4AF37] transition-colors">{startup.name}</h3>
              <p className="text-zinc-500 text-sm line-clamp-2">{startup.tagline}</p>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[2.5rem]">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">No Signal Detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}