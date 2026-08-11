# AyanOS Portfolio — Audit Report

Audit date: 2026-08-11
Project root: `ayanos-workspace-main`

---

## 1. Tech stack

| Layer | Technology |
| --- | --- |
| Framework | **TanStack Start** v1.168 (SSR-first, file-based routing) + **Nitro** server |
| UI | **React 19.2**, TypeScript 5.8 |
| Build | **Vite 8**, `@lovable.dev/vite-tanstack-config` |
| Styling | **Tailwind CSS 4** (CSS-first `@theme` tokens), `tw-animate-css` |
| Animation | **Motion** (Framer Motion successor), `AnimatePresence` |
| Data fetching | TanStack Query (installed, **unused**) |
| Components | shadcn/ui (Radix primitives) — ~40 files, **mostly unused** |
| Package manager | **Bun** 1.3 (`bun.lock`) |

Deploy target is a Nitro server (defaults to Cloudflare Workers config).

## 2. Project structure

```
src/
├── components/
│   ├── ayanos/            # Custom app: BootSequence, Terminal, FilePanels
│   └── ui/                # ~40 shadcn components (few used by app)
├── hooks/use-mobile.tsx   # Mobile breakpoint hook
├── lib/
│   ├── ayanos-data.ts     # ALL content data (profile, skills, projects, stats)
│   ├── error-page.ts      # SSR 500 fallback HTML
│   ├── error-capture.ts   # Captures swallowed SSR errors
│   ├── lovable-error-reporting.ts
│   └── utils.ts           # cn() helper
├── routes/__root.tsx      # Root layout + SEO head + error/404
├── routes/index.tsx       # Single page — the "AyanOS" desktop
├── router.tsx             # TanStack Router with QueryClient
├── server.ts / start.ts   # SSR error wrappers
└── styles.css             # Design tokens + Tailwind theme
```

The app is a **single page** (`/`) implementing a VS Code–inspired desktop
metaphor: title bar → activity bar → explorer sidebar → editor tabs → status
bar, plus a boot sequence and a floating interactive terminal.

## 3. What is good ✅

- **Coherent concept.** The "developer OS" metaphor is executed consistently
  and is genuinely memorable for a portfolio.
- **Clean design tokens.** All colors are `oklch` CSS variables; components
  never hardcode colors.
- **Solid SSR error handling.** Three layers (`server.ts`, `start.ts`,
  `error-capture.ts`, `error-page.ts`) recover from h3-swallowed throws.
- **Genuinely functional terminal** — command parsing, history (↑/↓), colors,
  `open <file>` integration with the editor.
