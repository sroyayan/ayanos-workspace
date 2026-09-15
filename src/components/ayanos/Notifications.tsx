import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";

export type NoticeKind = "info" | "success" | "error";

interface Notice {
  id: number;
  kind: NoticeKind;
  title: string;
  message?: string;
}

type NotifyFn = (opts: {
  kind?: NoticeKind;
  title: string;
  message?: string;
  duration?: number;
}) => void;

const NoticeCtx = createContext<NotifyFn>(() => {});

let _seq = 0;

const KIND_STYLE: Record<NoticeKind, { border: string; icon: string }> = {
  info: { border: "var(--color-accent)", icon: "ⓘ" },
  success: { border: "var(--color-success)", icon: "✓" },
  error: { border: "var(--color-destructive)", icon: "✕" },
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setNotices((cur) => cur.filter((n) => n.id !== id));
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback<NotifyFn>(
    ({ kind = "info", title, message, duration = 3500 }) => {
      const id = ++_seq;
      setNotices((cur) => [...cur.slice(-3), { id, kind, title, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
    },
    [dismiss],
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => timers.current.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <NoticeCtx.Provider value={notify}>
      {children}

      {/* Toast stack — bottom-right, above the terminal button */}
      <div
        className="pointer-events-none fixed bottom-24 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence>
          {notices.map((n) => {
            const s = KIND_STYLE[n.kind];
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="pointer-events-auto overflow-hidden rounded-lg border border-border bg-titlebar shadow-2xl"
                style={{ borderLeft: `2px solid ${s.border}` }}
              >
                <div className="flex items-start gap-2.5 px-3 py-2.5">
                  <span
                    className="mt-0.5 flex-none font-mono text-sm"
                    style={{ color: s.border }}
                    aria-hidden="true"
                  >
                    {s.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-foreground">{n.title}</p>
                    {n.message && (
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        {n.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    aria-label="Dismiss notification"
                    className="flex-none rounded px-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NoticeCtx.Provider>
  );
}

export function useNotify(): NotifyFn {
  return useContext(NoticeCtx);
}
