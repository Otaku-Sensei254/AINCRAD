"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function FailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference") || searchParams.get("trxref") || "REF_UNASSIGNED";
  const reasonCode = searchParams.get("reason") || "AUTHORIZATION_DECLINED";
  const tier = (searchParams.get("tier") || "PRO").toUpperCase();

  const [copied, setCopied] = useState(false);

  const getReasonExplanation = (code: string) => {
    switch (code.toUpperCase()) {
      case "DECLINED":
      case "CARD_DECLINED":
        return "Your card issuer declined the transaction. This is often caused by international transaction locks or 3D-Secure authentication failure.";
      case "INSUFFICIENT_FUNDS":
        return "The payment provider reported insufficient funds or exceeded transaction limit on the selected payment method.";
      case "TIMEOUT":
      case "GATEWAY_TIMEOUT":
        return "The payment gateway communication timed out before the bank authorization could complete.";
      case "CANCELLED":
      case "USER_CANCELLED":
        return "The checkout process was cancelled before completion. No funds were debited from your card or wallet.";
      default:
        return "The payment gateway was unable to finalize this transaction. No funds were debited from your account.";
    }
  };

  const copyRef = () => {
    if (reference && reference !== "REF_UNASSIGNED") {
      navigator.clipboard.writeText(reference).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
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
    <div className="min-h-screen bg-[#030614] text-white selection:bg-red-600 selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Visual Grid & Glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 15%, #ef4444 0%, transparent 45%), radial-gradient(circle at 85% 75%, #dc2626 0%, transparent 40%)",
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
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-red-400 uppercase">
            TRANSACTION INTERRUPTED
          </span>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-2xl space-y-6">
          {/* Main Error Container */}
          <div className="bg-[#080d24]/90 border border-red-500/30 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.12)] backdrop-blur-xl relative overflow-hidden">
            {/* Ambient red glow in corner */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Error Icon & Heading */}
            <div className="text-center space-y-3 pb-6 border-b border-zinc-800/80">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border-2 border-red-500/60 text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.3)] mx-auto animate-in zoom-in-50 duration-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-red-400 tracking-widest uppercase bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full inline-block">
                  TRANSACTION INCOMPLETE
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono uppercase">
                  PAYMENT NOT PROCESSED
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto font-mono">
                  {getReasonExplanation(reasonCode)}
                </p>
              </div>
            </div>

            {/* Diagnostic Dossier */}
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">DIAGNOSTIC DOSSIER</span>
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  STATUS: REJECTED / ABORTED
                </span>
              </div>

              <div className="bg-[#040817] border border-zinc-800/90 rounded-2xl p-4 md:p-5 space-y-3.5 font-mono text-xs">
                {/* Target Tier */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-zinc-400">Target Upgrade Tier</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700">
                    {tier} FLEET LICENSE
                  </span>
                </div>

                {/* Gateway Diagnostic Reason */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-zinc-400">Diagnostic Reason</span>
                  <span className="text-red-400 font-bold">{reasonCode.toUpperCase()}</span>
                </div>

                {/* Reference Tracker */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="text-zinc-400">Reference Tracker</span>
                  <div className="flex items-center gap-2">
                    <code className="text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-[11px] truncate max-w-[180px] sm:max-w-none">
                      {reference}
                    </code>
                    {reference !== "REF_UNASSIGNED" && (
                      <button
                        onClick={copyRef}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Copy Reference"
                      >
                        {copied ? (
                          <span className="text-[10px] text-red-400 font-bold">COPIED</span>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Attempt Timestamp */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Attempt Timestamp</span>
                  <span className="text-zinc-400">{timestamp}</span>
                </div>
              </div>
            </div>

            {/* Troubleshooting Checklist */}
            <div className="space-y-3 pb-6 border-b border-zinc-800/80">
              <span className="text-[11px] font-mono font-bold text-zinc-400 tracking-wider uppercase block">
                RECOMMENDED RESOLUTION CHECKLIST
              </span>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-zinc-300">
                  <span className="text-blue-400 font-bold mt-0.5">01</span>
                  <p className="text-zinc-400">
                    <strong className="text-zinc-200">Confirm 3D-Secure / OTP:</strong> Check your phone or banking app for SMS verification codes or biometric approval prompts.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-zinc-300">
                  <span className="text-blue-400 font-bold mt-0.5">02</span>
                  <p className="text-zinc-400">
                    <strong className="text-zinc-200">Alternative Payment Rail:</strong> You can select M-Pesa, debit/credit cards, or bank transfer directly in Paystack checkout.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-zinc-300">
                  <span className="text-blue-400 font-bold mt-0.5">03</span>
                  <p className="text-zinc-400">
                    <strong className="text-zinc-200">Account Safety:</strong> No funds have been deducted from your card. You can safely re-attempt initialization.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-red-900/40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>RETRY PAYMENT AT PROFILE</span>
              </button>

              <button
                onClick={() => router.push("/app")}
                className="sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs font-bold transition-colors"
              >
                <span>RETURN TO CONSOLE</span>
              </button>
            </div>
          </div>

          {/* Support Notice */}
          <div className="text-center space-y-1 font-mono text-[10px] text-zinc-400">
            <p>NEED OPERATOR ASSISTANCE? CONTACT D-HUHU TECH LABS BILLING DISPATCH</p>
            <p>REFERENCE TRACKER CODE: {reference}</p>
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

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030614] flex items-center justify-center text-zinc-400 font-mono text-xs">
          ANALYZING TRANSACTION STATUS...
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
