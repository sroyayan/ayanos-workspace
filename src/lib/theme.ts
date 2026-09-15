export type Theme = "dark" | "hacker";

const STORAGE_KEY = "ayanos-theme";
const ATTR = "data-theme";

const listeners = new Set<(theme: Theme) => void>();

function apply(theme: Theme) {
  document.documentElement.setAttribute(ATTR, theme);
}

/** Read the initial theme. Safe to call during SSR — returns "dark". */
export function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored === "hacker" ? "hacker" : "dark";
}

/** Apply the persisted theme before first paint (call in <head>). */
export function initTheme(): void {
  apply(getTheme());
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — fall through, theme still applies for this session */
  }
  apply(theme);
  listeners.forEach((l) => l(theme));
}

export function toggleTheme(): Theme {
  const next = getTheme() === "hacker" ? "dark" : "hacker";
  setTheme(next);
  return next;
}

/** Subscribe to theme changes (returns an unsubscribe fn). */
export function onThemeChange(cb: (theme: Theme) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
