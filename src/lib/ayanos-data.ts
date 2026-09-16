export type FileId =
  | "about.md"
  | "skills.json"
  | "projects"
  | "leetcode.stats"
  | "github.stats"
  | "resume.pdf"
  | "contact.md";

export const FILE_ORDER: FileId[] = [
  "about.md",
  "skills.json",
  "projects",
  "leetcode.stats",
  "github.stats",
  "resume.pdf",
  "contact.md",
];

/**
 * Site-level constants. Replace SITE.url with the real production domain once
 * deployed so canonical/og:url point at the live site.
 */
export const SITE = {
  url: "https://ayansingharoy.dev",
  title: "AyanOS — Ayan Singha Roy",
  description:
    "AyanOS — a developer operating system portfolio for Ayan Singha Roy. B.Tech CSE (AI & ML). Projects, LeetCode, GitHub stats and more.",
};

export const PROFILE = {
  name: "Ayan Singha Roy",
  role: "B.Tech CSE (AI & ML)",
  tagline:
    "Passionate about building software, learning web development, solving coding problems, and exploring AI. I like shipping things that work, then making them faster.",
  location: "West Bengal, India",
  // ⚠️  DEPLOYMENT REQUIRED: Replace with your real email address before going live.
  //     All mailto: links and the contact form fallback use this value.
  email: "ayans.royayan@gmail.com",
  github: "https://github.com/sroyayan",
  githubUsername: "sroyayan",
  linkedin: "https://linkedin.com/in/sroyayan",
  leetcode: "https://leetcode.com/u/ayanrsoy/",
  leetcodeUsername: "ayanrsoy",
  instagram: "https://www.instagram.com/4yan_s.r0y/",
};

export const SOCIALS = [
  { key: "github", label: "GitHub", handle: "@sroyayan", href: PROFILE.github, icon: "⎇" },
  {
    key: "leetcode",
    label: "LeetCode",
    handle: "u/ayanrsoy",
    href: PROFILE.leetcode,
    icon: "λ",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "in/sroyayan",
    href: PROFILE.linkedin,
    icon: "in",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@4yan_s.r0y",
    href: PROFILE.instagram,
    icon: "◎",
  },
  {
    key: "email",
    label: "Email",
    handle: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: "@",
  },
];

export const CURRENT_FOCUS = ["React", "Full Stack Development", "DSA", "AI/ML"];

export type Skill = { name: string; level: number }; // level 1..5
export type SkillCategory = keyof typeof SKILLS;

export const SKILLS = {
  languages: [
    { name: "Python", level: 5 },
    { name: "JavaScript", level: 4 },
    { name: "TypeScript", level: 3 },
    { name: "C", level: 3 },
  ],
  frontend: [
    { name: "HTML", level: 5 },
    { name: "CSS", level: 4 },
    { name: "React", level: 3 },
    { name: "Tailwind", level: 4 },
  ],
  tools: [
    { name: "Git", level: 4 },
    { name: "GitHub", level: 4 },
    { name: "VS Code", level: 5 },
    { name: "Linux / Bash", level: 3 },
  ],
  learning: [
    { name: "Node.js", level: 2 },
    { name: "AI / ML", level: 2 },
    { name: "DSA", level: 3 },
  ],
} as Record<string, Skill[]>;

export const SKILL_META: Record<string, { icon: string; color: string }> = {
  languages: { icon: "λ", color: "var(--color-warning)" },
  frontend: { icon: "◈", color: "var(--color-accent)" },
  tools: { icon: "⚙", color: "var(--color-success)" },
  learning: { icon: "✦", color: "var(--color-purple)" },
};

export const LEVEL_LABELS = ["", "Familiar", "Working", "Proficient", "Advanced", "Expert"];

export type Project = {
  id: string;
  name: string;
  description: string;
  tech: string[];
  features: string[];
  github: string;
  demo?: string;
  status: "live" | "wip" | "archived";
};

export const PROJECTS: Project[] = [
  {
    id: "agriguard-ai",
    name: "AgriGuard AI",
    description:
      "AI-powered agricultural pest detection and decision support system using YOLOv11.",
    tech: ["Python", "YOLOv11", "Jupyter"],
    features: ["Pest detection", "Decision support", "Computer vision"],
    github: "https://github.com/sroyayan/AgriGuard-AI",
    status: "live",
  },
  {
    id: "legalmetrix",
    name: "LegalMetriX",
    description:
      "Packaged commodity compliance analysis platform — upload, OCR, AI review, persist.",
    tech: ["FastAPI", "MongoDB", "Gemini AI", "OCR"],
    features: ["OCR extraction", "Gemini analysis", "Inspection history"],
    github: "https://github.com/sroyayan/LegalMetriX",
    status: "wip",
  },
  {
    id: "leetcode",
    name: "LeetCode Solutions",
    description: "Daily DSA practice solved in Python — progress across Easy, Medium and Hard.",
    tech: ["Python", "DSA"],
    features: ["150+ problems", "Python solutions"],
    github: "https://github.com/sroyayan/LeetCode",
    status: "live",
  },
  {
    id: "network-packet-analyzer",
    name: "Network Packet Analyzer",
    description: "A Python packet capture and inspection tool for network analysis.",
    tech: ["Python"],
    features: ["Packet capture", "Protocol inspection"],
    github: "https://github.com/sroyayan/network-packet-analyzer",
    status: "live",
  },
];

// Note: GitHub stats are now fetched live from the GitHub API in the github.stats
// panel (src/services/github.ts) — no hardcoded GITHUB_STATS object.
// LeetCode stats are fetched live in the leetcode.stats panel
// (src/services/leetcode.ts) — no hardcoded LEETCODE object.

export const ACHIEVEMENTS = [
  { label: "100+ LeetCode Problems", icon: "🏆" },
  { label: "Hackathon Participant", icon: "⚡" },
  { label: "Coding Club Member", icon: "👥" },
  { label: "Open Source Contributor", icon: "🌱" },
  { label: "Python Developer", icon: "🐍" },
];

export const LIVE_STATUS = {
  learning: "React",
  goal: "Software Engineering Internship",
  status: "Building Something Cool",
};

/**
 * Optional contact endpoint (e.g. Formspree) — set VITE_CONTACT_ENDPOINT in
 * .env to enable real form delivery. Without it, the contact form falls back
 * to a mailto: compose.
 */
export const CONTACT_ENDPOINT: string =
  (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? "";
