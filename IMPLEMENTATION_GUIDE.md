# IMPLEMENTATION_GUIDE.md — Step-by-Step Implementation Plans

> **Purpose:** For every planned feature in the ROADMAP, this document provides: why it matters, the concrete files to create or modify, the architecture approach, risks, and how to verify it works. This is the reference an AI agent or developer follows when implementing a feature.

---

## How to Use This Document

1. Pick a feature from the ROADMAP (start with P0).
2. Read the corresponding section below.
3. Follow the file-by-file implementation plan.
4. Verify using the testing checklist at the end of each section.
5. Check the "Depends On" field — if it says "Server API Layer," implement that first.

---

## Feature 0: Remove All Fake Data

**Why:** The single highest-ROI change. Every fake data point is an active credibility liability. Removing them costs 30 minutes and immediately improves trustworthiness.

**Depends On:** Nothing.

### Files to Modify

| File | Change |
|---|---|
| `src/lib/ayanos-data.ts` | Remove or replace `GITHUB_STATS` values with placeholder text. Remove fake email. Set `CONTACT.email` to `TODO`. Set `SITE.url` to `TODO`. |
| `src/components/ayanos/FilePanels.tsx` | In `GithubPanel`: remove the `Math.sin()` chart and heatmap. Replace with "Data loading..." placeholder text. In `LeetcodePanel`: remove the `Math.sin()` heatmap. Replace with "Activity data unavailable" text. |
| `src/components/ayanos/FilePanels.tsx` | In `ResumePanel`: change the download button's `onClick` to show an alert "PDF generation coming soon" or remove the button entirely. |
| `src/components/ayanos/FilePanels.tsx` | In `ContactPanel`: if `ayanos-data.ts` email is `TODO`, disable the mailto fallback and show "Contact form not configured" state. |

### Implementation Steps

1. Open `ayanos-data.ts`. Replace every fake value with either:
   - `TODO` string (for things like email, URL)
   - Honest placeholder (for stats: `"Stats loading — API integration pending"`)
2. Open `FilePanels.tsx`. Find the `Math.sin()` chart in `GithubPanel` (search for `Math.sin`). Delete the entire chart JSX and replace with a placeholder `<div>`.
3. Find the `Math.sin()` heatmap in `LeetcodePanel`. Delete and replace with placeholder.
4. Find the resume download button. Change `onClick` to a no-op with user feedback.
5. Run `bun run lint -- --fix` and `bunx tsc --noEmit` to verify nothing broke.
6. Run `bun run build` to verify the build succeeds.

### Verification

- [ ] No `Math.sin()` calls remain in any component file
- [ ] No hardcoded stats claim to be "live" or "real"
- [ ] `grep -r "example.com" src/` returns only TODO markers
- [ ] `grep -r "Math.sin" src/` returns nothing
- [ ] All panels render without errors
- [ ] Build succeeds

---

## Feature 1: Server API Layer (Foundation)

**Why:** Every real-data feature (GitHub, LeetCode, Contact, Blog, Analytics) needs server routes. This is the prerequisite for all P0 and P1 data features.

**Depends On:** Nothing.

### Architecture

TanStack Start with Nitro supports server routes via the `server/` directory at project root. Each file becomes an API endpoint using `defineEventHandler` from h3.

```
server/
  ├─ routes/
  │   ├─ api/
  │   │   ├─ github.ts       GET /api/github
  │   │   ├─ github repos.ts GET /api/github/repos
  │   │   ├─ leetcode.ts     GET /api/leetcode
  │   │   ├─ contact.ts      POST /api/contact
  │   │   └─ analytics.ts    GET /api/analytics, POST /api/analytics
  │   └─ blog/
  │       ├─ index.ts        GET /api/blog
  │       └─ [slug].ts       GET /api/blog/:slug
  └─ utils/
      ├─ cache.ts            Simple in-memory TTL cache
      └─ github.ts           GitHub API helper functions
```

