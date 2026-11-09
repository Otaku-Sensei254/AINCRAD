"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "scope", label: "2. Observability Scope & SLA" },
  { id: "accounts", label: "3. Operator Accounts & Security" },
  { id: "acceptable-use", label: "4. Acceptable Use & Probe Rules" },
  { id: "subscriptions", label: "5. Subscriptions & Billing Terms" },
  { id: "quotas", label: "6. Platform Quotas & Fair Use" },
  { id: "ip", label: "7. Intellectual Property Rights" },
  { id: "termination", label: "8. Suspension & Decommissioning" },
  { id: "liability", label: "9. Warranty & Liability Limits" },
  { id: "governing-law", label: "10. Governing Law & Arbitration" },
];

export default function TermsConditionsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("acceptance");

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
            href="/privacy"
            className="text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-800"
          >
            PRIVACY POLICY →
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
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-red-400">
              DOCUMENT IDENTIFIER: TOS-AINCRAD-OPS-2026
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-mono">
            TERMS & CONDITIONS OF SERVICE
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span>VERSION 1.0</span>
            <span>•</span>
            <span>EFFECTIVE DATE: NOVEMBER 2026</span>
            <span>•</span>
            <span>LEGAL JURISDICTION: SECUREFIXKE / KENYA & GLOBAL</span>
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
                TERMS INDEX
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                      activeSection === sec.id
                        ? "bg-red-600/15 text-red-400 font-bold border border-red-500/30"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                    {activeSection === sec.id && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
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
                href="/privacy"
                className="block p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
              >
                Privacy & Data Governance Policy →
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
          <section id="acceptance" className="space-y-4 pt-2">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">01.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing, deploying, subscribing to, or configuring endpoint telemetry probes within <strong>AINCRAD</strong> (&quot;the Service&quot;, provided by <strong>SecureFixKe - D-Huhu Tech Labs</strong>), you agree to be legally bound by these Terms and Conditions of Service (&quot;Terms&quot;).
            </p>
            <p>
              If you are accepting these Terms on behalf of an enterprise entity, organization, or engineering team, you represent and warrant that you hold legitimate authority to bind such entity to this agreement.
            </p>
          </section>

          {/* Section 2 */}
          <section id="scope" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">02.</span> Observability Scope & Service Level Objectives
            </h2>
            <p>
              AINCRAD provides distributed synthetic uptime monitoring, RTT latency tracking, SSL/TLS certificate integrity verification, process runtime supervisors, and incident tripwire alarms.
            </p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span>TARGET GATEWAY AVAILABILITY:</span>
                <span className="text-emerald-400 font-bold">99.9% MONTHLY UPTIME</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>PROBE LATENCY SAMPLING FREQUENCY:</span>
                <span className="text-blue-400 font-bold">DOWN TO 1-SECOND CADENCE</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>INCIDENT DISPATCH TARGET:</span>
                <span className="text-white font-bold">&lt; 15 SECONDS FROM STATE TRIP</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              While we engineer our platform for maximum fault tolerance across multi-region clusters, synthetic observability inherently relies on intermediate Internet transit corridors and third-party upstream providers.
            </p>
          </section>

          {/* Section 3 */}
          <section id="accounts" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">03.</span> Operator Accounts & Security
            </h2>
            <p>
              Access to AINCRAD requires the creation of an Operator Account. Operators are exclusively responsible for maintaining the confidentiality of their login credentials, Bearer JWT session tokens, and telemetry ingestion keys (<code>ing_...</code>).
            </p>
            <p>
              Any activity dispatched under your credentials will be deemed executed by your organization. You agree to notify our security team immediately at <code>security@aincrad.cloud</code> upon discovering any compromised credentials or unauthorized token usage.
            </p>
          </section>

          {/* Section 4 */}
          <section id="acceptable-use" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">04.</span> Acceptable Use & Probe Rules
            </h2>
            <p>
              AINCRAD is engineered strictly for authorized infrastructure performance management. You agree to adhere to the following mandatory probe rules:
            </p>
            <ul className="space-y-2 list-disc list-inside font-mono text-xs text-zinc-300 pl-2">
              <li>
                <strong>Authorization Requirement:</strong> You may only configure synthetic probes against endpoints, servers, and domains that you own or for which you have explicit written authorization to monitor.
              </li>
              <li>
                <strong>Denial of Service (DoS) Prohibition:</strong> You must not configure aggressive probe frequencies or payloads designed to overwhelm, degrade, or disrupt external target services.
              </li>
              <li>
                <strong>Malicious Content:</strong> You must not use command execution bindings or console streams to transmit malicious shell code, malware, or illicit payload streams.
              </li>
              <li>
                <strong>Vulnerability Exploitation:</strong> Probing endpoints for unauthorized vulnerability exploitation or port scanning outside synthetic health definitions is strictly prohibited.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="subscriptions" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">05.</span> Subscriptions & Billing Terms
            </h2>
            <p>
              AINCRAD offers tiered platform licensing including <strong>Community (Free)</strong>, <strong>Pro</strong>, and <strong>Team / Enterprise</strong> tiers.
            </p>
            <div className="bg-[#080d24] border border-zinc-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">PAYMENT PROCESSING:</span>
                <span className="text-white font-bold">PAYSTACK GATEWAY (SECURE CHECKOUT)</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">CURRENCY / BILLING:</span>
                <span className="text-white font-bold">KES / USD (AS QUOTED ON CHECKOUT)</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">REFUND POLICY:</span>
                <span className="text-zinc-300">14-DAY MONEY-BACK FOR UNUSED CYCLES</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">CANCELLATION:</span>
                <span className="text-emerald-400 font-bold">CANCEL ANYTIME VIA PROFILE SETTINGS</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              Upgrades take effect immediately upon successful payment verification. Downgrades take effect at the conclusion of the active billing period.
            </p>
          </section>

          {/* Section 6 */}
          <section id="quotas" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">06.</span> Platform Quotas & Fair Use
            </h2>
            <p>
              Each subscription tier specifies designated quotas for monitored application endpoints, minimum probe intervals (e.g. 15s for Free, 1s for Pro/Team), and log line buffer limits.
            </p>
            <p>
              If an organization continuously exceeds ingestion quotas by 300% or generates abusive telemetry traffic, AINCRAD reserves the right to rate-limit the offending ingestion token until tier alignment is restored.
            </p>
          </section>

          {/* Section 7 */}
          <section id="ip" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">07.</span> Intellectual Property Rights
            </h2>
            <p>
              The AINCRAD brand, logo, user interface designs, synthetic probe algorithms, CLI tooling, and codebase are the exclusive intellectual property of <strong>SecureFixKe - D-Huhu Tech Labs</strong>.
            </p>
            <p>
              Customer retains 100% intellectual property ownership of their underlying software applications, domain names, proprietary health metrics, and raw telemetry log outputs.
            </p>
          </section>

          {/* Section 8 */}
          <section id="termination" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">08.</span> Suspension & Decommissioning
            </h2>
            <p>
              We reserve the right to suspend or decommission an operator account immediately if:
            </p>
            <ul className="space-y-2 list-disc list-inside font-mono text-xs text-zinc-300 pl-2">
              <li>The account is engaged in unauthorized target probing or malicious scanning.</li>
              <li>Payment delinquency persists past the grace period following gateway notifications.</li>
              <li>Required by legal or regulatory mandate from relevant telecommunications or cyber authorities.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section id="liability" className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">09.</span> Warranty & Liability Limits
            </h2>
            <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 font-mono text-xs text-red-200">
              <strong className="text-red-400 block mb-1">LIMITATION OF LIABILITY NOTICE:</strong>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AINCRAD AND SECUREFIXKE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, NOR FOR ANY LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION RESULTING FROM SERVICE OUTAGES, DELAYED ALERT DISPATCHES, OR PROBE MISCONFIGURATIONS. OUR AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </div>
          </section>

          {/* Section 10 */}
          <section id="governing-law" className="space-y-4 pb-8">
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-red-500">10.</span> Governing Law & Arbitration
            </h2>
            <p>
              These Terms shall be construed and governed in accordance with the laws of Kenya and applicable international commercial arbitration frameworks.
            </p>
            <div className="bg-[#080d24] border border-zinc-800 rounded-2xl p-5 font-mono text-xs space-y-2">
              <div><span className="text-zinc-500">OPERATING ENTITY:</span> <strong className="text-white">SecureFixKe - D-Huhu Tech Labs</strong></div>
              <div><span className="text-zinc-500">LEGAL DOMICILE:</span> <span className="text-zinc-300">Nairobi, Kenya</span></div>
              <div><span className="text-zinc-500">DISPUTE RESOLUTION:</span> <span className="text-zinc-300">Arbitration under CIArb Kenya / International Chamber of Commerce</span></div>
              <div><span className="text-zinc-500">LEGAL INQUIRIES:</span> <span className="text-red-400 font-bold">legal@securefixke.tech</span></div>
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
