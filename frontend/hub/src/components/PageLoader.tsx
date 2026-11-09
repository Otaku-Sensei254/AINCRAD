"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(15);
  const [stage, setStage] = useState("INIT_CORE_ENGINE");

  useEffect(() => {
    // Quick, high-speed telemetry boot sequence
    const t1 = setTimeout(() => {
      setProgress(55);
      setStage("PROBING_DISTRIBUTED_EDGES");
    }, 180);

    const t2 = setTimeout(() => {
      setProgress(88);
      setStage("SYNCHRONIZING_TRIPWIRES");
    }, 360);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStage("SYS_OPERATIONAL");
    }, 520);

    const t4 = setTimeout(() => {
      setLoading(false);
    }, 720);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-[#02040b] text-white flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300 ${
        progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Laser Top Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-blue-500 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(239,68,68,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-sm w-full text-center flex flex-col items-center">
        {/* Animated Brand Emblem with AINCRAD-APP-LOGO */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-black/80 border border-zinc-800/90 p-3.5 flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
            <Image
              src="/AINCRAD-APP-LOGO.png"
              alt="AINCRAD Emblem"
              width={140}
              height={140}
              priority
              className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_16px_rgba(239,68,68,0.6)]"
            />
          </div>
          {/* Subtle pulse rings */}
          <div className="absolute -inset-3 rounded-3xl border border-red-500/30 animate-ping pointer-events-none" />
          <div className="absolute -inset-2 rounded-3xl bg-red-600/15 blur-md pointer-events-none" />
        </div>

        {/* Lockup Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono font-black text-lg tracking-wider text-white">AINCRAD</span>
          <span className="text-[10px] font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-950/80 border border-red-900 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
            OBSERVABILITY
          </span>
        </div>

        {/* Dynamic Telemetry Stage Status */}
        <div className="font-mono text-xs text-zinc-400 tracking-wider uppercase mb-5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
          <span>{stage}</span>
        </div>

        {/* Progress Bar with Percentage */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[10px] text-zinc-500">
          <span>PORT 443 / TLS 1.3</span>
          <span className="font-bold text-red-400">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
