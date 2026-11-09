"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { AppConfig, HealthResult } from "@/lib/types";

// ─── Status Definitions (Black, White, Blue & Red Palette) ───────────────────
const STATUS_CONFIG = {
  healthy: {
    label: "OPERATIONAL",
    dot: "bg-blue-600",
    ping: "bg-blue-500",
    badge: "text-blue-700 bg-blue-50 border-blue-200",
  },
  degraded: {
    label: "DEGRADED",
    dot: "bg-red-500",
    ping: "bg-red-400",
    badge: "text-red-700 bg-red-50 border-red-200",
  },
  down: {
    label: "OFFLINE",
    dot: "bg-red-600",
    ping: "bg-red-500",
    badge: "text-white bg-red-600 border-red-700 font-bold",
  },
  unknown: {
    label: "STANDBY",
    dot: "bg-zinc-400",
    ping: "bg-zinc-300",
    badge: "text-zinc-700 bg-zinc-100 border-zinc-200",
  },
} as const;

// ─── SVG Icons ──────────────────────────────────────────────────────────────
function IconGrid() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconCpu() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" />
    </svg>
  );
}
function IconDatabase() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
function IconRefresh({ spinning }: { spinning: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${spinning ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
function IconChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IconShieldAdmin() {
  return (
    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconSidebar({ collapsed }: { collapsed?: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      {collapsed ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 12h4m-2-2l2 2-2 2" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h-4m2-2l-2 2 2 2" />
      )}
    </svg>
  );
}

// ─── Progress Bar for Latency (Blue = Fast, Red = Slow) ─────────────────────
function LatencyProgressBar({ ms }: { ms?: number }) {
  if (ms === undefined || ms === null) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>LATENCY</span>
          <span>—</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden" />
      </div>
    );
  }

  const pct = Math.min((ms / 1200) * 100, 100);
  const isHighLatency = ms >= 600;
  const barColor = isHighLatency ? "bg-red-600" : "bg-blue-600";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-500 font-medium">RTT PROBE</span>
        <span className={`font-bold ${isHighLatency ? "text-red-600" : "text-zinc-900"}`}>
          {ms} ms
        </span>
      </div>
      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.max(pct, 5)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Stat Metric Card ───────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: string | number;
  sublabel: string;
  accent?: "blue" | "red" | "black";
}) {
  const valueClass =
    accent === "blue"
      ? "text-blue-600"
      : accent === "red"
      ? "text-red-600"
      : "text-zinc-950";

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs">
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">
        {label}
      </span>
      <div className={`text-2xl font-black font-mono tracking-tight mt-1 ${valueClass}`}>
        {value}
      </div>
      <div className="text-[11px] text-zinc-500 mt-0.5 font-medium">{sublabel}</div>
    </div>
  );
}

