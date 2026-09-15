# AI_CONTEXT.md — AyanOS Permanent Handoff Document

> **Purpose:** Allow any AI agent to understand the entire AyanOS project instantly
> without re-auditing the codebase. Read this file first, always.

---

## Project Summary

**AyanOS** is a VS Code-inspired developer portfolio for Ayan Singha Roy, a B.Tech CSE (AI & ML) student from West Bengal, India. It presents a personal portfolio as a developer operating system — complete with title bar, activity bar, explorer sidebar, editor tabs, terminal, and status bar.

**Status:** Late Alpha / Early Beta  
**Created:** Scaffolded via Lovable platform, iteratively improved through two audit cycles (August 2026).  
**Repository:** `ayanos-workspace-main` on `main` branch.  
**Deployed:** Not yet deployed. Target: Cloudflare Workers via Nitro.

---

## Architecture in 30 Seconds

```
Client: React 19 + TanStack Start (SSR) + Vite 8 + Tailwind CSS 4 + Motion
Server: Nitro (Cloudflare Workers target)
Data:   Static (src/lib/ayanos-data.ts) — NO backend, NO database, NO API calls
State:  All local useState — no global state management
Deploy: bun run build → bunx wrangler pages deploy dist
```

**Single page app:** Only one route exists (`/`). All content is in 7 panel components rendered via tabs.

---

## Critical Facts for AI Agents

### What EXISTS and WORKS
- Boot sequence with reduced-motion bypass and skip button
- VS Code shell: title bar, activity bar, explorer sidebar, editor tabs, status bar
- 7 panels: About, Skills, Projects, LeetCode, GitHub, Resume, Contact
- Interactive terminal with 14 commands, command history, focus trap
- Keyboard shortcuts: Ctrl+` (terminal), Ctrl+B (sidebar), Esc (skip boot)
- Mobile responsive with overlay sidebar
- SSR with three-layer error recovery
- SEO: JSON-LD, OpenGraph, Twitter cards, canonical
- Accessibility: skip link, ARIA labels, focus-visible rings, reduced-motion
- Design system: oklch tokens, print CSS, custom scrollbar

### What is FAKE / BROKEN
- **GitHub data:** All stats (repos, contributions, languages, activity bars) are `Math.sin()` pseudorandom — NOT real
- **LeetCode data:** Hardcoded numbers (152 total, 92 easy, 55 medium, 5 hard, 32-day streak) — NOT verified
- **LeetCode heatmap:** `Math.sin()` seeded noise — NOT real activity
- **Resume:** No PDF file exists. Print-to-PDF on HTML is the only option
- **Contact form:** Only works if `VITE_CONTACT_ENDPOINT` env var points to Formspree. Otherwise opens `mailto:`. Email in data is `example.com` placeholder
- **Demo links:** `team-portfolio` demo links to `https://team-portfolio.example.com` — DEAD
- **Status bar:** Static decoration (`⎇ main`, `● 0 problems`) — not live

### What is INSTALLED but UNUSED
- TanStack Query (provider wired, zero queries)
- React Hook Form + Zod (installed, not imported by any component)
- Recharts (installed, not imported)
- date-fns (installed, not imported)
- Lucide React (installed, unicode icons used instead)
- ~35 shadcn/ui components (only ~5 used by the app)

---

## File Map (Essential Files Only)

| File | Purpose | Lines | Notes |
|---|---|---|---|
| `src/routes/index.tsx` | **THE app** — entire AyanOS desktop shell | ~425 | All state lives here |
| `src/components/ayanos/FilePanels.tsx` | **7 panel components** (About, Skills, Projects, LeetCode, GitHub, Resume, Contact) | ~980 | Too large — should be split |
| `src/components/ayanos/Terminal.tsx` | Interactive terminal with 14 commands | ~290 | Well-implemented |
| `src/components/ayanos/BootSequence.tsx` | Boot overlay animation | ~77 | Simple, clean |
| `src/lib/ayanos-data.ts` | **ALL content data** — profile, skills, projects, stats, socials | ~194 | Single source of truth for static data |
| `src/routes/__root.tsx` | Root layout, SEO, 404, error boundary | ~170 | Well-implemented |
| `src/styles.css` | Design tokens, utilities, print/motion CSS | ~234 | oklch-based dark theme |
| `src/router.tsx` | Router + QueryClient setup | ~17 | QueryClient unused |
| `src/server.ts` | SSR error recovery (h3 swallowed throws) | ~55 | Production-quality |
| `src/start.ts` | TanStack Start bootstrap + error middleware | ~23 | Clean |
| `src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) | ~6 | Standard |
| `src/lib/error-capture.ts` | Global error capture for SSR | ~28 | Clever pattern |
| `src/lib/error-page.ts` | Static 500 HTML page | ~31 | Fallback |
| `src/hooks/use-mobile.tsx` | Mobile breakpoint hook (768px) | ~20 | Standard |

---

## Design Decisions (DO NOT CHANGE WITHOUT CAREFUL CONSIDERATION)

1. **Single page, no routing:** The VS Code metaphor works as one page. Adding routes would break the desktop feel. Routes should only be added for blog/posts.

2. **Static data layer:** `ayanos-data.ts` is the single source of truth. All panels import from it. This is intentional — content changes never touch UI code.

3. **oklch color system:** All colors are oklch CSS variables in `styles.css`. Components NEVER hardcode colors. They reference `var(--color-accent)`, `var(--color-success)`, etc.

4. **Unicode icons, not Lucide:** The project uses custom unicode characters (увеличен, ⎇, ⌕, etc.) for the terminal/IDE aesthetic. Lucide React is installed but not imported. Do not replace unicode icons with Lucide — it breaks the aesthetic.

5. **Motion (Framer Motion successor):** All animations use `motion/react`, not `framer-motion`. The `MotionConfig reducedMotion="user"` at the root respects user preferences.

6. **TanStack Start with Nitro:** The server layer uses TanStack Start's Nitro integration. Server routes go in the project root's server directory. The `@lovable.dev/vite-tanstack-config` plugin handles all Vite plugins — do not add duplicate plugins.

7. **Bun as package manager:** `bun.lock` exists. Use `bun install`, not `npm install`. Use `bun run` for scripts.

8. **Lovable platform integration:** The project is connected to Lovable. `AGENTS.md` warns against rewriting published git history. The `lovable-error-reporting.ts` sends errors to Lovable's telemetry.

---

## Known Bugs

| Bug | Severity | Location | Notes |
|---|---|---|---|
| First-visit flash (boot overlay) | Low | `index.tsx` | Server renders main content, then client flips to boot overlay on first visit (1-2 frames). Unavoidable due to SSR hydration — sessionStorage can't be read server-side. |
| `og-image.svg` may not be proper OG image | Low | `__root.tsx` meta tags | Referenced in meta but may be a placeholder SVG |
| Placeholder email | Low | `ayanos-data.ts` | `ayan.singharoy@example.com` — needs real email |
| `SITE.url` placeholder | Low | `ayanos-data.ts` | `https://ayansingharoy.dev` — update after deployment |
| 6 react-refresh warnings | Low | shadcn/ui files | Pre-existing in generated components, harmless |

