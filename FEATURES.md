# FEATURES.md — Complete Feature Documentation

---

## Feature Index

| # | Feature | Status | Last Verified |
|---|---|---|---|
| 1 | Boot Sequence | Working | 2026-09-15 |
| 2 | VS Code Shell | Working | 2026-09-15 |
| 3 | Explorer Sidebar | Working | 2026-09-15 |
| 4 | Editor Tabs | Working | 2026-09-15 |
| 5 | About Panel | Working | 2026-09-15 |
| 6 | Skills Panel | Working | 2026-09-15 |
| 7 | Projects Panel | Working | 2026-09-15 |
| 8 | LeetCode Panel | Partial (fake data) | 2026-09-15 |
| 9 | GitHub Panel | Partial (fake data) | 2026-09-15 |
| 10 | Resume Panel | Partial (no PDF) | 2026-09-15 |
| 11 | Contact Panel | Partial (needs Formspree) | 2026-09-15 |
| 12 | Terminal | Working | 2026-09-15 |
| 13 | Keyboard Shortcuts | Working | 2026-09-15 |
| 14 | Mobile Responsive | Working | 2026-09-15 |
| 15 | Accessibility | Working | 2026-09-15 |
| 16 | SSR Error Recovery | Working | 2026-09-15 |
| 17 | SEO / Meta Tags | Working | 2026-09-15 |
| 18 | Print CSS | Working | 2026-09-15 |

---

## 1. Boot Sequence

**Description:** On first visit, a full-screen overlay displays five animated boot lines ("Initializing AyanOS...", "Loading modules...", etc.) before revealing the main interface. Returning visitors skip it entirely via `sessionStorage`.

**Status:** Working

**Files:**
- `src/components/ayanos/BootSequence.tsx` (77 lines)
- `src/routes/index.tsx` (boot state management, lines 67-106)
- `src/styles.css` (reduced-motion media query)

**User Flow:**
1. First visit: Server renders `booted=true`, main content visible
2. Client `useEffect` reads `sessionStorage("ayanos-booted")` → not "1"
3. `setBooted(false)` → boot overlay appears (1-2 frame flash, unavoidable)
4. 5 lines appear with staggered delays (0ms, 500ms, 1000ms, 1500ms, 2100ms)
5. Auto-completes at 2700ms OR user clicks "Skip [esc]" OR presses Escape
6. `sessionStorage.setItem("ayanos-booted", "1")` → `setBooted(true)`
7. Returning visits: sessionStorage has "1" → `booted` stays `true` → no overlay

**Dependencies:** `motion/react` (AnimatePresence, motion.div)

**Known Issues:**
- First-visit flash: Server renders main content, client flips to boot overlay (1-2 frames)
- No visual variety: Same 5 lines every time

**Future Improvements:**
- Randomize boot messages
- Show actual system status (time, date)
- Optional: Check if GitHub/LeetCode APIs are configured and show connection status

---

## 2. VS Code Shell (App Shell)

**Description:** The main application frame: title bar with traffic lights, activity bar on the left, explorer sidebar, editor area with tabs, and status bar at the bottom.

**Status:** Working

**Files:**
- `src/routes/index.tsx` (entire file, 425 lines)
- `src/styles.css` (design tokens)

**User Flow:**
1. Title bar shows "AyanOS v1.0" with traffic light dots
2. Sidebar toggle button (☰) in title bar with `aria-expanded` and `aria-controls`
3. Activity bar shows 4 buttons (Explorer, Terminal shortcut, GitHub, Skills)
4. Sidebar shows file tree + live status widget
5. Editor area shows tabs + breadcrumb + content panel
6. Status bar shows static decoration (branch, problems, languages)

**Dependencies:** `motion/react`, `cn()` utility

**Known Issues:**
- Status bar is static decoration (not live)
- Activity bar search/extensions buttons do nothing
- `GitHub` and `Skills` activity buttons duplicate sidebar functionality

**Future Improvements:**
- Make status bar reflect actual state (open file, line count)
- Add more activity bar actions (search, extensions)
- Command palette (Ctrl+Shift+P)

---

## 3. Explorer Sidebar

**Description:** File tree showing 7 "files" representing portfolio sections. Includes a live status widget at the bottom.

**Status:** Working

**Files:**
- `src/routes/index.tsx` (lines 202-289)
- `src/lib/ayanos-data.ts` (FILE_ORDER, FILE_META, LIVE_STATUS)