### Files to Create

| File | Purpose |
|---|---|
| `server/utils/cache.ts` | Simple TTL cache: `getCached(key, ttlMs, fetcher)` — in-memory Map with expiration |
| `server/utils/github.ts` | GitHub REST API helper: `fetchGithubUser()`, `fetchGithubRepos()`, `fetchGithubEvents()` |
| `server/routes/api/github.ts` | `GET /api/github` — returns profile, stats, recent activity (1-hour cache) |
| `server/routes/api/contact.ts` | `POST /api/contact` — validates, sends email via Resend, rate-limits |

### Implementation Steps

1. Create `server/utils/cache.ts`:
   ```typescript
   const cache = new Map<string, { data: unknown; expiresAt: number }>();

   export async function getCached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
     const now = Date.now();
     const cached = cache.get(key);
     if (cached && cached.expiresAt > now) return cached.data as T;
     const data = await fetcher();
     cache.set(key, { data, expiresAt: now + ttlMs });
     return data;
   }
   ```

2. Create `server/utils/github.ts`:
   ```typescript
   const GITHUB_API = "https://api.github.com";

   export async function fetchGithubUser(token: string) {
     const res = await fetch(`${GITHUB_API}/users/ayan-singha-roy`, {
       headers: { Authorization: `Bearer ${token}`, "User-Agent": "AyanOS" },
     });
     if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
     return res.json();
   }

   export async function fetchGithubRepos(token: string) {
     const res = await fetch(`${GITHUB_API}/users/ayan-singha-roy/repos?sort=updated&per_page=10`, {
       headers: { Authorization: `Bearer ${token}`, "User-Agent": "AyanOS" },
     });
     if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
     return res.json();
   }

   export async function fetchGithubEvents(token: string) {
     const res = await fetch(`${GITHUB_API}/users/ayan-singha-roy/events/public?per_page=30`, {
       headers: { Authorization: `Bearer ${token}`, "User-Agent": "AyanOS" },
     });
     if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
     return res.json();
   }
   ```

3. Create `server/routes/api/github.ts`:
   ```typescript
   import { defineEventHandler, getQuery } from "h3";
   import { getCached } from "../../utils/github";
   import { fetchGithubUser, fetchGithubRepos, fetchGithubEvents } from "../../utils/github";

   export default defineEventHandler(async (event) => {
     const token = process.env.GITHUB_TOKEN;
     if (!token) {
       return { error: "GitHub token not configured", fallback: true };
     }

     return getCached("github-main", 3600000, async () => {
       const [user, repos, events] = await Promise.all([
         fetchGithubUser(token),
         fetchGithubRepos(token),
         fetchGithubEvents(token),
       ]);

       return {
         profile: {
           login: user.login,
           name: user.name,
           bio: user.bio,
           publicRepos: user.public_repos,
           followers: user.followers,
           following: user.following,
         },
         repos: repos.map((r: any) => ({
           name: r.name,
           description: r.description,
           language: r.language,
           stars: r.stargazers_count,
           url: r.html_url,
         })),
         recentActivity: events.slice(0, 10).map((e: any) => ({
           type: e.type,
           repo: e.repo?.name,
           date: e.created_at,
         })),
       };
     });
   });
   ```

