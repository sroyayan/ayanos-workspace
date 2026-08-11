import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FileId } from "@/lib/ayanos-data";
import {
  PROFILE,
  SOCIALS,
  LEETCODE,
  GITHUB_STATS,
  SKILLS,
  PROJECTS,
  FILE_ORDER,
  LIVE_STATUS,
} from "@/lib/ayanos-data";

type Line = { id: number; type: "in" | "out" | "ok" | "err"; text: string };

let _id = 0;
const nid = () => ++_id;

const HELP = `Available commands:
  help        — show this message
  about       — about Ayan
  skills      — list skills
  projects    — list projects
  resume      — open resume
  leetcode    — LeetCode stats
  github      — GitHub stats
  contact     — contact info
  socials     — social links
  ls          — list explorer files
  whoami      — who am i?
  status      — live status
  open <file> — open a file (e.g. open about.md)
  clear       — clear terminal
  exit        — close terminal`;

const VALID_FILES: FileId[] = [...FILE_ORDER];

export function Terminal({
  open,
  onClose,
  onOpenFile,
}: {
  open: boolean;
  onClose: () => void;
  onOpenFile: (id: FileId) => void;
}) {
  const [lines, setLines] = useState<Line[]>([
    { id: nid(), type: "ok", text: "AyanOS shell v1.0 — type `help` to begin." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  // Focus trap: keep Tab inside the dialog while it's open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const push = (type: Line["type"], text: string) =>
    setLines((l) => [...l, { id: nid(), type, text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push("in", cmd);
    setHistory((h) => [...h, cmd]);
    setHistIdx(-1);

    const [base, ...rest] = cmd.split(/\s+/);
    switch (base.toLowerCase()) {
      case "help":
        push("out", HELP);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        onClose();
        break;
      case "about":
        push("out", `${PROFILE.name} — ${PROFILE.role}\nLocation: ${PROFILE.location}`);
        onOpenFile("about.md");
        break;
      case "skills":
        push(
          "out",
          Object.entries(SKILLS)
            .map(([k, v]) => `${k}: ${v.map((s) => `${s.name}(${s.level}/5)`).join(", ")}`)
            .join("\n"),
        );
        onOpenFile("skills.json");
        break;
      case "projects":
        push("out", PROJECTS.map((p) => `• ${p.name} [${p.status}] — ${p.description}`).join("\n"));
        onOpenFile("projects");
        break;
      case "resume":
        push("ok", "Opening resume.pdf …");
        onOpenFile("resume.pdf");
        break;
      case "leetcode":
        push(
          "out",
          `Solved: ${LEETCODE.total}  |  E:${LEETCODE.easy}  M:${LEETCODE.medium}  H:${LEETCODE.hard}  |  Streak: ${LEETCODE.streak}d`,
        );
        onOpenFile("leetcode.log");
        break;
      case "github":
        push(
          "out",
          `Repos: ${GITHUB_STATS.repos}  |  Contributions: ${GITHUB_STATS.contributions}`,
        );
        onOpenFile("github.stats");
        break;
      case "contact":
        push("out", `${PROFILE.email}\n${PROFILE.github}\n${PROFILE.linkedin}`);
        onOpenFile("contact.md");
        break;
      case "socials":
        push("out", SOCIALS.map((s) => `${s.key}: ${s.handle}`).join("\n"));
        break;
      case "ls":
        push("out", FILE_ORDER.join("    "));
        break;
      case "whoami":
        push("out", `${PROFILE.name} — ${PROFILE.role}\n${PROFILE.location}`);
        break;
      case "status":
        push(
          "out",
          `learning: ${LIVE_STATUS.learning}\ngoal: ${LIVE_STATUS.goal}\nstatus: ${LIVE_STATUS.status}`,
        );
        break;
      case "open": {
        const f = rest.join(" ") as FileId;
        if (VALID_FILES.includes(f)) {
          push("ok", `Opening ${f} …`);
          onOpenFile(f);
        } else {
          push("err", `open: unknown file '${rest.join(" ")}' — try 'ls'`);
        }
        break;
      }
      default:
        push("err", `command not found: ${base} — try 'help'`);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="AyanOS terminal"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-16 right-4 z-40 flex h-[420px] w-[min(640px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border shadow-2xl glass"
        >
          <div className="flex items-center justify-between border-b border-border bg-titlebar px-3 py-2">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/80" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/80" aria-hidden="true" />
              <span className="ml-2">ayan@ayanos: ~</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close terminal"
              className="rounded px-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ✕
            </button>
          </div>

          <div
            ref={scrollRef}
            className="vs-scroll flex-1 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed"
          >
            {lines.map((l) => (
              <div
                key={l.id}
                className={
                  l.type === "in"
                    ? "text-foreground"
                    : l.type === "err"
                      ? "text-destructive"
                      : l.type === "ok"
                        ? "text-success"
                        : "text-muted-foreground"
                }
              >
                {l.type === "in" ? (
                  <span>
                    <span className="text-accent">ayan@ayanos</span>
                    <span className="text-muted-foreground">:~$ </span>
                    {l.text}
                  </span>
                ) : (
                  <pre className="whitespace-pre-wrap font-mono">{l.text}</pre>
                )}
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
                setInput("");
              }}
              className="mt-1 flex items-center gap-2"
            >
              <span className="text-accent">ayan@ayanos</span>
              <span className="text-muted-foreground">:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (!history.length) return;
                    const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
                    setHistIdx(next);
                    setInput(history[next]);
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (histIdx === -1) return;
                    const next = histIdx + 1;
                    if (next >= history.length) {
                      setHistIdx(-1);
                      setInput("");
                    } else {
                      setHistIdx(next);
                      setInput(history[next]);
                    }
                  }
                }}
                aria-label="Terminal input"
                className="flex-1 bg-transparent text-foreground caret-accent outline-none"
                autoComplete="off"
                spellCheck={false}
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