**User Flow:**
1. Sidebar opens by default on desktop, closed on mobile
2. "AYAN-PORTFOLIO" tree header with collapse arrow (decorative)
3. 7 file items with colored icons
4. Click a file → opens in editor tab + makes it active
5. Active file gets `aria-current="page"` + highlighted background
6. Live status widget shows learning/goal/status with pulse indicator

**Dependencies:** `motion/react`, `useIsMobile()` hook

**Known Issues:**
- Collapse arrow (▾) is decorative — the tree cannot be collapsed
- Live status is hardcoded, not live

**Future Improvements:**
- Collapsible file tree sections
- Drag-to-reorder files
- File search (Ctrl+P fuzzy finder)

---

## 4. Editor Tabs

**Description:** Tab bar showing open files with close buttons. Active tab gets accent border. Breadcrumb shows current path.

**Status:** Working

**Files:**
- `src/routes/index.tsx` (lines 298-354)

**User Flow:**
1. Click a file in sidebar → opens as new tab (if not already open)
2. Click a tab → switches active panel
3. Click close button (✕) on tab → closes tab
4. Cannot close last tab — defaults back to `about.md`
5. Breadcrumb updates to show current file name

**Dependencies:** `motion/react` (AnimatePresence for panel transitions)

**Known Issues:**
- Tabs overflow to the right with no scroll hint on many open tabs
- No tab reordering
- No "close all" or "close others" option

**Future Improvements:**
- Horizontal scroll for overflow tabs
- Tab context menu (close, close others, close all)
- Middle-click to close tab

---

## 5. About Panel

**Description:** Profile overview with avatar (gradient + initials), name, role, tagline, current focus areas, location, social links, and call-to-action buttons.

**Status:** Working

**Files:**
- `src/components/ayanos/FilePanels.tsx` (AboutPanel, lines 29-116)
- `src/lib/ayanos-data.ts` (PROFILE, SOCIALS, CURRENT_FOCUS)

**User Flow:**
1. Shows gradient avatar with "AR" initials
2. Green "Open to opportunities" indicator with pulse
3. 4 social link buttons (GitHub, LinkedIn, Instagram, Email)
4. Name with accent "#" prefix (markdown heading style)
5. Current Focus list with "+" markers
6. Location
7. "Contact me" + "GitHub" action buttons

**Dependencies:** `motion/react`

**Known Issues:**
- Avatar is not a real photo — just gradient + initials
- Social links open in new tabs (except email)

**Future Improvements:**
- Real profile photo
- Animated typing effect for tagline
- Achievement badges / certifications

---

## 6. Skills Panel

**Description:** Dual-view skills display: a JSON tree view with syntax highlighting, and proficiency bar cards grouped by category.

**Status:** Working

**Files:**
- `src/components/ayanos/FilePanels.tsx` (SkillsPanel, JsonLine, SkillBar, lines 118-234)
- `src/lib/ayanos-data.ts` (SKILLS, SKILL_META, LEVEL_LABELS)

**User Flow:**
1. Shows "JSON" badge + "skills.json — 4 keys"
2. JSON tree with color-coded keys (purple), string values (green), numbers (yellow)
3. Below: "Proficiency" section with 4 category cards
4. Each card has icon, category name, and skill bars
5. Skill bars animate from 0 to skill level on mount
6. Level labels: Familiar, Working, Proficient, Advanced, Expert

**Dependencies:** `motion/react`

**Known Issues:**
- JSON tree and proficiency bars show the same data in different formats (redundant?)
- Skill levels are manually set, not calculated

**Future Improvements:**
- Toggle between JSON view and proficiency view
- Skill endorsements (from LinkedIn or peers)
- Skill usage timeline ("learned React in Jan 2026")

---

## 7. Projects Panel

**Description:** Project cards with drill-down detail view. Shows status badges, tech tags, and feature counts.

**Status:** Working

**Files:**
- `src/components/ayanos/FilePanels.tsx` (ProjectsPanel, ProjectCard, ProjectDetail, lines 236-436)
- `src/lib/ayanos-data.ts` (PROJECTS)

**User Flow:**
1. Grid of project cards (2 columns on desktop)
2. Each card shows: file path, status badge, name, description, tech tags, feature count
3. "More projects on GitHub" link at bottom
4. Click card → drill-down detail view with:
   - Back navigation
   - Status badge + GitHub + Demo links
   - Full description + tech stack + feature list
   - Gradient placeholder for project preview
5. Click "← projects/" → back to grid

**Dependencies:** `motion/react`

**Known Issues:**
- "Future AI Project" placeholder removed (good)
- `team-portfolio` demo link is `example.com` — DEAD
- Project preview area is gradient placeholder, not real screenshots
- Only 3 projects shown

