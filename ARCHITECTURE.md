# ARCHITECTURE.md — AyanOS System Architecture

---

## 1. High-Level Architecture

AyanOS is a **server-side rendered React application** built on TanStack Start with a Nitro server runtime. The server handles SSR and error recovery; the client handles all interactivity. There is currently **no API layer** — all data is static.

```
┌──────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT TARGET                            │
│                    Cloudflare Workers (Nitro)                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                     NITRO SERVER                               │  │
│  │                                                                │  │
│  │  ┌──────────┐    ┌──────────────┐    ┌──────────────────────┐ │  │
│  │  │ server.ts │───>│  start.ts     │───>│ TanStack React Start │ │  │
│  │  │ (fetch)   │    │ (middleware)  │    │ Server Entry          │ │  │
│  │  └──────────┘    └──────────────┘    └──────────────────────┘ │  │
│  │       │                                                         │  │
│  │       │  ┌──────────────────────────────────────────────────┐  │  │
│  │       └─>│ Error Recovery Chain                             │  │  │
│  │          │ error-capture.ts → server.ts → start.ts          │  │  │
│  │          │ Catches h3-swallowed throws → renders 500 HTML   │  │  │
│  │          └──────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ SSR Output: Full HTML with embedded data                 │  │  │
│  │  │ - <head> with SEO meta, JSON-LD, fonts, styles           │  │  │
│  │  │ - <body> with rendered React component tree               │  │  │
│  │  │ - Inline script for hydration                             │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                    │                                  │
│                                    ▼                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                     CLIENT (Browser)                            │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ React 19 Hydration                                       │  │  │
│  │  │ - Read sessionStorage → set boot state                   │  │  │
│  │  │ - Attach event listeners (keyboard shortcuts)            │  │  │
│  │  │ - Mount Motion components (animations)                   │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ All interactivity is client-side:                        │  │  │
│  │  │ - Panel switching (useState)                             │  │  │
│  │  │ - Terminal commands (useState + switch statement)         │  │  │
│  │  │ - Sidebar toggle (useState)                              │  │  │
│  │  │ - Boot sequence (useState + useEffect + timers)          │  │  │
│  │  │ - Contact form (useState + fetch to Formspree)           │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. System Diagram — Data Flow

```
                         ┌──────────────┐
                         │  Static Data  │
                         │  ayanos-data  │
                         │    .ts        │
                         └──────┬───────┘
                                │
                    ┌───────────┼───────────────────┐
                    │           │                     │
                    ▼           ▼                     ▼
            ┌──────────┐ ┌──────────┐       ┌──────────────┐
            │  Panels   │ │ Terminal  │       │  Root Layout  │
            │ (7 comps) │ │ (14 cmds)│       │  (SEO/meta)   │
            └─────┬────┘ └────┬─────┘       └──────┬───────┘
                  │           │                      │
                  └─────┬─────┘                      │
                        │                            │
                  ┌─────▼────────────────────────────▼──┐
                  │           index.tsx                   │
                  │     (App Shell / State Root)          │
                  │                                      │
                  │  State:                              │
                  │  - booted (boolean)                  │
                  │  - openFiles (FileId[])              │
                  │  - active (FileId)                   │
                  │  - sidebarOpen (boolean)             │
                  │  - termOpen (boolean)                │
                  └──────────────┬──────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │       TanStack Router         │
                  │  (single route: "/")          │
                  │  + QueryClient (unused)        │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │     __root.tsx (Root Shell)   │
                  │  - <html lang="en">            │
                  │  - <HeadContent />             │
                  │  - JSON-LD structured data     │
                  │  - <Scripts />                 │
                  │  - Google Fonts (preconnect)   │
                  └──────────────────────────────┘
