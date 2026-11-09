"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconBook() {
  return (
    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="w-3 h-3 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ─── Code Block Component with Copy Action ──────────────────────────────────
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl bg-black/90 border border-zinc-800/90 overflow-hidden font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/70 text-zinc-400 text-[11px]">
        <span className="uppercase font-bold tracking-wider text-zinc-500">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-[10px]"
        >
          {copied ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <IconCheck /> COPIED
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <IconCopy /> Copy
            </span>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-zinc-200 leading-relaxed font-mono selection:bg-red-600 selection:text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Nav Structure ──────────────────────────────────────────────────────────
interface NavGroup {
  category: string;
  items: { id: string; label: string; badge?: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: "GETTING STARTED",
    items: [
      { id: "overview", label: "Citadel Overview" },
      { id: "quickstart", label: "Quickstart Guide", badge: "5 min" },
      { id: "zero-code", label: "Zero-Code Telemetry" },
    ],
  },
  {
    category: "TELEMETRY & INGESTION",
    items: [
      { id: "capabilities", label: "Capability Matrix" },
      { id: "tokens", label: "APP_ID & Token Auth" },
      { id: "health-schema", label: "Health Endpoint Spec" },
      { id: "beacon", label: "Traffic Beacon Script" },
      { id: "logs", label: "Log Shipping & Streams" },
    ],
  },
  {
    category: "OPERATIONAL ARCHITECTURE",
    items: [
      { id: "environments", label: "Multi-Environment Grid" },
      { id: "tripwires", label: "Autonomous Tripwires" },
      { id: "subprocesses", label: "Subprocess Daemons" },
      { id: "microservice-health", label: "Microservice Health Snippet" },
      { id: "db-connections", label: "Database Instance Connections" },
    ],
  },
  {
    category: "SUPPORT & RUNBOOKS",
    items: [
      { id: "troubleshooting", label: "Diagnostic Runbook" },
      { id: "api-reference", label: "Citadel REST APIs" },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter sections by search query
  const filteredNavGroups = useMemo(() => {
    if (!searchQuery.trim()) return NAV_GROUPS;
    const query = searchQuery.toLowerCase();
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(query) || group.category.toLowerCase().includes(query)
      ),
    })).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  // Smooth scroll handler
  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // ScrollSpy to track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const allItemIds = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));

      for (let i = allItemIds.length - 1; i >= 0; i--) {
        const id = allItemIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col justify-between antialiased selection:bg-red-600 selection:text-white relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-30 w-full bg-[#05091a]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/AINCRAD-NOBG.png"
              alt="AINCRAD"
              width={125}
              height={40}
              priority
              className="h-7 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            />
          </Link>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-red-950/40 border border-red-900/60 text-[10px] font-mono font-bold text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>DEVELOPER_SPEC // V1.0</span>
          </div>
        </div>

        {/* Search & Action Controls */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block min-w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs (e.g. health, token)..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-xs font-mono text-white rounded-xl pl-9 pr-3 py-1.5 outline-none placeholder:text-zinc-600 transition-all"
            />
          </div>

          <Link
            href="/app"
            className="text-xs font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>Fleet Console</span>
            <span className="text-zinc-500">→</span>
          </Link>

          {/* Mobile TOC Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400"
            aria-label="Toggle Table of Contents"
          >
            <IconBook />
          </button>
        </div>
      </header>

      {/* ── Main Container: Sidebar + Content ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 z-10">
        {/* ── Left Sidebar: Sticky Table of Contents ── */}
        <aside
          className={`${
            mobileMenuOpen ? "fixed inset-0 z-40 bg-[#030614]/95 p-6 flex" : "hidden"
          } md:block md:w-64 lg:w-72 shrink-0 md:sticky md:top-24 md:h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar`}
        >
          {mobileMenuOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800 md:hidden">
              <span className="font-mono text-xs font-bold text-red-400">TABLE OF CONTENTS</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                ✕ Close
              </button>
            </div>
          )}

          {/* Mobile Search input */}
          <div className="mb-4 sm:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs..."
              className="w-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-white rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <div className="space-y-6">
            {filteredNavGroups.map((group) => (
              <div key={group.category} className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-2.5">
                  {group.category}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                          isActive
                            ? "bg-red-950/60 border border-red-900/80 text-red-300 font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-bold shrink-0 ml-2">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Callout */}
          <div className="mt-8 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-2">
            <div className="text-zinc-200 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Need Custom Integration?</span>
            </div>
            <p className="text-zinc-500 text-[10px] leading-relaxed">
              Reach out to Citadel Core engineers or consult the telemetry gateway specs.
            </p>
            <Link
              href="/onboarding"
              className="text-red-400 hover:text-red-300 font-bold block hover:underline text-[10px]"
            >
              Launch Onboarding Wizard →
            </Link>
          </div>
        </aside>

        {/* ── Main Documentation Content ── */}
        <main className="flex-1 min-w-0 space-y-12 pb-16">
          {/* SECTION: Overview */}
          <section id="overview" className="scroll-mt-24 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-red-400">
              <span>PROTOCOL INTRODUCTION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              AINCRAD Observability Engine
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              AINCRAD is an autonomous, mission-critical observability hub and telemetry gateway.
              It continuously probes your distributed microservices, tracks latency degradations,
              and arms automatic failover tripwires to prevent cascading service outages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <div className="text-red-400 font-bold font-mono text-xs uppercase mb-1">
                  Zero Code Overhead
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Monitor any HTTP endpoint, gateway, or port without modifying code or redeploying.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <div className="text-blue-400 font-bold font-mono text-xs uppercase mb-1">
                  Autonomous Tripwires
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Detect micro-anomalies and auto-restart subprocesses in &lt;50ms before users notice.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <div className="text-emerald-400 font-bold font-mono text-xs uppercase mb-1">
                  Dual-Scope Clearance
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Role-based operator permissions ensuring cryptographic security across Citadel sectors.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: Quickstart */}
          <section id="quickstart" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Quickstart Guide</span>
                <span className="text-xs font-mono text-red-400 font-normal">#quickstart</span>
              </h2>
            </div>
            <p className="text-xs text-zinc-400">
              Establish your operator session and connect your first node in four swift steps:
            </p>

            <ol className="space-y-3 font-mono text-xs">
              <li className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-white">Authenticate Operator:</strong>
                  <span className="text-zinc-400 block mt-0.5">
                    Sign in to your Citadel console at <Link href="/login" className="text-red-400 underline">/login</Link> or provision a new callsign at <Link href="/register" className="text-red-400 underline">/register</Link>.
                  </span>
                </div>
              </li>
              <li className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-white">Initialize Citadel Sector:</strong>
                  <span className="text-zinc-400 block mt-0.5">
                    Navigate to <Link href="/onboarding" className="text-blue-400 underline">/onboarding</Link> to bind your organization and routing gateway zone.
                  </span>
                </div>
              </li>
              <li className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-white">Register Target Endpoint:</strong>
                  <span className="text-zinc-400 block mt-0.5">
                    Input your service URL (e.g. <code>http://localhost:4000</code>) and health path (<code>/health</code>).
                  </span>
                </div>
              </li>
              <li className="p-4 rounded-xl bg-black/60 border border-zinc-800/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-white">Monitor Telemetry Live:</strong>
                  <span className="text-zinc-400 block mt-0.5">
                    Observe round-trip latency, uptime percentage, and failover status on the <Link href="/app" className="text-zinc-300 underline">Fleet Console</Link>.
                  </span>
                </div>
              </li>
            </ol>
          </section>

          {/* SECTION: Zero-Code Monitoring */}
          <section id="zero-code" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Zero-Code Health Monitoring</span>
              <span className="text-xs font-mono text-blue-400 font-normal">#zero-code</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard uptime, RTT latency, HTTP status code validation, and SSL certificate expiry require <strong>zero SDK installations</strong>. AINCRAD sends automated non-intrusive HTTP probes to your registered endpoints every 15 to 30 seconds.
            </p>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3 font-mono text-xs">
              <div className="text-zinc-300 font-bold uppercase text-[11px] tracking-wider">
                Telemetry Captured Without Instrumentation:
              </div>
              <ul className="space-y-1.5 text-zinc-400">
                <li className="flex items-center gap-2">
                  <IconCheck /> Uptime status (OPERATIONAL, DEGRADED, OFFLINE)
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck /> Round-Trip Response Time (RTT) in milliseconds
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck /> HTTP status response verification (200 OK vs 5xx errors)
                </li>
                <li className="flex items-center gap-2">
                  <IconCheck /> TLS/SSL Certificate validity and expiration countdown
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION: Capability Matrix */}
          <section id="capabilities" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Capability Matrix</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#capabilities</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Overview of telemetry features and their code modification requirements:
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[11px] text-zinc-400 uppercase">
                    <th className="py-3 px-4">Capability</th>
                    <th className="py-3 px-4">Code Change</th>
                    <th className="py-3 px-4">Implementation Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Health Monitoring</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">None</td>
                    <td className="py-3 px-4 text-zinc-400">AINCRAD polls registered HTTP/HTTPS path</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Traffic Analytics</td>
                    <td className="py-3 px-4 text-blue-400 font-bold">Minimal</td>
                    <td className="py-3 px-4 text-zinc-400">Add client beacon snippet to frontend head</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Live Log Streaming</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">Optional</td>
                    <td className="py-3 px-4 text-zinc-400">Configure local file path or stream to /api/logs</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Autonomous Restart</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">None</td>
                    <td className="py-3 px-4 text-zinc-400">Configure subprocess daemon command in Hub</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION: Tokens & Auth */}
          <section id="tokens" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>APP_ID &amp; Ingestion Tokens</span>
              <span className="text-xs font-mono text-red-400 font-normal">#tokens</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When an application is created in the Citadel, a unique Node ID is assigned. For protected endpoints or log ingestion pipelines, pass your JWT Bearer token in the authorization header:
            </p>

            <CodeBlock
              language="http"
              code={`Authorization: Bearer <YOUR_JWT_ACCESS_TOKEN>
X-Aincrad-App-Id: <TARGET_APP_UUID>`}
            />
          </section>

          {/* SECTION: Health Endpoint Spec */}
          <section id="health-schema" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Recommended Health Endpoint Spec</span>
              <span className="text-xs font-mono text-blue-400 font-normal">#health-schema</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              While any HTTP 200 response is considered healthy, providing a structured diagnostic payload allows AINCRAD to drill into downstream dependencies:
            </p>

            <CodeBlock
              language="json"
              code={`{
  "status": "ok",
  "timestamp": "2026-11-06T18:00:00Z",
  "version": "1.4.2",
  "services": {
    "database": "connected",
    "redis": "connected",
    "gateway": "nominal"
  },
  "metrics": {
    "activeConnections": 42,
    "memoryUsageMb": 128.4
  }
}`}
            />
          </section>

          {/* SECTION: Traffic Beacon */}
          <section id="beacon" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Frontend Traffic Beacon</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#beacon</span>
            </h2>
            <p className="text-xs text-zinc-400">
              To record real-time page hits, bounce rates, and client-side RTT from end-user browsers, add this lightweight snippet to your HTML head or root template:
            </p>

            <CodeBlock
              language="html"
              code={`<script
  defer
  data-aincrad-id="YOUR_APP_ID"
  src="https://hub.aincrad.dev/beacon.js"
></script>`}
            />
          </section>

          {/* SECTION: Log Shipping */}
          <section id="logs" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Log Shipping &amp; Ingestion</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#logs</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Ship structured telemetry or stderr streams to the AINCRAD logging bus via HTTP POST:
            </p>

            <CodeBlock
              language="bash"
              code={`curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{
    "appId": "YOUR_APP_ID",
    "level": "error",
    "message": "Database query timeout after 2500ms",
    "timestamp": "2026-11-06T18:30:00Z"
  }'`}
            />
          </section>

          {/* SECTION: Environments */}
          <section id="environments" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Multi-Environment Grid</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#environments</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Each registered target supports separate environments: <strong>Production</strong>, <strong>Staging</strong>, and <strong>Development</strong>. Alerts and tripwires can be tuned independently to avoid staging test suites firing production pager alerts.
            </p>
          </section>

          {/* SECTION: Tripwires */}
          <section id="tripwires" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Autonomous Tripwires</span>
              <span className="text-xs font-mono text-red-400 font-normal">#tripwires</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tripwires are high-speed circuit breakers configured per target. If a node fails consecutive probes or exceeds the defined SLA latency threshold (e.g. <code>&lt; 600ms</code>), AINCRAD immediately transitions the node into <code>DEGRADED</code> or <code>OFFLINE</code> state and triggers configured failover actions.
            </p>
          </section>

          {/* SECTION: Subprocesses */}
          <section id="subprocesses" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Subprocess Daemons</span>
              <span className="text-xs font-mono text-blue-400 font-normal">#subprocesses</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For local microservices, you can provide an execution command (e.g. <code>npm run start</code> or <code>python main.py</code>). AINCRAD manages the subprocess lifecycle directly, offering one-click <strong>START</strong> and <strong>STOP</strong> controls directly from the Fleet Console.
            </p>
          </section>

          {/* SECTION: Troubleshooting */}
          <section id="troubleshooting" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Diagnostic Runbook</span>
              <span className="text-xs font-mono text-red-400 font-normal">#troubleshooting</span>
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-zinc-300">
                <strong className="text-red-400 block mb-1">Target Shows OFFLINE or STANDBY:</strong>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Verify the host URL is listening on the assigned port. If running on localhost within Docker, ensure container network bridges allow loopback resolution.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <strong className="text-blue-400 block mb-1">SSL Certificate Shows Invalid:</strong>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Self-signed certificates or expired certificates trigger warning tripwires. Renew certificates with Let&apos;s Encrypt or configure explicit TLS bypass for local staging.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
                <strong className="text-yellow-400 block mb-1">Session De-authenticated:</strong>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Access tokens expire after 24 hours. Re-authenticate at <code>/login</code> or verify your Bearer token in browser local storage.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION: API Reference */}
          <section id="api-reference" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Citadel REST APIs</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#api-reference</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Core endpoints exposed by the AINCRAD backend gateway (<code>http://localhost:4000</code>):
            </p>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[11px] text-zinc-400 uppercase">
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4">Endpoint</th>
                    <th className="py-2.5 px-4">Auth</th>
                    <th className="py-2.5 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="py-2.5 px-4 text-blue-400 font-bold">POST</td>
                    <td className="py-2.5 px-4 text-white">/auth/login</td>
                    <td className="py-2.5 px-4 text-zinc-500">Public</td>
                    <td className="py-2.5 px-4 text-zinc-400">Operator authentication &amp; JWT token issuance</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-blue-400 font-bold">POST</td>
                    <td className="py-2.5 px-4 text-white">/auth/register</td>
                    <td className="py-2.5 px-4 text-zinc-500">Public</td>
                    <td className="py-2.5 px-4 text-zinc-400">Operator registration &amp; identity provisioning</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold">GET</td>
                    <td className="py-2.5 px-4 text-white">/auth/me</td>
                    <td className="py-2.5 px-4 text-red-400">Bearer</td>
                    <td className="py-2.5 px-4 text-zinc-400">Current authenticated operator profile</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold">GET</td>
                    <td className="py-2.5 px-4 text-white">/organizations</td>
                    <td className="py-2.5 px-4 text-red-400">Bearer</td>
                    <td className="py-2.5 px-4 text-zinc-400">List Citadel sectors for operator</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-blue-400 font-bold">POST</td>
                    <td className="py-2.5 px-4 text-white">/applications</td>
                    <td className="py-2.5 px-4 text-red-400">Bearer</td>
                    <td className="py-2.5 px-4 text-zinc-400">Register new telemetry target node</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-emerald-400 font-bold">GET</td>
                    <td className="py-2.5 px-4 text-white">/auth/users</td>
                    <td className="py-2.5 px-4 text-red-500 font-bold">ADMIN</td>
                    <td className="py-2.5 px-4 text-zinc-400">List all Citadel fleet operators (Root only)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* SECTION: Monitoring by app type */}
          <section id="monitoring-by-app-type" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Monitoring by app type</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#monitoring-by-app-type</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              How AINCRAD monitors each application type:
            </p>
            <ul className="space-y-1.5 text-zinc-300 font-mono text-xs">
              <li className="flex items-center gap-2">
                <IconCheck /> API/Microservice/Gateway/Web (polled, no code changes)
              </li>
              <li className="flex items-center gap-2">
                <IconCheck /> Worker (heartbeat push)
              </li>
              <li className="flex items-center gap-2">
                <IconCheck /> Database (connection check)
              </li>
              <li className="flex items-center gap-2">
                <IconCheck /> Queue (connection check + depth)
              </li>
            </ul>
          </section>

          {/* SECTION: Worker heartbeat snippet */}
          <section id="worker-heartbeat" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Worker heartbeat snippet</span>
              <span className="text-xs font-mono text-zinc-500 font-normal">#worker-heartbeat</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Workers push a heartbeat to AINCRAD on an interval. Add this snippet to your worker process:
            </p>
            <CodeBlock
              language="js"
              code={`setInterval(() => {
  fetch("http://localhost:4000/api/heartbeat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appId: "YOUR_APP_ID", status: "ok" }),
  });
}, 15000);`}
            />
          <p className="text-xs text-zinc-400 leading-relaxed">
            The worker posts to /api/heartbeat every 15 seconds to signal it is alive.
          </p>
        </section>

        {/* SECTION: Microservice health snippet */}
        <section id="microservice-health" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Microservice Health Snippet</span>
            <span className="text-xs font-mono text-zinc-500 font-normal">#microservice-health</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Expose a /health route on your microservice so AINCRAD can probe it. Example:
          </p>
          <CodeBlock
            language="ts"
            code={`app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "fitchain", uptime: process.uptime() });
});`}
          />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Register with type MICROSERVICE, url https://fitchain.com, healthPath /health.
          </p>
        </section>

        {/* SECTION: Database instance connections */}
        <section id="db-connections" className="scroll-mt-24 space-y-4 border-t border-zinc-900 pt-8">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Database Instance Connections</span>
            <span className="text-xs font-mono text-zinc-500 font-normal">#db-connections</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Register a database as type DATABASE. Two modes:
          </p>
          <ul className="space-y-1.5 text-zinc-300 font-mono text-xs">
            <li className="flex items-center gap-2"><IconCheck /> HTTP health sidecar (recommended): expose /health that runs SELECT 1</li>
            <li className="flex items-center gap-2"><IconCheck /> Direct connection string: postgres://... (TCP/auth probe)</li>
          </ul>
          <CodeBlock
            language="ts"
            code={`app.get("/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});`}
          />
        </section>

        </main>
      </div>

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