**Future Improvements:**
- Real project screenshots / thumbnails
- Live demo links that work
- Project architecture diagrams
- More projects (target: 5-8)
- Category filtering (web, CLI, AI/ML)

---

## 8. LeetCode Panel

**Description:** LeetCode statistics display with difficulty breakdown, heatmap visualization, and badges.

**Status:** Partial — data is hardcoded, heatmap is fake

**Files:**
- `src/components/ayanos/FilePanels.tsx` (LeetcodePanel, Heatmap, Stat, lines 438-561)
- `src/lib/ayanos-data.ts` (LEETCODE)

**User Flow:**
1. Terminal-style display: "leetcode.log" header
2. Green text showing: Total (152+), Streak (32 days), Easy/Medium/Hard breakdown
3. Color-coded stat cards: Easy (green), Medium (yellow), Hard (red)
4. Heatmap: 7 rows × 26 weeks, green intensity varies
5. Badges: "50 Days Badge", "100 Solved", "Daily Challenge"

**Dependencies:** `motion/react`

**Known Issues:**
- ALL data is hardcoded — not fetched from LeetCode
- Heatmap is `Math.sin()` seeded noise — NOT real activity
- Presented as "Activity — last 26 weeks" — dishonest
- No link to actual LeetCode profile

**Future Improvements:**
- Real LeetCode API integration
- Real heatmap from actual submission data
- Link to LeetCode profile
- Problem-solving trend over time
- Most frequent problem types

---

## 9. GitHub Panel

**Description:** GitHub statistics with repository count, contributions, followers, language breakdown, commit activity, and achievements.

**Status:** Partial — all data is fake

**Files:**
- `src/components/ayanos/FilePanels.tsx` (GithubPanel, Stat, lines 563-643)
- `src/lib/ayanos-data.ts` (GITHUB_STATS, ACHIEVEMENTS)

**User Flow:**
1. Three stat cards: Repositories (24), Contributions (487), Followers (38)
2. Language breakdown with animated bars: Python (38%), JS (27%), TS (18%), C (10%), Other (7%)
3. Commit activity chart: 30 bars with `Math.sin()` heights
4. Achievement badges: 100+ LeetCode, Hackathon Participant, etc.
5. Footer: "stats updated manually — sync with the GitHub API for live numbers"

**Dependencies:** `motion/react`

**Known Issues:**
- ALL stats are hardcoded — not fetched from GitHub
- Language percentages are made up
- Commit activity is `Math.sin()` noise — NOT real commits
- Presented as if it's real data
- Achievements are generic ("Open Source Contributor") — not verified

**Future Improvements:**
- GitHub API integration (real repos, contributions, languages)
- Real commit activity from GitHub API
- Link to actual GitHub profile
- Recent repositories with descriptions
- Contribution streak

---

## 10. Resume Panel

**Description:** In-browser resume display with print-to-PDF functionality. Shows all portfolio data in a structured resume format.

**Status:** Partial — print works, but no actual PDF file

**Files:**
- `src/components/ayanos/FilePanels.tsx` (ResumePanel, ResumeRow, lines 645-783)
- `src/styles.css` (print CSS, lines 196-217)

**User Flow:**
1. "Print / Save as PDF" button at top
2. Tip: "use 'Save as PDF' in the print dialog"
3. Resume header: name, role, location, email, github, linkedin
4. Two-column layout:
   - Left: Profile, Skills (tags), Projects (list), Achievements
   - Right: Education, Currently (focus areas), Interests
5. Print button triggers `window.print()` with `.print-resume` isolation

**Dependencies:** None (pure CSS print styles)

**Known Issues:**
- No actual PDF file — user must use browser's "Save as PDF"
- Email is `example.com` placeholder
- No downloadable PDF file
- Print CSS works but is a workaround, not a solution

**Future Improvements:**
- Real PDF generation (jsPDF or server-side PDF)
- Downloadable resume file
- Multiple resume versions (general, AI/ML focused, web dev focused)
- Resume builder that generates from data

---

## 11. Contact Panel

**Description:** Contact form with name, email, and message fields. Supports Formspree backend or falls back to mailto.

**Status:** Partial — needs Formspree env var for real functionality

**Files:**
- `src/components/ayanos/FilePanels.tsx` (ContactPanel, Field, lines 785-978)
- `src/lib/ayanos-data.ts` (CONTACT_ENDPOINT, PROFILE.email)

