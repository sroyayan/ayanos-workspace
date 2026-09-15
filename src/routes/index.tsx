import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { BootSequence } from "@/components/ayanos/BootSequence";
import { Terminal } from "@/components/ayanos/Terminal";
import { NotificationsProvider, useNotify } from "@/components/ayanos/Notifications";
import { SystemStatus } from "@/components/ayanos/SystemStatus";
import { toggleTheme, getTheme, onThemeChange } from "@/lib/theme";
import {
  AboutPanel,
  SkillsPanel,
  ProjectsPanel,
  LeetcodePanel,
  GithubPanel,
  ResumePanel,
  ContactPanel,
} from "@/components/ayanos/FilePanels";
import { FILE_ORDER, LIVE_STATUS, type FileId } from "@/lib/ayanos-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AyanOS v1.0 — Ayan Singha Roy" },
      {
        name: "description",
        content:
          "AyanOS — a developer-OS portfolio for Ayan Singha Roy. B.Tech CSE (AI & ML). Projects, LeetCode, GitHub stats and more.",
      },
      { property: "og:title", content: "AyanOS v1.0 — Ayan Singha Roy" },
      {
        property: "og:description",
        content: "A personal portfolio designed as a developer operating system.",
      },
    ],
  }),
  component: AyanOS,
});

const FILE_META: Record<FileId, { label: string; icon: string; color: string; ext: string }> = {
  "about.md": { label: "about.md", icon: "M", color: "var(--color-accent)", ext: "md" },
  "skills.json": { label: "skills.json", icon: "{}", color: "var(--color-warning)", ext: "json" },
  projects: { label: "projects/", icon: "▸", color: "var(--color-purple)", ext: "dir" },
  "leetcode.stats": {
    label: "leetcode.stats",
    icon: "≡",
    color: "var(--color-success)",
    ext: "stats",
  },
  "github.stats": { label: "github.stats", icon: "★", color: "var(--color-pink)", ext: "stats" },
  "resume.pdf": { label: "resume.pdf", icon: "▤", color: "var(--color-orange)", ext: "pdf" },
  "contact.md": { label: "contact.md", icon: "@", color: "var(--color-accent)", ext: "md" },
};

const ACTIVITIES: {
  k: string;
  icon: string;
  label: string;
  action: "toggle-sidebar" | "terminal" | "open-file";
  file?: FileId;
}[] = [
  { k: "files", icon: "▤", label: "Explorer", action: "toggle-sidebar" },
  { k: "search", icon: "⌕", label: "Open terminal", action: "terminal" },
  { k: "git", icon: "⎇", label: "GitHub stats", action: "open-file", file: "github.stats" },
  { k: "ext", icon: "▦", label: "Skills", action: "open-file", file: "skills.json" },
];

