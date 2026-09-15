# TECHNICAL_DEBT.md — Code Smells, Unused Dependencies, and Refactoring Targets

> **Purpose:** Ranked inventory of all technical debt in AyanOS. Each entry includes severity, location, rationale, and fix recommendation. This document exists to guide refactoring decisions and prevent debt from compounding.

---

## Debt Severity Scale

| Level | Meaning | Action |
|---|---|---|
| **Critical** | Actively harmful — blocks features, misleads users, or introduces risk | Fix before any public demo |
| **High** | Slows development or creates confusion — costs hours per week | Fix within 1 sprint |
| **Medium** | Noticeable code smell — experienced devs will flag it in review | Fix when touching the file |
| **Low** | Minor inefficiency — cleanup when convenient | Fix opportunistically |

---

## Dependency Bloat

This is the most visible and easily measurable form of technical debt in AyanOS.

### Unused npm Packages (Confirmed Not Imported Anywhere)

| Package | Version | Purpose (Why Installed) | Actually Used? | Recommendation |
|---|---|---|---|---|
| `@hookform/resolvers` | ^5.2.2 | Zod resolver for React Hook Form | ❌ Never imported | Remove |
| `@radix-ui/react-accordion` | ^1.2.12 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-alert-dialog` | ^1.1.15 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-aspect-ratio` | ^1.1.8 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-avatar` | ^1.1.11 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-checkbox` | ^1.3.3 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-collapsible` | ^1.1.12 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-context-menu` | ^2.2.16 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-dialog` | ^1.1.15 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-dropdown-menu` | ^2.1.16 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-hover-card` | ^1.1.15 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-label` | ^2.1.8 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-menubar` | ^1.1.16 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-navigation-menu` | ^1.2.14 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-popover` | ^1.1.15 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-progress` | ^1.1.8 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-radio-group` | ^1.3.8 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-scroll-area` | ^1.2.10 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-select` | ^2.2.6 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-separator` | ^1.1.8 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-slider` | ^1.3.6 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-slot` | ^1.2.4 | shadcn/ui dependency | ✅ Used by Button | **Keep** |
| `@radix-ui/react-switch` | ^1.2.6 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-tabs` | ^1.1.13 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-toggle` | ^1.1.10 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-toggle-group` | ^1.1.11 | shadcn/ui component | ❌ Never imported by app | Remove |
| `@radix-ui/react-tooltip` | ^1.2.8 | shadcn/ui component | ❌ Never imported by app | Remove |
| `cmdk` | ^1.1.1 | shadcn/ui Command component | ❌ Never imported by app | Remove |
| `date-fns` | ^4.1.0 | Date formatting utility | ❌ Never imported | Remove |
| `embla-carousel-react` | ^8.6.0 | shadcn/ui Carousel | ❌ Never imported by app | Remove |
| `input-otp` | ^1.4.2 | shadcn/ui InputOTP | ❌ Never imported by app | Remove |
| `lucide-react` | ^0.575.0 | Icon library (replaced by unicode) | ❌ Never imported | Remove |
| `react-day-picker` | ^9.14.0 | shadcn/ui Calendar | ❌ Never imported by app | Remove |
| `react-hook-form` | ^7.71.2 | Form validation | ❌ Never imported | Remove (or use for contact form) |
| `react-resizable-panels` | ^4.6.5 | Resizable panel layout | ❌ Never imported by app | Remove |
| `recharts` | ^2.15.4 | Charting library | ❌ Never imported | Remove |
| `sonner` | ^2.0.7 | Toast notifications | ❌ Never imported by app | Remove |
| `vaul` | ^1.1.2 | shadcn/ui Drawer | ❌ Never imported by app | Remove |
| `zod` | ^3.24.2 | Schema validation | ❌ Never imported | Remove (or pair with React Hook Form) |

**Summary:** 37 packages can be removed. This will:
- Reduce `node_modules` size by ~60%
- Speed up `bun install` significantly
- Eliminate false-positive lint warnings from unused shadcn/ui files
- Make the dependency list honest — every installed package is actually used

**Approach:**
1. Delete unused `src/components/ui/*.tsx` files (accordion, alert, alert-dialog, avatar, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip)
2. Run `bun remove` for each unused dependency
3. Run `bunx tsc --noEmit` and `bun run lint` to verify nothing broke
4. Commit as a single "Remove unused dependencies" commit

---

## Large Files (Code Smells)

### FilePanels.tsx — 979 Lines, 7 Components

**Location:** `src/components/ayanos/FilePanels.tsx`

**Severity:** High

**Problem:** This file contains 7 independent panel components (AboutPanel, SkillsPanel, ProjectsPanel, LeetcodePanel, GithubPanel, ResumePanel, ContactPanel) plus shared helper functions. At 979 lines, it:
- Makes code review painful (no reviewer reads a 979-line file carefully)
- Creates merge conflicts (every panel change touches the same file)
- Prevents lazy loading (all panels ship in one bundle)
- Makes finding a specific panel's code slow

**Recommended split:**
```
src/components/ayanos/
  ├─ panels/
  │   ├─ AboutPanel.tsx        (~80 lines)
  │   ├─ SkillsPanel.tsx       (~120 lines)
  │   ├─ ProjectsPanel.tsx     (~150 lines)
  │   ├─ LeetcodePanel.tsx     (~130 lines)
  │   ├─ GithubPanel.tsx       (~150 lines)
  │   ├─ ResumePanel.tsx       (~80 lines)
  │   ├─ ContactPanel.tsx      (~120 lines)
  │   └─ index.ts              (barrel export)
  ├─ BootSequence.tsx          (~77 lines — keep as-is)
  └─ Terminal.tsx              (~290 lines — keep as-is)
```

**After split:** Each panel file is 80–150 lines. Easy to review, easy to modify, and potentially lazy-loadable.

### index.tsx — 425 Lines, All Application State

**Location:** `src/routes/index.tsx`

**Severity:** Medium

**Problem:** This is the entire AyanOS shell: title bar, activity bar, explorer sidebar, editor tabs, status bar, terminal toggle, and PanelFor switch — plus all `useState` calls for the entire application. At 425 lines, it's manageable but dense.

**Why it's not higher severity:** This file *should* be the central orchestrator. The issue is that the UI chrome (title bar, activity bar, etc.) is inline rather than extracted.

**Recommended refactor:**
```
src/components/ayanos/
  ├─ TitleBar.tsx
  ├─ ActivityBar.tsx
  ├─ ExplorerSidebar.tsx
  ├─ StatusBar.tsx
  ├─ EditorArea.tsx
  └─ panels/           (as above)
```

This would reduce `index.tsx` to ~150 lines of state management + composition.

---

## TypeScript Configuration Debt

**Location:** `tsconfig.json`

| Setting | Current | Recommended | Why |
|---|---|---|---|
| `noUnusedLocals` | `false` | `true` | Catches dead variables, improves code clarity |
| `noUnusedParameters` | `false` | `true` | Catches dead function parameters |
| `verbatimModuleSyntax` | `false` | `true` | Ensures explicit `import type` — prevents accidental runtime imports |

**Severity:** Low — these are lint-level settings that catch real issues. Enabling them after cleanup ensures they stay clean.

---

## Committed Build Artifacts

**Location:** `dist/` directory

**Severity:** High

**Problem:** The `dist/` folder (built output: client bundles + server worker) is committed to git. This:
- Bloats the repository permanently (every build is a new snapshot)
- Creates merge conflicts in generated files
- Exposes build-time environment variables if any are embedded
- Serves no purpose (deployment should be CI/CD-driven)

**Fix:** Add `dist/` to `.gitignore` and remove from tracking:
```bash
git rm -r --cached dist/
echo "dist/" >> .gitignore
git commit -m "chore: remove dist/ from git tracking"
```

---

## Fake Data as Technical Debt

This is not traditional technical debt, but it functions the same way — it compounds over time as more features depend on it.

| Data Point | Location | What It Does | Why It's Debt |
|---|---|---|---|
| GitHub commit chart | `FilePanels.tsx` (GithubPanel) | `Math.sin()` line chart | Looks real but isn't — actively misleads visitors |
| GitHub heatmap | `FilePanels.tsx` (GithubPanel) | `Math.sin()` seeded heatmap | Same problem — fabricated activity |
| GitHub stats | `ayanos-data.ts` (GITHUB_STATS) | Hardcoded: ~80 commits, 12 repos, 47 contributions | Will diverge from reality immediately |
| LeetCode stats | `ayanos-data.ts` (LEETCODE) | Hardcoded: 152 solved, 32-day streak | Unverified — may not match profile |
| LeetCode heatmap | `FilePanels.tsx` (LeetcodePanel) | `Math.sin()` seeded noise | Fabricated competitive programming activity |
| Email | `ayanos-data.ts` (CONTACT.email) | `ayan.singharoy@example.com` | Placeholder — contact form is broken |
| Demo URL | `ayanos-data.ts` (PROJECTS) | `https://team-portfolio.example.com` | Dead link |
| Site URL | `ayanos-data.ts` (SITE.url) | `https://ayansingharoy.dev` | Not verified / possibly unregistered |

**Fix:** Every fake data point must either be replaced with a real API call or removed entirely. See ROADMAP.md items #1–2 for implementation plan.

---

## Unused Infrastructure

### TanStack Query Provider (Wired, Zero Queries)

**Location:** `src/router.tsx` (QueryClient creation), `src/routes/__root.tsx` (QueryClientProvider)

**Severity:** Medium

The QueryClient is instantiated, wrapped around the entire app via QueryClientProvider, and configured — but zero `useQuery` or `useMutation` calls exist anywhere. This is ready infrastructure for the GitHub/LeetCode API integration.

**Recommendation:** Keep it. It's ready for use and costs nothing at runtime. Document in `ARCHITECTURE.md` that it's intentionally pre-wired.

### React Hook Form + Zod (Installed, Not Used)

**Location:** `package.json` (dependencies)

**Severity:** Low

These are the correct tools for the contact form (which currently uses raw `useState` + HTML validation). They should either be used or removed.

**Recommendation:** Use them when fixing the contact form (ROADMAP.md item #3), or remove if choosing a different form approach.

---

## Missing Infrastructure

These aren't debt in the traditional sense, but their absence creates debt as the project grows.

| Missing | Why It's Needed | Impact of Absence | Fix Priority |
|---|---|---|---|
| **Tests** | No way to verify changes don't break existing functionality | Every refactor is a risk; no confidence in deployments | P1 |
| **CI/CD** | No automated quality gates | Manual lint + build + type-check is error-prone | P1 |
| **Error tracking** | `lovable-error-reporting.ts` sends to Lovable, not to a real service | Production errors are invisible | P2 |
| **Logging** | `console.log` and `console.error` only | No structured logging, no searchability | P2 |
| **Rate limiting** | Contact endpoint (if implemented) has no protection | Spam, abuse | P1 when contact form is built |
| **CSP headers** | No Content Security Policy | XSS risk if user-generated content is ever added | P2 |

---

## Code-Level Debt

### Inline Styles vs. Tailwind Classes

**Location:** Scattered through `FilePanels.tsx`

**Severity:** Low

Some dynamic values (computed widths, conditional colors) use inline `style` attributes. This is acceptable for values that can't be determined at build time (e.g., skill bar widths based on proficiency level). No action needed — this is correct Tailwind usage.

### Console Statements

**Location:** `src/server.ts`, `src/start.ts`, `src/lib/error-capture.ts`

**Severity:** Low

`console.log` and `console.error` are used for SSR error logging. In production, these should ideally route to a structured logging service (e.g., Pino, or Cloudflare Workers' built-in logging).

**Recommendation:** Replace with a thin logging wrapper that can be swapped for a real service later.

### Magic Numbers

**Location:** `src/routes/index.tsx`, `src/components/ayanos/Terminal.tsx`

**Severity:** Low

Examples: `36` (title bar height), `48` (activity bar width), `240` (sidebar width), `420` (terminal height), `768` (mobile breakpoint). These are reasonable for a single-page app but could be extracted to constants if the shell layout is reused.

**Recommendation:** Extract to a `src/lib/constants.ts` file if other routes are added.

---

## Summary Table

| Category | Debt Items | Estimated Fix Effort | Priority |
|---|---|---|---|
| Unused dependencies | 37 packages + 35 shadcn/ui files | 1–2 hours | High |
| File size (FilePanels.tsx) | 979 lines → 7 files | 2–3 hours | High |
| Fake data | 8 data points | 30 min removal, 3–4 hrs to replace with real API | Critical |
| Committed dist/ | 1 directory | 5 minutes | High |
| TypeScript config | 3 settings | 10 minutes | Low |
| Missing tests | 0 test files | 4–6 hours for E2E basics | Medium |
| Missing CI/CD | No pipeline | 2–3 hours | Medium |
| Unused infrastructure | TanStack Query, React Hook Form, Zod | 0 (keep) or 10 min (remove) | Low |
| Logging | console only | 1 hour | Low |
| Magic numbers | ~10 instances | 30 minutes | Low |

---

*Last updated: 2026-09-15*
