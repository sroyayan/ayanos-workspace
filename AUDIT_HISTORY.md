# AUDIT_HISTORY.md — Chronological Audit Timeline

This document merges all audit reports (past and present) into a single historical timeline for the AyanOS project.

---

## Audit Timeline Overview

| Date | Audit Type | Source Document | Scope |
|---|---|---|---|
| 2026-08-11 | Full Codebase Audit | `AUDIT_REPORT.md` | Design, a11y, performance, mobile, code quality |
| 2026-08-11 | Improvement Report | `FINAL_REPORT.md` | What was changed, verification, deployment |
| 2026-09-15 | Full Architecture Audit | This document (AI audit) | Architecture, security, scalability, fake data |

---

## Audit #1 — 2026-08-11: Initial Codebase Audit

**Source:** `AUDIT_REPORT.md`

### Findings

| # | Finding | Severity |
|---|---|---|
| 1 | Resume panel is a dead end — View/Download resume calls `preventDefault()` and does nothing | High |
| 2 | Contact form fakes submission — sets `sent=true` immediately, nothing sent | High |
| 3 | Placeholder project — "Future AI Project", `features: ["TBA"]`, links to profile page | Medium |
| 4 | Placeholder contact data — email is `ayan.singharoy@example.com` | Medium |
| 5 | Activity bar — Search/Git/Extensions buttons decorative, do nothing | Low |
| 6 | Fake "live" data — LeetCode heatmap and GitHub commit bars generated with `Math.sin()` | Medium |
| 7 | Status bar chrome — `⎇ main`, `● 0 problems`, language list are static decoration | Low |

### Recommendations Made

**Performance:**
- Boot sequence blocks page 2.7s on every load — no persistence, no reduced-motion bypass
- Google Fonts render-blocking — both families load eagerly
- Single bundle — all 7 panels + all animations ship upfront
- Per-switch staggered animations run for every panel change

