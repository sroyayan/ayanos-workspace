import { motion } from "motion/react";
import {
  PROFILE,
  SKILLS,
  PROJECTS,
  LEETCODE,
  GITHUB_STATS,
  ACHIEVEMENTS,
  type Project,
} from "@/lib/ayanos-data";
import { useState } from "react";

/* ---------- about.md ---------- */
export function AboutPanel() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="flex flex-col items-center gap-3 lg:items-start">
        <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-border bg-card">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--color-accent) 35%, transparent), transparent 60%), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--color-purple) 35%, transparent), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold text-foreground">
            AR
          </div>
        </div>
        <div className="text-center lg:text-left">
          <div className="font-mono text-xs text-muted-foreground">~/about.md</div>
          <div className="mt-1 text-sm text-success">● Online</div>
        </div>
      </div>

      <article className="font-mono text-sm leading-7 text-foreground">
        <h1 className="mb-1 text-3xl font-bold tracking-tight">
          <span className="text-accent"># </span>
          {PROFILE.name}
        </h1>
        <div className="mb-6 text-muted-foreground">{PROFILE.role}</div>

        <p className="mb-6 max-w-2xl text-foreground/90">
          Passionate about building software, learning web development, solving
          coding problems, and exploring AI. I like shipping things that work,
          then making them faster.
        </p>

        <h2 className="mb-2 text-base text-accent">## Current Focus</h2>
        <ul className="mb-6 space-y-1 text-foreground/90">
          {["React", "Full Stack Development", "DSA", "AI/ML"].map((x) => (
            <li key={x}>
              <span className="text-success">+</span> {x}
            </li>
          ))}
        </ul>

        <h2 className="mb-2 text-base text-accent">## Location</h2>
        <p className="text-foreground/90">{PROFILE.location}</p>
      </article>
    </div>
  );
}

/* ---------- skills.json ---------- */
function JsonLine({ k, v, i }: { k: string; v: string[]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06 }}
      className="pl-6"
    >
      <span className="text-purple">"{k}"</span>
      <span className="text-muted-foreground">: </span>
      <span className="text-muted-foreground">[</span>
      <div className="pl-6">
        {v.map((item, j) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 + j * 0.04 + 0.1 }}
          >
            <span className="text-success">"{item}"</span>
            {j < v.length - 1 && <span className="text-muted-foreground">,</span>}
          </motion.div>
        ))}
      </div>
      <span className="text-muted-foreground">]</span>
    </motion.div>
  );
}
export function SkillsPanel() {
  const entries = Object.entries(SKILLS);
  return (
    <div className="font-mono text-sm">
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded bg-muted px-2 py-0.5">JSON</span>
        <span>skills.json — {entries.length} keys</span>
      </div>
      <div className="rounded-lg border border-border bg-card p-5 leading-7">
        <div className="text-muted-foreground">{"{"}</div>
        {entries.map(([k, v], i) => (
          <div key={k}>
            <JsonLine k={k} v={v as string[]} i={i} />
            {i < entries.length - 1 && <span className="pl-6 text-muted-foreground">,</span>}
          </div>
        ))}
        <div className="text-muted-foreground">{"}"}</div>
      </div>
    </div>
  );
}

/* ---------- projects/ ---------- */
function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onOpen}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-accent"
    >
      <div className="mb-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <span className="text-accent">▸</span>
        <span>projects/{p.id}.tsx</span>
      </div>
      <div className="mb-1 text-lg font-semibold text-foreground">{p.name}</div>
      <p className="mb-4 text-sm text-muted-foreground">{p.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span
            key={t}
            className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-foreground/80"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

function ProjectDetail({ p, onBack }: { p: Project; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-muted-foreground hover:text-accent">
            ← projects/
          </button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{p.id}</span>
        </div>
        <div className="flex gap-2">
          <a
            href={p.github}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-border px-2 py-1 text-muted-foreground hover:border-accent hover:text-accent"
          >
            GitHub ↗
          </a>
          {p.demo && (
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-accent bg-accent/10 px-2 py-1 text-accent hover:bg-accent/20"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{p.name}</h2>
          <p className="mb-6 text-foreground/85">{p.description}</p>
          <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Tech Stack
          </h3>
          <div className="mb-6 flex flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <span
                key={t}
                className="rounded border border-border px-2 py-0.5 font-mono text-xs"
              >
                {t}
              </span>
            ))}
          </div>
          <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Features
          </h3>
          <ul className="space-y-1 font-mono text-sm">
            {p.features.map((f) => (
              <li key={f}>
                <span className="text-success">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="min-h-[220px] rounded-lg border border-border"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--color-accent) 14%, var(--card)), color-mix(in oklab, var(--color-purple) 14%, var(--card)))",
          }}
        >
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            // screenshot.preview
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
      <div className="mb-4 font-mono text-xs text-muted-foreground">
        projects/ — {PROJECTS.length} entries
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} onOpen={() => setActive(p.id)} />
        ))}
      </div>
    </div>
  );
}

