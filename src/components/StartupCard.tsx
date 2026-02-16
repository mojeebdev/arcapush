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
      <div className="glass rounded-2xl overflow-hidden card-hover glow-accent">
        <div className="flex flex-col lg:flex-row">
          {/* Banner */}
          <div className="relative lg:w-1/2 h-[200px] lg:h-[300px] overflow-hidden">
            <Image
              src={startup.bannerUrl}
              alt={startup.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/80 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent lg:hidden" />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-semibold">
                {startup.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/30">
                <HiOutlineEye className="w-3 h-3" />
                {startup.viewCount}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              {startup.logoUrl && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={startup.logoUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold text-white">{startup.name}</h3>
            </div>

            <p className="text-white/50 text-sm mb-2">{startup.tagline}</p>
            <p className="text-white/30 text-sm line-clamp-3 mb-6">
              {startup.problemStatement}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/startup/${startup.id}`}
                className="btn-primary text-sm"
              >
                Request Access
                <HiOutlineArrowUpRight className="w-3.5 h-3.5 inline ml-1.5" />
              </Link>
              <ShareButton startup={startup} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <Link href={`/startup/${startup.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="glass rounded-xl overflow-hidden card-hover group cursor-pointer h-full"
      >
        <div className="relative h-[140px] overflow-hidden">
          <Image
            src={startup.bannerUrl}
            alt={startup.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-100 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-semibold text-white/70">
              {startup.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {startup.logoUrl && (
              <div className="w-6 h-6 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
                <Image
                  src={startup.logoUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h4 className="font-semibold text-white text-sm truncate">
              {startup.name}
            </h4>
          </div>
          <p className="text-xs text-white/40 line-clamp-2">
            {startup.problemStatement}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}