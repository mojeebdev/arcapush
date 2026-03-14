"use client";

import { useState } from "react";
import { PaymentModal }      from "@/components/PaymentModal";
import { AscensionSuccess }  from "@/components/AscensionSuccess";
import { HiOutlineBolt }     from "react-icons/hi2";

export function ClientDetails({ startup, children }: { startup: any; children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const handleSuccess    = (data: any) => { setIsModalOpen(false); setSuccessData(data); };
  const handleCloseSuccess = ()        => setSuccessData(null);

  return (
    <>
      {children}

      {!successData && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-10 right-10 z-[60] flex items-center gap-3 px-8 py-4 font-black uppercase italic tracking-tighter rounded-full transition-transform hover:scale-110 active:scale-95 group"
          style={{
            background: "var(--accent)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(91,43,255,0.25)",
          }}
        >
          <HiOutlineBolt className="w-5 h-5 group-hover:animate-bounce" />
          Boost Signal
        </button>
      )}

      {isModalOpen && (
        <PaymentModal
          startupId={startup.id}
          status={startup.status}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}

      {successData && (
        <AscensionSuccess
          startupName={successData.startupName || startup.name}
          expiresAt={successData.expiresAt}
          txHash={successData.txHash}
          duration={successData.duration}
          startupSlug={startup.slug}
          startupId={startup.id}
          onClose={handleCloseSuccess}
        />
      )}
    </>
  );
}