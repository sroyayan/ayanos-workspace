import { motion } from "motion/react";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import {
  PROFILE,
  SOCIALS,
  CURRENT_FOCUS,
  SKILLS,
  SKILL_META,
  LEVEL_LABELS,
  PROJECTS,
  LEETCODE,
  GITHUB_STATS,
  ACHIEVEMENTS,
  CONTACT_ENDPOINT,
  type Project,
} from "@/lib/ayanos-data";

/* ---------- shared bits ---------- */
function SectionLabel({ text }: { text: string }) {
  return (
    <h3 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      {text}
    </h3>
  );
}

/* ---------- about.md ---------- */
export function AboutPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/20">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--color-accent) 35%, transparent), transparent 60%), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--color-purple) 35%, transparent), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold text-foreground">
            AR
          </div>
          <span
            className="absolute bottom-3 right-3 h-3.5 w-3.5 rounded-full border-2 border-background bg-success"
            title="Available"
          />
        </div>

        <div className="text-center lg:text-left">
          <div className="font-mono text-xs text-muted-foreground">~/about.md</div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-success lg:justify-start">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" aria-hidden="true" />
            Open to opportunities
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
          {SOCIALS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target={s.key === "email" ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card font-mono text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span aria-hidden="true">{s.icon}</span>
            </a>
          ))}
        </div>
      </div>

      <article className="font-mono text-sm leading-7 text-foreground">
        <h1 className="mb-1 text-3xl font-bold tracking-tight">
          <span className="text-accent"># </span>
          {PROFILE.name}
        </h1>
        <div className="mb-6 text-muted-foreground">{PROFILE.role}</div>

        <p className="mb-6 max-w-2xl text-foreground/90">{PROFILE.tagline}</p>

        <h2 className="mb-2 text-base text-accent">## Current Focus</h2>
        <ul className="mb-6 space-y-1 text-foreground/90">
          {CURRENT_FOCUS.map((x) => (
            <li key={x}>
              <span className="text-success">+</span> {x}
            </li>
          ))}
        </ul>

        <h2 className="mb-2 text-base text-accent">## Location</h2>
        <p className="mb-6 text-foreground/90">{PROFILE.location}</p>

        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${PROFILE.email}`}
            className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
          >
            Contact me
          </a>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            GitHub ↗
          </a>
        </div>
      </article>
    </div>
  );
}

/* ---------- skills.json ---------- */
function JsonLine({
  k,
  skills,
  i,
}: {
  k: string;
  skills: { name: string; level: number }[];
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="pl-6"
    >
      <span className="text-purple">"{k}"</span>
      <span className="text-muted-foreground">: {"{"}</span>
      <div className="pl-6">
        {skills.map((skill, j) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + j * 0.03 + 0.05 }}
          >
            <span className="text-success">"{skill.name}"</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-warning">{skill.level}</span>
            {j < skills.length - 1 && <span className="text-muted-foreground">,</span>}
          </motion.div>
        ))}
      </div>
      <span className="text-muted-foreground">{"}"}</span>
    </motion.div>
  );
}

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-mono text-xs">
        <span className="text-foreground">{name}</span>
        <span className="text-muted-foreground">{LEVEL_LABELS[level]}</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${name}: ${LEVEL_LABELS[level]}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level * 20}%` }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-accent"
        />
      </div>
    </div>
  );
}