// ─── App Card Component ─────────────────────────────────────────────────────
function AppCard({
  app,
  health,
  onOpen,
  onDelete,
  onEdit,
  onStart,
  onStop,
}: {
  app: AppConfig;
  health?: HealthResult;
  onOpen: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onStart: () => void;
  onStop: () => void;
}) {
  const statusKey = (health?.status ?? "unknown") as keyof typeof STATUS_CONFIG;
  const status = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.unknown;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isDown = statusKey === "down";

  return (
    <div
      onClick={onOpen}
      className={`group bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
        isDown ? "border-red-300 hover:border-red-500" : "border-zinc-200 hover:border-blue-600"
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                {app.name}
              </h3>
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 shrink-0">
                {app.type}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${status.badge} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <span>{status.label}</span>
          </div>
        </div>

        {/* URL Target */}
        {app.url ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.open(app.url, "_blank");
            }}
            className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-blue-600 font-mono truncate w-fit max-w-full hover:underline mb-4"
          >
            <span className="truncate">{app.url}{app.healthPath ?? ""}</span>
            <IconExternal />
          </div>
        ) : (
          <div className="text-[11px] text-zinc-400 font-mono mb-4">No endpoint linked</div>
        )}

        {/* Progress Bar & Telemetry Strip */}
        <div className="space-y-3 pt-3 border-t border-zinc-100">
          <LatencyProgressBar ms={health?.latencyMs} />

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-zinc-600">
            <span className="text-zinc-400 text-[10px]">HTTP CODE</span>
            <span className={`font-bold ${health?.statusCode && health.statusCode < 400 ? "text-blue-600" : "text-red-600"}`}>
              {health?.statusCode ? `${health.statusCode} OK` : "—"}
            </span>
          </div>
        </div>

        {health?.message && (
          <div className="mt-2.5 px-2.5 py-1.5 rounded bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono truncate">
            {health.message}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-100 text-xs"
      >
        <div className="flex items-center gap-1.5">
          {app.command && (
            <>
              <button
                onClick={onStart}
                className="px-2 py-1 rounded text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              >
                START
              </button>
              <button
                onClick={onStop}
                className="px-2 py-1 rounded text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
              >
                STOP
              </button>
            </>
          )}

          <button
            onClick={onEdit}
            className="p-1.5 text-zinc-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
            title="Edit configuration"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onDelete}
                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold shadow-xs hover:bg-red-700"
              >
                CONFIRM
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-1.5 py-1 text-zinc-400 hover:text-zinc-600 text-[10px]"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 text-zinc-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
              title="Delete service"
            >
              <IconTrash />
            </button>
          )}
        </div>

        <button
          onClick={onOpen}
          className="flex items-center gap-1 text-[11px] font-bold text-zinc-800 group-hover:text-blue-600 transition-colors"
        >
          <span>VIEW</span>
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}

// ─── Main Controller Page ───────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let t = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!t) {
        const m = document.cookie.match(/(?:^|; )token=([^;]+)/);
        if (m) t = decodeURIComponent(m[1]);
      }
      console.log("app guard token present:", !!t);
      if (!t) router.push("/login");
      else {
        localStorage.setItem("token", t);
        sessionStorage.setItem("token", t);
      }
    }
  }, [router]);

  const [apps, setApps] = useState<AppConfig[]>([]);
  const appsRef = useRef<AppConfig[]>([]);
  useEffect(() => { appsRef.current = apps; }, [apps]);
  const [orgId, setOrgId] = useState<string | null>(null);
  const orgIdRef = useRef<string | null>(null);
  useEffect(() => { orgIdRef.current = orgId; }, [orgId]);

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentOrg, setCurrentOrg] = useState<any>(null);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [orgSearchQuery, setOrgSearchQuery] = useState("");
  const orgDropdownRef = useRef<HTMLDivElement>(null);

  // Close organization dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target as Node)) {
        setOrgDropdownOpen(false);
      }
    };
    if (orgDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [orgDropdownOpen]);

  // Close edit-type, create-type, create-dbMode dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (editTypeRef.current && !editTypeRef.current.contains(e.target as Node)) setEditTypeOpen(false);
      if (createTypeRef.current && !createTypeRef.current.contains(e.target as Node)) setCreateTypeOpen(false);
      if (createDbModeRef.current && !createDbModeRef.current.contains(e.target as Node)) setCreateDbModeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editTypeOpen, setEditTypeOpen] = useState(false);
  const editTypeRef = useRef<HTMLDivElement>(null);
  const [createTypeOpen, setCreateTypeOpen] = useState(false);
  const createTypeRef = useRef<HTMLDivElement>(null);
  const [createDbModeOpen, setCreateDbModeOpen] = useState(false);
  const createDbModeRef = useRef<HTMLDivElement>(null);
  const [health, setHealth] = useState<Record<string, HealthResult>>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aincrad_sidebar_collapsed");
      if (saved !== null) setSidebarCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("aincrad_sidebar_collapsed", String(next));
      }
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const [form, setForm] = useState({
    name: "",
    type: "web",
    url: "",
    healthPath: "/health",
    command: "",
    logPath: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const loadApps = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const r = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.ok) setUserInfo(await r.json());
      } catch {}
    }

    if (token) {
      try {
        const orgs = await fetch(`${API}/organizations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (orgs.ok) {
          const o = await orgs.json();
          setOrganizations(o);
          const activeOrg = (orgIdRef.current ? o.find((x: any) => x.id === orgIdRef.current) : null) || o?.[0];
          const oid = activeOrg?.id;
          if (oid) {
            setOrgId(oid);
            setCurrentOrg(activeOrg);
            const res = await fetch(`${API}/applications?organizationId=${oid}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              setApps(Array.isArray(data) ? data.map((a: any) => ({ ...a, type: String(a.type ?? "").toLowerCase() })) : data);
              return;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // If authenticated but no org, show empty dashboard (no default apps)
    if (token) {
      setApps([]);
      return;
    }

    try {
      const res = await fetch("/api/apps");
      if (res.ok) { const d = await res.json(); setApps(Array.isArray(d) ? d.map((a: any) => ({ ...a, type: String(a.type ?? "").toLowerCase() })) : d); }
    } catch (e) {
      console.error(e);
    }
  }, [API]);

  const checkHealth = useCallback(async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      let data: HealthResult[] = [];
      if (token && appsRef.current.length > 0) {
        const res = await fetch("/api/health", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(appsRef.current.filter((a:any) => !a.paused).map((a) => ({ id: a.id, url: a.url, healthPath: a.healthPath }))) });
        if (res.ok) data = await res.json();
      }
      if (!data || data.length === 0) {
        const res = await fetch("/api/health");
        if (res.ok) data = await res.json();
      }
      const map: Record<string, HealthResult> = {};
      (Array.isArray(data) ? data : []).forEach((h: HealthResult) => { if (h?.id) map[h.id] = h; });
      setHealth(map);
      setLastChecked(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Filtered organizations for dropdown search
  const filteredOrganizations = useMemo(() => {
    if (!orgSearchQuery.trim()) return organizations;
    return organizations.filter((o: any) =>
      (o.name || "").toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      (o.id || "").toLowerCase().includes(orgSearchQuery.toLowerCase())
    );
  }, [organizations, orgSearchQuery]);

  const handleSelectOrg = async (selectedOrg: any) => {
    setCurrentOrg(selectedOrg);
    setOrgId(selectedOrg.id);
    setOrgDropdownOpen(false);
    setOrgSearchQuery("");

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(`${API}/applications?organizationId=${selectedOrg.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const d = await res.json();
          const mapped = Array.isArray(d)
            ? d.map((a: any) => ({ ...a, type: String(a.type ?? "").toLowerCase() }))
            : [];
          setApps(mapped);
          setTimeout(() => checkHealth(), 100);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadApps();
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [loadApps, checkHealth]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      if (token && orgId) {
        const res = await fetch(`${API}/applications?organizationId=${orgId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, type: (form.type || "web").toUpperCase() }),
        });
        if (res.ok) {
          setForm({ name: "", type: "web", url: "", healthPath: "/health", command: "", logPath: "" });
          setShowModal(false);
          await loadApps();
          checkHealth();
          return;
        }
      }

      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", type: "web", url: "", healthPath: "/health", command: "", logPath: "" });
        setShowModal(false);
        await loadApps();
        checkHealth();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch(`${API}/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await fetch(`/api/apps/${id}`, { method: "DELETE" });
    }
    await loadApps();
  }

  async function handleProc(id: string, action: "start" | "stop") {
    await fetch("/api/processes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    checkHealth();
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  // Metrics Calculations
  const healthyCount = useMemo(
    () => apps.filter((a) => health[a.id]?.status === "healthy").length,
    [apps, health]
  );
  const incidentCount = useMemo(
    () => apps.filter((a) => health[a.id]?.status === "down" || health[a.id]?.status === "degraded").length,
    [apps, health]
  );
  const uptimePercent = useMemo(() => {
    if (apps.length === 0) return 100;
    return Math.round((healthyCount / apps.length) * 100);
  }, [apps.length, healthyCount]);

  const avgLatency = useMemo(() => {
    const latencies = Object.values(health)
      .map((h) => h.latencyMs)
      .filter((l): l is number => typeof l === "number" && !isNaN(l));
    if (latencies.length === 0) return null;
    return Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  }, [health]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.url && app.url.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = selectedType === "all" || app.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [apps, searchQuery, selectedType]);

  const navFilters = [
    { id: "all", label: "All Fleet Targets", icon: <IconGrid /> },
    { id: "web", label: "Web Applications", icon: <IconGlobe /> },
    { id: "api", label: "API Gateways", icon: <IconZap /> },
    { id: "microservice", label: "Microservices", icon: <IconCpu /> },
    { id: "worker", label: "Worker Daemons", icon: <IconCpu /> },
    { id: "database", label: "Database Instances", icon: <IconDatabase /> },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-zinc-900 flex flex-col md:flex-row antialiased selection:bg-red-600 selection:text-white">
      {/* ── Mobile Top Bar (Responsive Toggle) ─────────────────────────────── */}
      <div className="md:hidden bg-[#030614] border-b border-zinc-800 text-white px-4 py-3 flex items-center justify-between z-30">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/AINCRAD-NOBG.png"
            alt="AINCRAD"
            width={110}
            height={34}
            className="h-6 w-auto object-contain"
            priority
          />
          <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/80 px-1.5 py-0.5 rounded">
            CONSOLE
          </span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          aria-label="Toggle Navigation"
        >
          <IconMenu />
        </button>
      </div>

      {/* ── Left Sidebar (Obsidian Command Console with Red/Blue Precision) ─── */}
      <aside
        className={`${
          mobileSidebarOpen ? "fixed inset-0 z-40 flex" : "hidden"
        } md:flex md:static ${
          sidebarCollapsed ? "w-full md:w-20 lg:w-20 p-3" : "w-full md:w-72 lg:w-80 p-5"
        } bg-[#050814] text-white flex-col justify-between shrink-0 border-r border-zinc-850 shadow-2xl relative transition-all duration-300 ease-in-out`}
      >
        <div className="space-y-5">
          {/* Header Brand & Console Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            {sidebarCollapsed ? (
              <div className="w-full flex flex-col items-center gap-3">
                <Link href="/" className="flex items-center justify-center group" title="AINCRAD Citadel (Return to Home)">
                  <Image
                    src="/AINCRAD-APP-LOGO.png"
                    alt="AINCRAD"
                    width={36}
                    height={36}
                    className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                    priority
                  />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
                  title="Expand sidebar (Ctrl+B)"
                  aria-label="Expand sidebar"
                >
                  <IconSidebar collapsed={true} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-2.5 group">
                  <Image
                    src="/AINCRAD-NOBG.png"
                    alt="AINCRAD"
                    width={125}
                    height={38}
                    className="h-6 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    priority
                  />
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-red-950/60 border border-red-900/80 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                    HUB V1.0
                  </span>
                </Link>

                <div className="flex items-center gap-1">
                  {/* Collapse button on desktop */}
                  <button
                    onClick={toggleSidebar}
                    className="hidden md:inline-flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
                    title="Collapse sidebar (Ctrl+B)"
                    aria-label="Collapse sidebar"
                  >
                    <IconSidebar collapsed={false} />
                  </button>

                  {/* Mobile close button */}
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="md:hidden text-zinc-400 hover:text-white"
                  >
                    <IconClose />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Active Citadel Sector Card */}
          {sidebarCollapsed ? (
            <div ref={orgDropdownRef} className="relative z-30 flex justify-center">
              <button
                type="button"
                onClick={() => setOrgDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-blue-500/50 flex items-center justify-center relative group cursor-pointer transition-all shadow-sm"
                title={`Active Citadel Sector: ${currentOrg?.name || "Citadel Prime Sector"} (Click to switch organization)`}
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600/30 to-indigo-900/40 border border-blue-500/50 flex items-center justify-center font-bold text-xs text-blue-300 font-mono">
                  {(currentOrg?.name || "C").charAt(0).toUpperCase()}
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </button>

              {/* Floating popover in collapsed mode */}
              {orgDropdownOpen && (
                <div className="absolute left-full top-0 ml-3 w-72 z-50 bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-2.5 space-y-2 font-mono text-xs animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-zinc-800/80">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      SWITCH SECTOR / ORG
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold">
                      {organizations.length} {organizations.length === 1 ? "ORG" : "ORGS"}
                    </span>
                  </div>

                  {organizations.length > 3 && (
                    <div className="relative px-1">
                      <input
                        type="text"
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        placeholder="Filter sectors..."
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none placeholder:text-zinc-600 font-mono"
                        autoFocus
                      />
                    </div>
                  )}

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
                    {filteredOrganizations.length === 0 ? (
                      <div className="py-4 text-center text-zinc-500 text-[11px]">
                        No matching sectors found
                      </div>
                    ) : (
                      filteredOrganizations.map((o: any) => {
                        const isSelected = (currentOrg?.id || "") === o.id;

                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => handleSelectOrg(o)}
                            className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-left transition-all ${
                              isSelected
                                ? "bg-blue-600/20 border border-blue-500/50 text-white shadow-sm"
                                : "hover:bg-zinc-900/80 border border-transparent text-zinc-300 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 font-mono ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                }`}
                              >
                                {(o.name || "O").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs truncate font-mono">
                                  {o.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 truncate font-mono">
                                  ID: {o.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="flex items-center gap-1 shrink-0 text-blue-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 w-full p-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 text-[11px] font-bold font-mono transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>+ Provision New Sector</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Active Citadel Sector Card with Sleek Dropdown (Expanded Mode) */
            <div ref={orgDropdownRef} className="relative z-30">
              <div className="p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 shadow-sm relative group hover:border-zinc-700/80 transition-all">
                {/* Header bar */}
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    <span>ACTIVE CITADEL SECTOR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold">
                      {organizations.length} {organizations.length === 1 ? "ORG" : "ORGS"}
                    </span>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-blue-400 hover:text-blue-300 text-[10px] font-bold"
                      title="Provision new organization sector"
                    >
                      + New
                    </button>
                  </div>
                </div>

                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setOrgDropdownOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl border text-left transition-all group/btn ${
                    orgDropdownOpen
                      ? "bg-zinc-900 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                      : "bg-zinc-900/90 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Sector Initial Badge */}
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600/30 via-indigo-900/40 to-black border border-blue-500/40 flex items-center justify-center font-bold text-xs text-blue-300 font-mono shrink-0 shadow-xs">
                      {(currentOrg?.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-white truncate font-mono group-hover/btn:text-blue-300 transition-colors">
                        {currentOrg?.name || "Citadel Prime Sector"}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 truncate flex items-center gap-1.5">
                        <span>US-EAST-01</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">NOMINAL</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-red-400/90 font-bold hidden sm:inline">&lt; 12ms</span>
                    <svg
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                        orgDropdownOpen ? "rotate-180 text-blue-400" : "group-hover/btn:text-white"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Custom Dropdown Popover Menu (Expanded Mode) */}
              {orgDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-2.5 space-y-2 font-mono text-xs animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-zinc-800/80">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      SWITCH SECTOR / ORG
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold">
                      {organizations.length} AVAILABLE
                    </span>
                  </div>

                  {/* Search Filter if more than 3 orgs */}
                  {organizations.length > 3 && (
                    <div className="relative px-1">
                      <input
                        type="text"
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        placeholder="Search organizations..."
                        className="w-full bg-zinc-950/90 border border-zinc-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none placeholder:text-zinc-600 font-mono"
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Organizations List */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
                    {filteredOrganizations.length === 0 ? (
                      <div className="py-4 text-center text-zinc-500 text-[11px]">
                        No matching sectors found
                      </div>
                    ) : (
                      filteredOrganizations.map((o: any) => {
                        const isSelected = (currentOrg?.id || "") === o.id;

                        return (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => handleSelectOrg(o)}
                            className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-xl text-left transition-all ${
                              isSelected
                                ? "bg-blue-600/20 border border-blue-500/50 text-white shadow-sm"
                                : "hover:bg-zinc-900/80 border border-transparent text-zinc-300 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 font-mono ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                }`}
                              >
                                {(o.name || "O").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs truncate font-mono">
                                  {o.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 truncate font-mono">
                                  {o.projects?.length ?? 1} {(o.projects?.length === 1 ? "project" : "projects")} · ID: {o.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>

                            {isSelected ? (
                              <div className="flex items-center gap-1 shrink-0 text-blue-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 shrink-0">
                                Switch →
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center gap-2 w-full p-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 text-[11px] font-bold font-mono transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>+ Provision New Sector (+ Org)</span>
                    </button>
                    {userInfo?.role === "ADMIN" && (
                      <Link
                        href="/admin?view=organizations"
                        onClick={() => setOrgDropdownOpen(false)}
                        className="flex items-center gap-2 w-full p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 text-[11px] font-mono transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Manage All Enclaves in Admin</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Category 1: FLEET INFRASTRUCTURE */}
          <div>
            {!sidebarCollapsed && (
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1 flex items-center justify-between">
                <span>FLEET INFRASTRUCTURE</span>
                <span className="text-zinc-600 font-bold">{apps.length} NODES</span>
              </div>
            )}
            <nav className="space-y-1">
              {navFilters.map((item) => {
                const count =
                  item.id === "all" ? apps.length : apps.filter((a) => a.type === item.id).length;
                const isActive = selectedType === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedType(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={`${item.label} (${count})`}
                    className={`w-full flex items-center ${
                      sidebarCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                    } rounded-xl text-xs font-mono transition-all relative ${
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/90"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={isActive ? "text-white" : "text-zinc-400"}>{item.icon}</span>
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {sidebarCollapsed ? (
                      count > 0 && (
                        <span className="absolute -top-1 -right-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {count}
                        </span>
                      )
                    ) : (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          isActive ? "bg-blue-700 text-white" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Navigation Category 2: PROTOCOLS & WORKSPACES */}
          <div>
            {!sidebarCollapsed && (
              <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                CITADEL PROTOCOLS
              </div>
            )}
            <div className="space-y-1 text-xs font-mono">
              {/* Elevated Admin Link (If Root Admin) */}
              {userInfo?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  title="Citadel Admin Center (ROOT Clearance)"
                  className={`flex items-center ${
                    sidebarCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                  } rounded-xl text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-900/60 font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)] group relative`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconShieldAdmin />
                    {!sidebarCollapsed && <span>Citadel Admin Center</span>}
                  </div>
                  {sidebarCollapsed ? (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-600 text-white font-black tracking-wider">
                      ROOT
                    </span>
                  )}
                </Link>
              )}

              {/* Documentation */}
              <Link
                href="/docs"
                title="API & SDK Documentation"
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2"
                } rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/90 transition-colors`}
              >
                <IconBook />
                {!sidebarCollapsed && <span>API &amp; SDK Docs</span>}
              </Link>


            </div>
          </div>
        </div>

        {/* ── Sidebar Bottom Dock: Radar Telemetry & Operator Profile ── */}
        <div className="mt-6 pt-4 border-t border-zinc-850 space-y-3">
          {/* System Telemetry Radar */}
          {sidebarCollapsed ? (
            <div
              className="p-2 rounded-xl bg-zinc-950/90 border border-zinc-800/80 flex flex-col items-center justify-center gap-1 cursor-default group"
              title={`System Telemetry: ${uptimePercent}% Operational · ${healthyCount} Online · ${incidentCount} Alerts`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  incidentCount > 0 ? "bg-red-500 animate-ping shadow-[0_0_6px_#ef4444]" : "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                }`}
              />
              <span className={`text-[10px] font-black font-mono ${incidentCount > 0 ? "text-red-400" : "text-blue-400"}`}>
                {uptimePercent}%
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 font-mono">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${incidentCount > 0 ? "bg-red-500 animate-ping shadow-[0_0_6px_#ef4444]" : "bg-emerald-500 shadow-[0_0_6px_#10b981]"}`} />
                  <span>TELEMETRY RADAR</span>
                </span>
                <span className={`font-black text-xs ${incidentCount > 0 ? "text-red-400" : "text-blue-400"}`}>
                  {uptimePercent}%
                </span>
              </div>

              {/* Uptime Progress Bar */}
              <div className="h-1.5 w-full bg-zinc-850 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full ${incidentCount > 0 ? "bg-red-500" : "bg-gradient-to-r from-blue-600 to-rose-500"} rounded-full transition-all duration-500`}
                  style={{ width: `${uptimePercent}%` }}
                />
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 rounded-lg bg-black/60 border border-zinc-850">
                  <span className="text-zinc-500 block text-[9px] font-bold">OPERATIONAL</span>
                  <span className="font-black text-blue-400 text-xs">{healthyCount}</span>
                </div>
                <div
                  className={`p-2 rounded-lg border ${
                    incidentCount > 0
                      ? "bg-red-950/60 border-red-800 text-red-400"
                      : "bg-black/60 border-zinc-850 text-zinc-400"
                  }`}
                >
                  <span className="block text-[9px] font-bold">ALERTS</span>
                  <span className="font-black text-xs">{incidentCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Operator Identity Dock */}
          {userInfo ? (
            sidebarCollapsed ? (
              <div className="flex flex-col items-center gap-2 py-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border cursor-pointer ${
                    userInfo.role === "ADMIN"
                      ? "bg-red-950/80 border-red-700 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      : "bg-blue-950/80 border-blue-700 text-blue-400"
                  }`}
                  title={`${userInfo.username} (${userInfo.email}) · ${userInfo.role}`}
                >
                  {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "O"}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                  title="De-authenticate / Logout"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black/70 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                      userInfo.role === "ADMIN"
                        ? "bg-red-950/80 border-red-700 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                        : "bg-blue-950/80 border-blue-700 text-blue-400"
                    }`}
                  >
                    {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : "O"}
                  </div>
                  <button onClick={() => router.push("/profile")} className="min-w-0 text-left hover:opacity-80">
                    <div className="font-bold text-xs text-white truncate font-mono">
                      {userInfo.username}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate font-mono">
                      {userInfo.email}
                    </div>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                    title="De-authenticate / Logout"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center">
              <button
                onClick={handleLogout}
                className="w-full py-2 text-[10px] font-bold text-zinc-400 hover:text-red-400 font-mono uppercase tracking-widest transition-colors"
              >
                De-authenticate
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main View Area ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Crisp White + Black/Blue Actions) */}
        <header className="sticky top-0 z-20 bg-white border-b border-zinc-200/90 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Desktop Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="hidden md:inline-flex items-center justify-center p-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 transition-colors shadow-2xs"
              title={sidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
              aria-label="Toggle sidebar collapse"
            >
              <IconSidebar collapsed={sidebarCollapsed} />
            </button>

            <span className="text-sm font-black text-zinc-900 uppercase tracking-wide font-mono">
              {selectedType === "all" ? "All Systems" : `${selectedType} Systems`}
            </span>
            <span className="font-mono text-xs text-blue-600 font-bold">
              [{filteredApps.length} ACTIVE]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkHealth}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono rounded-lg bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 transition-colors shadow-2xs disabled:opacity-50"
            >
              <IconRefresh spinning={refreshing} />
              <span>SYNC</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold font-mono rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm shadow-blue-600/20"
            >
              <IconPlus />
              <span>REGISTER SERVICE</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <MetricCard
              label="TOTAL SERVICES"
              value={apps.length}
              sublabel="Active targets"
              accent="black"
            />
            <MetricCard
              label="OPERATIONAL"
              value={healthyCount}
              sublabel={`${uptimePercent}% healthy`}
              accent="blue"
            />
            <MetricCard
              label="INCIDENTS / ALERTS"
              value={incidentCount}
              sublabel={incidentCount === 0 ? "Zero active errors" : "Critical attention"}
              accent={incidentCount > 0 ? "red" : "black"}
            />
            <MetricCard
              label="AVG LATENCY"
              value={avgLatency !== null ? `${avgLatency} ms` : "—"}
              sublabel="Round-trip response"
              accent="blue"
            />
          </div>

          {/* Search toolbar */}
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search services or endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 font-mono transition-colors shadow-2xs"
            />

            {lastChecked && (
              <span className="text-[11px] font-mono text-zinc-500 font-bold shrink-0">
                LAST SYNC: {lastChecked}
              </span>
            )}
          </div>

          {/* Application Cards Grid */}
          {filteredApps.length === 0 ? (
            <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-12 text-center shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 uppercase font-mono mb-1">
                {apps.length === 0 ? "No services registered" : "No matching services"}
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-4">
                {apps.length === 0
                  ? "Register endpoints or worker subprocesses to track telemetry and live health."
                  : "Try clearing your search query or register a new service for this category."}
              </p>
              <button
                onClick={() => { setForm((f:any) => ({ ...f, type: selectedType === "all" ? "web" : selectedType })); setShowModal(true); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                + Register Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  health={health[app.id]}
                  onOpen={() => router.push(`/apps/${app.id}`)}
                  onDelete={() => handleDelete(app.id)}
                  onEdit={() => {
                    setEditingApp(app);
                    setEditForm({ ...app });
                  }}
                  onStart={() => handleProc(app.id, "start")}
                  onStop={() => handleProc(app.id, "stop")}
                />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer className="w-full border-t border-zinc-200/80 bg-white py-4 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-zinc-500 mt-auto">
          <span>AINCRAD CONTROL CENTER · FLEET TELEMETRY ACTIVE</span>
          <span>
            Powered by <strong className="text-zinc-800 font-semibold">SecureFixKe - D-Huhu Tech Labs</strong>
          </span>
        </footer>
      </div>

      {/* ── Edit Application Modal ─────────────────────────────────────────── */}
      {editingApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs"
          onClick={() => setEditingApp(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              if (token) {
                await fetch(`${API}/applications/${editingApp.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ ...editForm, type: (editForm.type || "web").toUpperCase() }),
                });
              } else {
                await fetch(`/api/apps/${editingApp.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...editForm, type: (editForm.type || "web").toUpperCase() }),
                });
              }
              setEditingApp(null);
              loadApps();
            }}
            className="bg-white border border-zinc-200 rounded-xl w-full max-w-md shadow-2xl p-5 space-y-3"
          >
            <h2 className="font-bold text-lg">Edit {editingApp.name}</h2>
            <input
              placeholder="Name"
              value={editForm.name ?? ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full border border-zinc-200 p-2 rounded-lg text-sm"
            />
            {/* Custom Edit-Type Dropdown */}
            <div ref={editTypeRef} className="relative w-full">
              <button
                type="button"
                onClick={() => setEditTypeOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 border border-zinc-300 bg-zinc-50 hover:bg-white px-3 py-2 rounded-lg text-sm font-mono transition-colors"
              >
                <span className="uppercase text-zinc-800 font-bold">{editForm.type ?? "web"}</span>
                <svg className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${editTypeOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {editTypeOpen && (
                <div className="absolute z-50 mt-1 w-full bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                  {["web", "api", "gateway", "microservice", "worker", "database", "queue", "other"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setEditForm({ ...editForm, type: t }); setEditTypeOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase transition-colors ${editForm.type === t ? "bg-blue-600/20 border-l-2 border-blue-500 text-blue-300" : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white"}`}
                    >
                      {t}
                      {editForm.type === t && <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              placeholder="Base URL"
              value={editForm.url ?? ""}
              onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              className="w-full border border-zinc-200 p-2 rounded-lg text-sm"
            />
            <input
              placeholder="Health path"
              value={editForm.healthPath ?? ""}
              onChange={(e) => setEditForm({ ...editForm, healthPath: e.target.value })}
              className="w-full border border-zinc-200 p-2 rounded-lg text-sm"
            />
            <input
              placeholder="Subprocess command"
              value={editForm.command ?? ""}
              onChange={(e) => setEditForm({ ...editForm, command: e.target.value })}
              className="w-full border border-zinc-200 p-2 rounded-lg text-sm"
            />
            <input
              placeholder="Log file path"
              value={editForm.logPath ?? ""}
              onChange={(e) => setEditForm({ ...editForm, logPath: e.target.value })}
              className="w-full border border-zinc-200 p-2 rounded-lg text-sm"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="flex-1 py-2 bg-zinc-100 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Register Application Modal ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-200 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-black text-white">
              <div>
                <h3 className="text-sm font-bold tracking-wide font-mono">REGISTER SERVICE</h3>
                <p className="text-[11px] text-zinc-400 font-mono">Configure endpoint telemetry probe</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-zinc-400 hover:text-white rounded transition-colors"
              >
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                    Service Name
                  </label>
                  <input
                    required
                    placeholder="e.g. Auth Service"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                    Type
                  </label>
                  {/* Custom Create-Type Dropdown */}
                  <div ref={createTypeRef} className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setCreateTypeOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 hover:bg-white text-zinc-900 focus:outline-none font-mono transition-colors uppercase text-[11px] font-bold"
                    >
                      <span>{form.type}</span>
                      <svg className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${createTypeOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {createTypeOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                        {["web", "api", "microservice", "worker", "database", "queue", "other"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => { setForm({ ...form, type: t }); setCreateTypeOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono uppercase font-bold transition-colors ${form.type === t ? "bg-blue-600/20 border-l-2 border-blue-500 text-blue-300" : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white"}`}
                          >
                            {t}
                            {form.type === t && <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {form.type === "database" && (
                <div>
                  <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                    DB Connection Mode
                  </label>
                  {/* Custom DB Mode Dropdown */}
                  <div ref={createDbModeRef} className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setCreateDbModeOpen((o) => !o)}
                      className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 hover:bg-white text-zinc-900 focus:outline-none font-mono transition-colors text-[11px] font-bold"
                    >
                      <span>{(form as any).dbMode === "direct" ? "Direct connection string" : "HTTP health sidecar (recommended)"}</span>
                      <svg className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${createDbModeOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {createDbModeOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-[#060a1d]/98 backdrop-blur-xl border border-zinc-700/90 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                        {[
                          { value: "http", label: "HTTP health sidecar (recommended)" },
                          { value: "direct", label: "Direct connection string" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setForm({ ...(form as any), dbMode: opt.value }); setCreateDbModeOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono font-bold transition-colors ${(form as any).dbMode === opt.value || (!((form as any).dbMode) && opt.value === "http") ? "bg-blue-600/20 border-l-2 border-blue-500 text-blue-300" : "text-zinc-300 hover:bg-zinc-900/80 hover:text-white"}`}
                          >
                            {opt.label}
                            {((form as any).dbMode === opt.value || (!((form as any).dbMode) && opt.value === "http")) && <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                    {(form as any).dbMode === "direct"
                      ? "Provide a connection URL (postgres://...) — AINCRAD will probe TCP/auth."
                      : "Provide the sidecar /health URL that checks the DB connection."}
                  </p>
                </div>
              )}

              {form.type === "database" && (form as any).dbMode === "direct" ? (
                <div>
                  <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                    Database URL
                  </label>
                  <input
                    placeholder="postgres://user:pass@host:5432/db"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition-colors"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Base URL
                    </label>
                    <input
                      placeholder="http://localhost:4000"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                      Health Path
                    </label>
                    <input
                      placeholder="/health"
                      value={form.healthPath}
                      onChange={(e) => setForm({ ...form, healthPath: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                  Subprocess Command (Optional)
                </label>
                <input
                  placeholder="npm run start or python main.py"
                  value={form.command}
                  onChange={(e) => setForm({ ...form, command: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1 uppercase text-[10px] tracking-wider font-mono">
                  Log File Path (Optional)
                </label>
                <input
                  placeholder="/var/log/app.log"
                  value={form.logPath}
                  onChange={(e) => setForm({ ...form, logPath: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-900 focus:outline-none focus:bg-white focus:border-blue-600 font-mono transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-900 font-bold font-mono"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono rounded-lg disabled:opacity-50 shadow-sm"
                >
                  {loading ? "SAVING..." : "SAVE SERVICE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
