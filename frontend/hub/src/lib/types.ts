export type AppType = "web" | "api" | "gateway" | "microservice" | "worker" | "database" | "queue" | "other";

export interface AppConfig {
  id: string;
  name: string;
  type: AppType;
  description?: string;
  url?: string;          // base URL
  healthPath?: string;   // e.g. /health
  port?: number;
  command?: string;      // subprocess command to manage
  logPath?: string;      // path to log file
  apiKey?: string;
  tags?: string[];
  createdAt: string;
}

export interface HealthResult {
  id: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  statusCode?: number;
  latencyMs?: number;
  message?: string;
  ssl?: { valid: boolean; daysRemaining: number; issuer?: string; error?: string };
  body?: string;
  checkedAt: string;
}

export interface TrafficStats {
  id: string;
  requests: number;
  errors: number;
  avgLatencyMs: number;
  rps: number;
  updatedAt: string;
}

export interface ProcessStatus {
  id: string;
  running: boolean;
  pid?: number;
  uptimeSec?: number;
  startedAt?: string;
}
