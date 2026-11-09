import { NextResponse } from "next/server";
import { readApps, addApp } from "@/lib/store";
import { AppConfig } from "@/lib/types";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json(readApps());
}

export async function POST(req: Request) {
  const body = await req.json();
  const app: AppConfig = {
    id: randomUUID(),
    name: body.name,
    type: body.type ?? "other",
    description: body.description,
    url: body.url,
    healthPath: body.healthPath ?? "/health",
    port: body.port,
    command: body.command,
    logPath: body.logPath,
    tags: body.tags ?? [],
    createdAt: new Date().toISOString(),
  };
  addApp(app);
  return NextResponse.json(app, { status: 201 });
}
