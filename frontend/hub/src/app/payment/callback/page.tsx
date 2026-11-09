"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function CallbackInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [phase, setPhase] = useState<"scanning" | "success" | "failed">("scanning");
  const [statusText, setStatusText] = useState("ESTABLISHING GATEWAY HANDSHAKE...");

  useEffect(() => {
    const ref = sp.get("reference") || sp.get("trxref");
    if (!ref) {
      setPhase("failed");
      setStatusText("NO TRANSACTION REFERENCE DETECTED");
      return;
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setStatusText("VERIFYING CRYPTOGRAPHIC HMAC SIGNATURE...");

    const timer = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/billing/verify/${ref}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.status === "success") {
            setPhase("success");
            setStatusText("SIGNATURE VERIFIED · ELEVATING QUOTA...");
            const tier = d?.metadata?.tier || "PRO";
            const amount = d?.amount || "";
            setTimeout(() => {
              router.push(`/payment/success?reference=${ref}&tier=${tier}&amount=${amount}`);
            }, 1200);
          } else {
            setPhase("failed");
            setStatusText(d?.gateway_response || d?.message || "TRANSACTION REJECTED");
            setTimeout(() => {
              router.push(`/payment/failed?reference=${ref}&reason=${encodeURIComponent(d?.gateway_response || "declined")}`);
            }, 1500);
          }
        })
        .catch(() => {
          setPhase("failed");
          setStatusText("GATEWAY VERIFICATION TIMEOUT");
          setTimeout(() => {
            router.push(`/payment/failed?reference=${ref}&reason=network_timeout`);
          }, 1500);
        });
    }, 800);

    return () => clearTimeout(timer);
  }, [sp, router]);

  return (
    <div className="min-h-screen bg-[#030614] text-white flex flex-col items-center justify-center p-6 relative font-mono selection:bg-blue-600 selection:text-white">
      {/* Background Visual Effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #2563eb 0%, transparent 60%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.06) 24px, rgba(255,255,255,0.06) 25px)",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#080d24]/90 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Image src="/AINCRAD-NOBG.png" alt="AINCRAD" width={110} height={26} className="opacity-95" priority />
        </div>

        {/* Dynamic Status Beacon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          {phase === "scanning" && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
              <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-500/60 flex items-center justify-center text-blue-400 shadow-[0_0_20px_#2563eb]">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          )}

          {phase === "success" && (
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_24px_#10b981] animate-in zoom-in-50">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {phase === "failed" && (
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/60 flex items-center justify-center text-red-400 shadow-[0_0_24px_#ef4444] animate-in zoom-in-50">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="space-y-1.5">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white">
            PAYSTACK PAYMENT GATEWAY
          </h2>
          <p className="text-xs text-zinc-400">
            {statusText}
          </p>
        </div>

        {/* Progress Bar / Scan Indicator */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
          <div
            className={`h-full transition-all duration-700 ${
              phase === "success"
                ? "w-full bg-emerald-500"
                : phase === "failed"
                ? "w-full bg-red-500"
                : "w-2/3 bg-blue-600 animate-pulse"
            }`}
          />
        </div>

        {/* Manual Fallback Links */}
        <div className="pt-2 flex justify-center gap-4 text-[11px] text-zinc-400">
          <button onClick={() => router.push("/profile")} className="hover:text-zinc-200 underline">
            Profile Settings
          </button>
          <span>•</span>
          <button onClick={() => router.push("/app")} className="hover:text-zinc-200 underline">
            Fleet Console
          </button>
        </div>
      </div>

      <p className="relative z-10 text-[10px] text-zinc-400 mt-6 tracking-widest uppercase">
        Powered by SecureFixKe - D-Huhu Tech Labs
      </p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#030614] text-white font-mono text-xs">
          INITIALIZING TELEMETRY GATEWAY...
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