```

---

## 3. Folder Structure

```
ayanos-workspace-main/
│
├── public/                          # Static assets served at root
│   ├── favicon.svg                  # "AR" gradient icon (64x64 SVG)
│   └── og-image.svg                 # OpenGraph image (may be placeholder)
│
├── src/
│   ├── routes/                      # TanStack Start file-based routing
│   │   ├── __root.tsx               # Root layout: HTML shell, SEO, 404, error boundary
│   │   ├── index.tsx                # "/" route: THE entire AyanOS desktop (425 lines)
│   │   └── README.md                # TanStack routing conventions
│   │
│   ├── components/
│   │   ├── ayanos/                   # Custom application components
│   │   │   ├── BootSequence.tsx      # Boot overlay (77 lines)
│   │   │   ├── FilePanels.tsx        # 7 panel components (980 lines)
│   │   │   └── Terminal.tsx          # Interactive terminal (290 lines)
│   │   │
│   │   └── ui/                       # shadcn/ui components (~40 files, ~5 used)
│   │       ├── accordion.tsx         # Unused
│   │       ├── alert.tsx             # Unused
│   │       ├── ... (38 more)         # Mostly unused
│   │       └── tooltip.tsx           # Unused
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx           # Mobile breakpoint hook (768px)
│   │
│   ├── lib/
│   │   ├── ayanos-data.ts           # ALL portfolio content (194 lines)
│   │   ├── utils.ts                 # cn() = clsx + tailwind-merge
│   │   ├── error-capture.ts         # Global error capture for SSR recovery
│   │   ├── error-page.ts            # Static 500 HTML fallback
│   │   └── lovable-error-reporting.ts  # Lovable platform telemetry
│   │
│   ├── router.tsx                   # TanStack Router + QueryClient setup
│   ├── routeTree.gen.ts             # Auto-generated route tree (DO NOT EDIT)
│   ├── start.ts                     # TanStack Start bootstrap + error middleware
│   ├── server.ts                    # SSR error recovery (h3 swallowed throws)
│   └── styles.css                   # Design system: oklch tokens, utilities, print/motion CSS
│
├── dist/                            # Built output (committed to git — should not be)
│   ├── client/
│   └── server/
│
├── AI_CONTEXT.md                    # AI handoff document
├── ARCHITECTURE.md                  # This file
├── AUDIT_REPORT.md                  # Previous audit (2026-08-11)
├── FINAL_REPORT.md                  # Previous improvement report
├── PROJECT_OVERVIEW.md              # High-level overview
├── FEATURES.md                      # Feature documentation
├── TECH_STACK.md                    # Technology choices
├── ROADMAP.md                       # Improvement priorities
├── TECHNICAL_DEBT.md                # Debt inventory
├── IMPLEMENTATION_GUIDE.md          # Step-by-step implementation plans
├── RECRUITER_VIEW.md                # Recruiter perspective
├── SIH_JURY_VIEW.md                 # Hackathon judge perspective
├── CLAUDE_MEMORY.md                 # Condensed AI context
│
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite + TanStack Start config
├── components.json                  # shadcn/ui configuration
├── eslint.config.js                 # ESLint flat config
├── .prettierrc / .prettierignore    # Formatting config
├── bunfig.toml                      # Bun configuration
├── bun.lock                         # Bun lockfile
├── .gitignore                       # Git ignore rules
├── AGENTS.md                        # Lovable git history warning
└── .lovable/project.json            # Lovable platform metadata
```

---

## 4. Component Hierarchy

```
<QueryClientProvider>                    # __root.tsx — unused QueryClient
  └── <MotionConfig>                    # index.tsx — reducedMotion="user"
      ├── <BootSequence />              # Conditionally rendered (first visit)
      ├── <header> (Title Bar)          # Fixed 36px height
      ├── <div> (Body)
      │   ├── <nav> (Activity Bar)      # 48px wide, desktop only
      │   ├── <aside> (Explorer)        # 240px wide, overlay on mobile
      │   │   ├── File tree
      │   │   └── Live Status widget
      │   └── <main> (Editor)
      │       ├── Tabs bar              # Dynamic, shows open files
      │       ├── Breadcrumb
      │       └── Content area          # AnimatePresence wrapper
      │           └── <PanelFor />      # Switches between 7 panels
      │               ├── AboutPanel
      │               ├── SkillsPanel
      │               ├── ProjectsPanel
      │               ├── LeetcodePanel
      │               ├── GithubPanel
      │               ├── ResumePanel
      │               └── ContactPanel
      ├── <footer> (Status Bar)         # Fixed 24px height
      ├── <button> (Terminal Toggle)    # Fixed position, bottom-right
      └── <Terminal />                  # Floating dialog, 420px height
```

---

## 5. State Management

All state is managed via `useState` in `src/routes/index.tsx`. There is no global state, no Context, no Redux, no Zustand. This is intentional and appropriate for a single-page portfolio.

| State Variable | Type | Default (SSR) | Default (Client First Visit) | Persisted? |
|---|---|---|---|---|
| `booted` | `boolean` | `true` | `false` (flipped in useEffect) | `sessionStorage("ayanos-booted")` |
| `openFiles` | `FileId[]` | `["about.md"]` | `["about.md"]` | No |
| `active` | `FileId` | `"about.md"` | `"about.md"` | No |
| `sidebarOpen` | `boolean` | `true` | `false` on mobile, `true` on desktop | No |
| `termOpen` | `boolean` | `false` | `false` | No |

**Terminal internal state** (in `Terminal.tsx`):

| State | Type | Purpose |
|---|---|---|
| `lines` | `Line[]` | Terminal output history |
| `input` | `string` | Current input value |
| `history` | `string[]` | Command history for arrow navigation |
| `histIdx` | `number` | Current position in command history |

**Contact form state** (in `FilePanels.tsx`):

| State | Type | Purpose |
|---|---|---|
| `form` | `{name, email, message}` | Form field values |
| `status` | `FormStatus` | `"idle" | "sending" | "sent" | "error"` |
| `error` | `string` | Error message |

**SSR Hydration Pattern:**
```
Server renders: booted=true, sidebarOpen=true (main content visible)
Client first visit: useEffect reads sessionStorage → booted=false → boot overlay shown
Client returning: sessionStorage has "1" → booted stays true → no boot overlay
```

---

## 6. SSR Architecture

```
Request
  │
  ▼
