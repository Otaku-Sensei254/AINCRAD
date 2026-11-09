import { NextResponse } from "next/server";
import { getApp } from "@/lib/store";
import { spawn, ChildProcess } from "child_process";

const procs = new Map<string, { proc: ChildProcess; startedAt: number; pid?: number }>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const p = procs.get(id);
    return NextResponse.json({ id, running: !!p && !p.proc.killed, pid: p?.pid, startedAt: p ? new Date(p.startedAt).toISOString() : undefined });
  }
  const all = Array.from(procs.entries()).map(([id, p]) => ({ id, running: !p.proc.killed, pid: p.pid, startedAt: new Date(p.startedAt).toISOString() }));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { id, action } = body;
  const app = getApp(id);
  if (!app) return NextResponse.json({ error: "not found" }, { status: 404 });

  if (action === "start") {
    if (procs.has(id) && !procs.get(id)!.proc.killed) {
      return NextResponse.json({ error: "already running" }, { status: 409 });
    }
    if (!app.command) return NextResponse.json({ error: "no command configured" }, { status: 400 });
    const proc = spawn(app.command, { shell: true, detached: true, stdio: "ignore" });
    procs.set(id, { proc, startedAt: Date.now(), pid: proc.pid });
    proc.on("exit", () => { /* keep record; marked killed */ });
    return NextResponse.json({ id, running: true, pid: proc.pid });
  }
  if (action === "stop") {
    const p = procs.get(id);
    if (!p) return NextResponse.json({ error: "not running" }, { status: 404 });
    try { process.kill(-p.proc.pid!, "SIGTERM"); } catch { try { p.proc.kill(); } catch {} }
    procs.delete(id);
    return NextResponse.json({ id, running: false });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
