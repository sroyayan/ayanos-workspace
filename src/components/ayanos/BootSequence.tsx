import { motion } from "motion/react";
import { useEffect, useState } from "react";

const LINES = [
  { text: "Initializing AyanOS...", delay: 0 },
  { text: "Loading modules...", delay: 500 },
  { text: "Connecting GitHub...", delay: 1000 },
  { text: "Fetching LeetCode data...", delay: 1500 },
  { text: "System Ready.", delay: 2100 },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers = LINES.map((l, i) =>
      setTimeout(() => setVisible(i + 1), l.delay),
    );
    const done = setTimeout(onComplete, 2700);
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
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>AyanOS v1.0 — boot</span>
        </div>
        <div className="space-y-2">
          {LINES.slice(0, visible).map((l, i) => (
            <motion.div
              key={l.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-accent">{">"}</span>
              <span className={i === LINES.length - 1 ? "text-success" : "text-foreground"}>
                {l.text}
              </span>
            </motion.div>
          ))}
          {visible < LINES.length && (
            <div className="text-accent">
              <span className="blink" />
            </div>
          )}
        </div>
        <button
          onClick={onComplete}
          className="mt-10 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Skip [esc]
        </button>
      </div>
    </motion.div>
  );
}
