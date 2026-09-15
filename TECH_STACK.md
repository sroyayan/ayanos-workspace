# TECH_STACK.md — Technology Stack & Rationale

---

## Stack Overview

| Layer | Technology | Version | Role |
|---|---|---|---|
| **UI Library** | React | 19.2 | Component rendering |
| **Language** | TypeScript | 5.8 | Type safety |
| **Meta-framework** | TanStack Start | 1.167+ | SSR, routing, server entry |
| **Router** | TanStack Router | 1.168+ | File-based routing, type-safe navigation |
| **Build Tool** | Vite | 8.0 | Dev server + production bundler |
| **SSR Runtime** | Nitro | 3.0 beta | Server deployment (Cloudflare Workers) |
| **Styling** | Tailwind CSS | 4.2 | Utility-first CSS (CSS-first config) |
| **Animation** | Motion | 12.40 | Animations + transitions (Framer Motion successor) |
| **Package Manager** | Bun | 1.3 | Install + scripts |
| **Platform** | Lovable | — | AI app builder + hosting |
| **Deployment** | Cloudflare Workers | — | Edge deployment target |

---

## Frameworks

### TanStack Start (Primary Framework)

**Version:** 1.167+  
**Role:** SSR-first React meta-framework  
**Why chosen:**
- Provides full SSR out of the box with React 19
- File-based routing via TanStack Router (type-safe)
- Integrates with Nitro for server deployment
- Lovable platform supports it natively
- Modern alternative to Next.js with better type safety

**How it's used:**
- `src/routes/__root.tsx` — Root layout with SEO, error boundary
- `src/routes/index.tsx` — Single page route (`/`)
- `src/router.tsx` — Router configuration
- `src/start.ts` — Server bootstrap with error middleware
- `src/server.ts` — SSR error recovery layer

**Trade-offs:**
- Less mature than Next.js (smaller ecosystem)
- Fewer examples and tutorials available
- Nitro 3.0 is beta (potential instability)
- Lovable integration simplifies setup but adds vendor dependency

### React 19

**Version:** 19.2  
**Role:** UI rendering  
**Why chosen:**
- Latest React with Server Components support (via TanStack Start)
- Better hydration with `suppressHydrationWarning`
- Improved error handling

**How it's used:**
- Functional components throughout
- Hooks: useState, useEffect, useCallback, useMemo, useRef
- No Server Components used (all client-side rendering)

### TanStack Router

**Version:** 1.168+  
**Role:** Client-side routing  
**Why chosen:**
- Type-safe route parameters
- File-based routing (auto-generated route tree)
- Scroll restoration support
- Preloading support

**How it's used:**
- Single route: `/` → `index.tsx`
- Route tree auto-generated in `routeTree.gen.ts`
- `createFileRoute` for page routes
- `createRootRouteWithContext` for root layout

---

## Build Tools

### Vite 8

**Role:** Dev server + production bundler  
**Why chosen:**
- Fast HMR (Hot Module Replacement)
- Native ES module support
- Plugin ecosystem
- Used by TanStack Start and Lovable

