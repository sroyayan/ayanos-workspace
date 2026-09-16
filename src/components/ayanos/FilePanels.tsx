import { motion } from "motion/react";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  PROFILE,
  SOCIALS,
  CURRENT_FOCUS,
  SKILLS,
  SKILL_META,
  LEVEL_LABELS,
  PROJECTS,
  ACHIEVEMENTS,
  CONTACT_ENDPOINT,
  type Project,
} from "@/lib/ayanos-data";
import { useNotify } from "@/components/ayanos/Notifications";
import { fetchGitHubProfile, fetchGitHubRepos } from "@/services/github";
import dpImg from "@/assets/dp.png";
import {
  fetchLeetCodeProfile,
  fetchLeetCodeRecentSubmissions,
  solvedByDifficulty,
  LEETCODE_STATUS,
  type LeetCodeSubmission,
} from "@/services/leetcode";

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
  const [imgError, setImgError] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/20">
          {!imgError ? (
            <img
              src={dpImg}
              alt="Ayan Singha Roy"
              width={160}
              height={160}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold text-foreground">
              AS
            </div>
          )}
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
            github.com/sroyayan ↗
          </span>
        </a>
      </div>
    </div>
  );
}

/* ---------- leetcode.stats ---------- */

const LC_TIME = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// Lifted from modern Intl — "timeAgo" via Intl.RelativeTimeFormat
function timeAgo(ts: string): string {
  const diff = (Date.now() - Number(ts) * 1000) / 1000; // seconds
  if (diff < 60) return "just now";
  if (diff < 3600) return LC_TIME.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return LC_TIME.format(-Math.round(diff / 3600), "hour");
  return LC_TIME.format(-Math.round(diff / 86400), "day");
}

function SubmissionRow({ s, i }: { s: LeetCodeSubmission; i: number }) {
  const accepted = s.status === LEETCODE_STATUS.accepted;
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      className="flex items-baseline justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
    >
      <a
        href={`https://leetcode.com/problems/${s.titleSlug}/`}
        target="_blank"
        rel="noreferrer"
        className="truncate font-mono text-sm text-foreground transition-colors hover:text-accent"
      >
        {s.title}
      </a>
      <span
        className="flex-none font-mono text-[11px]"
        style={{ color: accepted ? "var(--color-success)" : "var(--color-destructive)" }}
      >
        {accepted ? "AC" : "WA"} · {timeAgo(s.timestamp)}
      </span>
    </motion.div>
  );
}

function LeetCodeError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-12 text-center">
      <span className="text-4xl" aria-hidden="true">
        λ
      </span>
      <h3 className="font-mono text-lg text-foreground">Failed to load LeetCode data</h3>
      <p className="font-mono text-sm text-muted-foreground">{message}</p>
      <a
        href={PROFILE.leetcode}
        target="_blank"
        rel="noreferrer"
        className="mt-4 rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
      >
        View profile on LeetCode ↗
      </a>
    </div>
  );
}

