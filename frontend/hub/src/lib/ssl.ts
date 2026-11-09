import tls from "tls";

export function checkSsl(hostname: string, port = 443): Promise<{ valid: boolean; daysRemaining: number; issuer?: string; subject?: string; error?: string }> {
  return new Promise((resolve) => {
    const socket = tls.connect({ host: hostname, port, servername: hostname, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) {
        resolve({ valid: false, daysRemaining: 0, error: "no certificate" });
        return;
      }
      const expiry = new Date(cert.valid_to);
      const days = Math.floor((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      resolve({ valid: days > 0, daysRemaining: days, issuer: cert.issuer?.O as string, subject: cert.subject?.CN as string });
    });
    socket.on("error", (e) => resolve({ valid: false, daysRemaining: 0, error: e.message }));
    socket.setTimeout(5000, () => { socket.destroy(); resolve({ valid: false, daysRemaining: 0, error: "timeout" }); });
  });
}

export async function checkDomainAge(hostname: string): Promise<{ ageDays?: number; created?: string; error?: string }> {
  try {
    const res = await fetch(`https://api.whois.vu/?q=${encodeURIComponent(hostname)}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { error: `whois ${res.status}` };
    const data = await res.json();
    const created = data?.created || data?.creation_date || data?.created_date;
    if (!created) return { error: "no creation date" };
    const d = new Date(created);
    const ageDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    return { ageDays, created: d.toISOString() };
  } catch (e: any) {
    return { error: e?.message };
  }
}
