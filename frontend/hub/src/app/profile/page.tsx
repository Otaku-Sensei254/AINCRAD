"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  tier?: string;
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
}

interface Organization {
  id: string;
  name: string;
  projects?: { id: string; name: string }[];
  memberships?: { role: string }[];
}

type TabType = "identity" | "security" | "preferences" | "audit";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name?: string, email?: string): string {
  if (name && name.length > 0) return name.slice(0, 2).toUpperCase();
  if (email && email.length > 0) return email.slice(0, 2).toUpperCase();
  return "OP";
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// ── Icons ────────────────────────────────────────────────────────────────────
function IconHub() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
// ── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("identity");

  // Interactive feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Organization creation state
  const [newOrgName, setNewOrgName] = useState("");
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Telemetry preferences (stored locally)
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [latencyThreshold, setLatencyThreshold] = useState("300");
  const [refreshInterval, setRefreshInterval] = useState("15");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [crashAlerts, setCrashAlerts] = useState(true);

  // Trigger toast helper
  const showToastNotification = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Copy helper
  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      showToastNotification(`${label} copied to clipboard`);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedSound = localStorage.getItem("aincrad_pref_sound");
      if (savedSound !== null) setSoundAlerts(savedSound === "true");

      const savedThreshold = localStorage.getItem("aincrad_pref_threshold");
      if (savedThreshold) setLatencyThreshold(savedThreshold);

      const savedInterval = localStorage.getItem("aincrad_pref_interval");
      if (savedInterval) setRefreshInterval(savedInterval);

      const savedEmail = localStorage.getItem("aincrad_pref_email_alerts");
      if (savedEmail !== null) setEmailAlerts(savedEmail === "true");

      const savedCrash = localStorage.getItem("aincrad_pref_crash_alerts");
      if (savedCrash !== null) setCrashAlerts(savedCrash === "true");
    } catch {}
  }, []);

  // Save preference handler
  const savePreference = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      showToastNotification("Telemetry preference saved");
    } catch {}
  };

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API}/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([userData, orgsData]) => {
        if (!userData) {
          router.push("/login");
          return;
        }
        setUser(userData);
        if (Array.isArray(orgsData)) {
          setOrgs(orgsData);
        }
      })
      .catch((err) => {
        console.error(err);
        showToastNotification("Failed to load user profile", "error");
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Handle Organization Creation
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setIsCreatingOrg(true);

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`${API}/organizations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newOrgName.trim() }),
      });

      if (res.ok) {
        const created = await res.json();
        setOrgs((prev) => [...prev, created]);
        setNewOrgName("");
        showToastNotification(`Organization "${created.name}" established`);
      } else {
        showToastNotification("Failed to create organization", "error");
      }
    } catch {
      showToastNotification("Network error creating organization", "error");
    } finally {
      setIsCreatingOrg(false);
    }
  };

  // Handle Password Update Mock/Validation
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      showToastNotification("Current password is required", "error");
      return;
    }
    if (newPassword.length < 8) {
      showToastNotification("New password must be at least 8 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToastNotification("Passwords do not match", "error");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToastNotification("Password credentials updated successfully");
    }, 1000);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  // Loading Screen
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-zinc-200/90 shadow-md">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs font-bold text-zinc-700 tracking-wider">
            SYNCHRONIZING OPERATOR DOSSIER...
          </span>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.username, user.email);
  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-900 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* ── Toast Notification ────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-mono font-bold shadow-xl transition-all animate-bounce ${
            toast.type === "error"
              ? "bg-red-950 text-red-200 border-red-700"
              : "bg-black text-white border-zinc-700"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : "bg-blue-500 shadow-[0_0_6px_#3b82f6]"}`} />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ── Precision Navbar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/app")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-800 text-xs font-bold text-white transition-all shadow-2xs font-mono"
          >
            <IconHub />
            <span>FLEET HUB</span>
          </button>

          <div className="h-4 w-px bg-zinc-200" />

          <div className="flex items-center gap-2">
            <Image src="/AINCRAD-NOBG.png" alt="AINCRAD" width={92} height={22} className="opacity-95" priority />
            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
              V1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="hidden sm:inline">GATEWAY LINK:</span>
            <span className="text-zinc-900">ENCRYPTED</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-mono font-bold transition-all shadow-2xs"
          >
            <IconLogout />
            <span className="hidden sm:inline">SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* ── Page Container ────────────────────────────────────────────── */}
      <main className="flex-1 p-5 md:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* ── Cyber Command Hero Profile Header ──────────────────────── */}
        <div className="relative bg-black rounded-3xl overflow-hidden border border-zinc-800 shadow-xl">
          {/* Visual Accents & Backdrop Gradients */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10% 20%, #2563eb 0%, transparent 45%), radial-gradient(circle at 90% 80%, #ef4444 0%, transparent 45%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.06) 20px, rgba(255,255,255,0.06) 21px)",
            }}
          />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Avatar & Identity Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Large Avatar Badge */}
                <div className="relative shrink-0">
                  <div
                    className={`w-24 h-24 rounded-2xl flex items-center justify-center font-mono text-3xl font-black text-white shadow-2xl border-2 ${
                      isAdmin
                        ? "bg-gradient-to-br from-red-600 via-rose-700 to-black border-red-400/50 shadow-red-950/50"
                        : "bg-gradient-to-br from-blue-600 via-indigo-700 to-black border-blue-400/50 shadow-blue-950/50"
                    }`}
                  >
                    {initials}
                  </div>
                  {/* Status Indicator Beacon */}
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-black rounded-full border border-zinc-800">
                    <span className="w-3.5 h-3.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse" />
                  </div>
                </div>

                {/* Identity Text */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">
                      {user.username || user.email.split("@")[0]}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                        isAdmin
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      }`}
                    >
                      <IconShield />
                      {user.role?.toUpperCase() || "OPERATOR"}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                      {user.tier?.toUpperCase() || "FREE"} TIER
                    </span>
                  </div>

                  <p className="text-zinc-400 font-mono text-xs">{user.email}</p>

                  <div className="flex gap-2 pt-2">
                    {["PRO", "TEAM"].filter((t) => {
                      const order = { FREE: 0, PRO: 1, TEAM: 2 };
                      return (order[t as keyof typeof order] ?? 0) > (order[(user.tier || "FREE").toUpperCase() as keyof typeof order] ?? 0);
                    }).map((t) => (
                      <button
                        key={t}
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/billing/initialize`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ email: user.email, tier: t, callbackUrl: window.location.origin + "/payment/callback" }),
                          });
                          const data = await res.json();
                          if (data?.authorization_url) window.location.href = data.authorization_url;
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg"
                      >
                        Upgrade to {t}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <span className="text-zinc-400 font-bold">UID:</span>
                      <code className="text-zinc-300 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-zinc-800">
                        {user.id}
                      </code>
                      <button
                        onClick={() => handleCopy(user.id, "uid_hero", "Operator ID")}
                        title="Copy UID"
                        className="p-1 hover:text-white transition-colors"
                      >
                        <IconCopy />
                      </button>
                    </span>
                    <span>•</span>
                    <span>JOINED {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Controls */}
              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                <button
                  onClick={() => router.push("/app")}
                  className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-900/30"
                >
                  <IconActivity />
                  <span>FLEET TELEMETRY</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-red-500/30 text-red-400 hover:text-red-300 font-mono text-xs font-bold transition-all"
                  >
                    <IconShield />
                    <span>ADMIN COMMAND</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom KPI Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
              <div className="bg-zinc-900/60 border border-zinc-800/70 rounded-xl p-3">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Security State
                </span>
                <span className="text-xs font-mono font-bold text-blue-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  AUTHENTICATED
                </span>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/70 rounded-xl p-3">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Organizations
                </span>
                <span className="text-xs font-mono font-bold text-white mt-1">
                  {orgs.length} ASSIGNED
                </span>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/70 rounded-xl p-3">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Probe Protocol
                </span>
                <span className="text-xs font-mono font-bold text-blue-400 mt-1">
                  HTTP / TCP / SSL
                </span>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/70 rounded-xl p-3">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Session Integrity
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ACTIVE & ENCRYPTED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sub-Navigation Tabs ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-zinc-200 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("identity")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
              activeTab === "identity"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80"
            }`}
          >
            <IconBuilding />
            <span>IDENTITY & ORGANIZATIONS</span>
            {orgs.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === "identity" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-700"}`}>
                {orgs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
              activeTab === "security"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80"
            }`}
          >
            <IconKey />
            <span>CREDENTIALS & KEYS</span>
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
              activeTab === "preferences"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80"
            }`}
          >
            <IconSettings />
            <span>TELEMETRY PREFERENCES</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
              activeTab === "audit"
                ? "bg-black text-white shadow-xs"
                : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80"
            }`}
          >
            <IconActivity />
            <span>AUDIT & SESSIONS</span>
          </button>
        </div>

        {/* ── TAB 1: IDENTITY & ORGANIZATIONS ──────────────────────────── */}
        {activeTab === "identity" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Operator Attributes Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 uppercase">
                      OPERATOR IDENTITY PARAMETERS
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">CONFIGURED</span>
                </div>

                <div className="divide-y divide-zinc-100 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
                    <span className="text-zinc-500 font-semibold">Operator Callsign (Username)</span>
                    <span className="text-zinc-950 font-bold">{user.username || "—"}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
                    <span className="text-zinc-500 font-semibold">Registered Email Route</span>
                    <span className="text-zinc-950 font-bold">{user.email}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
                    <span className="text-zinc-500 font-semibold">Security Role / Access Level</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold w-fit ${
                        isAdmin
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      <IconShield />
                      {user.role}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
                    <span className="text-zinc-500 font-semibold">System Operator Identifier</span>
                    <div className="flex items-center gap-2">
                      <code className="text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-bold">
                        {user.id}
                      </code>
                      <button
                        onClick={() => handleCopy(user.id, "uid_row", "Operator ID")}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-800 transition-colors"
                      >
                        <IconCopy />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
                    <span className="text-zinc-500 font-semibold">Account Commissioned Date</span>
                    <span className="text-zinc-800">{formatDate(user.createdAt)}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
                    <span className="text-zinc-500 font-semibold">Last Dossier Modification</span>
                    <span className="text-zinc-800">{formatDate(user.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Organization Directory & Creation */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-2.5">
                    <IconBuilding />
                    <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 uppercase">
                      ORGANIZATIONS & TENANCY
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">
                    {orgs.length} REGISTERED
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  {orgs.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center mx-auto text-zinc-500 mb-2">
                        <IconBuilding />
                      </div>
                      <p className="font-mono text-xs font-bold text-zinc-700">NO ORGANIZATIONS CONFIGURED</p>
                      <p className="font-mono text-[11px] text-zinc-400 mt-1 max-w-sm mx-auto">
                        You currently operate in standalone mode. Create an organization to partition apps, services, and team telemetry.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {orgs.map((org) => (
                        <div
                          key={org.id}
                          className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 hover:border-blue-300 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-zinc-950 uppercase">
                                {org.name}
                              </span>
                              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                                TENANT
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                              ID: {org.id}
                            </span>
                          </div>

                          <div className="mt-3 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-500">
                              {org.projects?.length ?? 0} Associated Projects
                            </span>
                            <button
                              onClick={() => handleCopy(org.id, `org_${org.id}`, "Org ID")}
                              className="text-blue-600 hover:underline font-bold flex items-center gap-1"
                            >
                              <IconCopy />
                              <span>COPY ID</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Organization Form */}
                  <form onSubmit={handleCreateOrg} className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      placeholder="e.g. Enterprise Production Fleet, EU Cluster"
                      className="flex-1 px-4 py-2.5 text-xs font-mono rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isCreatingOrg || !newOrgName.trim()}
                      className="px-5 py-2.5 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-2"
                    >
                      {isCreatingOrg ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>CREATING...</span>
                        </>
                      ) : (
                        <span>+ CREATE ORG</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right: Security Badge / Node Access Status */}
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
                    OPERATOR CLEARANCE
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-xs space-y-2 border border-zinc-800">
                  <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <span>SECURITY ENCLAVE</span>
                    <span className="text-blue-400 font-bold">AINCRAD-RING-0</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <span>ACCESS SCOPE</span>
                    <span className="text-zinc-200 font-bold">READ / WRITE / INGEST</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <span>AUDIT LOGGING</span>
                    <span className="text-emerald-400 font-bold">MANDATORY ACTIVE</span>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                  All configuration adjustments, telemetry heartbeats, and endpoint probe definitions dispatched under this operator ID are cryptographically signed and stored in the immutable fleet audit register.
                </p>
              </div>

              {/* Quick Launch Panel */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900">
                  PLATFORM NAVIGATION
                </h3>

                <div className="space-y-2 font-mono text-xs">
                  <button
                    onClick={() => router.push("/app")}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all font-bold text-zinc-800"
                  >
                    <span>MONITORED FLEET</span>
                    <span className="text-blue-600">→</span>
                  </button>

                  <button
                    onClick={() => router.push("/docs")}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all font-bold text-zinc-800"
                  >
                    <span>API DOCUMENTATION</span>
                    <span className="text-blue-600">→</span>
                  </button>

                  <button
                    onClick={() => router.push("/onboarding")}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all font-bold text-zinc-800"
                  >
                    <span>ONBOARDING WIZARD</span>
                    <span className="text-blue-600">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: CREDENTIALS & KEYS ────────────────────────────────── */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Policy & Ingestion Key */}
            <div className="space-y-6">
              {/* Operator Authentication Policy */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                    <IconKey />
                    <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 uppercase">
                      OPERATOR AUTHENTICATION POLICY
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    ENFORCED
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                    Session integrity is continuously validated at the perimeter gateway. Credentials and bearer claims are encrypted in-flight using TLS 1.3 and verified via SHA-256 HMAC signatures.
                  </p>

                  <div className="divide-y divide-zinc-100 border border-zinc-200/90 rounded-xl bg-zinc-50/50 font-mono text-xs">
                    <div className="flex items-center justify-between p-3.5">
                      <span className="text-zinc-500 font-semibold">Token Architecture</span>
                      <span className="font-bold text-zinc-900">Signed JWT (Stateless)</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5">
                      <span className="text-zinc-500 font-semibold">Storage Protection</span>
                      <span className="font-bold text-zinc-900">Encrypted Local Enclave</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5">
                      <span className="text-zinc-500 font-semibold">Transmission Layer</span>
                      <span className="font-bold text-emerald-600">HTTPS / TLS 1.3 Mandatory</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5">
                      <span className="text-zinc-500 font-semibold">Session Status</span>
                      <span className="font-bold text-blue-600">Active (Auto-Renewing)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingestion API Key Card */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                    <IconShield />
                    <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 uppercase">
                      TELEMETRY INGESTION KEY
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    INGESTION SCOPE
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                    Assign this key to your remote daemon probes or Docker telemetry forwarders to push heartbeat packets to <code className="bg-zinc-100 px-1 py-0.5 rounded font-bold text-zinc-800">/api/heartbeat</code>.
                  </p>

                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                    <code className="text-xs font-mono text-zinc-900 font-bold flex-1 truncate">
                      ing_live_{user.id.slice(0, 12)}_telemetry_hub
                    </code>
                    <button
                      onClick={() =>
                        handleCopy(`ing_live_${user.id.slice(0, 12)}_telemetry_hub`, "ing_key", "Ingestion Key")
                      }
                      className="shrink-0 p-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition-colors shadow-2xs"
                    >
                      <IconCopy />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Update & Credential Policy */}
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                  <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 uppercase">
                    UPDATE OPERATOR PASSWORD
                  </h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4 font-mono">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">
                      CURRENT CREDENTIAL
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">
                      NEW OPERATOR PASSWORD
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 chars (uppercase, number, symbol)"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="w-full py-2.5 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>UPDATING CREDENTIALS...</span>
                        </>
                      ) : (
                        <span>COMMIT PASSWORD UPDATE</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Hardware / 2FA Status */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs font-mono space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 uppercase">TWO-FACTOR AUTH (2FA)</span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Two-factor authentication is enforced at the AINCRAD perimeter gateway. Multi-device cryptographic session tokens are validated on every telemetry payload.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: TELEMETRY PREFERENCES ─────────────────────────────── */}
        {activeTab === "preferences" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
            {/* Telemetry Polling & Alerts */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-xs font-bold tracking-widest text-zinc-900 uppercase">
                  TELEMETRY POLLING CADENCE & SOUND
                </h2>
              </div>

              <div className="p-6 space-y-5 text-xs">
                {/* Audio chime on down alerts */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div>
                    <span className="font-bold text-zinc-900 block">Audible Alert Beacons</span>
                    <span className="text-[11px] text-zinc-500">Play tone when any target node enters DEGRADED or DOWN state</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => {
                      setSoundAlerts(e.target.checked);
                      savePreference("aincrad_pref_sound", String(e.target.checked));
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                  />
                </div>

                {/* Polling Interval */}
                <div className="space-y-2 py-2 border-b border-zinc-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">Console Auto-Refresh Cadence</span>
                    <span className="text-blue-600 font-bold">{refreshInterval} SECONDS</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {["5", "15", "30", "60"].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          setRefreshInterval(sec);
                          savePreference("aincrad_pref_interval", sec);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          refreshInterval === sec
                            ? "bg-black text-white border-black"
                            : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Latency Threshold Warning */}
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">RTT Latency Warning Threshold</span>
                    <span className="text-red-600 font-bold">&gt; {latencyThreshold} ms</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { val: "150", label: "Strict (150ms)" },
                      { val: "300", label: "Standard (300ms)" },
                      { val: "500", label: "Permissive (500ms)" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => {
                          setLatencyThreshold(opt.val);
                          savePreference("aincrad_pref_threshold", opt.val);
                        }}
                        className={`py-2 px-2 text-center rounded-lg text-xs font-bold border transition-all ${
                          latencyThreshold === opt.val
                            ? "bg-black text-white border-black"
                            : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Channels */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-xs font-bold tracking-widest text-zinc-900 uppercase">
                  OPERATOR NOTIFICATION CHANNELS
                </h2>
              </div>

              <div className="p-6 space-y-5 text-xs">
                {/* Email Alerts */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div>
                    <span className="font-bold text-zinc-900 block">Critical Outage Dispatch</span>
                    <span className="text-[11px] text-zinc-500">Dispatch immediate alert to {user.email}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => {
                      setEmailAlerts(e.target.checked);
                      savePreference("aincrad_pref_email_alerts", String(e.target.checked));
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                  />
                </div>

                {/* Subprocess Crash Alerts */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div>
                    <span className="font-bold text-zinc-900 block">Process Crash Tripwires</span>
                    <span className="text-[11px] text-zinc-500">Capture exit code != 0 and bound PID terminations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={crashAlerts}
                    onChange={(e) => {
                      setCrashAlerts(e.target.checked);
                      savePreference("aincrad_pref_crash_alerts", String(e.target.checked));
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-zinc-300 focus:ring-blue-500"
                  />
                </div>

                {/* Timezone & Locale */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">
                    OBSERVABILITY CLOCK DISPLAY
                  </span>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-700 flex items-center justify-between">
                    <span>Client Local System Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
                    <span className="text-blue-600 font-bold">SYNCHRONIZED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: AUDIT & SESSIONS ──────────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="space-y-6 font-mono">
            {/* Active Browser Session Card */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <h2 className="text-xs font-bold tracking-widest text-zinc-900 uppercase">
                    ACTIVE OPERATOR BROWSER SESSIONS
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  CURRENT ENCLAVE
                </span>
              </div>

              <div className="p-6">
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900">
                        Localhost Development Gateway / Linux WebKit
                      </span>
                      <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                        THIS DEVICE
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      IP: 127.0.0.1 • Port 3000 • Authenticated via Bearer Token
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Session established: {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="self-start md:self-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    TERMINATE SESSION
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Log Register */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-xs font-bold tracking-widest text-zinc-900 uppercase">
                  OPERATOR SECURITY AUDIT TRAIL
                </h2>
              </div>

              <div className="divide-y divide-zinc-100 text-xs">
                {[
                  {
                    action: "AUTH_SESSION_RENEWED",
                    detail: "JWT Bearer validation verified against Gateway Auth service",
                    time: "Just now",
                    status: "SUCCESS",
                  },
                  {
                    action: "TELEMETRY_SYNC_PULL",
                    detail: "Active fleet nodes probed via /api/health cluster matrix",
                    time: "3 mins ago",
                    status: "OK",
                  },
                  {
                    action: "ORGANIZATION_QUERY",
                    detail: "Retrieved tenant partition records via /organizations",
                    time: "8 mins ago",
                    status: "OK",
                  },
                  {
                    action: "ACCESS_TOKEN_VERIFIED",
                    detail: "HMAC signature verified for operator callsign",
                    time: "24 mins ago",
                    status: "VERIFIED",
                  },
                ].map((log, idx) => (
                  <div key={idx} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">{log.action}</span>
                        <span className="text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200 px-1.5 py-0.2 rounded">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">{log.detail}</p>
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-4 text-center mt-auto shadow-2xs">
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
