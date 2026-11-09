"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconShield() {
  return (
    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

function IconEye({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="w-4 h-4 text-zinc-400 hover:text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-zinc-400 hover:text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please provide both operator identity and security token.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid operator credentials or node unreachable.");
      }
      localStorage.setItem("token", data.access_token);
      sessionStorage.setItem("token", data.access_token);
      document.cookie = `token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/app");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your network or server connection.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fill convenience for quick testing
  const handleFillAdmin = () => {
    setEmail("dhuhuinc@gmail.com");
    setPassword("Admin@123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col justify-between antialiased selection:bg-red-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Bar Navigation ── */}
      <header className="w-full bg-[#05091a]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/AINCRAD-NOBG.png"
            alt="AINCRAD"
            width={130}
            height={43}
            priority
            className="h-7 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
          />
          <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider">
            / AUTH_GATEWAY
          </span>
        </Link>

        <div className="flex items-center gap-5 text-xs font-mono">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]" />
            TLS 1.3 ENCRYPTED
          </span>
          <Link
            href="/"
            className="text-zinc-400 hover:text-white font-sans font-semibold transition-colors flex items-center gap-1"
          >
            ← Return to Citadel
          </Link>
        </div>
      </header>

      {/* ── Main Split View ── */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-10 items-stretch justify-center gap-8 z-10 animate-fade-in-up">
        {/* Left Column: Architectural Telemetry Overview */}
        <section className="lg:w-1/2 bg-black/85 text-white rounded-2xl p-6 sm:p-8 md:p-10 border border-zinc-800 flex flex-col justify-between scanline-effect shadow-2xl relative">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-bold text-red-400 mb-6 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ef4444]" />
              <span>AUTHENTICATION GATEWAY // PROTOCOL V1.0</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Access the Mission-Critical <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-blue-400 bg-clip-text text-transparent">
                Observability Engine.
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
              Authenticate operator identity to supervise telemetry pipelines, subprocess daemons, and autonomous failover tripwires across the fleet.
            </p>

            {/* Live Operational Metrics Matrix */}
            <div className="mt-8 bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                <span>Security Diagnostic</span>
                <span>Operational State</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  Gateway Zone us-east-01
                </span>
                <span className="text-blue-400 font-bold">&lt; 12ms RTT</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                  Tripwire Anomaly Monitor
                </span>
                <span className="text-red-400 font-bold">ARMED (0 FAILS)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  Cryptographic Token Broker
                </span>
                <span className="text-zinc-200 font-bold">JWT / HS256 ACTIVE</span>
              </div>
            </div>

            {/* Security Guarantee List */}
            <ul className="mt-6 space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <IconCheck /> Role-Based Access: Admins route to Citadel Admin, Operators route to Fleet Console
              </li>
              <li className="flex items-center gap-2">
                <IconCheck /> Automated tripwires isolate degraded endpoints in &lt;50ms
              </li>
              <li className="flex items-center gap-2">
                <IconCheck /> Zero-persistence tracking with encrypted token authentication
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>CORE PROTOCOL V1.0</span>
            <span className="text-red-400 font-bold">CONNECTED // TLS 1.3</span>
          </div>
        </section>

        {/* Right Column: High-Precision Sign-in Form */}
        <section className="lg:w-1/2 bg-[#05091a]/95 rounded-2xl p-6 sm:p-8 md:p-10 border border-zinc-800 shadow-2xl flex flex-col justify-center relative">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-red-400 tracking-wider uppercase">
                OPERATOR ACCESS
              </span>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="text-[11px] font-mono text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-900/80 px-2.5 py-1 rounded-md font-semibold transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                title="Fill in Admin credentials: dhuhuinc@gmail.com"
              >
                Auto-fill Admin Demo
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
              Sign In to AINCRAD
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter your verified operator email to manage deployed services.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2.5 shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Operator Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <IconMail />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@aincrad.dev"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono placeholder:text-zinc-600 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Access Token / Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("A cryptographic token reset request has been queued. Contact your administrator or check system logs.");
                  }}
                  className="text-xs text-red-400 hover:text-red-300 font-medium"
                >
                  Forgot token?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <IconLock />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono placeholder:text-zinc-600 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-200"
                  aria-label="Toggle password visibility"
                >
                  <IconEye open={showPw} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 accent-red-600"
                />
                <span className="text-xs text-zinc-400 font-medium">
                  Persist token on this machine
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AUTHENTICATING TELEMETRY SESSION...</span>
                </>
              ) : (
                <span>AUTHENTICATE OPERATOR &amp; ENTER CONSOLE</span>
              )}
            </button>
          </form>

          {/* Sign up prompt */}
          <div className="mt-8 pt-5 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">
              New cluster or operator?{" "}
              <Link href="/register" className="text-red-400 font-bold hover:underline">
                Provision a workspace →
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#02040b] border-t border-zinc-900 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-zinc-600 z-10">
        <span>AINCRAD OBSERVABILITY GATEWAY · RESTRICTED ACCESS · ALL ACCESS LOGGED</span>
        <span className="text-zinc-500">
          Powered by <strong className="text-zinc-400 font-semibold">SecureFixKe - D-Huhu Tech Labs</strong>
        </span>
      </footer>
    </div>
  );
}