Nitro Worker
  │
  ├── error-capture.ts registers global error/unhandledrejection listeners
  │
  ├── server.ts: fetch() handler
  │   ├── Imports TanStack Start server entry (lazy, cached)
  │   ├── Calls handler.fetch(request, env, ctx)
  │   ├── normalizeCatastrophicSsrResponse():
  │   │   ├── If status < 500 → pass through
  │   │   ├── If not JSON → pass through
  │   │   ├── If body contains "unhandled":true + "message":"HTTPError"
  │   │   │   → h3 swallowed the error
  │   │   │   → log the captured error from error-capture.ts
  │   │   │   → return renderErrorPage() HTML
  │   │   └── Otherwise → pass through
  │   └── On exception → log + return renderErrorPage() HTML
  │
  └── start.ts: error middleware
      ├── Wraps all route handlers
      ├── If error has statusCode → re-throw (HTTP errors)
      ├── Otherwise → log + return renderErrorPage() HTML
```

**Why three layers?** h3 (the HTTP framework under Nitro) catches in-handler throws and converts them to `{"unhandled":true,"message":"HTTPError"}` JSON responses. Standard try/catch never fires. `error-capture.ts` registers global listeners to capture the original error before h3 swallows it. `server.ts` detects the swallowed response and replaces it with proper HTML. `start.ts` catches errors that h3 doesn't swallow.

---

## 7. Deployment Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐
│  Developer    │────>│  Git Push     │────>│  Lovable Platform     │
│  (bun run     │     │  (main branch)│     │  (syncs commits)     │
│   build)      │     └──────────────┘     └──────────────────────┘
└──────┬───────┘
       │
       │  bunx wrangler pages deploy dist
       ▼
┌──────────────────────────────────────────────────────┐
│              Cloudflare Workers / Pages               │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │ Static Assets │    │ Nitro Server (SSR)        │   │
│  │ /favicon.svg  │    │ - Entry: src/server.ts    │   │
│  │ /og-image.svg │    │ - Runtime: V8 isolates    │   │
│  │ /assets/*     │    │ - Edge: Global CDN        │   │
│  └──────────────┘    └──────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

**Build pipeline:**
1. `bun run build` → Vite bundles client + Nitro bundles server
2. Output: `dist/client/` (static) + `dist/server/` (SSR worker)
3. `bunx wrangler pages deploy dist` → Uploads to Cloudflare

**Environment variables (planned):**
- Server-side: `GITHUB_TOKEN` (not `VITE_` prefix — never exposed to client)
- Client-side: `VITE_CONTACT_ENDPOINT` (Formspree URL)

---

## 8. API Architecture

### Current State: No APIs

There are no API routes. All data is static in `ayanos-data.ts`. The only external call is the optional Formspree POST from the contact form.

### Planned API Architecture

```
Client (React)                     Nitro Server
     │                                   │
     │  GET /api/github                  │
     │  ────────────────────────────────>│──> GitHub REST API
     │  <────────────────────────────────│<── (with GITHUB_TOKEN)
     │  { repos, contributions,          │
     │    languages, recentActivity }    │
     │                                   │
     │  GET /api/leetcode                │
     │  ────────────────────────────────>│──> LeetCode API/scraping
     │  <────────────────────────────────│<──
     │  { total, easy, medium, hard,     │
     │    streak, heatmap }              │
     │                                   │
     │  POST /api/contact                │
     │  ────────────────────────────────>│──> Email service / Resend
     │  <────────────────────────────────│<──
     │  { success: true }                │
     │                                   │
     │  GET /api/blog/[slug]             │
     │  ────────────────────────────────>│──> Markdown files
     │  <────────────────────────────────│<──
     │  { title, content, date }         │
     │                                   │
     │  GET /api/analytics               │
     │  ────────────────────────────────>│──> KV store / counter
     │  <────────────────────────────────│<──
     │  { views, uniqueVisitors }        │
```

**Server route convention (TanStack Start + Nitro):**
- Server routes use `defineEventHandler` from h3
- Files go in a `server/` directory at project root
- Environment variables without `VITE_` prefix are server-only (not bundled into client)

**Caching strategy (planned):**
- GitHub data: Cache for 1 hour (contributions change slowly)
- LeetCode data: Cache for 6 hours (stats update infrequently)
- Blog posts: Cache indefinitely (immutable content)
- Analytics: No cache (real-time)

---

*Last updated: 2026-09-15*
