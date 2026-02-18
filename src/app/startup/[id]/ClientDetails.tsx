"use client";

import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { AscensionSuccess } from "@/components/AscensionSuccess";
import { HiOutlineBolt } from "react-icons/hi2";

export function ClientDetails({ startup, children }: { startup: any, children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  return (
    <>
      {children}

      {/* 🚀 Signal Boost Floating Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 z-50 flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-black font-black uppercase italic tracking-tighter rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform active:scale-95 group"
      >
        <HiOutlineBolt className="w-5 h-5 group-hover:animate-bounce" />
        Boost Signal
      </button>

      {/* 💳 Payment Modal */}
      {isModalOpen && (
        <PaymentModal 
          startupId={startup.id} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={(data: any) => setSuccessData(data)} 
        />
      )}

      {/* 🎊 Celebration Screen */}
      {successData && (
        <AscensionSuccess 
          startupName={successData.startupName}
          expiresAt={successData.expiresAt}
          txHash={successData.txHash}
          duration={successData.duration}
        />
      )}
    </>
  );
}