4. Create `server/routes/api/contact.ts` (ROADMAP item #3, combined here):
   ```typescript
   import { defineEventHandler, readBody } from "h3";

   export default defineEventHandler(async (event) => {
     const body = await readBody(event);

     // Validate
     if (!body.name || !body.email || !body.message) {
       throw createError({ statusCode: 400, statusMessage: "Missing required fields" });
     }

     // Rate limiting (simple in-memory)
     // TODO: Use Cloudflare KV or similar in production

     // Send via Resend
     const apiKey = process.env.RESEND_API_KEY;
     if (!apiKey) {
       throw createError({ statusCode: 503, statusMessage: "Email service not configured" });
     }

     const res = await fetch("https://api.resend.com/emails", {
       method: "POST",
       headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
       body: JSON.stringify({
         from: "AyanOS <noreply@ayansingharoy.dev>",
         to: "ayansingharoy@gmail.com",
         replyTo: body.email,
         subject: `AyanOS Contact: ${body.name}`,
         text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
       }),
     });

     if (!res.ok) {
       throw createError({ statusCode: 502, statusMessage: "Failed to send email" });
     }

     return { success: true };
   });
   ```

### Risks

| Risk | Mitigation |
|---|---|
| `GITHUB_TOKEN` exposed to client | Never use `VITE_` prefix. Server-only env vars are not bundled into client code by Nitro. |
| Rate limiting by GitHub API | Cache responses for 1 hour. GitHub REST allows 5000 requests/hour with token — well within budget. |
| Nitro 3.0 beta breaking changes | Pin nitro version in `package.json`. Test with `bun run build` after any Nitro update. |
| Cloudflare Workers env vars | Use `wrangler.toml` or Cloudflare dashboard to set `GITHUB_TOKEN` and `RESEND_API_KEY`. |

### Verification

- [ ] `bun run build` succeeds with server routes
- [ ] `GET /api/github` returns profile data (with token set) or fallback error (without token)
- [ ] `POST /api/contact` validates input and returns proper error codes
- [ ] Cache works: second request within 1 hour returns cached data
- [ ] No `GITHUB_TOKEN` appears in client-side bundle (check `dist/client/` for the string)

---

## Feature 2: GitHub API Integration (Client Side)

**Why:** Replaces fake data with verifiable, real-time GitHub activity. The single highest-impact user-facing feature.

**Depends On:** Feature 1 (Server API Layer).

### Files to Modify

| File | Change |
|---|---|
| `src/components/ayanos/FilePanels.tsx` | Rewrite `GithubPanel` to fetch from `/api/github` using TanStack Query |
| `src/lib/ayanos-data.ts` | Remove `GITHUB_STATS` entirely (replaced by API data) |

### Files to Create

| File | Purpose |
|---|---|
| `src/lib/api-client.ts` | Shared fetch wrapper with error handling and type safety |

### Implementation Steps

1. Create `src/lib/api-client.ts`:
   ```typescript
   export async function apiFetch<T>(path: string): Promise<T> {
     const res = await fetch(path);
     if (!res.ok) throw new Error(`API error: ${res.status}`);
     return res.json();
   }
   ```

2. In `GithubPanel`, replace static data rendering with TanStack Query:
   ```typescript
   import { useQuery } from "@tanstack/react-query";
   import { apiFetch } from "@/lib/api-client";

   type GithubData = {
     profile: { login: string; name: string; bio: string; publicRepos: number; followers: number };
     repos: { name: string; description: string; language: string; stars: number; url: string }[];
     recentActivity: { type: string; repo: string; date: string }[];
   };

   // Inside the component:
   const { data, isLoading, error } = useQuery({
     queryKey: ["github"],
     queryFn: () => apiFetch<GithubData>("/api/github"),
     staleTime: 3600000, // 1 hour
     retry: 1,
   });
   ```

3. Render three sections:
   - **Profile card:** avatar, name, bio, repo count, followers
   - **Top repos:** list with language badges, star counts, links
   - **Recent activity:** timeline of last 10 events (commits, PRs, issues)

4. Add loading skeleton and error fallback states.

5. Remove `GITHUB_STATS` from `ayanos-data.ts`.

### Verification

- [ ] GitHub panel shows real data from the API
- [ ] Loading state appears while data is being fetched
- [ ] Error state appears if API is down or token is missing
- [ ] Data refreshes after staleTime (1 hour)
- [ ] `console.log` in network tab shows `/api/github` request
- [ ] No fake data remains in the GitHub panel

---

## Feature 3: Resume PDF Generation

**Why:** Every recruiter expects a downloadable PDF. The current download button does nothing.

**Depends On:** Nothing (can be implemented independently).

### Files to Modify

| File | Change |
|---|---|
| `src/components/ayanos/FilePanels.tsx` | In `ResumePanel`: add working download button that triggers PDF generation |
| `src/lib/ayanos-data.ts` | Add `RESUME_DATA` structured data for PDF rendering |

### Architecture Options

| Approach | Pros | Cons |
|---|---|---|
| **Client-side `@react-pdf/renderer`** | No server needed, stays in React ecosystem | Large bundle size (~200KB), complex layout |
| **Server-side Puppeteer** | Pixel-perfect HTML→PDF | Heavy dependency, not supported on Cloudflare Workers |
| **Static PDF file** | Simplest, fastest | Can't be dynamically generated from data |
| **Client-side `jsPDF`** | Small bundle, programmatic | Very low-level, painful to style |

**Recommended:** Static PDF file for now. Generate a well-designed PDF externally (Google Docs, Figma, Overleaf) and serve it as a static file from `public/`. Replace with dynamic generation later if needed.

### Implementation Steps (Static PDF approach)

1. Create the resume PDF externally using a template.
2. Save as `public/Ayan_Singha_Roy_Resume.pdf`.
3. In `ResumePanel`, change the download button:
   ```typescript
   <a href="/Ayan_Singha_Roy_Resume.pdf" download="Ayan_Singha_Roy_Resume.pdf">
     <Button>Download PDF</Button>
   </a>
   ```
4. Add a "View" button that opens the PDF in a new tab:
   ```typescript
   <a href="/Ayan_Singha_Roy_Resume.pdf" target="_blank" rel="noopener noreferrer">
     <Button variant="outline">View PDF</Button>
   </a>
   ```

### Verification

- [ ] Clicking "Download PDF" downloads `Ayan_Singha_Roy_Resume.pdf`
- [ ] The PDF opens correctly in browser
- [ ] The PDF contains real, up-to-date information
- [ ] File size is reasonable (< 500KB)

---

## Feature 4: Contact Form Backend

**Why:** The only conversion path for recruiters. Currently shows a fake "sent" message unless Formspree is configured.

**Depends On:** Feature 1 (Server API Layer) — already included in the server routes above.

### Files to Modify

| File | Change |
|---|---|
| `src/components/ayanos/FilePanels.tsx` | Rewrite `ContactPanel` to POST to `/api/contact` |
| `src/lib/ayanos-data.ts` | Replace placeholder email with real email |
| `package.json` | Add `react-hook-form` and `zod` to imports (already installed, now use them) |

### Implementation Steps

1. Create a form schema:
   ```typescript
   import { z } from "zod";

   export const contactSchema = z.object({
     name: z.string().min(2, "Name must be at least 2 characters"),
     email: z.string().email("Please enter a valid email address"),
     message: z.string().min(10, "Message must be at least 10 characters"),
   });

   export type ContactFormData = z.infer<typeof contactSchema>;
   ```

2. Rewrite `ContactPanel` using React Hook Form + Zod:
   ```typescript
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { contactSchema, type ContactFormData } from "@/lib/ayanos-data";
   ```

3. Form submission:
   ```typescript
   const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
     resolver: zodResolver(contactSchema),
   });

   const onSubmit = async (data: ContactFormData) => {
     try {
       const res = await fetch("/api/contact", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
       });
       if (!res.ok) throw new Error("Failed to send");
       reset();
       // Show success toast
     } catch (err) {
       // Show error message
     }
   };
   ```

4. Replace placeholder email in `ayanos-data.ts` with real email.

### Verification

- [ ] Form validates input (shows errors for invalid email, short messages)
- [ ] Submitting shows "Sending..." state
- [ ] Successful submission shows "Message sent!" and clears form
- [ ] Failed submission shows "Failed to send message. Please try again."
- [ ] Email arrives at the configured address
- [ ] Rate limiting prevents spam (test: submit 5 times rapidly)

---

## Feature 5: LeetCode API Integration

**Why:** Verifiable competitive programming skill. Currently hardcoded and possibly inaccurate.

**Depends On:** Feature 1 (Server API Layer).

### Architecture

LeetCode has no official public API. Options:

| Approach | Reliability | Effort | Recommendation |
|---|---|---|---|
| Third-party API (leetcode-api.vercel.app) | Medium — can go down | Low | **Start here** |
| GraphQL scraping (undocumented endpoint) | Medium — can break | Medium | Fallback |
| Self-hosted scraper + scheduled update | High | High | Production option |

### Files to Create

| File | Purpose |
|---|---|
| `server/routes/api/leetcode.ts` | `GET /api/leetcode` — fetches from third-party API, caches for 6 hours |

### Files to Modify

| File | Change |
|---|---|
| `src/components/ayanos/FilePanels.tsx` | Rewrite `LeetcodePanel` to fetch from `/api/leetcode` via TanStack Query |
| `src/lib/ayanos-data.ts` | Remove `LEETCODE` data |

### Implementation Steps

1. Create server route:
   ```typescript
   import { defineEventHandler } from "h3";
   import { getCached } from "../../utils/cache";

   export default defineEventHandler(async () => {
     return getCached("leetcode-main", 21600000, async () => {
       const username = "ayan_singha_roy"; // real LeetCode username
       const res = await fetch(`https://leetcode-api.vercel.app/${username}`);
       if (!res.ok) return { error: "LeetCode data unavailable", fallback: true };
       return res.json();
     });
   });
   ```

2. Rewrite `LeetcodePanel`:
   - Use `useQuery` with `/api/leetcode`
   - Show loading skeleton while fetching
   - Show error state if API is down
   - Render: total solved (easy/medium/hard), streak, recent submissions

3. Remove fake heatmap. Either:
   - Build a real heatmap from submission data (if the API provides timestamps)
   - Show a simpler bar chart of problems solved per difficulty
   - Skip the heatmap entirely

### Verification

- [ ] LeetCode panel shows real data from the API
- [ ] Data matches the public LeetCode profile
- [ ] Loading/error states work
- [ ] Cache works (second request within 6 hours is instant)

---

## Feature 6: Blog System

**Why:** Technical writing demonstrates communication skill and differentiates from "just code" portfolios.

**Depends On:** Feature 1 (Server API Layer) for server routes; TanStart Start multi-route support.

### Architecture

```
content/blog/
  ├─ building-ayanos.mdx
  ├─ ssr-error-recovery.mdx
  └─ ...