/* ---------- leetcode.log ---------- */
function Heatmap() {
  // 7 rows × 26 weeks pseudo-deterministic heatmap
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
        <div className="mb-3 flex items-center justify-between">
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
        <Heatmap />
      </div>

      <div>
        <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Badges
        </h3>
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
        <h3 className="mb-4 font-mono text-sm">Top Languages</h3>
        <div className="space-y-3">
          {languages.map((l) => (
            <div key={l.name}>
              <div className="mb-1 flex items-center justify-between font-mono text-xs">
                <span className="text-foreground">{l.name}</span>
                <span className="text-muted-foreground">{l.pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
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
        <h3 className="mb-3 font-mono text-sm">Commit activity</h3>
        <div className="flex h-32 items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 1.3) * 80);
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.02 }}
                className="flex-1 rounded-sm bg-accent/60"
              />
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Achievements
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs"
            >
              <span className="text-base">{a.icon}</span>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- resume.pdf ---------- */
export function ResumePanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="rounded-md border border-accent bg-accent/10 px-4 py-2 font-mono text-sm text-accent hover:bg-accent/20"
        >
          View Resume
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          download
          className="rounded-md border border-border px-4 py-2 font-mono text-sm hover:border-accent"
        >
          ↓ Download Resume
        </a>
      </div>
      <div className="aspect-[8.5/11] w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-[color-mix(in_oklab,var(--background)_60%,black)]">
        <div className="flex h-full items-center justify-center text-center font-mono text-xs text-muted-foreground">
          <div>
            <div className="mb-2 text-base text-foreground">resume.pdf</div>
            <div>Embedded PDF viewer goes here.</div>
            <div className="mt-1">Drop your file into /public/resume.pdf.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- contact.md ---------- */
export function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="font-mono text-sm">
        <h1 className="mb-4 text-3xl font-bold">
          <span className="text-accent"># </span>contact
        </h1>
        <ul className="space-y-2">
          {[
            { k: "email", v: PROFILE.email, href: `mailto:${PROFILE.email}` },
            { k: "linkedin", v: "linkedin.com/in/ayan-singha-roy", href: PROFILE.linkedin },
            { k: "github", v: "github.com/ayan-singha-roy", href: PROFILE.github },
            { k: "instagram", v: "@ayan.singharoy", href: PROFILE.instagram },
          ].map((row) => (
            <li key={row.k} className="flex items-baseline gap-3">
              <span className="w-20 text-muted-foreground">{row.k}:</span>
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                {row.v}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
          setTimeout(() => setSent(false), 3500);
          setForm({ name: "", email: "", message: "" });
        }}
        className="overflow-hidden rounded-lg border border-border bg-card"
      >
        <div className="border-b border-border bg-titlebar px-3 py-1.5 font-mono text-xs text-muted-foreground">
          ~/send-message.sh
        </div>
        <div className="space-y-3 p-4 font-mono text-sm">
          <Field
            label="name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            required
            maxLength={80}
          />
          <Field
            label="email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            required
            maxLength={120}
          />
          <div>
            <div className="mb-1 text-muted-foreground">
              <span className="text-accent">$</span> message:
            </div>
            <textarea
              required
              maxLength={1000}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={5}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-accent hover:bg-accent/20"
          >
            ./send
          </button>
          {sent && (
            <div className="text-success">
              ✓ message queued — I&apos;ll get back to you.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <div className="mb-1 text-muted-foreground">
        <span className="text-accent">$</span> {label}:
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
