"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────
interface UserRecord {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER" | string;
  createdAt: string;
}

interface CurrentUser {
  id?: string;
  sub?: string;
  username: string;
  email: string;
  role: string;
}

interface Organization {
  id: string;
  name: string;
  createdAt?: string;
  projects?: { id: string; name: string }[];
  memberships?: { role: string; user?: any }[];
  apps?: ApplicationRecord[];
}

interface ApplicationRecord {
  id: string;
  name: string;
  type?: string;
  url?: string;
  healthPath?: string;
  command?: string;
  logPath?: string;
  paused?: boolean;
  projectId?: string;
  organizationId?: string;
  organizationName?: string;
}

interface PlanRecord {
  id: string;
  name: string;
  tier: "FREE" | "PRO" | "TEAM" | string;
  amount: number;
  currency: string;
  interval: string;
  active: boolean;
  maxApps?: number;
  probeInterval?: string;
  retention?: string;
}

interface BroadcastRecord {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  target?: string;
  category?: string;
}

type AdminView = "operators" | "organizations" | "apps" | "communications" | "settings";

// ── SVG Icons ────────────────────────────────────────────────────────────────
function IconShieldAdmin() {
  return (
    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

function IconRefresh({ spinning }: { spinning: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${spinning ? "animate-spin text-red-400" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

function IconCopy() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  );
}

function IconExternal() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function IconChevron({ collapsed }: { collapsed: boolean }) {
  return (
    <svg className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );
}

// ── Default Plan Specs ───────────────────────────────────────────────────────
const DEFAULT_PLANS: PlanRecord[] = [
  { id: "p-free", name: "Free Community", tier: "FREE", amount: 0, currency: "KES", interval: "monthly", active: true, maxApps: 5, probeInterval: "15s", retention: "7 Days" },
  { id: "p-pro", name: "Pro Fleet", tier: "PRO", amount: 120000, currency: "KES", interval: "monthly", active: true, maxApps: 50, probeInterval: "5s", retention: "30 Days" },
  { id: "p-team", name: "Team Enclave", tier: "TEAM", amount: 374100, currency: "KES", interval: "monthly", active: true, maxApps: 999, probeInterval: "1s", retention: "90 Days" },
];

export default function AdminPage() {
  const router = useRouter();

  // Navigation View State
  const [currentView, setCurrentView] = useState<AdminView>("operators");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const v = new URLSearchParams(window.location.search).get("view") as AdminView;
      if (v) setCurrentView(v);
    }
  }, []);

  // Collapsible Sidebar State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Authenticated State & Core Data
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [plans, setPlans] = useState<PlanRecord[]>(DEFAULT_PLANS);
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Operators Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Organizations Filter & Creation
  const [orgSearch, setOrgSearch] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>("ALL");
  const [orgFilterOpen, setOrgFilterOpen] = useState(false);
  const [orgFilterQuery, setOrgFilterQuery] = useState("");
  const orgFilterRef = useRef<HTMLDivElement>(null);

  // Communications Broadcast State
  const [broadcastAudience, setBroadcastAudience] = useState("ALL_OPERATORS");
  const [audienceOpen, setAudienceOpen] = useState(false);
  const audienceRef = useRef<HTMLDivElement>(null);
  const [broadcastCategory, setBroadcastCategory] = useState("FEATURE_UPDATE");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  // System Settings State
  const [systemCadence, setSystemCadence] = useState("15");
  const [latencyThreshold, setLatencyThreshold] = useState("300");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [rateLimit, setRateLimit] = useState("5000");
  const [rateLimitOpen, setRateLimitOpen] = useState(false);
  const rateLimitRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (orgFilterRef.current && !orgFilterRef.current.contains(e.target as Node)) {
        setOrgFilterOpen(false);
      }
      if (audienceRef.current && !audienceRef.current.contains(e.target as Node)) {
        setAudienceOpen(false);
      }
      if (rateLimitRef.current && !rateLimitRef.current.contains(e.target as Node)) {
        setRateLimitOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Keyboard shortcut Ctrl+B for sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("aincrad_admin_sidebar_collapsed", String(next));
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Restore sidebar state & settings from localStorage
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem("aincrad_admin_sidebar_collapsed");
      if (savedCollapsed !== null) setSidebarCollapsed(savedCollapsed === "true");

      const savedCadence = localStorage.getItem("aincrad_sys_cadence");
      if (savedCadence) setSystemCadence(savedCadence);

      const savedMaint = localStorage.getItem("aincrad_sys_maintenance");
      if (savedMaint !== null) setMaintenanceMode(savedMaint === "true");

      const savedReg = localStorage.getItem("aincrad_sys_registration");
      if (savedReg !== null) setRegistrationOpen(savedReg === "true");
    } catch {}
  }, []);

  // Sync currentView to URL
  const switchView = (view: AdminView) => {
    setCurrentView(view);
    router.replace(`/admin?view=${view}`, { scroll: false });
  };

  // Fetch verified session & all Citadel records
  const loadData = useCallback(async (showRefresh = false) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (showRefresh) setRefreshing(true);
    setError("");

    try {
      // 1. Verify caller identity and ADMIN role
      const meRes = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meRes.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const me = await meRes.json();
      if (me.role !== "ADMIN") {
        router.push("/app");
        return;
      }
      setCurrentUser(me);

      // 2. Fetch all registered users
      const usersRes = await fetch(`${API}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }

      // 3. Fetch Organizations
      const orgsRes = await fetch(`${API}/admin/organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let orgsList: Organization[] = [];
      if (orgsRes.ok) {
        const orgsData = await orgsRes.json();
        orgsList = Array.isArray(orgsData) ? orgsData : [];
      }

      // 4. Fetch Applications for each organization
      const allApps: ApplicationRecord[] = [];
      for (const org of orgsList) {
        try {
          const appRes = await fetch(`${API}/applications?organizationId=${org.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (appRes.ok) {
            const orgApps = await appRes.json();
            if (Array.isArray(orgApps)) {
              orgApps.forEach((a) => {
                allApps.push({ ...a, organizationId: org.id, organizationName: org.name });
              });
              org.apps = orgApps;
            }
          }
        } catch {}
      }
      setOrganizations(orgsList);
      setApplications(allApps);

      // 5. Fetch Plans
      const plansRes = await fetch(`${API}/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        if (Array.isArray(plansData) && plansData.length > 0) {
          setPlans((prev) =>
            plansData.map((p: any) => {
              const matchedDefault = DEFAULT_PLANS.find((d) => d.tier === p.tier);
              return {
                ...p,
                maxApps: matchedDefault?.maxApps ?? 10,
                probeInterval: matchedDefault?.probeInterval ?? "15s",
                retention: matchedDefault?.retention ?? "14 Days",
              };
            })
          );
        }
      }

      // 6. Fetch Broadcast History
      const bRes = await fetch(`${API}/admin/broadcasts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (bRes.ok) {
        const bData = await bRes.json();
        setBroadcasts(Array.isArray(bData) ? bData : []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to establish communication with Citadel database gateway.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  const copyToClipboard = (text: string, id: string, label = "UUID") => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aincrad-operators-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Operator roster exported as JSON");
  };

  // Filtered operator list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Filtered organizations
  const filteredOrgs = useMemo(() => {
    return organizations.filter((o) =>
      o.name.toLowerCase().includes(orgSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orgSearch.toLowerCase())
    );
  }, [organizations, orgSearch]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesOrg = selectedOrgFilter === "ALL" || app.organizationId === selectedOrgFilter;
      const matchesSearch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.url && app.url.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesOrg && matchesSearch;
    });
  }, [applications, selectedOrgFilter, searchTerm]);

  // Create Organization Handler
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setCreatingOrg(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const res = await fetch(`${API}/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newOrgName.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setOrganizations((prev) => [...prev, created]);
        setNewOrgName("");
        showToast(`Organization "${created.name}" created`);
      } else {
        showToast("Failed to create organization", "error");
      }
    } catch {
      showToast("Network error creating organization", "error");
    } finally {
      setCreatingOrg(false);
    }
  };

  // Dispatch Broadcast Email Handler
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      showToast("Subject and message body are required", "error");
      return;
    }
    setSendingBroadcast(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const res = await fetch(`${API}/admin/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          subject: broadcastSubject.trim(),
          body: broadcastBody.trim(),
          target: broadcastAudience,
          category: broadcastCategory,
        }),
      });

      if (res.ok) {
        const newRecord: BroadcastRecord = {
          id: "bc-" + Date.now(),
          subject: broadcastSubject.trim(),
          body: broadcastBody.trim(),
          target: broadcastAudience,
          category: broadcastCategory,
          createdAt: new Date().toISOString(),
        };
        setBroadcasts((prev) => [newRecord, ...prev]);
        setBroadcastSubject("");
        setBroadcastBody("");
        showToast("Email broadcast dispatched to operator fleet!");
      } else {
        showToast("Failed to queue broadcast", "error");
      }
    } catch {
      showToast("Network error dispatching broadcast", "error");
    } finally {
      setSendingBroadcast(false);
    }
  };

  // Save Plan Details Handler
  const handleSavePlan = async (tier: string, newAmount: number) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`${API}/plans/${tier}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: newAmount }),
      });
      if (res.ok) {
        setPlans((prev) =>
          prev.map((p) => (p.tier === tier ? { ...p, amount: newAmount } : p))
        );
        showToast(`Plan ${tier} pricing updated to KES ${(newAmount / 100).toLocaleString()}`);
      } else {
        showToast("Failed to update plan", "error");
      }
    } catch {
      showToast("Network error updating plan", "error");
    }
  };

  // Save System Settings Handler
  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("aincrad_sys_cadence", systemCadence);
      localStorage.setItem("aincrad_sys_maintenance", String(maintenanceMode));
      localStorage.setItem("aincrad_sys_registration", String(registrationOpen));
      showToast("Citadel system settings committed successfully");
    } catch {
      showToast("Error persisting settings", "error");
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const standardCount = users.filter((u) => u.role === "USER").length;

  // Branded full-screen loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        <div className="absolute top-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-black/60 border border-zinc-800 flex items-center justify-center p-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Image
                src="/AINCRAD-APP-LOGO.png"
                alt="AINCRAD Citadel Core"
                width={80}
                height={80}
                className="w-16 h-16 object-contain animate-pulse"
                priority
              />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
            </span>
          </div>

          <div className="text-center space-y-2">
            <div className="text-sm font-mono font-bold tracking-widest text-red-400 uppercase">
              CITADEL CONTROL PLANE // VERIFYING ROOT CLEARANCE
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Synchronizing cluster node permissions, tenancy, &amp; operator rosters...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030614] text-zinc-100 flex flex-col antialiased selection:bg-red-600 selection:text-white relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-mono font-bold shadow-2xl transition-all animate-bounce ${
            toast.type === "error"
              ? "bg-red-950 text-red-200 border-red-700"
              : "bg-black text-white border-zinc-700"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500 shadow-[0_0_6px_#10b981]"}`} />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Maintenance Mode Alert Banner */}
      {maintenanceMode && (
        <div className="bg-amber-500/15 border-b border-amber-500/40 text-amber-300 px-6 py-2 text-xs font-mono font-bold flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>GLOBAL MAINTENANCE MODE ENGAGED — CITADEL PROBES RESTRICTED TO ROOT OPERATORS</span>
          </div>
          <button
            onClick={() => setMaintenanceMode(false)}
            className="text-[10px] uppercase underline text-amber-200 hover:text-white"
          >
            DISENGAGE
          </button>
        </div>
      )}

      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-30 w-full bg-[#05091a]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
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

          <div className="h-5 w-px bg-zinc-800 hidden sm:block" />

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/40 border border-red-900/60 text-[10px] font-mono font-bold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shadow-[0_0_6px_#ef4444]" />
            <span>CITADEL_CORE // ROOT_ADMIN</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono">
              <div className="w-6 h-6 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center font-bold text-red-400 text-[11px]">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-zinc-200 font-bold leading-none">{currentUser.username}</div>
                <div className="text-[10px] text-zinc-500 leading-none mt-0.5">{currentUser.email}</div>
              </div>
              <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                ROOT
              </span>
            </div>
          )}

          {/* Quick Nav to Fleet App */}
          <Link
            href="/app"
            className="text-xs font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Fleet Console</span>
            <span className="text-zinc-500">→</span>
          </Link>

          {/* Refresh Action */}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh database records"
          >
            <IconRefresh spinning={refreshing} />
          </button>

          {/* Terminate Session */}
          <button
            onClick={handleLogout}
            className="text-xs font-mono font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-900/60 px-3 py-1.5 rounded-xl transition-all"
          >
            De-auth
          </button>
        </div>
      </header>

      {/* ── Main Layout: Collapsible Sidebar + Dynamic View Content ── */}
      <div className="flex-1 flex w-full relative overflow-x-hidden">

        {/* ── Collapsible Admin Sidebar ─────────────────────────────── */}
        <aside
          className={`shrink-0 bg-[#040714] border-r border-zinc-800/80 transition-all duration-300 flex flex-col justify-between z-20 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Top of Sidebar: Toggle & Navigation Links */}
          <div className="p-3 space-y-4">
            {/* Collapse / Expand Header */}
            <div className="flex items-center justify-between px-2 pt-2">
              {!sidebarCollapsed && (
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                    NAVIGATION VIEWS
                  </span>
                  <span className="text-[10px] font-mono text-red-400 font-bold block">
                    CORE V1.0
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  setSidebarCollapsed((prev) => {
                    const next = !prev;
                    localStorage.setItem("aincrad_admin_sidebar_collapsed", String(next));
                    return next;
                  });
                }}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all mx-auto lg:mx-0"
                title={sidebarCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
              >
                <IconChevron collapsed={sidebarCollapsed} />
              </button>
            </div>

            {/* Navigation Buttons */}
            <nav className="space-y-1.5 pt-2 font-mono text-xs">
              {/* 1. Operators */}
              <button
                onClick={() => switchView("operators")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                  currentView === "operators"
                    ? "bg-red-950/60 text-red-400 border border-red-800 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                }`}
                title="Fleet Operators"
              >
                <IconUser />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Fleet Operators</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                      {users.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 2. Organizations */}
              <button
                onClick={() => switchView("organizations")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                  currentView === "organizations"
                    ? "bg-red-950/60 text-red-400 border border-red-800 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                }`}
                title="Organizations"
              >
                <IconBuilding />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Organizations</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                      {organizations.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 3. Apps & Endpoints */}
              <button
                onClick={() => switchView("apps")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                  currentView === "apps"
                    ? "bg-red-950/60 text-red-400 border border-red-800 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                }`}
                title="Apps Tied to Orgs"
              >
                <IconServer />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Apps Tied to Orgs</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                      {applications.length}
                    </span>
                  </div>
                )}
              </button>

              {/* 4. Communications */}
              <button
                onClick={() => switchView("communications")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                  currentView === "communications"
                    ? "bg-red-950/60 text-red-400 border border-red-800 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                }`}
                title="Email Communications"
              >
                <IconMail />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Communications</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                      MAIL
                    </span>
                  </div>
                )}
              </button>

              {/* 5. System Settings & Plans */}
              <button
                onClick={() => switchView("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                  currentView === "settings"
                    ? "bg-red-950/60 text-red-400 border border-red-800 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent"
                }`}
                title="System Settings & Plans"
              >
                <IconSliders />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span>Settings &amp; Plans</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                      CORE
                    </span>
                  </div>
                )}
              </button>
            </nav>
          </div>

          {/* Bottom of Sidebar: Operator Dossier */}
          <div className="p-3 border-t border-zinc-800/80 space-y-2">
            {!sidebarCollapsed ? (
              <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-bold">{currentUser?.username}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                </div>
                <div className="text-[10px] text-zinc-500 truncate">{currentUser?.email}</div>
                <div className="text-[9px] text-red-400 font-bold pt-1">
                  CLEARANCE: LEVEL 5 (ROOT)
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center font-bold text-red-400 text-xs font-mono">
                  {currentUser?.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main View Content Area ────────────────────────────────── */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 z-10 overflow-y-auto">
          {/* Error Notification */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs font-mono flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => loadData(true)}
                className="underline text-red-400 hover:text-red-300 font-bold text-xs"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW 1: FLEET OPERATORS                                         */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {currentView === "operators" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* KPI Fleet Diagnostic Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Total Fleet Operators</span>
                    <IconUser />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{users.length}</span>
                    <span className="text-xs text-blue-400 font-mono">Provisioned</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Active in PostgreSQL Pool</span>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Citadel Administrators</span>
                    <IconShieldAdmin />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-red-400 font-mono">{adminCount}</span>
                    <span className="text-xs text-red-400/80 font-mono">Elevated</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>Full Citadel Core Governance</span>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Standard Operators</span>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{standardCount}</span>
                    <span className="text-xs text-zinc-400 font-mono">Console Scope</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Telemetry Node Access</span>
                  </div>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Database Gateway</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-emerald-400 font-mono">PostgreSQL</span>
                    <span className="text-xs text-emerald-500 font-mono font-bold">NOMINAL</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <span>Port: 5432 · Latency &lt; 4ms</span>
                  </div>
                </div>
              </section>

              {/* Table Controls & Filter Toolbar */}
              <section className="bg-black/75 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                  <div>
                    <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <span>Operator Roster &amp; Access Registry</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {filteredUsers.length} shown
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Inspect operator credentials, security roles, and account provisioning timestamps.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={exportJSON}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <IconCopy />
                      <span>Export JSON</span>
                    </button>

                    <div className="relative min-w-[220px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <IconSearch />
                      </span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter by callsign, email..."
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-xs font-mono text-white rounded-xl pl-9 pr-3 py-1.5 outline-none placeholder:text-zinc-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setRoleFilter("ALL")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      roleFilter === "ALL"
                        ? "bg-red-950/70 border border-red-800 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        : "bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    ALL OPERATORS ({users.length})
                  </button>
                  <button
                    onClick={() => setRoleFilter("ADMIN")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      roleFilter === "ADMIN"
                        ? "bg-red-950/70 border border-red-800 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        : "bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    ADMINS ({adminCount})
                  </button>
                  <button
                    onClick={() => setRoleFilter("USER")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      roleFilter === "USER"
                        ? "bg-blue-950/70 border border-blue-800 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                        : "bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    STANDARD OPERATORS ({standardCount})
                  </button>
                </div>

                {/* Operator Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/40">
                        <th className="py-3 px-4">Operator Identity</th>
                        <th className="py-3 px-4">Primary Email</th>
                        <th className="py-3 px-4">Security Clearance</th>
                        <th className="py-3 px-4">Provisioned At</th>
                        <th className="py-3 px-4 text-right">Node ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 text-xs font-mono">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-zinc-500 font-mono">
                            No operators found matching the active query criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isAdmin = u.role === "ADMIN";
                          const formattedDate = new Date(u.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors group">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                                      isAdmin
                                        ? "bg-red-950/60 border-red-800/80 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                                        : "bg-blue-950/60 border-blue-800/80 text-blue-400"
                                    }`}
                                  >
                                    {u.username ? u.username.charAt(0).toUpperCase() : "U"}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                                      <span>{u.username}</span>
                                      {currentUser?.username === u.username && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-normal">
                                          YOU
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-mono">
                                      Cluster Node: active
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-zinc-300">
                                <span className="select-all hover:text-white transition-colors">{u.email}</span>
                              </td>

                              <td className="py-3 px-4">
                                {isAdmin ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-800 text-[10px] font-bold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    ADMINISTRATOR
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/70 border border-blue-800 text-[10px] font-bold text-blue-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    OPERATOR
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-zinc-400">
                                <span>{formattedDate}</span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => copyToClipboard(u.id, u.id, "Operator UUID")}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] transition-all font-mono"
                                  title="Copy Operator UUID"
                                >
                                  <span className="truncate max-w-[80px]">{u.id}</span>
                                  <span className="text-zinc-500">
                                    {copiedId === u.id ? (
                                      <span className="text-emerald-400 font-bold">COPIED</span>
                                    ) : (
                                      <IconCopy />
                                    )}
                                  </span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW 2: ORGANIZATIONS & TENANCY                                 */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {currentView === "organizations" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300 font-mono">
              {/* Organization KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">
                    TOTAL ORGANIZATIONS
                  </span>
                  <div className="text-3xl font-black text-white">{organizations.length}</div>
                  <span className="text-[11px] text-zinc-500 block mt-1">Tenant Enclaves Configured</span>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">
                    TOTAL MONITORED APPS
                  </span>
                  <div className="text-3xl font-black text-blue-400">{applications.length}</div>
                  <span className="text-[11px] text-zinc-500 block mt-1">Linked Across Organizations</span>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">
                    TENANCY ISOLATION
                  </span>
                  <div className="text-xl font-black text-emerald-400 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ENFORCED
                  </div>
                  <span className="text-[11px] text-zinc-500 block mt-1">RBAC Partition Verification OK</span>
                </div>
              </div>

              {/* Create Organization Banner */}
              <div className="bg-black/75 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <IconBuilding />
                      <span>PROVISION NEW TENANT ORGANIZATION</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Establish an isolated organizational tenancy partition for application telemetry.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateOrg} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="e.g. Acme Corp Cluster, EU Telemetry Hub"
                    className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/40 text-xs text-white rounded-xl px-4 py-2.5 outline-none placeholder:text-zinc-600"
                  />
                  <button
                    type="submit"
                    disabled={creatingOrg || !newOrgName.trim()}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                  >
                    {creatingOrg ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>PROVISIONING...</span>
                      </>
                    ) : (
                      <span>+ PROVISION ORG</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Organization Roster */}
              <div className="bg-black/75 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-black text-white">ORGANIZATIONAL DIRECTORY</h2>
                    <span className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                      {filteredOrgs.length} Tenancies
                    </span>
                  </div>
                  <div className="relative min-w-[200px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <IconSearch />
                    </span>
                    <input
                      type="text"
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                      placeholder="Search organizations..."
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl pl-9 pr-3 py-1.5 outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOrgs.length === 0 ? (
                    <div className="col-span-2 py-10 text-center text-zinc-500 text-xs">
                      No organizations found matching search criteria.
                    </div>
                  ) : (
                    filteredOrgs.map((org) => {
                      const orgApps = applications.filter((a) => a.organizationId === org.id);

                      return (
                        <div
                          key={org.id}
                          className="bg-[#080d24] border border-zinc-800/90 rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-base font-bold text-white uppercase">{org.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-[11px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 truncate max-w-[180px]">
                                    {org.id}
                                  </code>
                                  <button
                                    onClick={() => copyToClipboard(org.id, `org-${org.id}`, "Org ID")}
                                    className="text-zinc-500 hover:text-white p-1"
                                    title="Copy Organization ID"
                                  >
                                    <IconCopy />
                                  </button>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold bg-blue-950/70 border border-blue-800 text-blue-400 px-2 py-0.5 rounded">
                                ACTIVE TENANT
                              </span>
                            </div>

                            {/* Tied Apps Preview */}
                            <div className="mt-4 pt-3 border-t border-zinc-800/80">
                              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                                <span>TIED APPLICATIONS ({orgApps.length})</span>
                                <button
                                  onClick={() => {
                                    setSelectedOrgFilter(org.id);
                                    switchView("apps");
                                  }}
                                  className="text-red-400 hover:underline text-[11px] font-bold"
                                >
                                  View in Apps Tab →
                                </button>
                              </div>

                              {orgApps.length === 0 ? (
                                <p className="text-[11px] text-zinc-600">No applications registered under this tenancy yet.</p>
                              ) : (
                                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                  {orgApps.slice(0, 3).map((a) => (
                                    <div
                                      key={a.id}
                                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-900 text-xs"
                                    >
                                      <span className="text-zinc-200 font-bold truncate">{a.name}</span>
                                      <span className="text-[10px] text-blue-400 bg-blue-950/50 px-1.5 py-0.5 rounded">
                                        {a.type || "WEB"}
                                      </span>
                                    </div>
                                  ))}
                                  {orgApps.length > 3 && (
                                    <p className="text-[10px] text-zinc-500 text-right">
                                      +{orgApps.length - 3} more apps
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[11px] text-zinc-500">
                            <span>{org.projects?.length || 1} Linked Project Partition</span>
                            <span className="text-emerald-400">Isolation Nominal</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW 3: APPS TIED TO ORGANIZATIONS                              */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {currentView === "apps" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300 font-mono">
              {/* App KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">
                    TOTAL MONITORED APPLICATIONS
                  </span>
                  <div className="text-3xl font-black text-white">{applications.length}</div>
                  <span className="text-[11px] text-zinc-500 block mt-1">Across All Fleet Organizations</span>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">
                    ORGANIZATION ENCLAVES
                  </span>
                  <div className="text-3xl font-black text-blue-400">{organizations.length}</div>
                  <span className="text-[11px] text-zinc-500 block mt-1">Configured Tenancies</span>
                </div>

                <div className="bg-black/60 border border-zinc-800/80 rounded-2xl p-5 shadow-xl">
                  <span className="text-zinc-400 text-xs uppercase tracking-wider block mb-1">
                    SYNTHETIC PROBE PIPELINE
                  </span>
                  <div className="text-xl font-black text-emerald-400 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    DISPATCHING
                  </div>
                  <span className="text-[11px] text-zinc-500 block mt-1">HTTP / TCP Tripwires Nominal</span>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div className="bg-black/75 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <IconServer />
                      <span>APPLICATIONS TIED TO ORGANIZATIONS</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {filteredApps.length} endpoints
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Verify endpoint routes, health probe paths, linked organizations, and runtime bindings.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Custom Org Filter Dropdown */}
                    <div ref={orgFilterRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setOrgFilterOpen((v) => !v)}
                        className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-white rounded-xl px-3.5 py-2 outline-none focus:border-red-500 flex items-center gap-2 font-mono transition-all"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="max-w-[160px] truncate">
                          {selectedOrgFilter === "ALL"
                            ? `All Organizations (${organizations.length})`
                            : organizations.find((o) => o.id === selectedOrgFilter)?.name || "Selected Org"}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${orgFilterOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {orgFilterOpen && (
                        <div className="absolute left-0 mt-2 w-64 bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150 font-mono">
                          {organizations.length > 4 && (
                            <div className="mb-2 px-1">
                              <input
                                type="text"
                                value={orgFilterQuery}
                                onChange={(e) => setOrgFilterQuery(e.target.value)}
                                placeholder="Search orgs..."
                                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-2.5 py-1 text-[11px] text-white outline-none"
                              />
                            </div>
                          )}
                          <div className="max-h-56 overflow-y-auto space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrgFilter("ALL");
                                setOrgFilterOpen(false);
                                setOrgFilterQuery("");
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                selectedOrgFilter === "ALL"
                                  ? "bg-blue-600/20 text-blue-300 font-bold border border-blue-500/50"
                                  : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white"
                              }`}
                            >
                              <span>All Organizations</span>
                              <span className="text-[10px] text-zinc-500">({organizations.length})</span>
                            </button>
                            {organizations
                              .filter((o) => o.name.toLowerCase().includes(orgFilterQuery.toLowerCase()))
                              .map((o) => {
                                const isSelected = selectedOrgFilter === o.id;
                                return (
                                  <button
                                    key={o.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedOrgFilter(o.id);
                                      setOrgFilterOpen(false);
                                      setOrgFilterQuery("");
                                    }}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                      isSelected
                                        ? "bg-blue-600/20 text-blue-300 font-bold border border-blue-500/50"
                                        : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white"
                                    }`}
                                  >
                                    <span className="truncate">{o.name}</span>
                                    {isSelected && (
                                      <svg className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Search */}
                    <div className="relative min-w-[200px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <IconSearch />
                      </span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search application..."
                        className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl pl-9 pr-3 py-1.5 outline-none placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/40">
                        <th className="py-3 px-4">Application / Endpoint</th>
                        <th className="py-3 px-4">Tied Organization</th>
                        <th className="py-3 px-4">Probe Route</th>
                        <th className="py-3 px-4">Process Command</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 text-xs">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-zinc-500">
                            No applications discovered for the selected organization filter.
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-zinc-900/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-400 flex items-center justify-center font-bold text-xs">
                                  {app.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-2">
                                    <span>{app.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                                      {app.type || "WEB"}
                                    </span>
                                  </div>
                                  {app.url ? (
                                    <a
                                      href={app.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                                    >
                                      <span className="truncate max-w-[200px]">{app.url}</span>
                                      <IconExternal />
                                    </a>
                                  ) : (
                                    <span className="text-[11px] text-zinc-500">Internal service endpoint</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-bold text-zinc-200 uppercase">
                                {app.organizationName || "Default Org"}
                              </div>
                              <span className="text-[10px] text-zinc-500">
                                Org ID: {app.organizationId?.slice(0, 10)}...
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-zinc-300">
                              <code className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-[11px] font-bold text-emerald-400">
                                {app.healthPath || "/health"}
                              </code>
                            </td>

                            <td className="py-3.5 px-4 text-zinc-400">
                              <span className="truncate max-w-[180px] block">
                                {app.command || "No subprocess bound"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <Link
                                href={`/apps/${app.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                              >
                                <span>Inspect</span>
                                <IconExternal />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW 4: COMMUNICATIONS & EMAIL BROADCAST                        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {currentView === "communications" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300 font-mono">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Email Composer Form */}
                <div className="lg:col-span-2 bg-black/75 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <IconMail />
                      <h2 className="text-base font-bold text-white uppercase tracking-wider">
                        PLATFORM OPERATOR BROADCAST DISPATCHER
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded">
                      ROOT AUTHORIZED
                    </span>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                    {/* Audience Selector Custom Dropdown */}
                    <div ref={audienceRef} className="relative">
                      <label className="text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                        Target Recipient Audience
                      </label>
                      <button
                        type="button"
                        onClick={() => setAudienceOpen((v) => !v)}
                        className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl px-4 py-2.5 outline-none focus:border-red-500 flex items-center justify-between text-left font-mono transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span>
                            {broadcastAudience === "ALL_OPERATORS" && `All Platform Operators (${users.length} recipients)`}
                            {broadcastAudience === "ADMINS_ONLY" && `Citadel Administrators Only (${adminCount} recipients)`}
                            {broadcastAudience === "SUBSCRIBERS_PRO_TEAM" && "Pro & Team Active Subscribers"}
                            {broadcastAudience === "COMMUNITY_FREE" && "Community Free Tier Operators"}
                          </span>
                        </div>
                        <svg
                          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${audienceOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {audienceOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150 space-y-1 font-mono">
                          {[
                            { key: "ALL_OPERATORS", label: "All Platform Operators", sub: `${users.length} registered accounts` },
                            { key: "ADMINS_ONLY", label: "Citadel Administrators Only", sub: `${adminCount} core operators` },
                            { key: "SUBSCRIBERS_PRO_TEAM", label: "Pro & Team Active Subscribers", sub: "Commercial tier operators" },
                            { key: "COMMUNITY_FREE", label: "Community Free Tier Operators", sub: "Free plan accounts" },
                          ].map((opt) => {
                            const isSelected = broadcastAudience === opt.key;
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => {
                                  setBroadcastAudience(opt.key);
                                  setAudienceOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                                  isSelected
                                    ? "bg-red-600/15 border border-red-500/50 text-white font-bold"
                                    : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white border border-transparent"
                                }`}
                              >
                                <div>
                                  <div className="text-xs">{opt.label}</div>
                                  <div className="text-[10px] text-zinc-500">{opt.sub}</div>
                                </div>
                                {isSelected && (
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

                    {/* Announcement Category */}
                    <div>
                      <label className="text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                        Broadcast Category / Priority
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { key: "FEATURE_UPDATE", label: "🚀 Feature Release" },
                          { key: "MAINTENANCE", label: "⚠️ Maintenance" },
                          { key: "SECURITY", label: "🛡️ Security Advisory" },
                          { key: "POLICY", label: "📢 Terms / Policy" },
                        ].map((c) => (
                          <button
                            type="button"
                            key={c.key}
                            onClick={() => setBroadcastCategory(c.key)}
                            className={`py-2 px-2 rounded-xl text-center font-bold border transition-all ${
                              broadcastCategory === c.key
                                ? "bg-red-950/70 text-red-300 border-red-800 shadow-sm"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div>
                      <label className="text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                        Broadcast Subject Header
                      </label>
                      <input
                        type="text"
                        value={broadcastSubject}
                        onChange={(e) => setBroadcastSubject(e.target.value)}
                        placeholder="e.g. [MAINTENANCE] Scheduled Core Telemetry Node Upgrade"
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-2.5 outline-none focus:border-red-500 placeholder:text-zinc-600"
                      />
                    </div>

                    {/* Message Body */}
                    <div>
                      <label className="text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                        Email Message Body (Markdown Supported)
                      </label>
                      <textarea
                        value={broadcastBody}
                        onChange={(e) => setBroadcastBody(e.target.value)}
                        rows={7}
                        placeholder="Write your platform announcement or feature release notes here... Operators will receive this via email dispatch."
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl p-4 outline-none focus:border-red-500 placeholder:text-zinc-600 leading-relaxed font-sans text-xs"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">
                        Template tags: <code className="text-zinc-400">&#123;operator_name&#125;</code>, <code className="text-zinc-400">&#123;organization&#125;</code>
                      </span>
                      <button
                        type="submit"
                        disabled={sendingBroadcast || !broadcastSubject.trim() || !broadcastBody.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center gap-2"
                      >
                        {sendingBroadcast ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>DISPATCHING BROADCAST...</span>
                          </>
                        ) : (
                          <>
                            <IconMail />
                            <span>DISPATCH EMAIL BROADCAST</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right: Live Preview Box */}
                <div className="bg-[#080d24] border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                      <span className="text-zinc-400 font-bold uppercase">LIVE EMAIL PREVIEW</span>
                      <span className="text-[10px] text-blue-400 font-bold">OPERATOR CLIENT</span>
                    </div>

                    <div className="bg-black border border-zinc-800/80 rounded-xl p-4 space-y-3 text-xs font-sans">
                      <div className="border-b border-zinc-900 pb-2 space-y-1 font-mono text-[11px]">
                        <div className="text-zinc-400">
                          <strong className="text-zinc-200">From:</strong> AINCRAD Citadel Dispatch &lt;dispatch@aincrad.cloud&gt;
                        </div>
                        <div className="text-zinc-400">
                          <strong className="text-zinc-200">Subject:</strong> {broadcastSubject || "[Announcement Headline]"}
                        </div>
                      </div>

                      <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed min-h-32 text-xs">
                        {broadcastBody || "Dear Fleet Operator,\n\nYour message preview will appear here formatted as dispatched to the fleet..."}
                      </div>

                      <div className="pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                        AINCRAD OBSERVABILITY · Powered by SecureFixKe - D-Huhu Tech Labs
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed">
                    Broadcasts are recorded in the Citadel audit log and queued through high-priority outbound SMTP relays.
                  </p>
                </div>
              </div>

              {/* Sent Broadcasts History */}
              <div className="bg-black/75 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h3 className="text-base font-bold text-white uppercase">PREVIOUS BROADCAST DISPATCHES</h3>
                  <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                    {broadcasts.length} Sent
                  </span>
                </div>

                {broadcasts.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">
                    No outbound platform broadcasts on record.
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-800/60 text-xs">
                    {broadcasts.map((b) => (
                      <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{b.subject}</span>
                            <span className="text-[10px] bg-red-950/60 border border-red-800 text-red-300 px-1.5 py-0.2 rounded">
                              {b.category || "BROADCAST"}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[11px] line-clamp-1">{b.body}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] text-zinc-400 block">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">DELIVERED</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW 5: SETTINGS & PLANS                                        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {currentView === "settings" && (
            <div className="space-y-6 animate-in fade-in-50 duration-300 font-mono">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Card: System Core Settings */}
                <div className="bg-black/75 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <IconSliders />
                      <h2 className="text-base font-bold text-white uppercase">
                        CITADEL SYSTEM CORE SETTINGS
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      SYNCHRONIZED
                    </span>
                  </div>

                  <form onSubmit={handleSaveSystemSettings} className="space-y-4 text-xs">
                    {/* Default Probe Cadence */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-bold uppercase">
                        Default Telemetry Polling Cadence
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["1", "5", "15", "30"].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setSystemCadence(s)}
                            className={`py-2 rounded-xl text-center font-bold border transition-all ${
                              systemCadence === s
                                ? "bg-red-600 text-white border-red-500 shadow-sm"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {s} Seconds
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Latency Threshold Warning */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 font-bold uppercase">
                        Strict Latency Alert Tripwire (RTT)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: "150", label: "150ms (Strict)" },
                          { val: "300", label: "300ms (Standard)" },
                          { val: "500", label: "500ms (Relaxed)" },
                        ].map((t) => (
                          <button
                            type="button"
                            key={t.val}
                            onClick={() => setLatencyThreshold(t.val)}
                            className={`py-2 rounded-xl text-center font-bold border transition-all ${
                              latencyThreshold === t.val
                                ? "bg-red-600 text-white border-red-500 shadow-sm"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Maintenance Mode Toggle */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div>
                        <span className="font-bold text-white block">Citadel Maintenance Mode</span>
                        <span className="text-[11px] text-zinc-500">Temporarily suspend external probe workers</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded border-zinc-700 bg-zinc-900 focus:ring-red-500"
                      />
                    </div>

                    {/* Operator Registration Open/Closed */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div>
                        <span className="font-bold text-white block">Operator Self-Registration</span>
                        <span className="text-[11px] text-zinc-500">Allow new operators to register on /register</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={registrationOpen}
                        onChange={(e) => setRegistrationOpen(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-zinc-700 bg-zinc-900 focus:ring-blue-500"
                      />
                    </div>

                    {/* Rate Limiting */}
                    <div ref={rateLimitRef} className="space-y-1.5 relative">
                      <label className="text-zinc-400 font-bold uppercase block">
                        Ingestion Rate Limiting Threshold
                      </label>
                      <button
                        type="button"
                        onClick={() => setRateLimitOpen((v) => !v)}
                        className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl px-4 py-2.5 outline-none focus:border-red-500 flex items-center justify-between text-left font-mono transition-all text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>
                            {rateLimit === "1000" && "1,000 Heartbeats / min per Token"}
                            {rateLimit === "5000" && "5,000 Heartbeats / min per Token (Default)"}
                            {rateLimit === "10000" && "10,000 Heartbeats / min per Token"}
                            {rateLimit === "UNLIMITED" && "Unlimited (Enterprise Core)"}
                          </span>
                        </div>
                        <svg
                          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${rateLimitOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {rateLimitOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150 space-y-1 font-mono">
                          {[
                            { value: "1000", label: "1,000 Heartbeats / min", desc: "Strict throttling for low resource usage" },
                            { value: "5000", label: "5,000 Heartbeats / min", desc: "Recommended default threshold" },
                            { value: "10000", label: "10,000 Heartbeats / min", desc: "High concurrency microservice throughput" },
                            { value: "UNLIMITED", label: "Unlimited Ingestion", desc: "Enterprise Core — zero barrier bypass" },
                          ].map((item) => {
                            const isSelected = rateLimit === item.value;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                  setRateLimit(item.value);
                                  setRateLimitOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                                  isSelected
                                    ? "bg-red-600/15 border border-red-500/50 text-white font-bold"
                                    : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white border border-transparent"
                                }`}
                              >
                                <div>
                                  <div className="text-xs">{item.label}</div>
                                  <div className="text-[10px] text-zinc-500">{item.desc}</div>
                                </div>
                                {isSelected && (
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

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md"
                      >
                        COMMIT SYSTEM CONFIGURATIONS
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Card: Subscription Plans Editor */}
                <div className="bg-black/75 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h2 className="text-base font-bold text-white uppercase">
                      SUBSCRIPTION TIERS &amp; PLAN DETAILS
                    </h2>
                    <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                      PAYSTACK RAILS
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Configure tier pricing, endpoint quotas, probe frequencies, and retention windows. Pricing changes are pushed directly to the billing controller.
                  </p>

                  <div className="space-y-4">
                    {plans.map((plan) => {
                      const isFree = plan.tier === "FREE";

                      return (
                        <div
                          key={plan.tier}
                          className="p-4 rounded-xl bg-[#080d24] border border-zinc-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-black uppercase ${
                                  plan.tier === "TEAM"
                                    ? "bg-purple-950 text-purple-300 border border-purple-800"
                                    : plan.tier === "PRO"
                                    ? "bg-blue-950 text-blue-300 border border-blue-800"
                                    : "bg-zinc-800 text-zinc-300"
                                }`}
                              >
                                {plan.tier}
                              </span>
                              <span className="font-bold text-white text-xs">{plan.name}</span>
                            </div>
                            <span className="text-[11px] text-zinc-500">
                              {plan.currency} / {plan.interval}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-1">
                                Monthly Amount ({plan.currency})
                              </label>
                              <input
                                type="number"
                                defaultValue={plan.amount}
                                disabled={isFree}
                                id={`plan-amt-${plan.tier}`}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white font-bold disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-zinc-400 block mb-1">
                                Max Monitored Apps
                              </label>
                              <input
                                type="text"
                                defaultValue={plan.maxApps ? String(plan.maxApps) : "Unlimited"}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                            <span>Probe Interval: {plan.probeInterval || "15s"}</span>
                            <span>Retention: {plan.retention || "14 Days"}</span>
                            {!isFree && (
                              <button
                                onClick={() => {
                                  const el = document.getElementById(`plan-amt-${plan.tier}`) as HTMLInputElement;
                                  if (el) handleSavePlan(plan.tier, Number(el.value));
                                }}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors"
                              >
                                Save Price
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
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
