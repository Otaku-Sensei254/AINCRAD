import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "heartbeats.json");
function read() { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return {}; } }
function write(d: any) { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

const THRESHOLD_MS = 90000; // 90s

export async function POST(req: Request) {
  const body = await req.json();
  const { appId } = body;
  if (!appId) return NextResponse.json({ error: "appId required" }, { status: 400 });
  const data = read();
  data[appId] = { lastSeen: new Date().toISOString() };
  write(data);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = read();
  if (id) {
    const rec = data[id];
    const alive = rec && (Date.now() - new Date(rec.lastSeen).getTime()) < THRESHOLD_MS;
    return NextResponse.json({ id, alive, lastSeen: rec?.lastSeen ?? null });
  }
  // return all
  const out: any = {};
  for (const k of Object.keys(data)) {
    out[k] = { alive: (Date.now() - new Date(data[k].lastSeen).getTime()) < THRESHOLD_MS, lastSeen: data[k].lastSeen };
  }
  return NextResponse.json(out);
}