- **Keyboard shortcuts** — `Ctrl/⌘+`` terminal, `Ctrl/⌘+B` sidebar, `Esc`
  skips boot.
- **Data centralized** in `ayanos-data.ts`; editing content never touches UI.
- **Polished motion** — staggered boot lines, panel transitions, animated
  bars/heatmap.
- Styled 404 + error boundary pages.

## 4. What is unfinished / broken ❌

| # | Issue | Severity |
| --- | --- | --- |
| 1 | **Resume panel is a dead end** — "View Resume" and "Download Resume" both call `preventDefault()` and do nothing. PDF viewer is placeholder text. No `public/` dir / `resume.pdf` exists. | High |
| 2 | **Contact form fakes submission** — sets `sent=true` immediately; message says "message queued" but nothing is sent and data is discarded. | High |
| 3 | **Placeholder project** — "Future AI Project", `features: ["TBA"]`, links to profile page. Misleading in a showcase. | Medium |
| 4 | **Placeholder contact data** — email is `ayan.singharoy@example.com` (example.com domain). | Medium |
| 5 | **Activity bar** — Search / Git / Extensions buttons are decorative and do nothing; implies features that don't exist. | Low |
| 6 | **Fake "live" data** — LeetCode heatmap and GitHub commit bars are generated with `Math.sin()`; presented as real activity. | Medium |
| 7 | **Status bar chrome** — `⎇ main`, `● 0 problems`, language list are static decoration implying a live editor. | Low |

## 5. What should be removed 🗑

- The **"Future AI Project" placeholder** (or clearly labelled as WIP with no
  dead links).
- **Unused shadcn/ui components** (~35 files never imported). Tree-shaken from
  the build, but they bloat the repo, lint surface, and confuse contributors.
- **TanStack Query** provider/QueryClient if no server data is ever fetched
  (only needed if the contact form / stats become real).
- **`use-mobile.tsx`** was unused before — I reuse it for responsive sidebar.

## 6. Performance issues ⚡

1. **Boot sequence blocks the page 2.7s on every load** and replays on each
   visit — hurts LCP and perceived speed. No persistence, no
   `prefers-reduced-motion` bypass.
2. **Google Fonts** stylesheet is render-blocking; both families load eagerly
   (Inter + JetBrains Mono). Acceptable, but no `preload` and no swap latency
   control.
3. **Single bundle**: all 7 panels + all animations ship up front. The app is
   small (~a few hundred KB), so code-splitting is a nice-to-have, not a must.
4. **Per-switch staggered animations** run for every panel change even for
   users with `prefers-reduced-motion: reduce`.
5. No favicon / og:image files exist (also an SEO gap).

## 7. Accessibility issues ♿

1. **Icon-only buttons lack accessible names** — activity bar (☰ ⌕ ⎇ ▦), tab
   close (✕), terminal toggle (`>_`), sidebar toggle. Only some have `title`.
2. **No `aria-expanded` / `aria-controls`** on the sidebar and terminal toggles.
3. **Terminal is not a proper dialog** — no `role="dialog"`, no `aria-label`,
   no focus trap (Tab escapes), **Escape does not close it**, and focus isn't
   returned to the trigger on close.
4. **Boot overlay** grabs the whole viewport with no focus management and no
   `aria-live`/`role="status"`; screen-reader users wait ~2.7s silently.
5. **No skip link** to jump past the title bar / sidebar chrome.
6. **Form fields are not labelled** — inputs use adjacent text but no
   `<label>`/`htmlFor`, so names/errors aren't exposed to assistive tech.
7. **`prefers-reduced-motion` not respected** anywhere.
8. **Contrast risk**: `--muted-foreground` is `oklch(0.62 …)` on a very dark
   background — fine for large text, borderline for the small mono text used
   everywhere.
9. No `:focus-visible` ring styling on the custom buttons.

## 8. Mobile / responsive issues 📱

1. **Explorer sidebar is open by default (240px)** on phones, squeezing the
   editor to ~130px on a 375px viewport. Should default to closed on mobile and
   open as an **overlay** instead of pushing content.
2. Activity bar correctly hidden on mobile; no equivalent navigation entry
   beyond the ☰ button (works, but the overlay fix above is required).
3. Status bar / title bar hints collapse OK on small screens.
4. Heatmap and project grids already use `overflow-x-auto` / responsive grids —
   mostly fine.

## 9. Priority order of improvements

**P0 — broken / misleading (fix first)**
1. Functional contact form (real submission path or honest fallback).
2. Functional resume (rendered resume + working print/PDF + remove placeholder).
3. Remove placeholder project & fix fake "live" data presentation.
4. Responsive sidebar (closed by default on mobile, overlay behavior).

**P1 — a11y + SEO + perf**
5. aria-labels, dialog semantics + focus trap for terminal, skip link,
   labelled form fields, reduced-motion support.
6. Favicon, `og:image`, JSON-LD, canonical, `theme-color`.
7. Boot sequence: persist "seen" flag, honor reduced-motion, faster LCP.
8. Contrast token bump for small text.

**P2 — design & showcase polish**
9. Projects: status badges, gradient cards, live-demo links, no dead links.
10. Skills: proficiency bars / richer visualization.
11. Contact: labelled, validated, with sending/success states.
12. About: social links, achievements, tighter typography & spacing.

---

### 10. Design weaknesses summary

- Single accent (blue) with occasional purple/pink/green — consistent but flat;
  adding a faint background treatment would elevate it.
- The "OS chrome" (status bar, activity bar) is mostly static decoration; making
  the few interactive bits honest removes the "fake UI" feeling.
- Skills shown as a raw JSON tree — informative but not scannable; a visual
  layer would help.
- Projects lack screenshots/previews (placeholder box) and most have no live
  demo.

See `FINAL_REPORT.md` for the full list of changes applied and deployment notes.
