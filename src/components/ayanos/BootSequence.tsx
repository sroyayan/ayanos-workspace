import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const LINES = [
  { text: "Initializing AyanOS...", delay: 0 },
  { text: "Loading modules...", delay: 500 },
  { text: "Connecting GitHub...", delay: 1000 },
  { text: "Fetching LeetCode data...", delay: 1500 },
  { text: "System Ready.", delay: 2100 },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(0);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: skip the boot animation entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }
    const timers = LINES.map((l, i) => setTimeout(() => setVisible(i + 1), l.delay));
    const done = setTimeout(onComplete, 2700);
    // Give keyboard users an immediate way out of the overlay.
    skipRef.current?.focus();
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="w-full max-w-2xl px-6 font-mono text-sm">
        <div className="mb-6 flex items-center gap-3 text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-success" aria-hidden="true" />
          <span>AyanOS v1.0 — boot</span>
        </div>
        <div role="status" aria-live="polite" className="space-y-2">
          {LINES.slice(0, visible).map((l, i) => (
            <motion.div
              key={l.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-accent" aria-hidden="true">
                {">"}
              </span>
              <span className={i === LINES.length - 1 ? "text-success" : "text-foreground"}>
                {l.text}
              </span>
            </motion.div>
          ))}
          {visible < LINES.length && (
            <div className="text-accent">
              <span className="blink" aria-hidden="true" />
            </div>
          )}
        </div>
        <button
          ref={skipRef}
          onClick={onComplete}
          className="mt-10 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Skip [esc]
        </button>
      </div>
    </motion.div>
  );
}
