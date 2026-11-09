export async function POST(req: Request) {
  const body = await req.json();
  const apps = Array.isArray(body) ? body : [];
  const results = await Promise.all(apps.map(async (app: any) => {
    const base = (app.url || "").replace(/\/$/, "");
    const url = base + (app.healthPath || "");
    const start = Date.now();
    if (!base) return { id: app.id, status: "unknown", message: "no url", checkedAt: new Date().toISOString() };
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const latency = Date.now() - start;
      const status = res.ok ? "healthy" : res.status >= 500 ? "down" : "degraded";
      let body = "";
      try { body = (await res.text()).slice(0, 500); } catch {}
      let ssl;
      if (base.startsWith("https://")) {
        try { const u = new URL(base); const { checkSsl } = await import("@/lib/ssl"); ssl = await checkSsl(u.hostname); } catch {}
      }
      return { id: app.id, status, statusCode: res.status, latencyMs: latency, ssl, body, checkedAt: new Date().toISOString() };
    } catch (e: any) {
      return { id: app.id, status: "down", message: e?.message, latencyMs: Date.now() - start, checkedAt: new Date().toISOString() };
    }
  }));
  return NextResponse.json(results);
}

import { NextResponse } from "next/server";
import { readApps } from "@/lib/store";
import { HealthResult } from "@/lib/types";
import { checkSsl } from "@/lib/ssl";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const apps = id ? readApps().filter((a) => a.id === id) : readApps();
  const results: HealthResult[] = await Promise.all(
    apps.map(async (app) => {
      let base = app.url?.replace(/\/$/, "") ?? (app.port ? `http://localhost:${app.port}` : "");
      if (base && !/^https?:\/\//i.test(base)) base = "https://" + base;
      const path = app.healthPath ? app.healthPath : "";
      const url = `${base}${path}`;
      const start = Date.now();
      if (!base) {
        return { id: app.id, status: "unknown", message: "no url configured", checkedAt: new Date().toISOString() };
      }
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        const latency = Date.now() - start;
        const status = res.ok ? "healthy" : res.status >= 500 ? "down" : "degraded";
        let body = "";
        try { body = (await res.text()).slice(0, 500); } catch {}
        let ssl;
        if (base.startsWith("https://")) {
          try { const u = new URL(base); ssl = await checkSsl(u.hostname); } catch {}
        }
        return { id: app.id, status, statusCode: res.status, latencyMs: latency, ssl, body, checkedAt: new Date().toISOString() };
      } catch (e: any) {
        return { id: app.id, status: "down", message: e?.message ?? "unreachable", latencyMs: Date.now() - start, checkedAt: new Date().toISOString() };
      }
    })
  );
  return NextResponse.json(results);
}