**User Flow:**
1. Left side: "Have an opportunity, a question, or just want to say hi?"
2. Social links list (github, linkedin, instagram, email)
3. Right side: Form styled as terminal script ("~/send-message.sh")
4. Fields: name (required), email (required, validated), message (required)
5. Submit: "./send" button
6. If Formspree configured: POST to endpoint → success/error state
7. If not configured: Opens `mailto:` in user's email client
8. Success message: "message sent" or "opening your mail app..."
9. Error message: "Couldn't reach the server. Please email me directly instead."

**Dependencies:** Optional Formspree endpoint

**Known Issues:**
- Email in data is `example.com` placeholder
- Without Formspree, the "sent" message is misleading (mailto was opened, not a sent message)
- No client-side validation feedback (just HTML required + regex)
- zod and react-hook-form are installed but not used here

**Future Improvements:**
- Real backend email delivery (not Formspree)
- Client-side validation with react-hook-form + zod
- Loading spinner during submission
- Confirmation email to sender
- Rate limiting

---

## 12. Terminal

**Description:** Floating terminal dialog with 14 commands, command history, focus trap, and ARIA dialog semantics.

**Status:** Working

**Files:**
- `src/components/ayanos/Terminal.tsx` (290 lines)
- `src/routes/index.tsx` (terminal state, keyboard shortcut)

**Commands:**

| Command | Action |
|---|---|
| `help` | Show available commands |
| `about` | Show profile info + open about.md |
| `skills` | List skills with levels + open skills.json |
| `projects` | List projects with status + open projects/ |
| `resume` | Open resume.pdf |
| `leetcode` | Show LeetCode stats + open leetcode.log |
| `github` | Show GitHub stats + open github.stats |
| `contact` | Show contact info + open contact.md |
| `socials` | Show social links |
| `ls` | List explorer files |
| `whoami` | Show name, role, location |
| `status` | Show live status |
| `open <file>` | Open a specific file |
| `clear` | Clear terminal output |
| `exit` | Close terminal |

**User Flow:**
1. Click floating button (bottom-right) or press Ctrl+`
2. Terminal opens as modal dialog with focus trap
3. Type command → output appears with colored formatting
4. Arrow Up/Down navigates command history
5. `open <file>` integrates with the editor (opens the file in a tab)
6. Escape or `exit` closes terminal
7. Auto-focuses input on open

**Dependencies:** `motion/react`

**Known Issues:**
- No tab completion
- No command aliases
- No pipe support
- History is session-only (not persisted)

**Future Improvements:**
- Tab completion for commands and file names
- Command aliases (e.g., `ll` for `ls`)
- History persistence
- Color output for more commands
- Pseudo-filesystem browsing (cd, cat)

---

## 13. Keyboard Shortcuts

**Description:** Global keyboard shortcuts for power users.

**Status:** Working

**Files:**
- `src/routes/index.tsx` (lines 113-127)

**Shortcuts:**

| Shortcut | Action |
|---|---|
| Ctrl/⌘ + ` | Toggle terminal |
| Ctrl/⌘ + B | Toggle sidebar |
| Escape | Skip boot sequence (only during boot) |

**User Flow:**
1. Press shortcut → corresponding action triggers
2. Shortcuts work from anywhere in the app
3. Terminal has its own keyboard handling (history, focus trap)

**Dependencies:** None (native keyboard events)

**Known Issues:**
- No shortcut for switching between open tabs
- No command palette (Ctrl+Shift+P)
- No shortcut help overlay

**Future Improvements:**
- Ctrl+Shift+P command palette
- Ctrl+Tab to cycle tabs
- Ctrl+1-7 to switch to specific panels
- "?" shortcut to show all shortcuts

---

## 14. Mobile Experience

**Description:** Responsive layout with overlay sidebar, hidden activity bar, and simplified status bar.

**Status:** Working

**Files:**
- `src/routes/index.tsx` (mobile handling, lines 62-111, 206-229)
- `src/hooks/use-mobile.tsx` (breakpoint detection)

**User Flow:**
1. On mobile (<768px):
   - Activity bar hidden
   - Sidebar opens as fixed overlay with backdrop
   - Click backdrop or file → sidebar closes
   - Auto-closes on resize from desktop to mobile
2. Status bar simplifies (hides some elements)
3. Terminal remains responsive (`min(640px, calc(100vw - 2rem))`)

**Dependencies:** `useIsMobile()` hook, `motion/react`

**Known Issues:**
- Sidebar animation may lag on low-end devices
- No touch gestures (swipe to open/close sidebar)
- Heatmap may be hard to read on small screens

**Future Improvements:**
- Swipe gestures for sidebar
- Bottom navigation bar on mobile
- Touch-optimized terminal
- PWA manifest for installability

