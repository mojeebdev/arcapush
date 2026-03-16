import Image from "next/image";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      <div className="col-span-2 md:col-span-1">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <Image src="/arcapush-logo.png" alt="Arcapush" width={120} height={32} className="h-7 w-auto object-contain" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-primary)" }}>
            Arcapush
          </span>
        </Link>

        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center"
          style={{ background: "color-mix(in srgb, var(--bg-2) 80%, transparent)", border: "1px solid var(--border)" }}
        >
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-3" style={{ color: "var(--text-primary)" }}>
            Something went wrong
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            There was a problem signing you in. Please try again.
          </p>
          <Link href="/auth/signin" className="ap-btn-primary w-full text-center block">
            Try Again →
          </Link>
        </div>
      </div>
    </div>
  );
}