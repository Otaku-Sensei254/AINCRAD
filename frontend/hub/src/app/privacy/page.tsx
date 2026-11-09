"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { id: "overview", label: "1. Overview & Enclave Scope" },
  { id: "telemetry", label: "2. Telemetry & Fleet Data Collected" },
  { id: "processing", label: "3. Purpose of Processing" },
  { id: "security", label: "4. Cryptographic Security & Storage" },
  { id: "tokens", label: "5. Auth Tokens & Session Policies" },
  { id: "subprocessors", label: "6. Sub-processors & Payment Rails" },
  { id: "retention", label: "7. Data Retention & Purge Lifecycles" },
  { id: "operator-rights", label: "8. Operator Rights & Tenancy Control" },
  { id: "incident-response", label: "9. Incident Response & Breaches" },
  { id: "contact", label: "10. Contact & Privacy Dispatch" },
];

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans relative">
      {/* Background Ambience */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, #2563eb 0%, transparent 40%), radial-gradient(circle at 85% 85%, #ef4444 0%, transparent 40%)",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.06) 24px, rgba(255,255,255,0.06) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.06) 24px, rgba(255,255,255,0.06) 25px)",
        }}
      />

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#060a1d]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono font-bold text-zinc-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>HOME</span>
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <Image src="/AINCRAD-NOBG.png" alt="AINCRAD" width={92} height={22} className="opacity-95" priority />
          <span className="hidden sm:inline font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
            LEGAL ARCHIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/terms"
            className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-800"
          >
            TERMS OF SERVICE →
          </Link>
          <button
            onClick={() => router.push("/app")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-900/30"
          >
            <span>FLEET CONSOLE</span>
          </button>
        </div>
      </header>

      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800/80 bg-[#040817] py-12 px-6 z-10">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-blue-400">
              DOCUMENT IDENTIFIER: POL-AINCRAD-SEC-2026
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-mono">
            PRIVACY & DATA GOVERNANCE POLICY
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span>VERSION 1.0</span>
            <span>•</span>
            <span>EFFECTIVE DATE: NOVEMBER 2026</span>
            <span>•</span>
            <span>SECURITY CLASSIFICATION: PUBLIC ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* ── Main Layout: Sidebar TOC + Legal Body ──────────────────────── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-10 z-10">
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="bg-[#080d24]/90 border border-zinc-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest mb-3 px-2">
                POLICY INDEX
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                      activeSection === sec.id
                        ? "bg-blue-600/15 text-blue-400 font-bold border border-blue-500/30"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                    {activeSection === sec.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Document Switcher */}
            <div className="bg-[#080d24]/90 border border-zinc-800/80 rounded-2xl p-4 space-y-2 font-mono text-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                RELATED AGREEMENTS
              </span>
              <Link
                href="/terms"
                className="block p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
              >
                Terms & Conditions of Service →
              </Link>
              <Link
                href="/docs"
                className="block p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
              >
                Developer API Documentation →
              </Link>
            </div>
          </div>
        </aside>

        {/* Legal Text Content */}
        <main className="flex-1 space-y-12 max-w-none text-zinc-300 leading-relaxed font-sans text-sm">
          {/* Section 1 */}
          <section id="overview" className="space-y-4 pt-2">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">01.</span> Overview & Enclave Scope
            </h2>
            <p>
              This Privacy and Data Governance Policy governs how <strong>AINCRAD</strong> (developed and operated by <strong>SecureFixKe - D-Huhu Tech Labs</strong>, hereinafter referred to as &quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) collects, processes, secures, and purges operational telemetry, infrastructure diagnostics, and operator authentication data.
            </p>
            <p>
              AINCRAD is purpose-built as an enterprise fleet observability and synthetic heartbeat tracking gateway. We operate under strict telemetry privacy boundaries: <strong>we do not inspect customer application business payloads, we do not monetize operational telemetry, and we enforce end-to-end data segregation across all tenant organizations.</strong>
            </p>
            <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 font-mono text-xs text-blue-200">
              <strong className="text-blue-400 block mb-1">CORE PRIVACY PLEDGE:</strong>
              We capture only network metrics (latency, HTTP codes, TLS certificate lifecycles, and process states). We do not record or store end-user PII flowing through your monitored web servers or upstream databases.
            </div>
          </section>

          {/* Section 2 */}
          <section id="telemetry" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">02.</span> Telemetry & Fleet Data Collected
            </h2>
            <p>When you register, configure endpoints, or dispatch agent probes to AINCRAD, the following data vectors are ingested:</p>
            <ul className="space-y-2 list-disc list-inside text-zinc-300 font-mono text-xs pl-2">
              <li>
                <strong>Operator Identity:</strong> Callsign (username), corporate email, encrypted password hash (bcrypt), assigned RBAC clearance level, and organization membership.
              </li>
              <li>
                <strong>Target Endpoint Profiles:</strong> Target URLs, health check probe routes (e.g., <code>/health</code>), configured check intervals, and subprocess execution wrappers.
              </li>
              <li>
                <strong>Synthetic Probe Telemetry:</strong> Round-trip time (RTT latency in milliseconds), HTTP response status codes (e.g. 200, 502), response payload size, and SSL/TLS certificate validity metadata (days remaining, issuer, cipher suite).
              </li>
              <li>
                <strong>System Console Streams:</strong> Standard output (stdout) and standard error (stderr) captured from linked process wrappers when explicitly routed by an authorized operator.
              </li>
              <li>
                <strong>Access Audit Registers:</strong> Client IP address, user-agent string, session timestamps, and cryptographic signature validations for compliance verification.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="processing" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">03.</span> Purpose of Processing
            </h2>
            <p>Data ingested into AINCRAD is utilized strictly to fulfill the operational contract of the platform:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[#080d24] border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-blue-400 font-bold block mb-1">REAL-TIME HEALTH DISPATCH</span>
                Calculating state transition matrices (Operational, Degraded, Offline) and triggering automated outage tripwires.
              </div>
              <div className="bg-[#080d24] border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-blue-400 font-bold block mb-1">SLA & LATENCY ANALYTICS</span>
                Compiling rolling window RTT trends, downtime incidents, and historical uptime percentage compliance.
              </div>
              <div className="bg-[#080d24] border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-blue-400 font-bold block mb-1">SECURITY MONITORING</span>
                Preventing unauthorized credential brute-forcing, verifying JWT signature validity, and preventing DDoS against ingest ports.
              </div>
              <div className="bg-[#080d24] border border-zinc-800 p-3.5 rounded-xl">
                <span className="text-blue-400 font-bold block mb-1">COMMUNICATION & BILLING</span>
                Dispatching critical threshold alarms to verified operator emails and administering enterprise subscription licensing.
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="security" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">04.</span> Cryptographic Security & Enclave Storage
            </h2>
            <p>
              Security is foundational to AINCRAD. We protect stored and transient data using enterprise-grade cryptographic controls:
            </p>
            <ul className="space-y-2 list-disc list-inside font-mono text-xs text-zinc-300 pl-2">
              <li>
                <strong>Data in Transit:</strong> 100% of network traffic between your client browsers, telemetry forwarders, and AINCRAD clusters is encrypted with TLS 1.3 with mandatory forward secrecy.
              </li>
              <li>
                <strong>Data at Rest:</strong> Fleet databases, relational registers, and log archives are encrypted using AES-256 block ciphers with rotating master key rings.
              </li>
              <li>
                <strong>Credential Protection:</strong> Passwords are never stored in plaintext. They are salted and hashed using standard adaptive <code>bcrypt</code> derivation algorithms.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="tokens" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">05.</span> Auth Tokens & Session Policies
            </h2>
            <p>
              Authentication within AINCRAD relies on HMAC-SHA256 signed JSON Web Tokens (JWT). Tokens are scoped strictly to the authenticated operator and their authorized organization enclaves.
            </p>
            <p>
              Ingestion tokens (<code>ing_...</code>) permit append-only submission of metric packets to <code>/api/heartbeat</code> and cannot be used to modify platform settings, query billing profiles, or delete monitored applications.
            </p>
          </section>

          {/* Section 6 */}
          <section id="subprocessors" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">06.</span> Sub-processors & Payment Rails
            </h2>
            <p>
              To maintain global low-latency operations and process enterprise licensing, we engage trusted third-party infrastructure providers:
            </p>
            <div className="bg-[#040817] border border-zinc-800 rounded-2xl overflow-hidden font-mono text-xs">
              <div className="grid grid-cols-3 bg-zinc-900/60 p-3 font-bold text-zinc-400 border-b border-zinc-800">
                <span>SUB-PROCESSOR</span>
                <span>FUNCTION</span>
                <span>DATA LOCATION</span>
              </div>
              <div className="divide-y divide-zinc-900">
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-white">Paystack Inc.</span>
                  <span className="text-zinc-400">Payment Gateway (PCI-DSS Level 1)</span>
                  <span className="text-zinc-400">Global / Africa Rails</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-white">PostgreSQL Enclaves</span>
                  <span className="text-zinc-400">Primary Telemetry Storage</span>
                  <span className="text-zinc-400">Dedicated Secure Hosts</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-white">Edge CDN & DNS</span>
                  <span className="text-zinc-400">DDoS Mitigation & Caching</span>
                  <span className="text-zinc-400">Multi-Region Edge</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              Payment details (such as credit card numbers or banking credentials) are handled entirely within Paystack&apos;s PCI-DSS compliant vault. AINCRAD servers never receive, log, or store raw payment credentials.
            </p>
          </section>

          {/* Section 7 */}
          <section id="retention" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">07.</span> Data Retention & Purge Lifecycles
            </h2>
            <p>
              We enforce strict retention horizons based on your selected platform subscription tier:
            </p>
            <ul className="space-y-2 list-disc list-inside font-mono text-xs text-zinc-300 pl-2">
              <li><strong>Free Community Tier:</strong> Rolling 7-day latency trend retention; 24-hour log terminal ring buffer.</li>
              <li><strong>Pro Tier:</strong> Rolling 30-day telemetry retention; 7-day log buffer.</li>
              <li><strong>Team / Enterprise Tier:</strong> 90-day extended archive with customizable cold storage export.</li>
              <li><strong>Decommissioned Nodes:</strong> When an operator deletes an application node, all linked historical probe logs are permanently excised within 48 hours.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="operator-rights" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">08.</span> Operator Rights & Tenancy Control
            </h2>
            <p>
              Under applicable international privacy regulations (including GDPR, CCPA, and the Kenya Data Protection Act 2019), operators and organization administrators possess full autonomy over their data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-[#080d24] border border-zinc-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">RIGHT TO EXPORT</span>
                Export entire application health history and configuration manifests in structured JSON format.
              </div>
              <div className="bg-[#080d24] border border-zinc-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">RIGHT TO RECTIFY</span>
                Modify profile callsigns, email routing, and organization memberships directly within the operator console.
              </div>
              <div className="bg-[#080d24] border border-zinc-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">RIGHT TO PURGE</span>
                Request complete de-provisioning and irrevocable deletion of your account and organization records.
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="incident-response" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">09.</span> Incident Response & Breaches
            </h2>
            <p>
              SecureFixKe maintains a 24/7 Security Operations Center (SOC). In the unlikely event of a confirmed security incident impacting operator credentials or infrastructure definitions, we commit to notifying affected tenant administrators via email within <strong>72 hours</strong> of formal verification, accompanied by full diagnostic impact analysis.
            </p>
          </section>

          {/* Section 10 */}
          <section id="contact" className="space-y-4 pb-8">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-blue-500">10.</span> Contact & Privacy Dispatch
            </h2>
            <p>
              For privacy inquiries, regulatory compliance verification, or formal Data Protection Officer (DPO) requests, contact our specialized legal engineering team:
            </p>
            <div className="bg-[#080d24] border border-zinc-800 rounded-2xl p-5 font-mono text-xs space-y-2">
              <div><span className="text-zinc-500">CONTROLLER:</span> <strong className="text-white">SecureFixKe - D-Huhu Tech Labs</strong></div>
              <div><span className="text-zinc-500">OPERATIONAL HUB:</span> <span className="text-zinc-300">Nairobi, Kenya · Global Telemetry Network</span></div>
              <div><span className="text-zinc-500">LEGAL & PRIVACY DISPATCH:</span> <span className="text-blue-400 font-bold">privacy@securefixke.tech</span></div>
              <div><span className="text-zinc-500">SECURITY ADVISORIES:</span> <span className="text-zinc-300">security@aincrad.cloud</span></div>
            </div>
          </section>
        </main>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/80 bg-[#060a1d]/90 px-6 py-6 text-center z-10">
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
