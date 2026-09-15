const STORAGE_KEY = "ayanos-start";

/** When the OS "session" started (persisted so uptime survives reloads). */
function startTimestamp(): number {
  if (typeof document === "undefined") return Date.now();
  const existing = Number(localStorage.getItem(STORAGE_KEY));
  if (existing && Number.isFinite(existing) && existing > 0) return existing;
  const now = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, String(now));
  } catch {
    /* ignore */
  }
  return now;
}

export interface SessionInfo {
  bootedAt: number;
  uptimeMs: number;
  /** humanized like "2d 3h 12m" */
  uptime: string;
}

export function getSession(): SessionInfo {
  const bootedAt = startTimestamp();
  const uptimeMs = Math.max(0, Date.now() - bootedAt);
  const s = Math.floor(uptimeMs / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const uptime = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
  return { bootedAt, uptimeMs, uptime };
}
