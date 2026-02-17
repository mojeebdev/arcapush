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
      <div className="bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden group shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* Visual Signal */}
          <div className="relative lg:w-1/2 h-[220px] lg:h-[350px] overflow-hidden">
            <Image
              src={startup.bannerUrl}
              alt={startup.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Ambient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent lg:hidden" />
          </div>

          {/* Data Signal */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center bg-zinc-950">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">
                {startup.category}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <HiOutlineEye className="w-3 h-3" />
                {startup.viewCount} views
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              {startup.logoUrl && (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-black p-1">
                  <Image
                    src={startup.logoUrl}
                    alt={`${startup.name} logo`}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">{startup.name}</h3>
            </div>

            <p className="text-white/80 font-bold text-sm mb-2 leading-tight tracking-tight uppercase">{startup.tagline}</p>
            <p className="text-zinc-500 text-xs font-medium line-clamp-2 mb-8 uppercase tracking-tighter">
              {startup.problemStatement}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/startup/${startup.id}`}
                className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 flex items-center gap-2"
              >
                Launch Details
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
        whileHover={{ y: -8 }}
        className="group relative bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/20 h-full"
      >
        <div className="relative h-[160px] overflow-hidden">
          <Image
            src={startup.bannerUrl}
            alt={startup.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full text-[8px] font-black text-white uppercase tracking-widest">
              {startup.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {startup.logoUrl && (
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 bg-black p-1 grayscale group-hover:grayscale-0 transition-all">
                <Image
                  src={startup.logoUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <h4 className="font-black text-white text-xs uppercase tracking-widest truncate">
              {startup.name}
            </h4>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter line-clamp-2 leading-relaxed">
            {startup.problemStatement}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}