**Accessibility:**
- Icon-only buttons lack accessible names
- No `aria-expanded`/`aria-controls` on toggles
- Terminal not a proper dialog (no `role="dialog"`, no focus trap, Escape doesn't close)
- Boot overlay: no focus management, no `aria-live`/`role="status"`
- No skip link
- Form fields not labelled
- `prefers-reduced-motion` not respected
- Contrast risk: `--muted-foreground` too low for small mono text
- No `:focus-visible` ring styling

**Mobile:**
- Explorer sidebar open by default (240px) on phones — squeezes editor to ~130px
- Should default to closed on mobile, open as overlay

### Priority Order Suggested

**P0:** Contact form, resume, remove placeholder + fake data, responsive sidebar  
**P1:** a11y + SEO + perf (labels, dialog semantics, favicon, JSON-LD, boot persistence)  
**P2:** Design polish (project badges, skill bars, contact validation, social links)

---

## Audit #2 — 2026-08-11: Final Report After Improvements

**Source:** `FINAL_REPORT.md`

### Changes Applied

| Area | Change |
|---|---|
| **Data Layer** | Added proficiency levels (1–5) to skills; status badges to projects; social icons; `CONTACT_ENDPOINT` env var |
| **FilePanels.tsx** | Full rewrite: AboutPanel slide-in, SkillsPanel JSON tree + proficiency bars, ProjectsPanel cards + badges, ContactPanel with mailto fallback + Formspree conditional |
| **Terminal.tsx** | ARIA dialog semantics; focus trap; command history; autofocus; keyboard labels |
| **BootSequence.tsx** | Reduced-motion bypass; `aria-live` region; skip button autofocus; Escape keybinding |
| **App Shell** | Hydration fix (server renders `booted=true`); skip-to-content link; ARIA labels; `aria-current="page"`; `aria-controls="explorer"`; mobile auto-close sidebar |
| **Root Layout** | JSON-LD Person schema; OG/Twitter meta tags; font preconnect; `lang="en"`; theme-color |
| **Design System** | Contrast bump (`--muted-foreground` 0.62→0.68); `.glass` utility; `::selection`; `:focus-visible` ring; custom scrollbar; print styles; reduced-motion media query |
| **Lint/Format** | Fixed 25 Prettier errors; lint passes with 0 errors |

### Verification Results

| Check | Result |
|---|---|
| `bun run lint -- --fix` | ✅ 0 errors, 6 pre-existing shadcn warnings |
| `bunx tsc --noEmit` | ✅ Clean |
| `bun run build` | ✅ Success |
| Dev server | ✅ Runs without errors |
| Browser console | ✅ Zero errors |
| SSR hydration | ✅ No mismatch errors |
| All 7 panels | ✅ Render correctly |
| Boot sequence | ✅ First-visit works, returning visitors skip |

### Remaining Issues After Fix

| Issue | Severity |
|---|---|
| 6 `react-refresh/only-export-components` warnings | Low (harmless shadcn noise) |
| Placeholder email in data | Low (must verify before deploy) |
| `SITE.url` placeholder | Low (update before launch) |
| First-visit boot flash (1–2 frames) | Low (unavoidable SSR hydration behavior) |
| `og-image.svg` may be placeholder | Low |

### Deployment Instructions Documented

1. `bun install` + `bun run build`
2. Configure `.env` with `VITE_CONTACT_ENDPOINT` and `VITE_GITHUB_TOKEN`
3. `bun run preview` → http://localhost:3000
4. Deploy: `bunx wrangler pages deploy dist --project-name ayanos`
5. Update `SITE.url` after deployment

---

## Audit #3 — 2026-09-15: Full Architecture Audit

**Source:** This document (AI agent comprehensive scan)

### New Findings

### Architecture
- **No backend.** All data static in `ayanos-data.ts`. Nitro server does SSR only.
- **No API routes.** No GitHub, LeetCode, contact, or blog endpoints.
- **No database.** No persistence beyond `sessionStorage` boot flag.
- **Single route.** Only `/` exists. Router installed for expansion.

### Data Integrity (Critical)
- **GitHub data entirely fake** — `Math.sin()` pseudorandom chart, hardcoded stats
- **LeetCode data entirely fake** — hardcoded numbers, seeded noise heatmap
- **Dead links** — `team-portfolio.example.com`, placeholder email
- **No real dedeployed URL** — `SITE.url` is unverified

### Security
- **No CSP header**
- **No rate limiting** on contact endpoint
- **Nitro 3.0 beta** — unpatched risk until stable
- **No HSTS** enforcement
- **GitHub token** (if configured) must be server-side only

### Scalability
- `FilePanels.tsx` is 979 lines with 7 components — unbeatable refactor target
- All panels bundle upfront — no code splitting
- Static data can't support dynamic features

### Technical Debt
- ~35 unused shadcn/ui components
- ~8 unused npm packages (React Hook Form, Zod, Recharts, date-fns, Lucide, etc.)
- TanStack Query wired but unused
- `dist/` committed to git
- `noUnusedLocals: false` / `noUnusedParameters: false` / `verbatimModuleSyntax: false` in tsconfig
- `nitro@3.0.260603-beta` dependency

---

## Lessons Learned

### From Audit #1 → Audit #2
1. **Accessibility work is high-ROI.** The terminal focus trap and reduced-motion support were cheap to add and dramatically improve the SIH judging impression.
2. **Cosmetic improvements are seductive but low-value.** The JSON tree for skills looks nice but adds no functional value.
3. **Fake data is a credibility trap.** Even a well-designed heatmap that isn't real data is worse than no heatmap at all.

### From Audit #2 → Audit #3
4. **SSR hydration constraints need explicit patterns.** The `booted=true` default + useEffect flip is the correct pattern for sessionStorage-dependent state.
5. **Error recovery architecture should be documented.** The three-layer chain (error-capture → server.ts → start.ts) took a dedicated file to explain.
6. **The single-file panel implementation blocks iteration.** Lessons from splitting would help any future AI agent.

### Overall
7. **The concept is the moat.** No amount of code quality can replace the memorability of the VS Code metaphor.
8. **Substance must catch up to style.** The project looks production-ready but isn't. Real data integration is the #1 priority.
9. **Documentation pays for itself.** Every audit has found the same issues re-audited because there was no persistent knowledge base. This doc is the fix.

---

*Last updated: 2026-09-15*  
*Next audit target: 30 days after GitHub API integration*