server/routes/api/blog/
  ├─ index.ts              GET /api/blog — list all posts
  └─ [slug].ts             GET /api/blog/:slug — single post

src/routes/blog/
  ├─ index.tsx             /blog — blog listing page
  └─ $slug.tsx             /blog/:slug — single post page
```

### Files to Create

| File | Purpose |
|---|---|
| `content/blog/building-ayanos.mdx` | First blog post (example) |
| `server/routes/api/blog/index.ts` | List all blog posts |
| `server/routes/api/blog/[slug].ts` | Get single post by slug |
| `src/routes/blog/index.tsx` | Blog listing page |
| `src/routes/blog/$slug.tsx` | Blog post page |

### Implementation Steps

1. Install MDX support:
   ```bash
   bun add @mdx-js/mdx @mdx-js/react
   ```

2. Create the blog post structure with frontmatter:
   ```markdown
   ---
   title: "Building AyanOS: A VS Code-Inspired Portfolio"
   date: "2026-09-15"
   tags: ["portfolio", "react", "ssr"]
   description: "How and why I built a developer portfolio that looks like VS Code."
   ---
   
   ## Why a Portfolio Shouldn't Look Like a Portfolio
   
   Most developer portfolios follow the same template...
   ```

3. Create server routes that read `.mdx` files from `content/blog/`.

4. Create TanStack Start page routes for `/blog` and `/blog/:slug`.

5. Add a terminal command: `blog` → lists posts, `open blog.md` → navigates to `/blog`.

### Verification

- [ ] `/blog` shows a list of posts with title, date, description
- [ ] `/blog/building-ayanos` renders the full post with markdown formatting
- [ ] Code blocks have syntax highlighting
- [ ] Reading time estimate is shown
- [ ] Terminal command `blog` shows post list

---

## Feature 7: Cleanup — Remove Unused Dependencies

**Why:** 37 unused packages and 35 unused shadcn/ui files add confusion and slow installs.

**Depends On:** Nothing (can be done any time).

### Implementation Steps

1. Delete unused shadcn/ui component files:
   ```bash
   cd src/components/ui
   rm accordion.tsx alert.tsx alert-dialog.tsx aspect-ratio.tsx avatar.tsx \
      calendar.tsx carousel.tsx chart.tsx checkbox.tsx collapsible.tsx \
      command.tsx context-menu.tsx dialog.tsx drawer.tsx dropdown-menu.tsx \
      hover-card.tsx input.tsx input-otp.tsx label.tsx menubar.tsx \
      navigation-menu.tsx pagination.tsx popover.tsx progress.tsx \
      radio-group.tsx resizable.tsx scroll-area.tsx select.tsx separator.tsx \
      sheet.tsx sidebar.tsx skeleton.tsx slider.tsx sonner.tsx switch.tsx \
      table.tsx tabs.tsx textarea.tsx toggle.tsx toggle-group.tsx tooltip.tsx
   ```

2. Remove unused npm dependencies:
   ```bash
   bun remove @hookform/resolvers @radix-ui/react-accordion \
     @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio \
     @radix-ui/react-avatar @radix-ui/react-checkbox \
     @radix-ui/react-collapsible @radix-ui/react-context-menu \
     @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
     @radix-ui/react-hover-card @radix-ui/react-label \
     @radix-ui/react-menubar @radix-ui/react-navigation-menu \
     @radix-ui/react-popover @radix-ui/react-progress \
     @radix-ui/react-radio-group @radix-ui/react-scroll-area \
     @radix-ui/react-select @radix-ui/react-separator \
     @radix-ui/react-slider @radix-ui/react-switch \
     @radix-ui/react-tabs @radix-ui/react-toggle \
     @radix-ui/react-toggle-group @radix-ui/react-tooltip \
     cmdk date-fns embla-carousel-react input-otp lucide-react \
     react-day-picker react-resizable-panels recharts sonner vaul
   ```

3. Verify:
   ```bash
   bun install
   bunx tsc --noEmit
   bun run lint -- --fix
   bun run build
   ```

4. Keep `react-hook-form`, `zod`, `@radix-ui/react-slot` (used by Button) — or remove `react-hook-form` and `zod` if not using them for the contact form.

### Verification

- [ ] `bun install` is faster
- [ ] `bunx tsc --noEmit` passes
- [ ] `bun run build` succeeds
- [ ] All panels render correctly
- [ ] No import errors in console

---

## Verification Checklist (All Features)

After implementing any combination of features, run this full verification:

```bash
# Type check
bunx tsc --noEmit

# Lint
bun run lint -- --fix

# Build
bun run build

# Preview
bun run preview  # Open http://localhost:3000

# Manual checks:
# 1. Boot sequence plays on first visit
# 2. Boot sequence skipped on second visit
# 3. All 7 panels open correctly
# 4. Terminal opens (Ctrl+`) and all 14 commands work
# 5. Sidebar toggles (Ctrl+B)
# 6. Mobile view works (resize browser < 768px)
# 7. No console errors
# 8. API endpoints return data (if implemented)
# 9. Contact form submits (if implemented)
# 10. Resume PDF downloads (if implemented)
```

---

*Last updated: 2026-09-15*
