"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShareButton } from "./ShareButton";
import { HiOutlineArrowUpRight, HiOutlineEye } from "react-icons/hi2";

interface StartupCardProps {
  startup: {
    id: string;
    name: string;
    tagline: string;
    problemStatement: string;
    bannerUrl: string;
    logoUrl: string | null;
    category: string;
    website: string | null;
    twitter: string | null;
    viewCount: number;
  };
  variant: "ticker" | "grid";
}

export function StartupCard({ startup, variant }: StartupCardProps) {
  if (variant === "ticker") {
    return (
      <div className="bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden group shadow-[0_0_50px_-20px_rgba(78,36,207,0.2)]">
        <div className="flex flex-col lg:flex-row">
          {/* 🌑 Visual Signal */}
          <div className="relative lg:w-1/2 h-[220px] lg:h-[380px] overflow-hidden">
            <Image
              src={startup.bannerUrl}
              alt={startup.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent lg:hidden" />
          </div>

          {/* 💎 Data Signal */}
          <div className="flex-1 p-8 lg:p-14 flex flex-col justify-center bg-zinc-950">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-[#4E24CF]/10 border border-[#4E24CF]/20 rounded-full text-[9px] font-black uppercase tracking-widest text-[#4E24CF]">
                {startup.category}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span className="flex items-center gap-1">
                  <HiOutlineEye className="w-3 h-3" />
                  {startup.viewCount} Signals
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              {startup.logoUrl && (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-black p-1.5">
                  <Image
                    src={startup.logoUrl}
                    alt={`${startup.name} logo`}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                {startup.name}
              </h3>
            </div>

            <p className="text-[#D4AF37] font-bold text-xs mb-3 tracking-[0.1em] uppercase">
              {startup.tagline}
            </p>
            <p className="text-zinc-500 text-sm font-medium line-clamp-2 mb-10 leading-relaxed">
              {startup.problemStatement}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/startup/${startup.id}`}
                className="px-8 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#4E24CF] hover:text-white transition-all active:scale-95 flex items-center gap-2"
              >
                View Transmission
                <HiOutlineArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <ShareButton startup={startup} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/startup/${startup.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:border-[#4E24CF]/30 h-full flex flex-col"
      >
        <div className="relative h-[180px] overflow-hidden">
          <Image
            src={startup.bannerUrl}
            alt={startup.name}
            fill
            className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute top-5 right-5">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg text-[8px] font-black text-[#D4AF37] uppercase tracking-widest">
              {startup.category}
            </span>
          </div>
        </div>

        <div className="p-8 flex-grow">
          <div className="flex items-center gap-3 mb-4">
            {startup.logoUrl && (
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/5 bg-black p-1.5 transition-transform group-hover:scale-110">
                <Image
                  src={startup.logoUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <h4 className="font-black text-white text-sm uppercase tracking-tighter truncate">
              {startup.name}
            </h4>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
            {startup.problemStatement}
          </p>
        </div>

        <div className="h-1 w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
      </motion.div>
    </Link>
  );
}
