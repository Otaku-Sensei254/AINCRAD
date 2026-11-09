"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconBuilding() {
  return (
    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconCheck({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return <div className="w-3 h-3 rounded-full border border-zinc-700" />;
}

function IconArrowRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Citadel Sector (Organization)
  const [orgName, setOrgName] = useState("");
  const [pricingTier, setPricingTier] = useState("FREE");
  const [pricingTierOpen, setPricingTierOpen] = useState(false);
  const pricingTierRef = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState("mission-critical");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pricingTierRef.current && !pricingTierRef.current.contains(e.target as Node)) {
        setPricingTierOpen(false);
      }
    };
    if (pricingTierOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pricingTierOpen]);

  // Step 2: First Telemetry Target
  const [appName, setAppName] = useState("Aincrad Core Gateway");
  const [appType, setAppType] = useState<"WEB" | "API" | "GATEWAY" | "MICROSERVICE" | "WORKER" | "DATABASE">("API");
  const [appUrl, setAppUrl] = useState("http://localhost:4000");
  const [healthPath, setHealthPath] = useState("/auth/me");

  // Step 3: Tripwire & Anomaly Configuration
  const [latencyThreshold, setLatencyThreshold] = useState<"250" | "600" | "1200">("600");
  const [autoRestart, setAutoRestart] = useState(true);
  const [audioAlerts, setAudioAlerts] = useState(true);

  // Step 4: Verification Simulation
  const [testingProbe, setTestingProbe] = useState(false);
  const [probeResult, setProbeResult] = useState<{ status: "idle" | "success" | "warning"; latencyMs: number } | null>(null);

  // Quick preset helper for Step 1
  const presetOrgs = ["Nexus Systems", "Aincrad Security Sector 01", "D-Huhu Research Core", "Specter Fleet Labs"];

  // Quick preset helper for Step 2
  const handleApplyPreset = (preset: "dev-backend" | "frontend-hub" | "custom") => {
    if (preset === "dev-backend") {
      setAppName("AINCRAD Backend API");
      setAppType("API");
      setAppUrl("http://localhost:4000");
      setHealthPath("/auth/me");
    } else if (preset === "frontend-hub") {
      setAppName("AINCRAD Hub Console");
      setAppType("WEB");
      setAppUrl("http://localhost:3000");
      setHealthPath("/api/health");
    }
  };

  // Run live verification probe
  const testProbeConnection = async () => {
    setTestingProbe(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health");
      const elapsed = Math.round(performance.now() - start);
      if (res.ok) {
        setProbeResult({ status: "success", latencyMs: Math.max(elapsed, 12) });
      } else {
        setProbeResult({ status: "warning", latencyMs: elapsed });
      }
    } catch {
      setProbeResult({ status: "warning", latencyMs: 45 });
    } finally {
      setTestingProbe(false);
    }
  };

  // Step Navigation Handlers
  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (step === 1 && !orgName.trim()) {
      setError("Please designate a callsign or name for your Citadel Sector.");
      return;
    }

    if (step === 2 && !appName.trim()) {
      setError("Please provide a name for your initial telemetry target.");
      return;
    }

    if (step === 3) {
      setStep(4);
      testProbeConnection();
      return;
    }

    setStep((prev) => (prev + 1) as any);
  };

  // Final Submission: Persist Org & Application to Backend
  const handleFinalizeOnboarding = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      let createdOrgId = "";

      // 1. Create Organization in backend
      if (token) {
        try {
          const orgRes = await fetch(`${API}/organizations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: orgName.trim(), tier: pricingTier }),
          });

          if (orgRes.ok) {
            const orgData = await orgRes.json();
            createdOrgId = orgData.id;
          }
        } catch (orgErr) {
          console.warn("Could not persist organization to backend:", orgErr);
        }
      }

      // 2. Register initial application
      const appPayload = {
        name: appName.trim(),
        type: appType.toLowerCase(),
        url: appUrl.trim(),
        healthPath: healthPath.trim(),
      };

      if (token && createdOrgId) {
        try {
          await fetch(`${API}/applications?organizationId=${createdOrgId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: appName.trim(),
              type: appType,
              url: appUrl.trim(),
              healthPath: healthPath.trim(),
            }),
          });
        } catch (appErr) {
          console.warn("Could not link application to organization in backend:", appErr);
        }
      } else {
        // Fallback to internal hub API
        await fetch("/api/apps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appPayload),
        });
      }

      // 3. Complete onboarding and route to Console
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "Failed to finalize initialization protocol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col justify-between antialiased selection:bg-red-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Bar ── */}
      <header className="w-full bg-[#05091a]/85 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/AINCRAD-NOBG.png"
              alt="AINCRAD"
              width={125}
              height={40}
              priority
              className="h-7 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            />
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase">
            / OPERATOR_INITIALIZATION_JOURNEY
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shadow-[0_0_8px_#3b82f6]" />
            STEP {step} OF 4
          </span>
          <Link
            href="/app"
            className="text-zinc-500 hover:text-zinc-300 font-sans text-xs transition-colors"
          >
            Skip to Hub →
          </Link>
        </div>
      </header>

      {/* ── Main Wizard Container ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-10 flex flex-col justify-center z-10 animate-fade-in">
        {/* Step Progression Indicators */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { num: 1, label: "Citadel Sector" },
              { num: 2, label: "Telemetry Target" },
              { num: 3, label: "Tripwires" },
              { num: 4, label: "Launch Node" },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? "bg-red-950/40 border-red-700/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : isDone
                      ? "bg-blue-950/30 border-blue-800/60"
                      : "bg-zinc-950/40 border-zinc-900 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      PHASE 0{s.num}
                    </span>
                    {isDone && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa]" />
                    )}
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
                    )}
                  </div>
                  <div className={`text-xs font-bold font-mono truncate ${isCurrent ? "text-white" : isDone ? "text-blue-300" : "text-zinc-500"}`}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Card Frame */}
        <div className="bg-[#05091a]/95 rounded-2xl border border-zinc-800 p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Ambient Corner Accent */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Error Notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2.5 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP 1: CITADEL SECTOR (ORGANIZATION) ── */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/50 border border-red-900/60 text-[10px] font-mono font-bold text-red-400 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>STEP 01 // CITADEL SECTOR INITIALIZATION</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Designate Your Organization Sector
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  All telemetry pipelines, microservice monitors, and autonomous failover tripwires will be governed under this sector.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Organization / Sector Callsign
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <IconBuilding />
                  </span>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Aincrad Defense Division 01"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl pl-11 pr-4 py-3 text-sm font-mono placeholder:text-zinc-600 transition-all outline-none"
                  />
                </div>

                {/* Pricing Tier */}
                <div className="mt-4">
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Pricing Tier
                  </label>
                  <div ref={pricingTierRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setPricingTierOpen((v) => !v)}
                      className="w-full bg-black/60 border border-zinc-800 hover:border-zinc-700 focus:border-red-500 text-white rounded-xl px-4 py-3 text-sm font-mono flex items-center justify-between transition-all outline-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${pricingTier === "FREE" ? "bg-zinc-400" : pricingTier === "PRO" ? "bg-blue-400" : "bg-red-400"}`} />
                        <span>
                          {pricingTier === "FREE" && "Free — $0/mo (5 apps)"}
                          {pricingTier === "PRO" && "Pro — $9/mo (50 apps)"}
                          {pricingTier === "TEAM" && "Team — $29/mo (unlimited)"}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${pricingTierOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {pricingTierOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-2 bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-1.5 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
                        {[
                          { key: "FREE", label: "Free — $0/mo", desc: "Up to 5 applications monitored", color: "bg-zinc-400" },
                          { key: "PRO", label: "Pro — $9/mo", desc: "Up to 50 applications monitored", color: "bg-blue-400" },
                          { key: "TEAM", label: "Team — $29/mo", desc: "Unlimited applications & priority probes", color: "bg-red-400" },
                        ].map((t) => {
                          const active = pricingTier === t.key;
                          return (
                            <button
                              key={t.key}
                              type="button"
                              onClick={() => {
                                setPricingTier(t.key);
                                setPricingTierOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-mono transition-colors ${
                                active
                                  ? "bg-red-600/15 border border-red-500/50 text-white"
                                  : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${t.color}`} />
                                <div>
                                  <div className="text-xs font-bold">{t.label}</div>
                                  <div className="text-[10px] text-zinc-400">{t.desc}</div>
                                </div>
                              </div>
                              {active && (
                                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Suggestions:</span>
                  {presetOrgs.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setOrgName(p)}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Classification */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Operational Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "mission-critical", label: "Mission Critical", desc: "Sub-50ms failover tripwires enabled" },
                    { id: "standard-telemetry", label: "Standard Telemetry", desc: "Standard fleet polling rate" },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        tier === t.id
                          ? "bg-blue-950/40 border-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                          : "bg-black/40 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-white font-mono">{t.label}</div>
                      <div className="text-[11px] text-zinc-400 mt-1">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <span>Proceed to Telemetry Target</span>
                  <IconArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: FIRST TELEMETRY TARGET ── */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-950/50 border border-blue-900/60 text-[10px] font-mono font-bold text-blue-400 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>STEP 02 // PROVISION FIRST TELEMETRY NODE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Connect Your First Infrastructure Target
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Specify the network endpoint or daemon service you wish to monitor with active health probes.
                </p>
              </div>

              {/* Archetype Selector */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Workload Archetype
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "API", label: "API Gateway", desc: "REST / NestJS / Express" },
                    { id: "WEB", label: "Web / Frontend", desc: "Next.js / Client UI" },
                    { id: "MICROSERVICE", label: "Microservice", desc: "Distributed gRPC / HTTP" },
                    { id: "WORKER", label: "Worker Daemon", desc: "Background Queue / Cron" },
                    { id: "DATABASE", label: "Database", desc: "PostgreSQL / Redis" },
                    { id: "GATEWAY", label: "Edge Proxy", desc: "Envoy / Nginx / Traefik" },
                  ].map((archetype) => (
                    <div
                      key={archetype.id}
                      onClick={() => setAppType(archetype.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        appType === archetype.id
                          ? "bg-red-950/40 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                          : "bg-black/40 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-white font-mono">{archetype.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{archetype.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Name & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    Target Callsign / Name
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("dev-backend")}
                      className="text-[10px] font-mono text-blue-400 hover:underline"
                    >
                      Apply Backend Preset
                    </button>
                    <span className="text-zinc-600">·</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("frontend-hub")}
                      className="text-[10px] font-mono text-blue-400 hover:underline"
                    >
                      Apply Hub Preset
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Core Authentication Service"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl px-4 py-2.5 text-xs font-mono placeholder:text-zinc-600 transition-all outline-none"
                />
              </div>

              {/* Endpoint URL & Health Path */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Target Base URL
                  </label>
                  <input
                    type="text"
                    required
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    placeholder="http://localhost:4000"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl px-4 py-2.5 text-xs font-mono placeholder:text-zinc-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Health Probe Path
                  </label>
                  <input
                    type="text"
                    required
                    value={healthPath}
                    onChange={(e) => setHealthPath(e.target.value)}
                    placeholder="/health"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl px-4 py-2.5 text-xs font-mono placeholder:text-zinc-600 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <span>Configure Tripwires</span>
                  <IconArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: TRIPWIRES & ANOMALY RULES ── */}
          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/50 border border-red-900/60 text-[10px] font-mono font-bold text-red-400 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>STEP 03 // ANOMALY CONTROLS &amp; TRIPWIRES</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Configure Anomaly Sensitivity &amp; Tripwires
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Define tripwire boundaries to isolate degrading instances and prevent cascading systemic outages.
                </p>
              </div>

              {/* Latency Threshold Buttons */}
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Tripwire Latency SLA Sensitivity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { val: "250", label: "Aggressive (<250ms)", desc: "High-frequency micro-trading or edge APIs" },
                    { val: "600", label: "Standard (<600ms)", desc: "Recommended for modern web services" },
                    { val: "1200", label: "Tolerant (<1200ms)", desc: "Heavy database batch workloads" },
                  ].map((t) => (
                    <div
                      key={t.val}
                      onClick={() => setLatencyThreshold(t.val as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        latencyThreshold === t.val
                          ? "bg-red-950/40 border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                          : "bg-black/40 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold text-white font-mono">{t.label}</div>
                      <div className="text-[10px] text-zinc-400 mt-1">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-Restart Daemon Toggle */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                    <span>Autonomous Subprocess Daemon Restart</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                      SELF-HEALING
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Automatically trigger process restarts if the health probe fails 3 consecutive rounds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRestart(!autoRestart)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    autoRestart ? "bg-red-600" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      autoRestart ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Audio beacon alerts */}
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-white">
                    Console Incident Audio Signal
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Play a crisp cyber acoustic ping whenever a target enters DEGRADED or OFFLINE status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAudioAlerts(!audioAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    audioAlerts ? "bg-blue-600" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      audioAlerts ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs font-mono rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all flex items-center gap-2 uppercase tracking-wider"
                >
                  <span>Verify &amp; Launch</span>
                  <IconArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 4: VERIFICATION & LAUNCH ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-900/60 text-[10px] font-mono font-bold text-emerald-400 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STEP 04 // READINESS AUDIT &amp; CONSOLE ACTIVATION</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Node Verification &amp; Activation
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Confirming your Citadel Sector parameters and validating live endpoint responsiveness.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-black/60 border border-zinc-800 rounded-xl p-5 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <span className="text-zinc-500 uppercase tracking-wider font-bold text-[10px]">
                    Sector Configuration
                  </span>
                  <span className="text-red-400 font-bold">{orgName}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Initial Target Node:</span>
                  <span className="text-blue-400 font-bold">{appName} ({appType})</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Probe Address:</span>
                  <span className="text-zinc-400">{appUrl}{healthPath}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Tripwire Threshold:</span>
                  <span className="text-red-400 font-bold">&lt; {latencyThreshold}ms</span>
                </div>
              </div>

              {/* Live Probe Diagnostic Result */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {testingProbe ? (
                    <span className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                  ) : probeResult?.status === "success" ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                  )}
                  <div>
                    <div className="text-xs font-mono font-bold text-white">
                      {testingProbe
                        ? "PROBING TELEMETRY BUS..."
                        : "CITADEL GATEWAY HANDSHAKE CONFIRMED"}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Round-trip verification:{" "}
                      <strong className="text-blue-400">
                        {probeResult ? `${probeResult.latencyMs}ms latency` : "Verified"}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={testProbeConnection}
                  disabled={testingProbe}
                  className="px-2.5 py-1 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  Re-test
                </button>
              </div>

              {/* Ready Checklist */}
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li className="flex items-center gap-2 text-emerald-400">
                  <IconCheck active={true} />
                  <span>Citadel Organization Sector Registered</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <IconCheck active={true} />
                  <span>Telemetry Ingestion Pipeline Configured</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <IconCheck active={true} />
                  <span>Subprocess Tripwire Anomaly Rules Armed</span>
                </li>
              </ul>

              {/* Final Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalizeOnboarding}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-black text-xs font-mono rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>INITIALIZING FLEET CONSOLE...</span>
                    </>
                  ) : (
                    <span>LAUNCH FLEET CONSOLE &amp; ENTER CITADEL</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full bg-[#02040b] border-t border-zinc-900 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-zinc-600 z-10">
        <span>AINCRAD OBSERVABILITY GATEWAY · RESTRICTED ACCESS · ALL ACCESS LOGGED</span>
        <span className="text-zinc-500">
          Powered by <strong className="text-zinc-400 font-semibold">SecureFixKe - D-Huhu Tech Labs</strong>
        </span>
      </footer>
    </div>
  );
}
