import { NextResponse } from "next/server";
import { getApp } from "@/lib/store";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "data", "ingested-logs.jsonl");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entry = {
      appId: body.appId,
      level: body.level || "info",
      message: body.message || "",
      timestamp: body.timestamp || new Date().toISOString(),
    };
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const lines = parseInt(searchParams.get("lines") ?? "100", 10);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const app = getApp(id);
  if (!app) return NextResponse.json({ lines: [] });
  const logPath = app.logPath;
  if (!logPath || !fs.existsSync(logPath)) {
    return NextResponse.json({ lines: [], message: logPath ? "log file not found" : "no logPath configured" });
  }
  const content = fs.readFileSync(logPath, "utf8");
  const all = content.split("\n");
  return NextResponse.json({ lines: all.slice(-lines) });
}
