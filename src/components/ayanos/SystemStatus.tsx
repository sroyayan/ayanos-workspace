import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import { getTheme, onThemeChange, type Theme } from "@/lib/theme";

function useNow(tickMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(t);
  }, [tickMs]);
  return now;
}

function useThemeValue() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(getTheme());
    return onThemeChange(setTheme);
  }, []);
  return theme;
}

/** Git repo label, tries to match the status-bar "main" style. */
const GITHUB_STATUS = "main · clean";

export function SystemStatus() {
  const now = useNow(1000);
  const theme = useThemeValue();
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null);

  useEffect(() => {
    const updateSession = () => setSession(getSession());
    updateSession();
    const timer = setInterval(updateSession, 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now
    ? now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "---, -- --- ----";

  const rows: { k: string; v: string; color?: string }[] = [
    { k: "time", v: time },
    { k: "date", v: date },
    { k: "uptime", v: session?.uptime ?? "--" },
    { k: "git", v: GITHUB_STATUS },
    { k: "theme", v: theme, color: "var(--color-accent)" },
  ];

  return (
    <div className="rounded-md border border-border bg-card p-3 font-mono text-xs">
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden="true" />
        System
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline justify-between gap-2">
            <span className="text-muted-foreground">{r.k}</span>
            <span className="tabular-nums" style={{ color: r.color ?? "var(--color-foreground)" }}>
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
