"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconUser() {
  return (
    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

function IconCheck({ valid }: { valid: boolean }) {
  if (valid) {
    return (
      <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 inline-block shrink-0" />
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time password validation metrics
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      setError("Please provide both callsign and primary operator email.");
      return;
    }

    if (!isPasswordValid) {
      setError("Passphrase does not satisfy security protocol requirements (8+ chars, uppercase, number, special char).");
      return;
    }

    if (!agreed) {
      setError("Operator telemetry agreement must be acknowledged.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Provision account
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to provision operator identity.");
      }

      // 2. Auto-login upon successful registration
      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.access_token) {
        localStorage.setItem("token", loginData.access_token);
        if (loginData.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/onboarding");
        }
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message || "Identity registration failed. Check network or connection to Citadel node.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fill convenience helper for development / demo
  const handleFillDemo = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setUsername(`pilot_${randomSuffix}`);
    setEmail(`pilot_${randomSuffix}@aincrad.dev`);
    setPassword("Cipher@2026Node!");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col justify-between antialiased selection:bg-red-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

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
            / PROVISION_OPERATOR
          </span>
        </Link>

        <div className="flex items-center gap-5 text-xs font-mono">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shadow-[0_0_8px_#3b82f6]" />
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
              <span>OPERATOR ONBOARDING // PROTOCOL V1.0</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Provision Your Operator <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-blue-400 bg-clip-text text-transparent">
                Telemetry Node.
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
              Establish verified cryptographic credentials to stream telemetry pipelines, manage distributed tripwires, and supervise autonomous failovers in real time.
            </p>

            {/* Live Operational Metrics Matrix */}
            <div className="mt-8 bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                <span>Cluster Readiness Metric</span>
                <span>System Status</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  PostgreSQL Persistence Pool
                </span>
                <span className="text-emerald-400 font-bold">ONLINE (16.x)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  JWT Token Brokerage
                </span>
                <span className="text-blue-400 font-bold">HS256 ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                  Autonomous Tripwires
                </span>
                <span className="text-red-400 font-bold">ARMED &amp; SYNCHED</span>
              </div>
            </div>

            {/* Provisioning Guarantees */}
            <ul className="mt-6 space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Instant workspace provisioning with role-based access governance</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Full access to Fleet Console metrics, service status, and subprocesses</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Automated tripwire anomaly detection with &lt;50ms response rate</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>IDENTITY BROKER // V1.0</span>
            <span className="text-red-400 font-bold">CITADEL READY</span>
          </div>
        </section>

        {/* Right Column: High-Precision Registration Form */}
        <section className="lg:w-1/2 bg-[#05091a]/95 rounded-2xl p-6 sm:p-8 md:p-10 border border-zinc-800 shadow-2xl flex flex-col justify-center relative">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-red-400 tracking-wider uppercase">
                IDENTITY REGISTRATION
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-900/80 px-2.5 py-1 rounded-md font-semibold transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                title="Populate sample operator details"
              >
                Auto-fill Sample
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
              Create Operator Identity
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Configure your credentials to provision node access across the Citadel.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2.5 shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Callsign / Username */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Operator Callsign / Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <IconUser />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kirito_01"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono placeholder:text-zinc-600 transition-all outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Primary Operator Email
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

            {/* Passphrase */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Master Security Passphrase
              </label>
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

              {/* Real-time Password Protocol Requirements */}
              <div className="mt-2.5 p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-[11px] font-mono space-y-1.5">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">
                  Cryptographic Passphrase Requirements:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
                    <IconCheck valid={hasMinLength} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
                    <IconCheck valid={hasUppercase} />
                    <span>1+ uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
                    <IconCheck valid={hasNumber} />
                    <span>1+ numeric digit</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-400 font-semibold" : "text-zinc-500"}`}>
                    <IconCheck valid={hasSpecial} />
                    <span>1+ special symbol</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 accent-red-600 shrink-0"
                />
                <span className="text-xs text-zinc-400 font-medium leading-relaxed">
                  I agree to the operator security protocol and data telemetry governance policies.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>PROVISIONING OPERATOR NODE &amp; LOGGING IN...</span>
                </>
              ) : (
                <span>PROVISION WORKSPACE &amp; ENTER CONSOLE</span>
              )}
            </button>
          </form>

          {/* Sign in prompt */}
          <div className="mt-8 pt-5 border-t border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-400">
              Already have an operator identity?{" "}
              <Link href="/login" className="text-red-400 font-bold hover:underline">
                Authenticate here →
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