export function LeetcodePanel() {
  const profileQuery = useQuery({
    queryKey: ["leetcode", "profile"],
    queryFn: fetchLeetCodeProfile,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const submissionsQuery = useQuery({
    queryKey: ["leetcode", "submissions"],
    queryFn: () => fetchLeetCodeRecentSubmissions(8),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const isLoading = profileQuery.isLoading || submissionsQuery.isLoading;
  const error = profileQuery.error || submissionsQuery.error;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <LeetCodeError message={error.message} />;
  }

  // profileQuery.data is guaranteed by the isLoading + error guards above,
  // but we use optional chaining defensively to avoid crashes on edge cases
  // (e.g. a query cancelled mid-flight).
  const profile = profileQuery.data;
  if (!profile) return null;
  const solved = solvedByDifficulty(profile);
  const submissions = submissionsQuery.data ?? [];
  const badges = profile.badges ?? [];

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-5">
        {profile.profile.userAvatar ? (
          <img
            src={profile.profile.userAvatar}
            alt={`${profile.username} avatar`}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border border-border bg-muted"
            loading="lazy"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted font-mono text-2xl text-accent">
            λ
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-base text-foreground">
              {profile.profile.realName || profile.username}
            </h3>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
              u/{profile.username}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Global rank #{profile.profile.ranking.toLocaleString()} · Reputation{" "}
            {profile.profile.reputation}
          </p>
          <a
            href={PROFILE.leetcode}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block font-mono text-xs text-accent transition-colors hover:text-accent-foreground"
          >
            open leetcode.com ↗
          </a>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total" value={solved.all} color="var(--color-accent)" />
        <Stat label="Easy" value={solved.easy} color="var(--color-success)" />
        <Stat label="Medium" value={solved.medium} color="var(--color-warning)" />
        <Stat label="Hard" value={solved.hard} color="var(--color-destructive)" />
      </div>

      {/* Recent submissions (real data — no fabricated heatmap) */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionLabel text="Recent Submissions" />
          <span className="font-mono text-[10px] text-muted-foreground">
            live from leetcode.com
          </span>
        </div>
        <div className="space-y-2">
          {submissions.length === 0 && (
            <p className="font-mono text-sm text-muted-foreground">No recent submissions found.</p>
          )}
          {submissions.map((s, i) => (
            <SubmissionRow key={`${s.titleSlug}-${s.timestamp}`} s={s} i={i} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <SectionLabel text="Badges" />
        {badges.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground">
            No badges yet — solve problems to earn your first one.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 6).map((b) => (
              <span
                key={b.id}
                className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent"
              >
                {b.icon ? `${b.icon} ` : "★ "}
                {b.displayName}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="border-t border-border pt-3 font-mono text-[10px] text-muted-foreground">
        Stats fetched live from LeetCode GraphQL API — no fabricated numbers.
      </p>
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
  const profileQuery = useQuery({
    queryKey: ["github", "profile"],
    queryFn: fetchGitHubProfile,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const reposQuery = useQuery({
    queryKey: ["github", "repos"],
    queryFn: fetchGitHubRepos,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const isLoading = profileQuery.isLoading || reposQuery.isLoading;
  const error = profileQuery.error || reposQuery.error;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-12 text-center">
        <span className="text-4xl" aria-hidden="true">
          ⎇
        </span>
        <h3 className="font-mono text-lg text-foreground">Failed to load GitHub data</h3>
        <p className="font-mono text-sm text-muted-foreground">{error.message}</p>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="mt-4 rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
        >
          View profile on GitHub ↗
        </a>
      </div>
    );
  }

  const profile = profileQuery.data;
  const repos = reposQuery.data || [];

  const stats = [
    { label: "Repositories", value: profile?.public_repos ?? 0, color: "var(--color-accent)" },
    { label: "Followers", value: profile?.followers ?? 0, color: "var(--color-purple)" },
    { label: "Following", value: profile?.following ?? 0, color: "var(--color-success)" },
  ];

  const languageTotals: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageTotals[repo.language] = (languageTotals[repo.language] || 0) + 1;
    }
  });

  const languages = Object.entries(languageTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      pct: Math.round((count / repos.length) * 100),
      color:
        name === "Python"
          ? "var(--color-accent)"
          : name === "JavaScript"
            ? "var(--color-warning)"
            : name === "TypeScript"
              ? "var(--color-purple)"
              : name === "C" || name === "C++"
                ? "var(--color-pink)"
                : "var(--color-muted-foreground)",
    }));

  const recentRepos = repos.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={`${profile.name || profile.login}'s avatar`}
            className="h-16 w-16 rounded-lg border border-border"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-mono text-lg font-semibold text-foreground">
            {profile?.name || profile?.login}
          </h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">@{profile?.login}</p>
          {profile?.bio && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/80">
              {profile.bio}
            </p>
          )}
        </div>
        <a
          href={profile?.html_url || PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          ↗ Profile
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      {languages.length > 0 && (
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
      )}

      {recentRepos.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <SectionLabel text="Recent Repositories" />
          <div className="space-y-3">
            {recentRepos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between gap-3 rounded border border-border bg-background p-3 transition-colors hover:border-accent/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-mono text-sm font-medium text-foreground">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <span aria-hidden="true">★</span> {repo.stargazers_count}
                    </span>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-accent hover:underline"
                  >
                    ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <span aria-hidden="true">$</span> Live data — last fetched:{" "}
        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 h-4 w-20 animate-pulse rounded bg-muted" />
      <div className="h-8 w-16 animate-pulse rounded bg-muted" />
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
  const notify = useNotify();

  const handlePrint = () => {
    if (resumeRef.current) {
      resumeRef.current.dataset.printing = "1";
      setTimeout(() => {
        window.print();
        delete resumeRef.current?.dataset.printing;
        notify({
          kind: "success",
          title: "Print dialog opened",
          message: "PDF or print from your browser.",
        });
      }, 0);
    }
  };

  const handleViewFullscreen = () => {
    if (!resumeRef.current) return;
    const html = resumeRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${PROFILE.name} — Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ui-monospace, monospace; background: #0a0a0f; color: #e0e0e8; padding: 2rem; }
  h2 { font-size: 1.5rem; font-weight: 700; color: #fff; }
  h3 { font-size: 0.875rem; font-weight: 600; color: #a8b1ff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  p, li { font-size: 0.875rem; line-height: 1.6; color: #c8c8d0; }
  ul { padding-left: 1rem; }
  a { color: #a8b1ff; }
  .muted { color: #666; font-size: 0.75rem; }
  .skills { display: flex; flex-wrap: wrap; gap: 0.375rem; }
  .skills span { border: 1px solid #333; padding: 0.125rem 0.5rem; font-size: 0.6875rem; color: #c8c8d0; }
  .project { border-left: 2px solid rgba(168,177,255,0.4); padding-left: 0.75rem; margin-bottom: 0.75rem; }
  .project strong { color: #fff; }
  .project .tech { font-size: 0.625rem; color: #888; }
  .grid { display: grid; grid-template-columns: 1fr 220px; gap: 1.5rem; }
  @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>${html}</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePrint}
          className="rounded-md border border-accent bg-accent/10 px-4 py-2 font-mono text-sm text-accent transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ⎙ Download PDF
        </button>
        <button
          onClick={handleViewFullscreen}
          className="rounded-md border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ⊡ View Full Screen
        </button>
        <span className="font-mono text-xs text-muted-foreground">
          Tip: use "Save as PDF" in the print dialog to download.
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
              <ResumeRow k="github" v="github.com/sroyayan" />
              <ResumeRow k="linkedin" v="linkedin.com/in/sroyayan" />
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

const contactLinks: { key: string; label: string; value: string; href: string; icon: string }[] = [
  { key: "github", label: "GitHub", value: "@sroyayan", href: PROFILE.github, icon: "⎇" },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "in/sroyayan",
    href: PROFILE.linkedin,
    icon: "in",
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "@4yan_s.r0y",
    href: PROFILE.instagram,
    icon: "◎",
  },
  {
    key: "leetcode",
    label: "LeetCode",
    value: "u/ayanrsoy",
    href: PROFILE.leetcode,
    icon: "λ",
  },
  {
    key: "email",
    label: "Email",
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: "@",
  },
  {
    key: "location",
    label: "Location",
    value: PROFILE.location,
    href: PROFILE.linkedin,
    icon: "◎",
  },
];

export function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const notify = useNotify();
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);

  const reset = () => setForm({ name: "", email: "", message: "" });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      notify({ kind: "info", title: "Email copied to clipboard", message: PROFILE.email });
    } catch {
      // Clipboard API unavailable (e.g. non-secure context) — select-and-copy fallback.
    }
  };

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
        notify({
          kind: "success",
          title: "Message sent",
          message: "Thanks — I'll get back to you.",
        });
      } catch {
        failed = true;
        setStatus("error");
        setError("Couldn't reach the server. Please email me directly instead.");
        notify({ kind: "error", title: "Message failed to send" });
      }
    } else {
      // Honest no-backend fallback: compose in the visitor's mail client.
      const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      reset();
      notify({ kind: "info", title: "Opening your mail client…" });
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
        <div className="grid gap-3 sm:grid-cols-2">
          {contactLinks.map((row) => {
            const isEmail = row.key === "email";
            return (
              <div
                key={row.key}
                className="group rounded-lg border border-border bg-card p-3 transition-colors hover:border-accent/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-base text-muted-foreground" aria-hidden="true">
                    {row.icon}
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-sm text-foreground/90">{row.value}</p>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={row.href}
                    target={isEmail ? undefined : "_blank"}
                    rel="noreferrer"
                    className="font-mono text-xs text-accent underline-offset-4 hover:underline"
                  >
                    {isEmail ? "send ↗" : "open ↗"}
                  </a>
                  {isEmail && (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className={cn(
                        "font-mono text-xs transition-colors hover:text-accent",
                        copied ? "text-success" : "text-muted-foreground",
                      )}
                    >
                      {copied ? "✓ copied" : "⧉ copy"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
