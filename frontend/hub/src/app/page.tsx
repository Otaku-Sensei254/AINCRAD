"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

// ─── Precision Technical SVG Icons ──────────────────────────────────────────
function IconServer() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth={3} />
      <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth={3} />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronDown({ open }: { open: boolean }) {
  return (
    <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180 text-blue-400" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// ─── Hero Feature Pill Icons ────────────────────────────────────────────────
function IconHeartPulse() {
  return (
    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3.5l2-6 3.5 13 3-9 2 4.5 2-2.5H21" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
      <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" />
    </svg>
  );
}

function IconObservability() {
  return (
    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Code Snippets Data ─────────────────────────────────────────────────────
const CODE_SNIPPETS: Record<string, { lang: string; code: string }> = {
  curl: {
    lang: "bash",
    code: `# Ping the telemetry gateway
curl -X POST https://hub.aincrad.dev/api/track \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "billing-gateway",
    "status": "healthy",
    "latencyMs": 42
  }'`,
  },
  node: {
    lang: "javascript",
    code: `// Node.js / Express Auto-Telemetry
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

app.listen(4000);`,
  },
  python: {
    lang: "python",
    code: `# Python FastAPI Probe Route
from fastapi import FastAPI
import time

app = FastAPI()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "cluster": "node-us-east-1"
    }`,
  },
  nextjs: {
    lang: "typescript",
    code: `// Next.js App Router: app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    checkedAt: new Date().toISOString()
  });
}`,
  },
};

// ─── Interactive Terminal CLI Preset Commands ────────────────────────────────
const CLI_COMMANDS = [
  {
    cmd: "aincrad probe --fleet",
    desc: "Verify all registered endpoints across 4 global edge zones",
    output: [
      "[INFO] Dispatching 24 synthetic heartbeats...",
      "✓ [us-east-1] auth-gateway.internal    -> 24ms  [200 OK]",
      "✓ [eu-central] order-queue-worker      -> 112ms [200 OK]",
      "✓ [us-east-1] payments-db-primary      -> 14ms  [200 OK]",
      "✓ [ap-east-1] notifications-relay      -> 38ms  [200 OK]",
      "============================================================",
      "RESULT: 4/4 services verified. Jitter: 1.2ms. Zero packet loss.",
    ],
  },
  {
    cmd: "aincrad tripwire --status",
    desc: "Check active circuit breaker tripwires and threshold breaches",
    output: [
      "[AUDIT] Scanning active circuit breaker tripwires...",
      "● TRIPWIRE #01: Latency threshold > 450ms   -> [ARMED / PASSIVE]",
      "● TRIPWIRE #02: HTTP 5xx error rate > 1.5%  -> [ARMED / PASSIVE]",
      "● TRIPWIRE #03: Subprocess PID crash loop   -> [ARMED / ACTIVE]",
      "============================================================",
      "STATUS: All cascading failure trips nominal. 0 anomalies detected.",
    ],
  },
  {
    cmd: "aincrad restart order-worker",
    desc: "Issue Unix SIGTERM and spawn replacement process via daemon",
    output: [
      "[DAEMON] Sending SIGTERM to PID 48109 (order-queue-worker)...",
      "[DAEMON] Process terminated cleanly. Flushing telemetry buffers...",
      "[DAEMON] Spawning child process: npm run worker:start...",
      "✓ [PID 48214] Process alive. Memory allocated: 128MB.",
      "✓ Heartbeat resumed in 320ms. Route /health responding 200 OK.",
    ],
  },
  {
    cmd: "aincrad export --json",
    desc: "Dump fleet operational configuration and endpoint telemetry",
    output: [
      `{
  "fleet": "aincrad-production",
  "nodes_total": 4,
  "cluster_rtt_avg_ms": 18.4,
  "tripwire_armed": true,
  "last_synchronized": "${new Date().toISOString()}"
}`,
    ],
  },
];

// ─── Live Simulator Sample Data ─────────────────────────────────────────────
const INITIAL_SIMULATOR = [
  { id: "s1", name: "auth-gateway.internal", status: "OPERATIONAL", latency: 24, code: 200, region: "US-EAST" },
  { id: "s2", name: "order-queue-worker", status: "OPERATIONAL", latency: 118, code: 200, region: "EU-CENTRAL" },
  { id: "s3", name: "payments-db-primary", status: "OPERATIONAL", latency: 14, code: 200, region: "US-EAST" },
  { id: "s4", name: "notification-dispatcher", status: "DEGRADED", latency: 540, code: 429, region: "AP-EAST" },
];

export default function HomePage() {
  const [activeCodeTab, setActiveCodeTab] = useState("curl");
  const [copied, setCopied] = useState(false);
  const [nodes, setNodes] = useState(INITIAL_SIMULATOR);
  const [simulating, setSimulating] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Interactive Terminal State
  const [activeCliIndex, setActiveCliIndex] = useState(0);
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [visibleCliLogs, setVisibleCliLogs] = useState<string[]>(CLI_COMMANDS[0].output);

  // Interactive Chaos Outage Simulation State
  const [chaosNodeId, setChaosNodeId] = useState<string | null>(null);
  const [chaosStatus, setChaosStatus] = useState<string>("SYSTEM ALL NOMINAL");

  // Track page scroll percentage for top progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live simulator pulse
  const triggerProbePulse = () => {
    setSimulating(true);
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          latency: Math.floor(Math.random() * (n.status === "DEGRADED" ? 600 : 70)) + 12,
        }))
      );
      setSimulating(false);
    }, 400);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runCliCommand = (idx: number) => {
    setActiveCliIndex(idx);
    setTerminalRunning(true);
    setVisibleCliLogs(["Executing: " + CLI_COMMANDS[idx].cmd + "..."]);
    setTimeout(() => {
      setVisibleCliLogs(CLI_COMMANDS[idx].output);
      setTerminalRunning(false);
    }, 400);
  };

  // Chaos injection simulator: trigger failure & watch autonomous recovery
  const triggerChaosTest = (nodeId: string) => {
    setChaosNodeId(nodeId);
    setChaosStatus("TRIPWIRE TRIGGERED: Latency spike > 1,200ms");

    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, status: "OFFLINE", latency: 1420, code: 503 }
          : n
      )
    );

    setTimeout(() => {
      setChaosStatus("AUTONOMOUS ENGINE: Initiating PID restart & proxy failover...");
    }, 1200);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? { ...n, status: "OPERATIONAL", latency: 19, code: 200 }
            : n
        )
      );
      setChaosStatus("RECOVERED IN 1.8s: Zero downstream errors. Cluster nominal.");
      setChaosNodeId(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col antialiased selection:bg-red-600 selection:text-white">
      {/* ── Dynamic Top Scroll Progress Indicator ──────────────────────────── */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-red-600 z-[60] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(239,68,68,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── Section 1: Hero Section (Matching Hero-sample.png) ──────────────── */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#030614]">
        {/* Background Image: Floating Castle */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Floating-Castle-hero.png"
            alt="AINCRAD Floating Castle"
            fill
            priority
            quality={95}
            className="object-cover object-right md:object-center select-none pointer-events-none"
          />
          {/* Deep Vignette Overlays to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030614]/95 via-[#030614]/75 to-transparent/30 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#030614]/85 via-[#030614]/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#030614] via-[#030614]/80 to-transparent pointer-events-none" />
        </div>

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <header className="w-full z-40 px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/AINCRAD-NOBG.png"
              alt="AINCRAD"
              width={160}
              height={53}
              priority
              className="h-7 sm:h-9 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
            />
          </Link>

          <div className="flex items-center gap-6 sm:gap-8">
            <nav className="hidden md:flex items-center gap-7 text-xs font-bold tracking-widest text-zinc-300 uppercase">
              <a href="#features" className="hover:text-white transition-colors">
                FEATURES
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                PRICING
              </a>
              <Link href="/docs" className="hover:text-white transition-colors">
                DOCS
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                LOGIN
              </Link>
            </nav>

            <Link
              href="/register"
              className="px-5 py-2 rounded-full border border-red-500/80 hover:border-red-400 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_18px_rgba(239,68,68,0.3)] hover:bg-red-500/10 active:scale-95"
            >
              GET STARTED
            </Link>
          </div>
        </header>

        {/* ── Far Right Vertical Japanese Text Accent (from Hero-sample.png) ── */}
        <div className="hidden lg:flex flex-col items-center absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none">
          <div className="w-[1.5px] h-14 bg-gradient-to-b from-transparent via-red-500 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] mb-3" />
          <div
            className="text-[13px] font-mono font-bold tracking-[0.35em] text-zinc-300 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]"
            style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
          >
            アインクラッド
          </div>
          <div className="w-[1.5px] h-14 bg-gradient-to-t from-transparent via-red-500 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] mt-3" />
        </div>

        {/* ── Main Hero Content ───────────────────────────────────────────── */}
        <div className="relative z-10 max-w-3xl px-6 sm:px-12 lg:px-16 pt-8 md:pt-14 pb-8 flex-1 flex flex-col justify-center">
          {/* Eyebrow Label with red accent lines */}
          <ScrollReveal delay={60} distance={15}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-[1.5px] bg-red-500 inline-block" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-300 uppercase font-semibold">
                LEVEL-100 OBSERVABILITY &amp; AUTONOMOUS FLEET CONTROL
              </span>
              <span className="w-6 h-[1.5px] bg-red-500 inline-block" />
            </div>
          </ScrollReveal>

          {/* Headline with vibrant gradient */}
          <ScrollReveal delay={140} distance={20}>
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent leading-[1.08]">
              Every Service Linked. One Command Hub.
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal delay={220} distance={20}>
            <p className="mt-5 text-sm sm:text-base text-zinc-300/90 max-w-xl leading-relaxed font-normal">
              Ascend beyond blind spots. Synthetic heartbeat probes, real-time RTT telemetry, and autonomous tripwire mitigation — engineered so your distributed fleet never falls.
            </p>
          </ScrollReveal>

          {/* Action CTA Buttons */}
          <ScrollReveal delay={300} distance={20}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3.5 bg-gradient-to-r from-[#ef4444] to-[#f43f5e] hover:from-[#dc2626] hover:to-[#e11d48] text-white font-bold text-xs tracking-wider rounded-full shadow-[0_0_30px_rgba(239,68,68,0.45)] transition-all flex items-center gap-2 transform hover:scale-[1.02] active:scale-95 uppercase"
              >
                <span>INITIALIZE FLEET</span>
                <IconArrowRight />
              </Link>
              <Link
                href="/docs"
                className="px-8 py-3.5 bg-black/40 hover:bg-white/10 border border-zinc-700/80 hover:border-zinc-400 text-zinc-200 font-bold text-xs tracking-wider rounded-full transition-all backdrop-blur-md flex items-center gap-2 uppercase"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <IconArrowRight />
              </Link>
            </div>
          </ScrollReveal>

          {/* ── 4 Feature Pills Row ── */}
          <ScrollReveal delay={380} distance={20}>
            <div className="mt-12 pt-8 border-t border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-5">
              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0 mt-0.5">
                  <IconHeartPulse />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Sub-Millisecond RTT</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">Continuous edge probes</div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0 mt-0.5">
                  <IconLayers />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Fleet Mesh Topology</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">APIs, DBs &amp; daemons</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-800/80 flex items-center justify-center shrink-0 mt-0.5">
                  <IconAnalytics />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Live Diagnostics</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">Traffic &amp; latency streams</div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-950/60 border border-blue-800/80 flex items-center justify-center shrink-0 mt-0.5">
                  <IconObservability />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Autonomous Tripwires</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">Instant circuit isolation</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Hero Bottom Metadata Strip ──────────────────────────────────── */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] tracking-widest uppercase">
            <span className="w-4 h-[1.5px] bg-red-500 inline-block" />
            <span>ZERO AGENT OVERHEAD. ABSOLUTE SYSTEM RESILIENCE.</span>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-right">
            <div className="text-[10px] leading-tight">
              <span className="block font-bold text-white tracking-widest">AINCRAD SYSTEMS</span>
              <span className="block text-zinc-400 text-[9px]">CORE REVISION 1.0</span>
            </div>
            <span className="w-[2px] h-7 bg-red-500 inline-block" />
          </div>
        </div>
      </section>

      {/* ── Real-Time Operational Marquee Ticker ─────────────────────────────── */}
      <div className="w-full bg-[#02040b] border-y border-zinc-800/80 py-3 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 font-mono text-xs text-zinc-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <strong className="text-white">[US-EAST]</strong> auth-gateway.internal · 24ms · 200 OK
          </span>
          <span className="text-zinc-600">/</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <strong className="text-white">[EU-CENTRAL]</strong> order-queue-worker · 118ms · 200 OK
          </span>
          <span className="text-zinc-600">/</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <strong className="text-white">[US-EAST]</strong> payments-db-primary · 14ms · 200 OK
          </span>
          <span className="text-zinc-600">/</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <strong className="text-red-400">[AP-EAST]</strong> notification-dispatcher · 540ms · 429 RATE_LIMIT
          </span>
          <span className="text-zinc-600">/</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <strong className="text-white">[FLEET STATUS]</strong> 4.8M Synthetic Heartbeats Executed Today
          </span>
          <span className="text-zinc-600">/</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <strong className="text-white">[TRIPWIRES]</strong> 0 Cascading Failures Triggered
          </span>
        </div>
      </div>

      {/* ── Section 2: Interactive Telemetry Simulator Widget ───────────────── */}
      <section id="simulator" className="px-6 py-16 max-w-5xl mx-auto w-full">
        <ScrollReveal distance={30}>
          <div className="bg-[#05091a] border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden scanline-effect">
            {/* Mock Console Top Bar */}
            <div className="bg-black/90 text-white px-5 py-3.5 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-[0_0_6px_#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-[0_0_6px_#3b82f6]" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-zinc-300">
                  AINCRAD // FLEET TELEMETRY PROBE MATRIX
                </span>
              </div>

              <button
                onClick={triggerProbePulse}
                disabled={simulating}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-mono font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)] disabled:opacity-50"
              >
                {simulating ? "PROBING..." : "PING FLEET"}
              </button>
            </div>

            {/* Simulator Content Table */}
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="pb-3">Target Node</th>
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Health State</th>
                    <th className="pb-3">Round-Trip Time</th>
                    <th className="pb-3 text-right">HTTP Probe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {nodes.map((node) => (
                    <tr key={node.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 font-semibold text-white">{node.name}</td>
                      <td className="py-3.5 text-zinc-400 text-[11px]">{node.region}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          node.status === "OPERATIONAL"
                            ? "bg-blue-950/60 text-blue-400 border border-blue-900/60"
                            : "bg-red-950/60 text-red-400 border border-red-900/60"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${node.status === "OPERATIONAL" ? "bg-blue-500 shadow-[0_0_6px_#3b82f6]" : "bg-red-500 shadow-[0_0_6px_#ef4444]"}`} />
                          {node.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2 max-w-xs">
                          <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${node.latency > 300 ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-blue-500 shadow-[0_0_8px_#3b82f6]"}`}
                              style={{ width: `${Math.min((node.latency / 600) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-zinc-300">{node.latency}ms</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`font-bold ${node.code === 200 ? "text-blue-400" : "text-red-400"}`}>
                          {node.code} {node.code === 200 ? "OK" : "RATE_LIMIT"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-black/60 border-t border-zinc-800 px-5 py-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>CLUSTER: US-EAST (GLOBAL EDGES ACTIVE)</span>
              <span className="text-blue-400 font-bold">SYNCHRONIZED (0 ERRORS DETECTED)</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 3: High-Impact Performance Metrics ──────────────────────── */}
      <section className="px-6 py-16 bg-[#040714] border-y border-zinc-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={0} distance={20}>
            <div className="p-5 border-l-2 border-white/80 bg-zinc-900/30 rounded-r-xl">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">99.99%</span>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Uptime Availability</h4>
              <p className="text-xs text-zinc-500 mt-1">Engineered for fault-tolerant microservice clusters.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} distance={20}>
            <div className="p-5 border-l-2 border-blue-500 bg-zinc-900/30 rounded-r-xl">
              <span className="text-3xl sm:text-4xl font-black font-mono text-blue-400">&lt; 14ms</span>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Probe Resolution</h4>
              <p className="text-xs text-zinc-500 mt-1">Global synthetic edge verification in real time.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} distance={20}>
            <div className="p-5 border-l-2 border-white/80 bg-zinc-900/30 rounded-r-xl">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">4.8M+</span>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Daily Health Checks</h4>
              <p className="text-xs text-zinc-500 mt-1">Continuous heartbeat evaluation without sidecar lag.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300} distance={20}>
            <div className="p-5 border-l-2 border-red-500 bg-zinc-900/30 rounded-r-xl">
              <span className="text-3xl sm:text-4xl font-black font-mono text-red-500">0 ms</span>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Cascading Failures</h4>
              <p className="text-xs text-zinc-500 mt-1">Automated tripwires isolate crash loops instantly.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 4: Deep Capabilities Feature Matrix ─────────────────────── */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto w-full">
        <ScrollReveal distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
              ENGINEERING CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
              Engineered for High-Consequence Systems.
            </h2>
            <p className="text-sm text-zinc-400 mt-3">
              Every feature is designed to reduce Mean Time to Detection (MTTD) and restore operational capacity before clients notice.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <ScrollReveal delay={50} distance={20}>
            <div className="bg-[#05091a] border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white mb-4">
                <IconCpu />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Subprocess Lifecycle Daemon</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Launch, monitor, and gracefully restart managed background daemons or workers directly through unified PID triggers.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 2 */}
          <ScrollReveal delay={120} distance={20}>
            <div className="bg-[#05091a] border border-zinc-800 hover:border-blue-500/80 p-6 rounded-2xl shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900 text-blue-400 flex items-center justify-center mb-4">
                <IconActivity />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Continuous RTT Telemetry</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Synthetic round-trip latency profiling reveals latency degradation before HTTP timeouts occur.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 3 */}
          <ScrollReveal delay={190} distance={20}>
            <div className="bg-[#05091a] border border-zinc-800 hover:border-red-500/80 p-6 rounded-2xl shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-900 text-red-400 flex items-center justify-center mb-4">
                <IconShield />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Signal Red Failure Tripwires</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instantly flags degraded endpoints and isolates bad nodes from service mesh traffic before error cascades multiply.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 4 */}
          <ScrollReveal delay={260} distance={20}>
            <div className="bg-[#05091a] border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white mb-4">
                <IconTerminal />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Tail Stream Console</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Inspect real-time standard output and error streams in a high-contrast terminal with zero latency overhead.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 5 */}
          <ScrollReveal delay={330} distance={20}>
            <div className="bg-[#05091a] border border-zinc-800 hover:border-blue-500/80 p-6 rounded-2xl shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-900 text-blue-400 flex items-center justify-center mb-4">
                <IconServer />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Fleet Topology Discovery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Categorize and monitor your entire architecture: HTTP APIs, database clusters, worker nodes, and WebSockets.
              </p>
            </div>
          </ScrollReveal>

          {/* Feature 6 */}
          <ScrollReveal delay={400} distance={20}>
            <div className="bg-[#05091a] border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white mb-4">
                <IconCheck />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Agentless Deployment</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No heavy daemon agents or invasive kernel modules. Simply expose an HTTP endpoint and start monitoring immediately.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 5: Interactive Chaos Injection Playground ───────────────── */}
      <section className="px-6 py-16 bg-[#020510] text-white border-y border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal distance={20}>
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-900/80 text-[11px] font-mono font-bold text-red-400 mb-3 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>CHAOS INJECTION PLAYGROUND</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                Test Autonomous Recovery Live.
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                Inject a simulated crash into any node and watch AINCRAD isolate the failure, trip the circuit breaker, and self-heal the service.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal distance={30}>
            <div className="bg-black/90 border border-zinc-800 rounded-2xl p-6 font-mono shadow-2xl">
              {/* Status ticker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500">ENGINE STATUS:</span>
                  <span className={`font-bold ${chaosNodeId ? "text-red-400 animate-pulse" : "text-blue-400"}`}>
                    {chaosStatus}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 uppercase">
                  CIRCUIT BREAKER: {chaosNodeId ? "ENGAGED (ISOLATING)" : "NOMINAL"}
                </span>
              </div>

              {/* Target Node Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-6">
                {nodes.map((node) => {
                  const isTarget = chaosNodeId === node.id;
                  return (
                    <div
                      key={node.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isTarget
                          ? "bg-red-950/50 border-red-600 shadow-md shadow-red-900/30"
                          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-zinc-400">{node.region}</span>
                        <span className={`w-2 h-2 rounded-full ${node.status === "OPERATIONAL" ? "bg-blue-500 shadow-[0_0_6px_#3b82f6]" : "bg-red-500 shadow-[0_0_6px_#ef4444]"}`} />
                      </div>
                      <div className="font-bold text-xs text-white truncate mb-2">{node.name}</div>
                      <div className="text-[11px] text-zinc-400 mb-3">
                        RTT: <span className={node.latency > 300 ? "text-red-400 font-bold" : "text-zinc-200"}>{node.latency}ms</span>
                      </div>

                      <button
                        type="button"
                        disabled={chaosNodeId !== null}
                        onClick={() => triggerChaosTest(node.id)}
                        className="w-full py-1.5 px-2 bg-red-600/90 hover:bg-red-600 text-white rounded text-[10px] font-bold uppercase transition-colors disabled:opacity-40 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      >
                        {isTarget ? "ISOLATING..." : "Inject Outage"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                <span>TRIPWIRE SLA: &lt;50ms TRIP TIME</span>
                <span className="text-zinc-400 font-bold">PID AUTO-RESTART: ENABLED</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 6: Interactive Terminal / CLI Engine ────────────────────── */}
      <section id="cli" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <ScrollReveal distance={20}>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
              ENGINEERING TERMINAL
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-2">
              Full Fleet Control from your CLI.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Control subprocesses, dump JSON telemetry, and test tripwires directly with the official AINCRAD command-line tool.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal distance={30}>
          <div className="bg-[#05091a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            {/* Left Command Selector Bar */}
            <div className="md:w-5/12 bg-black/60 p-4 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase font-bold text-zinc-500 mb-3">
                  PRESET COMMAND RUNNERS
                </div>
                <div className="space-y-2">
                  {CLI_COMMANDS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => runCliCommand(idx)}
                      className={`w-full text-left p-3 rounded-xl font-mono text-xs transition-all flex items-start gap-2.5 ${
                        activeCliIndex === idx
                          ? "bg-zinc-900 border border-zinc-700 text-white shadow-md"
                          : "bg-black/40 hover:bg-zinc-900/60 text-zinc-300 border border-zinc-800/80"
                      }`}
                    >
                      <div className="mt-0.5 text-red-500 shrink-0">
                        <IconPlay />
                      </div>
                      <div>
                        <div className="font-bold text-white">{item.cmd}</div>
                        <div className={`text-[10px] mt-0.5 leading-snug ${activeCliIndex === idx ? "text-zinc-300" : "text-zinc-500"}`}>
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                Install via: <span className="font-bold text-zinc-200">curl -fsSL aincrad.dev/cli.sh | sh</span>
              </div>
            </div>

            {/* Right Live Terminal Output */}
            <div className="md:w-7/12 bg-black text-zinc-200 font-mono text-xs flex flex-col justify-between p-5 min-h-[320px]">
              <div>
                {/* Terminal Title Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_6px_#ef4444]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_6px_#3b82f6]" />
                    <span className="ml-2 font-bold text-zinc-300">aincrad-cli · session #01</span>
                  </div>
                  <span>{terminalRunning ? "RUNNING..." : "IDLE"}</span>
                </div>

                {/* Terminal Logs */}
                <div className="space-y-1.5 leading-relaxed text-xs">
                  <div className="text-zinc-500">$ {CLI_COMMANDS[activeCliIndex].cmd}</div>
                  {visibleCliLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.startsWith("✓")
                          ? "text-blue-400 font-bold"
                          : log.startsWith("●")
                          ? "text-zinc-300"
                          : log.startsWith("RESULT") || log.startsWith("STATUS")
                          ? "text-white font-bold"
                          : "text-zinc-300"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
                <span>EXIT CODE 0</span>
                <span className="text-blue-400">TELEMETRY_PIPELINE_OK</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 7: Architecture Flow (Red vs Blue Mitigation) ───────────── */}
      <section id="architecture" className="px-6 py-20 bg-[#020510] text-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal distance={20}>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
                AUTONOMOUS INCIDENT RESPONSE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
                Cascading Failures Prevented in Milliseconds.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-3">
                When an upstream service degrades, AINCRAD automatically isolates the anomaly, alerts operators, and restores service parity.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Conventional Way (Failure) */}
            <ScrollReveal direction="left" distance={25}>
              <div className="bg-black/70 border border-zinc-800 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-red-500 uppercase">Conventional Monitoring</span>
                  <span className="text-[10px] font-mono text-zinc-500">SLOW REACTION</span>
                </div>
                <div className="space-y-3 text-xs font-mono text-zinc-400">
                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800">
                    <span className="text-red-400 font-bold block mb-1">00:00 - Memory Leak</span>
                    Service latency spikes to 1,400ms. Endpoints become unresponsive.
                  </div>
                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800">
                    <span className="text-red-400 font-bold block mb-1">00:04 - Cascading Failures</span>
                    Connection pool exhaustion spreads to dependent databases and gateways.
                  </div>
                  <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800">
                    <span className="text-red-400 font-bold block mb-1">00:15 - Human Alert</span>
                    Engineers paged after users have already encountered 504 errors.
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* The AINCRAD Way (Autonomous Recovery) */}
            <ScrollReveal direction="right" distance={25}>
              <div className="bg-black/70 border border-blue-900/60 rounded-2xl p-6 relative overflow-hidden h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase">AINCRAD Control Loop</span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold">AUTONOMOUS</span>
                </div>
                <div className="space-y-3 text-xs font-mono text-zinc-300">
                  <div className="p-3 rounded bg-blue-950/40 border border-blue-900/60">
                    <span className="text-blue-400 font-bold block mb-1">00:00 - RTT Spike Detected</span>
                    Telemetry flags degradation threshold breach (&gt; 450ms).
                  </div>
                  <div className="p-3 rounded bg-blue-950/40 border border-blue-900/60">
                    <span className="text-blue-400 font-bold block mb-1">00:01 - Subprocess Triggered</span>
                    AINCRAD automatically initiates PID reboot or routes probe traffic to standby nodes.
                  </div>
                  <div className="p-3 rounded bg-blue-950/40 border border-blue-900/60">
                    <span className="text-blue-400 font-bold block mb-1">00:02 - Full Recovery</span>
                    Zero downstream errors. Incident logged to live console stream.
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 8: Tabbed SDK & CLI Integration ─────────────────────────── */}
      <section id="integration" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <ScrollReveal distance={20}>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
              FAST ONBOARDING
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-2">
              Integrate in 60 Seconds.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Compatible with any framework that exposes a health check route or executes as a shell process.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal distance={30}>
          <div className="bg-[#05091a] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Language Switcher Tabs */}
            <div className="bg-black/60 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {Object.keys(CODE_SNIPPETS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveCodeTab(key)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors uppercase ${
                      activeCodeTab === key
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <button
                onClick={copyCode}
                className="text-xs font-mono text-zinc-400 hover:text-white font-semibold px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
              >
                {copied ? "COPIED!" : "COPY"}
              </button>
            </div>

            {/* Code Viewer */}
            <div className="p-6 bg-black text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>
                <code>{CODE_SNIPPETS[activeCodeTab].code}</code>
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 9: Transparent Pricing Plans ───────────────────────────── */}
      <section id="pricing" className="px-6 py-20 bg-[#020510] border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal distance={20}>
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
                TIERED DEPLOYMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
                Predictable Engineering Plans.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                Deploy without credit card verification. Scale as your microservice fleet expands.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Developer Tier */}
            <ScrollReveal delay={0} distance={25}>
              <div className="bg-[#05091a] border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase">COMMUNITY</span>
                  <div className="text-3xl font-black font-mono text-white mt-2 mb-1">$0</div>
                  <p className="text-xs text-zinc-400 mb-6">For single developers &amp; indie builders.</p>

                  <ul className="space-y-3 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2"><IconCheck /> Up to 5 monitored services</li>
                    <li className="flex items-center gap-2"><IconCheck /> 30-second probe interval</li>
                    <li className="flex items-center gap-2"><IconCheck /> Subprocess daemon manager</li>
                    <li className="flex items-center gap-2"><IconCheck /> 24-hour log retention</li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl text-center border border-zinc-800 transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </ScrollReveal>

            {/* Production Tier */}
            <ScrollReveal delay={120} distance={25}>
              <div className="bg-[#05091a] border-2 border-red-500/80 rounded-2xl p-6 shadow-xl shadow-red-950/20 flex flex-col justify-between relative h-full">
                <div className="absolute -top-3 right-6 bg-red-600 text-white font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow-[0_0_10px_#ef4444]">
                  RECOMMENDED
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-red-400 uppercase">PRODUCTION</span>
                  <div className="text-3xl font-black font-mono text-white mt-2 mb-1">$9 <span className="text-xs text-zinc-400 font-normal">/mo</span></div>
                  <p className="text-xs text-zinc-400 mb-6">For high-throughput cloud applications.</p>

                  <ul className="space-y-3 text-xs text-zinc-200 font-medium">
                    <li className="flex items-center gap-2"><IconCheck /> Unlimited monitored services</li>
                    <li className="flex items-center gap-2"><IconCheck /> 5-second high-precision RTT probes</li>
                    <li className="flex items-center gap-2"><IconCheck /> Autonomous crash recovery loop</li>
                    <li className="flex items-center gap-2"><IconCheck /> 30-day telemetry retention</li>
                    <li className="flex items-center gap-2"><IconCheck /> Webhook &amp; Slack incident alerts</li>
                  </ul>
                </div>

                <Link
                  href="/register"
                  className="mt-8 w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl text-center transition-all shadow-[0_0_18px_rgba(239,68,68,0.4)]"
                >
                  Deploy Production Cluster
                </Link>
              </div>
            </ScrollReveal>

            {/* Enterprise Tier */}
            <ScrollReveal delay={240} distance={25}>
              <div className="bg-[#05091a] border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase">ENTERPRISE</span>
                  <div className="text-3xl font-black font-mono text-white mt-2 mb-1">$29 <span className="text-xs text-zinc-400 font-normal">/mo</span></div>
                  <p className="text-xs text-zinc-400 mb-6">Dedicated VPC &amp; on-premise deployments.</p>

                  <ul className="space-y-3 text-xs text-zinc-300 font-medium">
                    <li className="flex items-center gap-2"><IconCheck /> Dedicated probing cluster</li>
                    <li className="flex items-center gap-2"><IconCheck /> Custom SLA &amp; 99.999% guarantee</li>
                    <li className="flex items-center gap-2"><IconCheck /> SSO / SAML &amp; RBAC integration</li>
                    <li className="flex items-center gap-2"><IconCheck /> Dedicated SRE support channel</li>
                  </ul>
                </div>

                <a
                  href="mailto:support@aincrad.dev"
                  className="mt-8 w-full py-2.5 bg-black hover:bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
                >
                  Contact Enterprise Engineering
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 10: Technical FAQ ──────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <ScrollReveal distance={20}>
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest">
              FREQUENT QUESTIONS
            </span>
            <h2 className="text-3xl font-black tracking-tight text-white mt-2">
              Engineering Details &amp; FAQ.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal distance={25}>
          <div className="space-y-3">
            {[
              {
                q: "How does AINCRAD probe services without sidecars or agents?",
                a: "AINCRAD conducts synthetic external HTTP/HTTPS and TCP heartbeat probes across distributed edge regions. By pinging your existing /health routes, it measures exact client-facing latency without consuming guest CPU or memory.",
              },
              {
                q: "Can AINCRAD manage processes running on local servers?",
                a: "Yes. When you configure an optional subprocess command (e.g. `npm run start` or `mix phx.server`), AINCRAD handles PID lifecycle management, starting and stopping the daemon with standard UNIX signal handlers.",
              },
              {
                q: "How are incident tripwires configured?",
                a: "Tripwires trigger whenever an endpoint returns non-2xx status codes or exceeds latency thresholds. The UI dynamically shifts node badges to Signal Red and streams live console logs for rapid inspection.",
              },
              {
                q: "Can I monitor services hosted on Vercel, Render, or Fly.io?",
                a: "Absolutely. Any publicly accessible URL or private endpoint accessible to the Hub can be registered and probed in real time.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#05091a] border border-zinc-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs font-bold text-white"
                >
                  <span>{item.q}</span>
                  <IconChevronDown open={openFaq === idx} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 11: Giant Final Action Banner ───────────────────────────── */}
      <section className="px-6 py-20 bg-black text-white text-center border-t border-zinc-900">
        <ScrollReveal distance={30}>
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-800/90 p-2.5 mx-auto mb-6 shadow-[0_0_25px_rgba(239,68,68,0.35)] flex items-center justify-center overflow-hidden">
              <Image
                src="/AINCRAD-APP-LOGO.png"
                alt="AINCRAD Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Take Fleet Control?
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Set up your first endpoint in under 60 seconds. Experience real-time telemetry, automated process control, and unified logs.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all uppercase tracking-wider"
              >
                Create Account Free
              </Link>
              <Link
                href="/app"
                className="w-full sm:w-auto px-7 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs rounded-full transition-colors uppercase tracking-wider"
              >
                Open Console Hub
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Technical Footer ────────────────────────────────────────────────── */}
      <footer className="bg-[#02040b] border-t border-zinc-900 px-6 py-10 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/AINCRAD-NOBG.png"
              alt="AINCRAD"
              width={100}
              height={33}
              className="h-5 w-auto object-contain opacity-80"
            />
            <span className="font-mono text-zinc-500 text-[11px]">/ FLEET CONTROL</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-mono text-[11px]">
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-white transition-colors">Console Login</Link>
            <Link href="/app" className="hover:text-white transition-colors">Live Dashboard</Link>
          </div>

          <div className="font-mono text-[10px] text-zinc-600">
            SYS_STATUS: ALL REGIONS OPERATIONAL
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shadow-[0_0_6px_#ef4444]" />
            <span>Powered by <strong className="text-zinc-300 font-semibold">SecureFixKe - D-Huhu Tech Labs</strong></span>
          </div>
          <span className="text-zinc-600 text-[10px]">© 2025 AINCRAD OBSERVABILITY PLATFORM. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </div>
  );
}