function AyanOS() {
  const isMobile = useIsMobile();
  const notify = useNotify();
  const [theme, setTheme] = useState<"dark" | "hacker">(() => getTheme());
  // Server renders booted=true so the main content shows. On first visit, the
  // client's useEffect flips booted→false to show the boot overlay (a brief
  // flash is unavoidable since sessionStorage can't be read during SSR).
  // Returning visitors stay booted=true with no flash.
  const [booted, setBooted] = useState<boolean>(true);
  const [openFiles, setOpenFiles] = useState<FileId[]>(["about.md"]);
  const [active, setActive] = useState<FileId>("about.md");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [termOpen, setTermOpen] = useState(false);

  const openFile = useCallback((id: FileId) => {
    setOpenFiles((cur) => (cur.includes(id) ? cur : [...cur, id]));
    setActive(id);
  }, []);

  const closeFile = (id: FileId) => {
    const next = openFiles.filter((f) => f !== id);
    if (next.length === 0) {
      setOpenFiles(["about.md"]);
      setActive("about.md");
      return;
    }
    setOpenFiles(next);
    if (id === active) setActive(next[next.length - 1]);
  };

  const handleBooted = useCallback(() => {
    try {
      sessionStorage.setItem("ayanos-booted", "1");
    } catch {
      /* ignore */
    }
    setBooted(true);
  }, []);

  // On first visit (no sessionStorage flag), show the boot overlay.
  // Returning visitors already have booted=true and skip this entirely.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ayanos-booted") !== "1") setBooted(false);
    } catch {
      setBooted(false);
    }
  }, []);

  // Close the explorer automatically on small screens.
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // Keep the header icon in sync when the theme is changed elsewhere (e.g. terminal).
  useEffect(() => onThemeChange(setTheme), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !booted) handleBooted();
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setTermOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted, handleBooted]);

  const runActivity = (a: (typeof ACTIVITIES)[number]) => {
    if (a.action === "toggle-sidebar") setSidebarOpen((v) => !v);
    else if (a.action === "terminal") setTermOpen(true);
    else if (a.action === "open-file" && a.file) openFile(a.file);
  };

  return (
    <NotificationsProvider>
      <MotionConfig reducedMotion="user">
        <div
          suppressHydrationWarning
          className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground"
        >
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-md bg-primary px-3 py-2 font-mono text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
          >
            Skip to content
          </a>

          <AnimatePresence>{!booted && <BootSequence onComplete={handleBooted} />}</AnimatePresence>

          {/* Title bar */}
          <header className="flex h-9 flex-none items-center justify-between border-b border-border bg-titlebar px-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-destructive/80" />
                <span className="h-3 w-3 rounded-full bg-warning/80" />
                <span className="h-3 w-3 rounded-full bg-success/80" />
              </div>
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Toggle explorer"
                aria-expanded={sidebarOpen}
                aria-controls="explorer"
                className="ml-3 rounded px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title="Toggle explorer (Ctrl/⌘B)"
              >
                ☰
              </button>
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              <span className="text-foreground">AyanOS</span>
              <span> v1.0</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="hidden sm:inline">Ctrl/⌘` terminal</span>
              <button
                onClick={() => {
                  const next = toggleTheme();
                  setTheme(next);
                  notify({
                    kind: "info",
                    title: next === "hacker" ? "Theme: Hacker Green" : "Theme: AyanOS Dark",
                  });
                }}
                aria-label="Toggle theme"
                aria-pressed={theme === "hacker"}
                title="Toggle theme"
                className="rounded px-2 py-0.5 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {theme === "hacker" ? "🌙" : "💚"}
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="flex min-h-0 flex-1">
            {/* Activity bar */}
            <nav
              aria-label="Primary"
              className="hidden w-12 flex-none flex-col items-center gap-3 border-r border-border bg-sidebar py-3 sm:flex"
            >
              {ACTIVITIES.map((a, i) => (
                <button
                  key={a.k}
                  onClick={() => runActivity(a)}
                  aria-label={a.label}
                  aria-pressed={i === 0 ? sidebarOpen : undefined}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded font-mono text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                  style={i === 0 ? { borderLeft: "2px solid var(--color-accent)" } : undefined}
                >
                  <span aria-hidden="true">{a.icon}</span>
                </button>
              ))}
            </nav>

            {/* Explorer */}
            <AnimatePresence initial={false}>
              {sidebarOpen && (
                <>
                  {isMobile && (
                    <motion.div
                      key="explorer-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSidebarOpen(false)}
                      className="fixed inset-0 z-20 bg-black/60"
                      aria-hidden="true"
                    />
                  )}
                  <motion.aside
                    key="explorer"
                    id="explorer"
                    initial={
                      isMobile ? { x: -240, width: 240, opacity: 0 } : { width: 0, opacity: 0 }
                    }
                    animate={{ x: 0, width: 240, opacity: 1 }}
                    exit={isMobile ? { x: -240, width: 240, opacity: 0 } : { width: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "overflow-hidden border-r border-border bg-sidebar",
                      isMobile ? "fixed inset-y-0 left-0 z-30 shadow-2xl" : "flex-none",
                    )}
                  >
                    <div className="px-3 pb-2 pt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Explorer
                    </div>
                    <div className="px-2 font-mono text-sm">
                      <div className="flex items-center gap-1 px-1 py-1 text-xs text-muted-foreground">
                        <span aria-hidden="true">▾</span>
                        <span>AYAN-PORTFOLIO</span>
                      </div>
                      <ul className="space-y-0.5">
                        {FILE_ORDER.map((id) => {
                          const m = FILE_META[id];
                          const isActive = active === id;
                          return (
                            <li key={id}>
                              <button
                                onClick={() => openFile(id)}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                                  isActive
                                    ? "bg-muted text-foreground"
                                    : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground",
                                )}
                              >
                                <span
                                  className="w-4 text-center"
                                  style={{ color: m.color }}
                                  aria-hidden="true"
                                >
                                  {m.icon}
                                </span>
                                <span className="truncate">{m.label}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Live status */}
                      <div className="mt-6 space-y-3">
                        <SystemStatus />
                        <div className="rounded-md border border-border bg-card p-3 text-xs">
                          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            <span
                              className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"
                              aria-hidden="true"
                            />
                            Live Status
                          </div>
                          <div className="space-y-1.5 font-mono">
                            <Row k="learning" v={LIVE_STATUS.learning} />
                            <Row k="goal" v={LIVE_STATUS.goal} />
                            <Row k="status" v={LIVE_STATUS.status} color="var(--color-success)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Editor */}
            <main
              id="main-content"
              tabIndex={-1}
              className="flex min-w-0 flex-1 flex-col outline-none"
            >
              {/* Tabs */}
              <div className="flex flex-none items-center overflow-x-auto border-b border-border bg-titlebar">
                {openFiles.map((id) => {
                  const m = FILE_META[id];
                  const isActive = active === id;
                  return (
                    <div
                      key={id}
                      className={cn(
                        "group flex items-center gap-2 border-r border-border px-3 py-2 font-mono text-xs",
                        isActive
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      style={isActive ? { borderTop: "1px solid var(--color-accent)" } : undefined}
                    >
                      <button
                        onClick={() => setActive(id)}
                        className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <span style={{ color: m.color }} aria-hidden="true">
                          {m.icon}
                        </span>
                        <span>{m.label}</span>
                      </button>
                      <button
                        onClick={() => closeFile(id)}
                        aria-label={`Close ${m.label}`}
                        className="ml-1 rounded px-1 opacity-60 transition-opacity hover:bg-muted hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Breadcrumb */}
              <div className="flex-none border-b border-border bg-background px-4 py-1 font-mono text-[11px] text-muted-foreground">
                AYAN-PORTFOLIO <span className="mx-1">›</span>{" "}
                <span className="text-foreground">{FILE_META[active].label}</span>
              </div>

              {/* Content */}
              <div className="vs-scroll flex-1 overflow-y-auto bg-background">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="mx-auto max-w-5xl px-6 py-8"
                  >
                    <PanelFor id={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>

          {/* Status bar */}
          <footer className="flex h-6 flex-none items-center justify-between bg-status px-3 font-mono text-[11px] text-status-foreground">
            <div className="flex items-center gap-4">
              <span aria-hidden="true">⎇</span>
              <span>main</span>
              <span aria-hidden="true">●</span>
              <span>0 problems</span>
              <span className="hidden sm:inline">UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Python</span>
              <span>React</span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                Open to Opportunities
              </span>
            </div>
          </footer>

          {/* Floating terminal button */}
          <button
            onClick={() => setTermOpen((v) => !v)}
            aria-label={termOpen ? "Close terminal" : "Open terminal"}
            aria-expanded={termOpen}
            aria-controls="terminal"
            className="fixed bottom-9 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-accent bg-card font-mono text-base text-accent shadow-lg shadow-accent/20 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            title="Open terminal (Ctrl/⌘`)"
          >
            <span aria-hidden="true">{">_"}</span>
          </button>

          <Terminal open={termOpen} onClose={() => setTermOpen(false)} onOpenFile={openFile} />
        </div>
      </MotionConfig>
    </NotificationsProvider>
  );
}

function Row({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-muted-foreground">{k}:</span>
      <span style={{ color: color ?? "var(--color-foreground)" }}>{v}</span>
    </div>
  );
}

function PanelFor({ id }: { id: FileId }) {
  // useMemo to avoid re-mount churn within an id
  return useMemo(() => {
    switch (id) {
      case "about.md":
        return <AboutPanel />;
      case "skills.json":
        return <SkillsPanel />;
      case "projects":
        return <ProjectsPanel />;
      case "leetcode.stats":
        return <LeetcodePanel />;
      case "github.stats":
        return <GithubPanel />;
      case "resume.pdf":
        return <ResumePanel />;
      case "contact.md":
        return <ContactPanel />;
    }
  }, [id]);
}
