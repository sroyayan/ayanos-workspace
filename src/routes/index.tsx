import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BootSequence } from "@/components/ayanos/BootSequence";
import { Terminal } from "@/components/ayanos/Terminal";
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

const FILE_META: Record<
  FileId,
  { label: string; icon: string; color: string; ext: string }
> = {
  "about.md": { label: "about.md", icon: "M", color: "var(--color-accent)", ext: "md" },
  "skills.json": { label: "skills.json", icon: "{}", color: "var(--color-warning)", ext: "json" },
  projects: { label: "projects/", icon: "▸", color: "var(--color-purple)", ext: "dir" },
  "leetcode.log": { label: "leetcode.log", icon: "≡", color: "var(--color-success)", ext: "log" },
  "github.stats": { label: "github.stats", icon: "★", color: "var(--color-pink)", ext: "stats" },
  "resume.pdf": { label: "resume.pdf", icon: "▤", color: "var(--color-orange)", ext: "pdf" },
  "contact.md": { label: "contact.md", icon: "@", color: "var(--color-accent)", ext: "md" },
};

function AyanOS() {
  const [booted, setBooted] = useState(false);
  const [openFiles, setOpenFiles] = useState<FileId[]>(["about.md"]);
  const [active, setActive] = useState<FileId>("about.md");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [termOpen, setTermOpen] = useState(false);

  const openFile = useCallback((id: FileId) => {
    setOpenFiles((cur) => (cur.includes(id) ? cur : [...cur, id]));
    setActive(id);
  }, []);

  const closeFile = (id: FileId) => {
    setOpenFiles((cur) => {
      const next = cur.filter((f) => f !== id);
      if (id === active) {
        const fallback = next[next.length - 1] ?? "about.md";
        if (!next.length) {
          setActive("about.md");
          return ["about.md"];
        }
        setActive(fallback);
      }
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !booted) setBooted(true);
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
  }, [booted]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {/* Title bar */}
      <header className="flex h-9 flex-none items-center justify-between border-b border-border bg-titlebar px-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/80" />
            <span className="h-3 w-3 rounded-full bg-warning/80" />
            <span className="h-3 w-3 rounded-full bg-success/80" />
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-3 rounded px-2 py-0.5 font-mono text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Toggle sidebar (⌘B)"
          >
            ☰
          </button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-foreground">AyanOS</span>
          <span> v1.0</span>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          <span className="hidden sm:inline">⌘` terminal</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <nav className="hidden w-12 flex-none flex-col items-center gap-3 border-r border-border bg-sidebar py-3 sm:flex">
          {[
            { k: "files", icon: "▤" },
            { k: "search", icon: "⌕" },
            { k: "git", icon: "⎇" },
            { k: "ext", icon: "▦" },
          ].map((b, i) => (
            <button
              key={b.k}
              className={`flex h-9 w-9 items-center justify-center rounded font-mono text-base transition-colors ${
                i === 0
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={i === 0 ? { borderLeft: "2px solid var(--color-accent)" } : undefined}
            >
              {b.icon}
            </button>
          ))}
        </nav>

        {/* Explorer */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-none overflow-hidden border-r border-border bg-sidebar"
            >
              <div className="px-3 pb-2 pt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Explorer
              </div>
              <div className="px-2 font-mono text-sm">
                <div className="flex items-center gap-1 px-1 py-1 text-xs text-muted-foreground">
                  <span>▾</span>
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
                          className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors ${
                            isActive
                              ? "bg-muted text-foreground"
                              : "text-sidebar-foreground hover:bg-muted/60 hover:text-foreground"
                          }`}
                        >
                          <span className="w-4 text-center" style={{ color: m.color }}>
                            {m.icon}
                          </span>
                          <span className="truncate">{m.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Live status */}
                <div className="mt-6 rounded-md border border-border bg-card p-3 text-xs">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    Live Status
                  </div>
                  <div className="space-y-1.5 font-mono">
                    <Row k="learning" v={LIVE_STATUS.learning} />
                    <Row k="goal" v={LIVE_STATUS.goal} />
                    <Row k="status" v={LIVE_STATUS.status} color="var(--color-success)" />
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Editor */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Tabs */}
          <div className="flex flex-none items-center overflow-x-auto border-b border-border bg-titlebar">
            {openFiles.map((id) => {
              const m = FILE_META[id];
              const isActive = active === id;
              return (
                <div
                  key={id}
                  className={`group flex items-center gap-2 border-r border-border px-3 py-2 font-mono text-xs ${
                    isActive
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    isActive
                      ? { borderTop: "1px solid var(--color-accent)" }
                      : undefined
                  }
                >
                  <button
                    onClick={() => setActive(id)}
                    className="flex items-center gap-2"
                  >
                    <span style={{ color: m.color }}>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                  <button
                    onClick={() => closeFile(id)}
                    className="ml-1 rounded px-1 opacity-60 hover:bg-muted hover:opacity-100"
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
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
          <span>⎇ main</span>
          <span>● 0 problems</span>
          <span className="hidden sm:inline">UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Python</span>
          <span>React</span>
          <span className="hidden sm:inline">● Open to Opportunities</span>
        </div>
      </footer>

      {/* Floating terminal button */}
      <button
        onClick={() => setTermOpen((v) => !v)}
        className="fixed bottom-9 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-accent bg-card font-mono text-base text-accent shadow-lg shadow-accent/20 hover:bg-accent hover:text-accent-foreground"
        title="Open terminal (⌘`)"
      >
        {">_"}
      </button>

      <Terminal
        open={termOpen}
        onClose={() => setTermOpen(false)}
        onOpenFile={openFile}
      />
    </div>
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
      case "leetcode.log":
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