---

## 15. Accessibility

**Description:** ARIA labels, focus management, keyboard navigation, reduced-motion support, and screen reader compatibility.

**Status:** Working (with room for improvement)

**Files:**
- `src/routes/index.tsx` (skip link, ARIA attributes)
- `src/components/ayanos/Terminal.tsx` (dialog semantics, focus trap)
- `src/components/ayanos/BootSequence.tsx` (aria-live, reduced-motion)
- `src/styles.css` (focus-visible, reduced-motion media query)

**Accessibility Features:**
- Skip-to-content link (visible on keyboard focus)
- ARIA labels on all icon-only buttons
- `aria-expanded` / `aria-controls` on sidebar toggle
- `aria-current="page"` on active file
- Terminal: `role="dialog"`, `aria-modal="true"`, focus trap
- Boot: `role="status"`, `aria-live="polite"`
- Global `:focus-visible` ring (2px accent)
- `prefers-reduced-motion: reduce` kills all animations
- Form fields have proper `<label htmlFor>`

**Dependencies:** None

**Known Issues:**
- Color contrast borderline on `--muted-foreground` for small mono text
- No skip link for terminal
- No high-contrast mode
- Screen reader users can't explore the heatmap meaningfully

**Future Improvements:**
- ARIA description for heatmap
- High-contrast mode toggle
- Screen reader announcements for panel switches
- Skip link for terminal dialog

---

## 16. SSR Error Recovery

**Description:** Three-layer error handling that catches h3-swallowed throws and renders proper HTML error pages.

**Status:** Working

**Files:**
- `src/lib/error-capture.ts` (28 lines)
- `src/server.ts` (55 lines)
- `src/start.ts` (23 lines)
- `src/lib/error-page.ts` (31 lines)

**Error Recovery Chain:**
1. `error-capture.ts`: Registers global `error` + `unhandledrejection` listeners
2. `server.ts`: Detects h3's `{"unhandled":true,"message":"HTTPError"}` response
3. `start.ts`: Catches errors that h3 doesn't swallow
4. `error-page.ts`: Renders static 500 HTML

**Dependencies:** None (pure error handling)

**Known Issues:**
- Error page is light-themed (doesn't match dark app theme)
- No error reporting beyond console.error

**Future Improvements:**
- Dark-themed error page
- Error reporting to external service (Sentry, etc.)
- Retry button that actually retries

---

## 17. SEO / Meta Tags

**Description:** Comprehensive SEO setup with JSON-LD structured data, OpenGraph tags, Twitter cards, and canonical URL.

**Status:** Working

**Files:**
- `src/routes/__root.tsx` (lines 76-119, 121-140)

**Meta Tags:**
- charset, viewport, title, description, author, theme-color
- og:title, og:description, og:type, og:url, og:image, og:site_name
- twitter:card, twitter:title, twitter:description, twitter:image
- robots (index, follow), canonical
- JSON-LD Person schema (name, url, jobTitle, sameAs, knowsAbout)

**Font Loading:**
- Preconnect to fonts.googleapis.com and fonts.gstatic.com
- Google Fonts: Inter (400-700) + JetBrains Mono (400-700)

**Dependencies:** None (static HTML)

**Known Issues:**
- `og:image` references `/og-image.svg` which may be a placeholder
- `canonical` URL is placeholder (`ayansingharoy.dev`)
- No sitemap.xml
- No robots.txt

**Future Improvements:**
- Real OG image (PNG, 1200×630)
- sitemap.xml
- robots.txt
- Canonical URL updated after deployment

---

## 18. Print CSS

**Description:** Isolates the resume panel for printing, hiding all other UI elements.

**Status:** Working

**Files:**
- `src/styles.css` (lines 196-217)
- `src/components/ayanos/FilePanels.tsx` (ResumePanel, `.print-resume` class)

**Print Behavior:**
1. User clicks "Print / Save as PDF" button
2. `window.print()` is called
3. CSS `@media print` rules:
   - Hide everything except `.print-resume`
   - `.print-resume` becomes `position: fixed; inset: 0; width: 100%`
   - White background, black text, no borders
4. User selects "Save as PDF" in browser print dialog

**Dependencies:** None (pure CSS)

**Known Issues:**
- Workaround for missing real PDF generation
- Users unfamiliar with "Save as PDF" may be confused

**Future Improvements:**
- Real PDF generation (jsPDF or Puppeteer)
- Downloadable PDF file
- Multiple resume templates

---

*Last updated: 2026-09-15*
