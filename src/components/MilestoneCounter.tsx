import { prisma } from "@/lib/prisma";

export async function MilestoneCounter() {
  
  const count = await prisma.startup.count();
  
  
  const formattedCount = new Intl.NumberFormat().format(count);

  return (
    <div className="flex flex-col items-center justify-center py-12 border-y border-white/5 bg-zinc-900/10 backdrop-blur-sm">
      <div className="text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-black mb-2">
        VibeStream Network Strength
      </div>
      <div className="text-6xl font-black tracking-tighter text-white tabular-nums">
        {formattedCount}
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mt-2">
        Startups Initialized
      </div>
    </div>
  );
}