---

## Open Tasks (Priority Order)

### P0 — Critical (Do First)
1. Remove all fake data (Math.sin charts, hardcoded stats)
2. Replace with real GitHub API integration
3. Fix contact form (real backend or honest mailto)
4. Replace placeholder email/links with real ones
5. Create actual resume PDF or remove download button
6. Remove dead demo links (team-portfolio → example.com)

### P1 — Important (Do Next)
7. LeetCode API integration
8. Blog / technical articles system
9. Project architecture visualizations
10. CI/CD status display
11. Visitor analytics
12. Achievement timeline

### P2 — Nice to Have
13. Light/dark theme toggle
14. Interactive code playground
15. AI/ML experiment dashboard
16. Cybersecurity lab showcase
17. Multi-route support (for blog)
18. End-to-end test suite
19. Performance monitoring
20. RSS feed

---

## Coding Standards

- **TypeScript strict mode** is enabled
- **Prettier** for formatting (`bun run format`)
- **ESLint** with react-hooks + react-refresh + typescript-eslint
- **Functional components only** — no class components
- **Tailwind CSS** for all styling — no inline styles except dynamic values (colors, widths)
- **Motion** for all animations — no CSS keyframe animations (except `.blink` cursor)
- **Data in `ayanos-data.ts`** — never hardcode content in components
- **`cn()` utility** for conditional classes — always use it
- **`role` and `aria-*` attributes** on all interactive elements
- **`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`** pattern on buttons
- **`aria-hidden="true"`** on decorative elements
- **`font-mono`** for terminal/IDE aesthetic, `font-sans` for body text

---

## Environment Variables

| Variable | Prefix | Purpose | Required |
|---|---|---|---|
| `VITE_CONTACT_ENDPOINT` | `VITE_` (client) | Formspree endpoint URL | No (falls back to mailto) |
| `VITE_GITHUB_TOKEN` | `VITE_` (client) | GitHub personal access token | No (but needed for real GitHub data) |
| `GITHUB_TOKEN` | Server-only | GitHub API token (secure, not exposed to client) | Yes for GitHub API integration |

---

## Things Future AI Agents Must Never Break

1. **The VS Code metaphor** — title bar, activity bar, explorer, tabs, status bar. This IS the product.
2. **The oklch color system** — never hardcode colors in components. Always use CSS variables.
3. **The `ayanos-data.ts` contract** — this is the single source of truth for all content.
4. **SSR hydration** — `booted` and `sidebarOpen` default to `true` on the server to match SSR output. The `useEffect` flips them post-hydration. Do not change this pattern.
5. **The boot sequence skip** — `sessionStorage.getItem("ayanos-booted")` controls boot replay. Returning visitors must never see the boot overlay.
6. **Reduced motion support** — `MotionConfig reducedMotion="user"` + CSS `@media (prefers-reduced-motion: reduce)`. Both must remain.
7. **Terminal focus trap** — Tab cycles within the dialog. Escape closes it. This is accessibility-critical.
8. **Print CSS** — `.print-resume` class isolates the resume for printing. Do not remove or break this.
9. **The error recovery chain** — `error-capture.ts` → `server.ts` → `start.ts`. This catches h3-swallowed throws that would otherwise produce empty 500 responses.
10. **Bun package manager** — always use `bun install` and `bun run`, never `npm`.

---

## Deployment Checklist

```bash
# 1. Install dependencies
bun install

# 2. Set environment variables in .env
# VITE_CONTACT_ENDPOINT=https://formspree.io/f/YOUR_ID
# GITHUB_TOKEN=ghp_xxxxx  (for server-side API calls)

# 3. Build
bun run build

# 4. Preview locally
bun run preview  # → http://localhost:3000

# 5. Deploy to Cloudflare
bunx wrangler pages deploy dist --project-name ayanos

# 6. Update SITE.url in ayanos-data.ts to the real deployed URL
# 7. Rebuild and redeploy
```

---

*Last updated: 2026-09-15*  
*Document version: 1.0*  
*Audit source: Full codebase scan + AUDIT_REPORT.md + FINAL_REPORT.md*
