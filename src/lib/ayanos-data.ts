export type FileId =
  | "about.md"
  | "skills.json"
  | "projects"
  | "leetcode.log"
  | "github.stats"
  | "resume.pdf"
  | "contact.md";

export const FILE_ORDER: FileId[] = [
  "about.md",
  "skills.json",
  "projects",
  "leetcode.log",
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
  // TODO: replace with the real email before going live
  email: "ayan.singharoy@example.com",
  github: "https://github.com/ayan-singha-roy",
  linkedin: "https://linkedin.com/in/ayan-singha-roy",
  instagram: "https://instagram.com/ayan.singharoy",
};

export const SOCIALS = [
  { key: "github", label: "GitHub", handle: "@ayan-singha-roy", href: PROFILE.github, icon: "⎇" },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "in/ayan-singha-roy",
    href: PROFILE.linkedin,
    icon: "in",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@ayan.singharoy",
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
    id: "downtube",
    name: "DownTube",
    description: "A clean YouTube video & audio downloader with format selection.",
    tech: ["Python", "Flask", "pytube"],
    features: ["MP4 / MP3 export", "Quality picker", "Batch queue", "Dark UI"],
    github: "https://github.com/ayan-singha-roy/downtube",
    status: "live",
  },
  {
    id: "morse",
    name: "Morse Code Generator",
    description: "Text ↔ Morse converter with audio playback and visual flash.",
    tech: ["JavaScript", "Web Audio API", "HTML/CSS"],
    features: ["Bidirectional convert", "Audio output", "Speed control"],
    github: "https://github.com/ayan-singha-roy/morse-code",
    status: "live",
  },
  {
    id: "team-portfolio",
    name: "Team Portfolio Website",
    description: "Hackathon team site — built end-to-end in one weekend.",
    tech: ["React", "Tailwind", "Framer Motion"],
    features: ["Member cards", "Project gallery", "Contact form"],
    github: "https://github.com/ayan-singha-roy/team-portfolio",
    demo: "https://team-portfolio.example.com",
    status: "wip",
  },
];

export const LEETCODE = {
  total: 152,
  easy: 92,
  medium: 55,
  hard: 5,
  streak: 32,
  badges: ["50 Days Badge", "100 Solved", "Daily Challenge"],
};

export const GITHUB_STATS = {
  repos: 24,
  contributions: 487,
  followers: 38,
  languages: [
    { name: "Python", pct: 38, color: "var(--color-accent)" },
    { name: "JavaScript", pct: 27, color: "var(--color-warning)" },
    { name: "TypeScript", pct: 18, color: "var(--color-purple)" },
    { name: "C", pct: 10, color: "var(--color-pink)" },
    { name: "Other", pct: 7, color: "var(--color-muted-foreground)" },
  ],
};

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
