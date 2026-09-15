# PROJECT_OVERVIEW.md — AyanOS

---

## What AyanOS Is

AyanOS is a **developer operating system portfolio** — a single-page web application that presents the personal portfolio of Ayan Singha Roy as a VS Code–inspired desktop environment. It features a title bar, activity bar, explorer sidebar with file tree, editor tabs, a floating interactive terminal, and a status bar.

The project demonstrates that a portfolio doesn't have to be a static page with a photo and a resume link. It can be an *experience* — something a recruiter, judge, or collaborator remembers.

---

## Purpose

AyanOS serves three distinct purposes:

1. **Portfolio:** Showcase Ayan's projects, skills, LeetCode stats, GitHub activity, and resume to recruiters and hiring managers.

2. **Competition Entry:** Serve as a Smart India Hackathon (SIH) submission or demo project that demonstrates full-stack development skills.

3. **Learning Artifact:** Be a living project that evolves as Ayan learns new technologies — each new skill gets added to the OS, each new project gets a panel, each new tool gets a terminal command.

---

## Target Audience

| Audience | What They Care About | What AyanOS Shows Them |
|---|---|---|
| **Recruiters** | Can this person code? Are they serious? | Real GitHub data, real projects, working contact form, downloadable resume |
| **Open-source maintainers** | Does this person contribute? | GitHub contributions, commit activity, project architecture |
| **Hackathon judges** | Is this innovative? Does it work? Is it technically sound? | Unique concept, working terminal, SSR, accessibility, real data integration |
| **Cybersecurity professionals** | Does this person understand security? | (Planned: CTF writeups, security lab) |
| **AI/ML engineers** | Does this person do real ML work? | (Planned: experiment dashboard, model performance) |
| **Fellow developers** | Is this well-built? | Clean architecture, TypeScript, design system, keyboard shortcuts |

---

## Core Concept

**"What if a portfolio was an operating system?"**

The user boots into AyanOS, sees a terminal-style boot sequence, and lands in a VS Code–like environment. They can:

- **Browse files** in the explorer sidebar (about.md, skills.json, projects/, etc.)
- **Open files** as editor tabs with smooth transitions
- **Use the terminal** to type commands like `about`, `skills`, `projects`, `open about.md`
- **Navigate with keyboard** — Ctrl+` for terminal, Ctrl+B for sidebar, arrow keys in terminal history
- **On mobile**, the sidebar becomes an overlay with a backdrop

Every piece of information is presented as a "file" in this OS, reinforcing the developer aesthetic.

---

## Current Status

| Aspect | Status |
|---|---|
| **Development stage** | Late Alpha / Early Beta |
| **Deployment** | Not deployed (target: Cloudflare Workers) |
| **Last audit** | 2026-09-15 (comprehensive codebase scan) |
| **Previous audits** | 2026-08-11 (AUDIT_REPORT.md + FINAL_REPORT.md) |
| **Build status** | Passing (`bun run build` succeeds) |
| **Lint status** | Clean (0 errors, 6 pre-existing shadcn warnings) |
| **TypeScript** | Clean (`bunx tsc --noEmit` passes) |
| **Tests** | None |
| **CI/CD** | None |
| **Real data** | None (all hardcoded or pseudorandom) |
| **Backend** | None (SSR only, no API routes) |

---

## Strengths

1. **Memorable concept.** The VS Code metaphor is executed consistently and is genuinely unique among student portfolios. It's the kind of thing judges remember.

2. **Clean design system.** All colors are oklch CSS variables. Components never hardcode colors. The dark theme is cohesive and professional.

3. **Solid SSR.** Three layers of error recovery (`error-capture.ts`, `server.ts`, `start.ts`) handle h3-swallowed throws that would otherwise produce empty 500 responses. This is production-quality infrastructure work.

4. **Genuinely functional terminal.** 14 commands, command history with arrow keys, focus trap, ARIA dialog semantics. This is not a mockup — it works.

5. **Keyboard-first design.** Ctrl+` for terminal, Ctrl+B for sidebar, Escape to skip boot, arrow keys for terminal history. Power users feel at home.

6. **Data centralized.** All content lives in `ayanos-data.ts`. Editing content never touches UI code. This is good architecture.

7. **Polished motion.** Staggered boot lines, panel transitions, animated skill bars, hover effects on project cards. The animations enhance the experience without being gratuitous.

8. **Accessibility considered.** Skip link, ARIA labels, focus-visible rings, reduced-motion support, proper dialog semantics on the terminal. Not perfect, but far better than most student projects.

9. **Error handling infrastructure.** The SSR error recovery chain is more robust than many production apps. This demonstrates systems thinking.

---

## Weaknesses

1. **Everything is fake.** GitHub stats are `Math.sin()`. LeetCode stats are hardcoded. The heatmap is seeded noise. A recruiter who cross-references will find inconsistencies.

2. **Dead ends everywhere.** Resume download does nothing useful. Contact form only works with an env var that isn't set. Demo links go to `example.com`. Email is `example.com`.

3. **No backend.** No API routes, no data persistence, no dynamic content. The Nitro server only handles SSR error recovery.

4. **No real data integration.** Despite having API tokens documented as env vars, no actual API calls exist.

5. **Dependency bloat.** ~30+ packages installed but never imported (Recharts, date-fns, React Hook Form, Zod, Lucide React, 35 shadcn/ui components).

6. **Single file with 7 components.** `FilePanels.tsx` is 979 lines. It should be split into separate files.

7. **No tests.** Zero test files exist. No unit tests, no integration tests, no end-to-end tests.

8. **No CI/CD.** No GitHub Actions, no automated testing, no deployment pipeline.

9. **Fake "live" data presented as real.** The heatmap and commit bars are generated with `Math.sin()` and labeled as "Activity — last 26 weeks" and "Commit activity (30 days)." This is dishonest.

10. **No blog or technical writing.** The portfolio shows what was built but not how or why. Technical writing would demonstrate communication skills.

---

## Future Vision

### Phase 1: Make It Real (Weeks 1-2)
Replace all fake data with real API integrations. Fix dead links. Create working contact form. Generate real resume PDF.

### Phase 2: Add Substance (Weeks 3-4)
Blog system with technical articles. Project architecture visualizations. CI/CD status display. Visitor analytics.

### Phase 3: Differentiate (Weeks 5-8)
AI/ML experiment dashboard. Cybersecurity lab showcase. Interactive code playground. Achievement timeline.

### Phase 4: Production-Ready (Weeks 9-12)
End-to-end tests. Performance monitoring. Light theme. RSS feed. Multi-route support for blog.

**The vision:** AyanOS becomes not just a portfolio, but a **platform** — a place where every project, every learning milestone, every technical insight has a home. A living document of an engineering career, presented as the operating system that runs it.

---

*Last updated: 2026-09-15*
