"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { AppConfig, HealthResult } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── Status Definitions (Black, White, Blue & Red Palette) ───────────────────
const STATUS_CONFIG = {
  healthy: {
    label: "OPERATIONAL",
    dot: "bg-blue-600",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
  },
  degraded: {
    label: "DEGRADED",
    dot: "bg-red-500",
    badge: "text-red-700 bg-red-50 border-red-200",
  },
  down: {
    label: "OFFLINE",
    dot: "bg-red-600",
    badge: "text-white bg-red-600 border-red-700 font-bold",
  },
  unknown: {
    label: "STANDBY",
    dot: "bg-zinc-400",
    badge: "text-zinc-700 bg-zinc-100 border-zinc-200",
  },
} as const;

function IconArrowLeft() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
function IconRefresh({ spinning }: { spinning: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${spinning ? "animate-spin text-blue-600" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
function IconExternal() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function AppDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [app, setApp] = useState<AppConfig | null>(null);
  const [health, setHealth] = useState<HealthResult | null>(null);
  const [history, setHistory] = useState<{ t: string; latency: number }[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [proc, setProc] = useState<{ running: boolean; pid?: number; startedAt?: string } | null>(null);
  const [monitoring, setMonitoring] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const appRes = await (async () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const orgs = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/organizations`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : []);
            for (const o of (orgs || [])) {
              const apps = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/applications?organizationId=${o.id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : []);
              const found = (apps || []).find((a: any) => a.id === id);
              if (found) return found;
            }
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/applications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (r.ok) return r.json();
          } catch {}
        }
        const r = await fetch(`/api/apps/${id}`);
        return r.ok ? r.json() : null;
      })();

      if (appRes) setApp(appRes);

      let healthRes: any = null;
      if (appRes) {
        const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify([{ id: appRes.id, url: appRes.url, healthPath: appRes.healthPath }]) });
        if (res.ok) { const d = await res.json(); healthRes = Array.isArray(d) ? d[0] : d; }
      }
      const logsRes = await fetch(`/api/logs?id=${id}`).then((r) => (r.ok ? r.json() : { lines: [] })).catch(() => ({ lines: [] }));
      const procRes = await fetch(`/api/processes?id=${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null);

      const hr: HealthResult | null = healthRes;
      if (hr) {
        setHealth(hr);
        setHistory((prev) => {
          const next = [
            ...prev,
            { t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), latency: hr.latencyMs ?? 0 },
          ].slice(-30);
          try {
            localStorage.setItem(`hist_${id}`, JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      setLogs(logsRes?.lines ?? []);
      setProc(procRes);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    try {
      const savedHist = localStorage.getItem(`hist_${id}`);
      if (savedHist) setHistory(JSON.parse(savedHist));
    } catch {}

    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData, id]);

  async function handleToggleProc(action: "start" | "stop") {
    try {
      await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading && !app) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center text-zinc-600 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold">SYNCING TELEMETRY STREAM...</span>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-sm font-bold text-red-600 font-mono">TARGET NOT FOUND</h2>
        <p className="text-xs text-zinc-500 mt-1 mb-4">Service endpoint identifier does not exist.</p>
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1.5 bg-black text-white rounded text-xs font-bold"
        >
          RETURN TO HUB
        </button>
      </div>
    );
  }

  const statusKey = (health?.status ?? "unknown") as keyof typeof STATUS_CONFIG;
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.unknown;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-900 flex flex-col antialiased">
      {/* ── Precision Navbar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-xs font-bold text-white transition-colors shadow-2xs"
          >
            <IconArrowLeft />
            <span>HUB</span>
          </button>

          <div className="h-4 w-px bg-zinc-200" />

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-zinc-950 uppercase">{app.name}</h1>
            <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
              {app.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded border ${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span>{status.label}</span>
          </div>

          <button
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 transition-colors shadow-2xs disabled:opacity-50"
          >
            <IconRefresh spinning={refreshing} />
            <span>SYNC</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace ─────────────────────────────────────────────────── */}
      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Left: Primary Content Column ── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Telemetry Stats Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">STATE</span>
              <div className={`text-xl font-black font-mono mt-1 ${statusKey === "healthy" ? "text-blue-600" : "text-red-600"}`}>
                {status.label}
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block font-mono font-medium">
                {health?.checkedAt ? new Date(health.checkedAt).toLocaleTimeString() : "Unsynced"}
              </span>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">LATENCY (RTT)</span>
              <div className="text-xl font-black font-mono text-zinc-950 mt-1">
                {health?.latencyMs !== undefined ? `${health.latencyMs} ms` : "—"}
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block font-mono font-medium">
                {health?.latencyMs ? (health.latencyMs < 300 ? "Optimal response" : "Latency alert") : "No response"}
              </span>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">HTTP CODE</span>
              <div className={`text-xl font-black font-mono mt-1 ${health?.statusCode && health.statusCode < 400 ? "text-blue-600" : "text-red-600"}`}>
                {health?.statusCode ?? "—"}
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block font-mono font-medium">
                {health?.statusCode === 200 ? "200 SUCCESS" : health?.message || "Probe result"}
              </span>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">PROCESS</span>
              <div className={`text-xl font-black font-mono mt-1 ${proc?.running ? "text-blue-600" : "text-zinc-600"}`}>
                {proc?.running ? "RUNNING" : "STOPPED"}
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block font-mono font-medium">
                {proc?.pid ? `PID: ${proc.pid}` : app.command ? "Command bound" : "No subprocess"}
              </span>
            </div>
          </div>

          {/* SSL + Response */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 font-mono">SSL CERTIFICATE</h3>
              {health?.ssl ? (
                <div className="text-xs font-mono space-y-1">
                  <div>Status: {health.ssl.valid ? "Valid" : "Invalid"}</div>
                  <div>Days remaining: {health.ssl.daysRemaining}</div>
                  {health.ssl.issuer && <div>Issuer: {health.ssl.issuer}</div>}
                  {health.ssl.error && <div className="text-red-600">{health.ssl.error}</div>}
                </div>
              ) : (
                <div className="text-xs text-zinc-400 font-mono">No SSL data (HTTP or not checked)</div>
              )}
            </div>
            <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 font-mono">ENDPOINT RESPONSE</h3>
              <pre className="text-xs font-mono text-zinc-700 whitespace-pre-wrap break-all max-h-40 overflow-auto">{health?.body ?? "—"}</pre>
            </div>
          </div>

          {/* Configuration Specs + Latency History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Endpoint Details */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 font-mono">
                  CONFIGURATION
                </h3>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Target URL</span>
                    {app.url ? (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline font-bold"
                      >
                        <span>{app.url}</span>
                        <IconExternal />
                      </a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Probe Route</span>
                    <span className="text-zinc-900 font-bold">{app.healthPath || "/health"}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-100">
                    <span className="text-zinc-500">Command</span>
                    <span className="text-zinc-900 truncate max-w-[180px] font-bold">{app.command || "None"}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-zinc-500">Log Route</span>
                    <span className="text-zinc-900 truncate max-w-[180px] font-bold">{app.logPath || "None"}</span>
                  </div>
                </div>
              </div>

              {app.command && (
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleProc("start")}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    START PROCESS
                  </button>
                  <button
                    onClick={() => handleToggleProc("stop")}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-2xs"
                  >
                    STOP PROCESS
                  </button>
                </div>
              )}
            </div>

            {/* Latency History Chart */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  RTT LATENCY TREND
                </h3>
                <span className="text-[10px] font-mono text-zinc-400 font-bold">15S INTERVAL</span>
              </div>

              {history.length < 2 ? (
                <div className="h-44 flex items-center justify-center text-xs text-zinc-400 font-mono">
                  Gathering telemetry samples...
                </div>
              ) : (
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#e4e4e7" />
                      <XAxis dataKey="t" stroke="#71717a" fontSize={10} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} unit="ms" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#000000",
                          borderColor: "#27272a",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontFamily: "monospace",
                          color: "#ffffff",
                        }}
                        formatter={(val: unknown) => [`${val}ms`, "RTT"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#2563eb" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="text-[11px] font-mono text-zinc-400 text-right mt-1 font-bold">
                STREAM SAMPLES: {history.length}
              </div>
            </div>
          </div>

          {/* Live Output Log Terminal */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  SYSTEM CONSOLE OUTPUT
                </h3>
                {app.logPath && (
                  <span className="font-mono text-[11px] text-zinc-400">
                    [{app.logPath}]
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-zinc-400 font-bold">
                {logs.length} LINES
              </span>
            </div>

            <div className="bg-black border border-zinc-900 rounded-lg p-4 h-72 overflow-y-auto font-mono text-xs leading-relaxed text-zinc-200 shadow-inner">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 font-bold">
                  // NO LOG ENTRIES REGISTERED
                </div>
              ) : (
                logs.map((line, idx) => (
                  <div key={idx} className="hover:bg-zinc-900 px-1 py-0.5 rounded flex">
                    <span className="w-8 text-zinc-600 select-none text-right mr-3 shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre-wrap break-all">{line}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>{/* /left column */}

        {/* ── Right: Integration Credentials Sticky Panel ── */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0">
          <div className="sticky top-20 space-y-4">

            {/* Credentials Card */}
            <div className="bg-white border border-zinc-200/90 rounded-xl shadow-xs overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-zinc-950 border-b border-zinc-800">
                <span className={`w-2 h-2 rounded-full shrink-0 ${monitoring ? "bg-blue-500 shadow-[0_0_6px_#3b82f6]" : "bg-zinc-500"}`} />
                <span className="text-[10px] font-bold tracking-widest font-mono text-zinc-100 uppercase">
                  Integration Credentials
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* APP_ID row */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono mb-1">APP_ID</span>
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
                    <code className="text-[11px] font-mono text-zinc-800 font-bold flex-1 truncate">
                      {app?.id ?? "—"}
                    </code>
                    <button
                      title="Copy APP_ID"
                      onClick={() => { if (app?.id) navigator.clipboard.writeText(app.id); }}
                      className="shrink-0 p-1 rounded hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Ingestion Token row */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono mb-1">INGESTION TOKEN</span>
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2">
                    <code className="text-[11px] font-mono text-zinc-800 font-bold flex-1 truncate">
                      {app?.apiKey ? `ing_${app.apiKey}` : "—"}
                    </code>
                    <button
                      title="Copy token"
                      onClick={() => { if (app?.apiKey) navigator.clipboard.writeText(`ing_${app.apiKey}`); }}
                      className="shrink-0 p-1 rounded hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-100" />

                {/* Monitoring toggle */}
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono mb-2">PROBE STATUS</span>
                  <button
                    onClick={() => setMonitoring(!monitoring)}
                    className={`w-full px-3 py-2 text-xs font-bold rounded-lg border transition-all font-mono ${
                      monitoring
                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {monitoring ? "⏸  PAUSE MONITORING" : "▶  RESUME MONITORING"}
                  </button>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1.5 text-center">
                    {monitoring ? "Actively probing every 15s" : "Probing suspended"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick-link to target */}
            {app.url && (
              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-xs font-bold font-mono text-zinc-700 hover:text-blue-700 transition-all shadow-xs"
              >
                <IconExternal />
                OPEN TARGET ENDPOINT
              </a>
            )}

          </div>
        </aside>

      </main>
    </div>
  );
}

export default function AppDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center text-zinc-600 font-mono text-xs">
          SYNCING...
        </div>
      }
    >
      <AppDetailContent />
    </Suspense>
  );
}
