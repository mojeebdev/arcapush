import Image from "next/image";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="mb-8 flex justify-center">
        <Image
          src="/arcapush_wordmark.png"
          alt="Arcapush"
          width={160}
          height={36}
          className="h-9 w-auto object-contain"
          priority
        />
      </div>

      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
      >
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-3" style={{ color: "var(--text-primary)" }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="ap-btn-primary w-full text-center block"
        >
          Try Again →
        </Link>
      </div>
    </div>
  );
}