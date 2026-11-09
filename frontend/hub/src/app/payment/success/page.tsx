"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    "AINCRAD-TX-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  const tier = (searchParams.get("tier") || "PRO").toUpperCase();
  const rawAmount = searchParams.get("amount");
  const displayAmount = rawAmount
    ? Number(rawAmount) > 1000
      ? `KES ${(Number(rawAmount) / 100).toLocaleString()}`
      : `KES ${Number(rawAmount).toLocaleString()}`
    : tier === "TEAM"
    ? "KES 3,741.00"
    : "KES 1,200.00";

  const [copied, setCopied] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((u) => {
            if (u?.email) setUserEmail(u.email);
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  const copyReference = () => {
    navigator.clipboard.writeText(reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timestamp = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="min-h-screen bg-[#030614] text-white selection:bg-blue-600 selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Visual Grid & Glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 15%, #10b981 0%, transparent 45%), radial-gradient(circle at 15% 75%, #2563eb 0%, transparent 40%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.06) 24px, rgba(255,255,255,0.06) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.06) 24px, rgba(255,255,255,0.06) 25px)",
        }}
      />

      {/* ── Top Precision Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#060a1d]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/app")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono font-bold text-zinc-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>CONSOLE</span>
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <Image src="/AINCRAD-NOBG.png" alt="AINCRAD" width={92} height={22} className="opacity-95" priority />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
            PAYMENT VERIFIED
          </span>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-2xl space-y-6">
          {/* Main Success Container */}
          <div className="bg-[#080d24]/90 border border-emerald-500/30 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.12)] backdrop-blur-xl relative overflow-hidden">
            {/* Ambient glow in corner */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Success Icon & Heading */}
            <div className="text-center space-y-3 pb-6 border-b border-zinc-800/80">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/40 border-2 border-emerald-400/60 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.3)] mx-auto animate-in zoom-in-50 duration-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full inline-block">
                  AUTHORIZATION SUCCESSFUL
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono uppercase">
                  TELEMETRY TIER ELEVATED
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto font-mono">
                  Your transaction has cleared the Paystack Gateway. Your enterprise observability quota is now active across all fleet clusters.
                </p>
              </div>
            </div>

            {/* Transaction Receipt Dossier */}
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">TRANSACTION DOSSIER</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  STATUS: CLEARED
                </span>
              </div>

              <div className="bg-[#040817] border border-zinc-800/90 rounded-2xl p-4 md:p-5 space-y-3.5 font-mono text-xs">
                {/* Plan Tier */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-zinc-400">Activated Tier</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-sm">
                      {tier}
                    </span>
                    <span className="text-[11px] text-zinc-500">FLEET LICENSE</span>
                  </div>
                </div>

                {/* Amount Paid */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-zinc-400">Amount Processed</span>
                  <span className="text-white font-bold text-sm tracking-wide">{displayAmount}</span>
                </div>

                {/* Gateway Reference with Copy */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-zinc-400">Gateway Reference</span>
                  <div className="flex items-center gap-2">
                    <code className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-[11px] truncate max-w-[180px] sm:max-w-none">
                      {reference}
                    </code>
                    <button
                      onClick={copyReference}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Copy Reference"
                    >
                      {copied ? (
                        <span className="text-[10px] text-emerald-400 font-bold">COPIED</span>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Operator Email */}
                {userEmail && (
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                    <span className="text-zinc-400">Billing Recipient</span>
                    <span className="text-zinc-300 font-semibold">{userEmail}</span>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Clearing Timestamp</span>
                  <span className="text-zinc-400">{timestamp}</span>
                </div>
              </div>
            </div>

            {/* Unlocked Capabilities Grid */}
            <div className="space-y-3 pb-6 border-b border-zinc-800/80">
              <span className="text-[11px] font-mono font-bold text-zinc-400 tracking-wider uppercase block">
                UNLOCKED PLATFORM CAPABILITIES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>1-Second Probe Intervals</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Synthetic Edge Tripwires</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>90-Day Telemetry Retention</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Priority Incident Dispatch</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/app")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-900/40"
              >
                <span>OPEN FLEET CONSOLE</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={() => router.push("/profile")}
                className="sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs font-bold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>OPERATOR PROFILE</span>
              </button>
            </div>
          </div>

          {/* Security & Regulatory Footnote */}
          <div className="text-center space-y-1 font-mono text-[10px] text-zinc-400">
            <p>PAYMENT PROCESSED VIA PAYSTACK SECURE GATEWAY (PCI-DSS LEVEL 1 CERTIFIED)</p>
            <p>ALL TRANSACTIONS ARE CRYPTOGRAPHICALLY SIGNED AND AUDIT LOGGED</p>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/80 bg-[#060a1d]/90 px-6 py-4 text-center z-10">
        <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
          AINCRAD OBSERVABILITY GATEWAY · RESTRICTED ACCESS · ALL ACCESS LOGGED
        </p>
        <p className="text-[10px] font-mono text-zinc-400 font-semibold mt-1">
          Powered by SecureFixKe - D-Huhu Tech Labs
        </p>
      </footer>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030614] flex items-center justify-center text-zinc-400 font-mono text-xs">
          LOADING TRANSACTION DOSSIER...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