export function SkillsPanel() {
  const entries = Object.entries(SKILLS);
  return (
    <div className="space-y-8">
      <div className="font-mono text-sm">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-muted px-2 py-0.5">JSON</span>
          <span>skills.json — {entries.length} keys</span>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 leading-7">
          <div className="text-muted-foreground">{"{"}</div>
          {entries.map(([k, skills], i) => (
            <div key={k}>
              <JsonLine k={k} skills={skills} i={i} />
              {i < entries.length - 1 && <span className="pl-6 text-muted-foreground">,</span>}
            </div>
          ))}
          <div className="text-muted-foreground">{"}"}</div>
        </div>
      </div>

      <div>
        <SectionLabel text="Proficiency" />
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map(([k, skills], i) => {
            const meta = SKILL_META[k] ?? { icon: "•", color: "var(--color-accent)" };
            return (
              <div
                key={k}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/50"
              >
                <div className="mb-3 flex items-center gap-2 font-mono text-sm">
                  <span aria-hidden="true" style={{ color: meta.color }}>
                    {meta.icon}
                  </span>
                  <span className="text-foreground">{k}</span>
                </div>
                <div className="space-y-3">
                  {skills.map((s, j) => (
                    <SkillBar
                      key={s.name}
                      name={s.name}
                      level={s.level}
                      delay={i * 0.1 + j * 0.05}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- projects/ ---------- */
const STATUS_META: Record<Project["status"], { label: string; className: string }> = {
  live: { label: "live", className: "border-success/40 bg-success/10 text-success" },
  wip: { label: "work in progress", className: "border-warning/40 bg-warning/10 text-warning" },
  archived: { label: "archived", className: "border-border bg-muted text-muted-foreground" },
};

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const status = STATUS_META[p.status];
  return (
    <motion.button
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onOpen}
      aria-label={`Open ${p.name} details`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div
        aria-hidden="true"
        className="h-1.5 w-full bg-gradient-to-r from-accent/80 to-purple/60"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            <span className="text-accent">▸</span> projects/{p.id}.tsx
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>
        <div className="mb-1 text-lg font-semibold text-foreground">{p.name}</div>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-foreground/80"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 font-mono text-accent">
            <span className="text-success" aria-hidden="true">
              ✓
            </span>
            {p.features.length} features
          </span>
          <span className="ml-auto font-mono text-muted-foreground transition-colors group-hover:text-accent">
            open →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function ProjectDetail({ p, onBack }: { p: Project; onBack: () => void }) {
  const status = STATUS_META[p.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Back to all projects"
            className="text-muted-foreground transition-colors hover:text-accent"
          >
            ← projects/
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{p.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
              status.className,
            )}
          >
            {status.label}
          </span>
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            GitHub ↗
          </a>
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-accent bg-accent/10 px-2 py-1 text-accent transition-colors hover:bg-accent/20"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">{p.name}</h2>
          <p className="mb-6 text-foreground/85">{p.description}</p>
          <SectionLabel text="Tech Stack" />
          <div className="mb-6 flex flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <span
                key={t}
                className="rounded border border-border px-2 py-0.5 font-mono text-xs text-foreground/85"
              >
                {t}
              </span>
            ))}
          </div>
          <SectionLabel text="Features" />
          <ul className="space-y-1 font-mono text-sm text-foreground/90">
            {p.features.map((f) => (
              <li key={f}>
                <span className="text-success" aria-hidden="true">
                  ✓
                </span>{" "}
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="relative min-h-[220px] overflow-hidden rounded-lg border border-border"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--color-accent) 14%, var(--card)), color-mix(in oklab, var(--color-purple) 14%, var(--card)))",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="font-mono text-lg font-semibold text-foreground/80">{p.name}</div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              project preview
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {p.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsPanel() {
  const [active, setActive] = useState<string | null>(null);
  const proj = PROJECTS.find((p) => p.id === active);
  if (proj) return <ProjectDetail p={proj} onBack={() => setActive(null)} />;
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <span>projects/ — {PROJECTS.length} entries</span>
        <span className="rounded bg-muted px-2 py-0.5">click to open</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} onOpen={() => setActive(p.id)} />
        ))}
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="group flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 p-5 text-center font-mono text-sm text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
        >
          <span className="text-2xl" aria-hidden="true">
            ⎇
          </span>
          <span>More projects on GitHub</span>
          <span className="text-xs underline-offset-4 group-hover:underline">
            github.com/ayan-singha-roy ↗
          </span>
        </a>
      </div>
    </div>
  );
}

/* ---------- leetcode.log ---------- */
function Heatmap() {
  // 7 rows × 26 weeks pseudo-deterministic heatmap (decorative)
  const weeks = 26;
  const cells = Array.from({ length: 7 * weeks }, (_, i) => {
    const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453);
    const level = Math.floor((v - Math.floor(v)) * 5); // 0..4
    return level;
  });
  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${weeks}, minmax(10px, 1fr))`,
          gridTemplateRows: "repeat(7, 10px)",
          gridAutoFlow: "column",
        }}
      >
        {cells.map((lvl, i) => (
          <div
            key={i}
            className="rounded-[2px]"
            style={{
              background:
                lvl === 0
                  ? "color-mix(in oklab, var(--foreground) 6%, transparent)"
                  : `color-mix(in oklab, var(--color-success) ${lvl * 22}%, var(--card))`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function LeetcodePanel() {
  const { total, easy, medium, hard, streak, badges } = LEETCODE;
  const lines = [
    `> Total Problems Solved: ${total}+`,
    `> Current Streak: ${streak} Days`,
    `> Easy:   ${easy}`,
    `> Medium: ${medium}`,
    `> Hard:   ${hard}`,
  ];
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-border bg-[color-mix(in_oklab,var(--background)_60%,black)]">
        <div className="border-b border-border bg-titlebar px-3 py-1.5 font-mono text-xs text-muted-foreground">
          leetcode.log
        </div>
        <div className="p-5 font-mono text-sm">
          {lines.map((l, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="text-success"
            >
              {l}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Easy" value={easy} color="var(--color-success)" />
        <Stat label="Medium" value={medium} color="var(--color-warning)" />
        <Stat label="Hard" value={hard} color="var(--color-destructive)" />
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-mono text-sm text-foreground">Activity — last 26 weeks</h3>
          <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
            <span>less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{
                  background:
                    l === 0
                      ? "color-mix(in oklab, var(--foreground) 6%, transparent)"
                      : `color-mix(in oklab, var(--color-success) ${l * 22}%, var(--card))`,
                }}
              />
            ))}
            <span>more</span>
          </div>
        </div>
        <div aria-hidden="true" role="presentation">
          <Heatmap />
        </div>
      </div>

      <div>
        <SectionLabel text="Badges" />
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent"
            >
              ★ {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="font-mono text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-3xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

/* ---------- github.stats ---------- */
export function GithubPanel() {
  const { repos, contributions, followers, languages } = GITHUB_STATS;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Repositories" value={repos} color="var(--color-accent)" />
        <Stat label="Contributions (year)" value={contributions} color="var(--color-success)" />
        <Stat label="Followers" value={followers} color="var(--color-purple)" />
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <SectionLabel text="Top Languages" />
        <div className="space-y-3">
          {languages.map((l) => (
            <div key={l.name}>
              <div className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="text-foreground">{l.name}</span>
                <span className="text-muted-foreground">{l.pct}%</span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`${l.name}: ${l.pct}%`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${l.pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: l.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <SectionLabel text="Commit activity (30 days)" />
        <div className="flex h-32 items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 1.3) * 80);
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.02 }}
                aria-hidden="true"
                className="flex-1 rounded-sm bg-accent/60"
              />
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel text="Achievements" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs"
            >
              <span className="text-base" aria-hidden="true">
                {a.icon}
              </span>
              <span className="text-foreground/90">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        <span aria-hidden="true">$</span> stats updated manually — sync with the GitHub API for live
        numbers.
      </p>
    </div>
  );
}

/* ---------- resume.pdf ---------- */
function ResumeRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-2 font-mono text-xs">
      <span className="w-14 shrink-0 text-muted-foreground">{k}</span>
      <span className="text-foreground/90">{v}</span>
    </div>
  );
}

export function ResumePanel() {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (resumeRef.current) {
      resumeRef.current.dataset.printing = "1";
      setTimeout(() => {
        window.print();
        delete resumeRef.current?.dataset.printing;
      }, 0);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePrint}
          className="rounded-md border border-accent bg-accent/10 px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ⎙ Print / Save as PDF
        </button>
        <span className="font-mono text-xs text-muted-foreground">
          Tip: use “Save as PDF” in the print dialog.
        </span>
      </div>

      <div
        ref={resumeRef}
        className="print-resume overflow-hidden rounded-lg border border-border bg-card"
      >
        {/* Resume header */}
        <div className="border-b border-border bg-[color-mix(in_oklab,var(--background)_55%,black)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{PROFILE.name}</h2>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{PROFILE.role}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{PROFILE.location}</p>
            </div>
            <div className="space-y-1">
              <ResumeRow k="email" v={PROFILE.email} />
              <ResumeRow k="github" v="github.com/ayan-singha-roy" />
              <ResumeRow k="linkedin" v="linkedin.com/in/ayan-singha-roy" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_220px]">
          <div className="space-y-5">
            <section>
              <SectionLabel text="Profile" />
              <p className="text-sm leading-relaxed text-foreground/85">{PROFILE.tagline}</p>
            </section>

            <section>
              <SectionLabel text="Skills" />
              <div className="flex flex-wrap gap-1.5">
                {Object.values(SKILLS)
                  .flat()
                  .map((s) => (
                    <span
                      key={s.name}
                      className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-foreground/85"
                    >
                      {s.name}
                    </span>
                  ))}
              </div>
            </section>

            <section>
              <SectionLabel text="Projects" />
              <ul className="space-y-3">
                {PROJECTS.map((p) => (
                  <li key={p.id} className="border-l-2 border-accent/40 pl-3">
                    <div className="text-sm font-semibold text-foreground">{p.name}</div>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                    <div className="mt-1 font-mono text-[10px] text-foreground/70">
                      {p.tech.join(" · ")}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionLabel text="Achievements" />
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {ACHIEVEMENTS.map((a) => (
                  <li key={a.label} className="flex items-center gap-2 text-sm text-foreground/85">
                    <span aria-hidden="true">{a.icon}</span>
                    {a.label}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-5 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <section>
              <SectionLabel text="Education" />
              <p className="text-sm text-foreground">{PROFILE.role}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">West Bengal, India</p>
            </section>
            <section>
              <SectionLabel text="Currently" />
              <ul className="space-y-1.5 text-sm text-foreground/85">
                {CURRENT_FOCUS.map((f) => (
                  <li key={f}>
                    <span className="text-success" aria-hidden="true">
                      +{" "}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <SectionLabel text="Interests" />
              <p className="text-sm leading-relaxed text-foreground/85">
                Web development, competitive programming, AI/ML, open source, hackathons.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ---------- contact.md ---------- */
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  maxLength,
  textarea,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  maxLength?: number;
  textarea?: boolean;
}) {
  const shared = cn(
    "w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40",
  );
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-muted-foreground">
        <span className="text-accent" aria-hidden="true">
          $
        </span>{" "}
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={maxLength}
          rows={5}
          className={cn(shared, "resize-none")}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={maxLength}
          className={shared}
        />
      )}
    </div>
  );
}

type FormStatus = "idle" | "sending" | "sent" | "error";

export function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);

  const reset = () => setForm({ name: "", email: "", message: "" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !emailValid || form.message.trim().length < 2) return;
    setStatus("sending");
    setError("");

    let failed = false;
    if (CONTACT_ENDPOINT) {
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        setStatus("sent");
        reset();
      } catch {
        failed = true;
        setStatus("error");
        setError("Couldn't reach the server. Please email me directly instead.");
      }
    } else {
      // Honest no-backend fallback: compose in the visitor's mail client.
      const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      reset();
    }

    if (!failed) setTimeout(() => setStatus("idle"), 6000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="font-mono text-sm">
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          <span className="text-accent"># </span>contact
        </h1>
        <p className="mb-6 max-w-sm text-foreground/80">
          Have an opportunity, a question, or just want to say hi? Drop a message — I usually reply
          within a day.
        </p>
        <ul className="space-y-2">
          {SOCIALS.map((row) => (
            <li key={row.key} className="flex items-baseline gap-3">
              <span className="w-20 shrink-0 text-muted-foreground">{row.key}:</span>
              <a
                href={row.href}
                target={row.key === "email" ? undefined : "_blank"}
                rel="noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                {row.handle}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={onSubmit}
        className="overflow-hidden rounded-lg border border-border bg-card"
        aria-label="Contact form"
      >
        <div className="border-b border-border bg-titlebar px-3 py-1.5 font-mono text-xs text-muted-foreground">
          ~/send-message.sh
        </div>
        <div className="space-y-3 p-4 font-mono text-sm">
          <Field
            id="cf-name"
            label="name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            required
            maxLength={80}
          />
          <Field
            id="cf-email"
            label="email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            required
            maxLength={120}
          />
          <Field
            id="cf-message"
            label="message"
            value={form.message}
            onChange={(v) => setForm((f) => ({ ...f, message: v }))}
            required
            maxLength={1000}
            textarea
          />

          {status === "error" && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "sending…" : "./send"}
          </button>

          {status === "sent" && (
            <p role="status" className="text-success">
              ✓{" "}
              {CONTACT_ENDPOINT ? "message sent — I'll get back to you." : "opening your mail app…"}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
