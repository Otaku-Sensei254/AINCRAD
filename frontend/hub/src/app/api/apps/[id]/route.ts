import { NextResponse } from "next/server";
import { removeApp, getApp, readApps, writeApps } from "@/lib/store";
import { AppConfig } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(app);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const apps = readApps();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  apps[idx] = { ...apps[idx], ...body, id };
  writeApps(apps);
  return NextResponse.json(apps[idx]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  removeApp(id);
  return NextResponse.json({ ok: true });
}
