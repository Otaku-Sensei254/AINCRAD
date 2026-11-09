import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "traffic.json");
function read() { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return {}; } }
function write(d: any) { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

export async function POST(req: Request) {
  const body = await req.json();
  const { appId, path: p, ip, ua } = body;
  if (!appId) return NextResponse.json({ error: "appId required" }, { status: 400 });
  const data = read();
  if (!data[appId]) data[appId] = { total: 0, unique: [], paths: {}, daily: {} };
  const rec = data[appId];
  rec.total += 1;
  const day = new Date().toISOString().slice(0, 10);
  rec.daily[day] = (rec.daily[day] || 0) + 1;
  rec.paths[p || "/"] = (rec.paths[p || "/"] || 0) + 1;
  if (ip && !rec.unique.includes(ip)) rec.unique.push(ip);
  write(data);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = read();
  if (id) return NextResponse.json(data[id] ?? { total: 0, unique: [], paths: {}, daily: {} });
  return NextResponse.json(data);
}