**Configuration:**
- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`
- This plugin provides: tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, componentTagger (dev)
- **DO NOT** add duplicate plugins — the Lovable config handles everything

### Nitro 3.0 (Beta)

**Role:** SSR runtime for Cloudflare Workers  
**Why chosen:**
- Works with TanStack Start
- Deploy to Cloudflare Workers, Vercel, or Node.js
- Automatic code splitting for server routes
- Built-in error handling

**How it's used:**
- Default target: Cloudflare Workers
- Server entry: `src/server.ts`
- Error middleware: `src/start.ts`

---

## Styling

### Tailwind CSS 4

**Version:** 4.2  
**Role:** Utility-first CSS  
**Why chosen:**
- CSS-first configuration (no `tailwind.config.js`)
- `@theme` directive for design tokens
- Works with oklch color system
- `tw-animate-css` for animation utilities

**Configuration:**
- `src/styles.css` contains all design tokens
- `components.json` configures shadcn/ui integration
- Path aliases: `@/components`, `@/lib`, `@/hooks`

**Custom Design System:**
- All colors: oklch CSS variables (never hardcoded in components)
- Fonts: Inter (sans) + JetBrains Mono (mono)
- Radius system: `--radius` with sm/md/lg/xl variants
- Custom utilities: `.glass`, `.vs-scroll`, `.blink`, `.sr-only`

---

## Animation

### Motion (Framer Motion Successor)

**Version:** 12.40  
**Role:** Animations and transitions  
**Why chosen:**
- Successor to Framer Motion (same API, better performance)
- `AnimatePresence` for mount/unmount transitions
- `MotionConfig` for global animation settings
- `whileHover` for interactive effects

**How it's used:**
- Boot sequence: staggered line appearance
- Panel transitions: fade + slide on tab switch
- Skill bars: animated width on mount
- Project cards: hover lift effect
- Terminal: slide-up dialog animation
- `MotionConfig reducedMotion="user"` at root (accessibility)

---

## Component Library

### shadcn/ui (Radix Primitives)

**Role:** Reusable UI components  
**Why chosen:**
- Built on Radix UI (accessible primitives)
- Customizable via Tailwind CSS
- No runtime dependency (copy-paste components)
- Standard in modern React projects

**Usage:** ~40 components installed, ~5 actually used:
- Used: Button, Badge, Card (via custom implementations)
- Unused: Accordion, Alert, AlertDialog, Avatar, Calendar, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip

---

## Data Fetching

### TanStack Query

**Version:** 5.83  
**Role:** Server state management  
**Why chosen:**
- Caching, background refetching, optimistic updates
- Standard for React data fetching
- Integrated with TanStack Start

**Current usage:** Provider is wired in `__root.tsx` and `router.tsx`, but **zero queries are defined**. This is infrastructure ready for GitHub/LeetCode API integration.

---

## Forms

### React Hook Form + Zod

**Role:** Form validation  
**Why chosen:**
- Performant (uncontrolled components)
- Zod for schema validation
- Standard in React ecosystem

**Current usage:** Installed but **not used**. The contact form uses raw `useState` + HTML validation. This should be migrated to React Hook Form + Zod.

---

## Icons

### Lucide React

**Version:** 0.575  
**Role:** Icon library  
**Why chosen:**
- Standard React icon library
- Tree-shakeable
- Comprehensive icon set

**Current usage:** Installed but **not imported**. The project uses custom unicode characters for the terminal/IDE aesthetic:
- `увеличен` (files), `⨯` (search), `⎇` (git), `▦` (extensions)
- `M`, `{}`, `▸`, `≡`, `★`, `▤`, `@` (file icons)
- `>`, `+`, `✓`, `▾` (terminal/UI elements)

**Decision:** Unicode icons are an intentional aesthetic choice. Do not replace with Lucile icons.

---

## Package Manager

### Bun

**Version:** 1.3  
**Role:** Package management + script runner  
**Why chosen:**
- Faster than npm/yarn
- Native TypeScript support
- Built-in test runner (not used yet)
- Lovable platform uses Bun

**Commands:**
- `bun install` — Install dependencies
- `bun run dev` — Start dev server
- `bun run build` — Production build
- `bun run preview` — Preview production build
- `bun run lint` — Run ESLint
- `bun run format` — Run Prettier

**Lockfile:** `bun.lock` (committed to git)

---

## Development Workflow

### Linting

**Tool:** ESLint 9 with flat config  
**Plugins:** react-hooks, react-refresh, typescript-eslint, prettier  
**Config:** `eslint.config.js`  
**Run:** `bun run lint`

### Formatting

**Tool:** Prettier 3.7  
**Config:** `.prettierrc` (not shown, uses defaults)  
**Ignore:** `.prettierignore`  
**Run:** `bun run format`

### Type Checking

**Tool:** TypeScript 5.8  
**Config:** `tsconfig.json`  
**Strict mode:** Enabled  
**Run:** `bunx tsc --noEmit`

---

## Deployment

### Target: Cloudflare Workers

**Tool:** Wrangler CLI  
**Deploy command:** `bunx wrangler pages deploy dist --project-name ayanos`  
**Environment:**
- `GITHUB_TOKEN` — Server-side GitHub API token (NOT `VITE_` prefix)
- `VITE_CONTACT_ENDPOINT` — Formspree URL (client-side)

### Build Pipeline

```bash
bun install          # Install dependencies
bun run build        # Vite + Nitro build
# Output: dist/client/ (static) + dist/server/ (SSR worker)
bunx wrangler pages deploy dist  # Deploy to Cloudflare
```

---

## Technology Decision Log

| Decision | Chosen | Alternatives Considered | Reason |
|---|---|---|---|
| SSR framework | TanStack Start | Next.js, Remix, Astro | Lovable support, type-safe routing, modern |
| CSS framework | Tailwind CSS 4 | CSS Modules, styled-components, vanilla CSS | Utility-first, design token support, shadcn/ui compatibility |
| Animation | Motion | React Spring, CSS animations | Framer Motion successor, AnimatePresence, reduced-motion support |
| Package manager | Bun | npm, yarn, pnpm | Speed, Lovable platform requirement |
| Component library | shadcn/ui | Ant Design, Material UI, Chakra UI | Customizable, Tailwind-native, accessible (Radix) |
| Data fetching | TanStack Query | SWR, React Query v4 | Latest version, TanStack ecosystem |
| Build tool | Vite 8 | Webpack, Turbopack | Speed, ESM-native, TanStack Start integration |
| Deployment | Cloudflare Workers | Vercel, Netlify, AWS | Edge deployment, free tier, Nitro support |

---

*Last updated: 2026-09-15*
