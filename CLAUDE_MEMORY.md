# CLAUDE_MEMORY.md — AyanOS AI Quick-Reference

> **Load this file first in every AI session.** Max 1500 words.

---

## What AyanOS Is

A VS Code-inspired developer portfolio for Ayan Singha Roy (B.Tech CSE AI & ML, West Bengal, India). A single-page app that presents a personal portfolio as a developer operating system — explorer sidebar, editor tabs, terminal, status bar. Scaffolded via Lovable, improved through two audit cycles.

**Status:** Late Alpha. Visually polished but substantively fake. Most data is hardcoded or pseudorandom.

---

## Architecture

- **Stack:** React 19, TypeScript 5.8, TanStack Start (SSR), Vite 8, Tailwind CSS 4, Motion (Framer Motion successor)
- **Server:** Nitro (Cloudflare Workers target) — SSR only, no API routes yet
- **Data:** All static in `src/lib/ayanos-data.ts` — no backend, no database
- **State:** All local `useState` in `src/routes/index.tsx` — no global state
- **Deploy:** `bun run build` → `bunx wrangler pages deploy dist`
- **Package manager:** Bun (never npm)

**Key files:**
- `src/routes/index.tsx` — The entire app shell (425 lines)
- `src/components/ayanos/FilePanels.tsx` — All 7 panels (980 lines, needs splitting)
- `src/components/ayanos/Terminal.tsx` — Interactive terminal (290 lines)
- `src/lib/ayanos-data.ts` — All content data (194 lines)
- `src/styles.css` — Design tokens, oklch colors (234 lines)
- `src/routes/__root.tsx` — SEO, 404, error boundary (170 lines)

---

## What Works

Boot sequence (a11y, reduced-motion), VS Code shell, 7 panels, terminal with 14 commands + history, keyboard shortcuts (Ctrl+`, Ctrl+B, Esc), mobile overlay sidebar, SSR with 3-layer error recovery, SEO (JSON-LD, OpenGraph), accessibility (skip link, ARIA, focus-visible), dark theme with oklch tokens, print CSS for resume.

## What Is Fake

GitHub stats and charts: `Math.sin()` pseudorandom. LeetCode stats: hardcoded (152 total, 92 easy). LeetCode heatmap: seeded noise. Resume: no PDF, only print-to-PDF. Contact form: only works with Formspree env var, otherwise mailto. Email: `example.com` placeholder. Demo link: `team-portfolio.example.com` — dead.

## What Is Installed But Unused

TanStack Query, React Hook Form, Zod, Recharts, date-fns, Lucide React, ~35 shadcn/ui components.

---

## Next Priorities

1. **GitHub API integration** — Replace fake data with real repos/contributions/languages via server proxy
2. **Remove all fake data** — Dead links, Math.sin charts, placeholder email
3. **Contact form backend** — Real email delivery
4. **Resume PDF generator** — Programmatic PDF from data
5. **LeetCode API integration** — Real competitive programming stats

---

## Known Bugs

First-visit flash (1-2 frames, unavoidable SSR hydration issue). `og-image.svg` may be placeholder. 6 react-refresh warnings in shadcn/ui (harmless).

---

## Design Rules (Never Break)

1. VS Code metaphor IS the product
2. oklch color tokens only — never hardcode colors in components
3. `ayanos-data.ts` is the single source of truth for content
4. SSR: `booted` and `sidebarOpen` default `true` on server, flip in `useEffect`
5. Boot skip via `sessionStorage("ayanos-booted")` — returning visitors never see boot
6. `MotionConfig reducedMotion="user"` + CSS media query — both required
7. Terminal focus trap: Tab cycles, Escape closes
8. Print CSS: `.print-resume` class isolates resume
9. Error chain: `error-capture.ts` → `server.ts` → `start.ts` catches h3 swallowed throws
10. Unicode icons (增大, ⎇, ⌕), not Lucide — aesthetic choice

---

## Coding Standards

TypeScript strict. Prettier + ESLint. Functional components only. Tailwind CSS (no inline except dynamic). `cn()` for conditional classes. ARIA on all interactive elements. `focus-visible:ring-2 focus-visible:ring-accent` on buttons. `font-mono` for IDE aesthetic.

---

*Word count: ~490. Last updated: 2026-09-15.*
