import { prisma } from "@/lib/prisma";

export async function MilestoneCounter() {
  const count = await prisma.startup.count();
  const formattedCount = new Intl.NumberFormat().format(count);

  return (
    <div
      className="flex flex-col items-center justify-center py-12 backdrop-blur-sm"
      style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}
    >
      <p className="ap-label mb-2" style={{ color: "var(--accent)" }}>Arcapush Registry</p>
      <div
        className="text-6xl font-black tracking-tighter tabular-nums"
        style={{ color: "var(--text-primary)" }}
      >
        {formattedCount}
      </div>
      <p className="ap-label mt-2">Products Indexed</p>
    </div>
  );
}