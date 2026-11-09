import fs from "fs";
import path from "path";
import { AppConfig } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const APPS_FILE = path.join(DATA_DIR, "apps.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(APPS_FILE)) fs.writeFileSync(APPS_FILE, "[]");
}

export function readApps(): AppConfig[] {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(APPS_FILE, "utf8"));
  } catch {
    return [];
  }
}

export function writeApps(apps: AppConfig[]) {
  ensure();
  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));
}

export function addApp(app: AppConfig) {
  const apps = readApps();
  apps.push(app);
  writeApps(apps);
  return app;
}

export function removeApp(id: string) {
  const apps = readApps().filter((a) => a.id !== id);
  writeApps(apps);
}

export function getApp(id: string) {
  return readApps().find((a) => a.id === id);
}
