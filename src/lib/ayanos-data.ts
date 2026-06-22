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

export const PROFILE = {
  name: "Ayan Singha Roy",
  role: "B.Tech CSE (AI & ML)",
  location: "West Bengal, India",
  email: "ayan.singharoy@example.com",
  github: "https://github.com/ayan-singha-roy",
  linkedin: "https://linkedin.com/in/ayan-singha-roy",
  instagram: "https://instagram.com/ayan.singharoy",
};

export const SKILLS = {
  languages: ["Python", "JavaScript", "C"],
  frontend: ["HTML", "CSS", "React", "Tailwind"],
  tools: ["Git", "GitHub", "VS Code"],
  learning: ["Node.js", "AI/ML", "DSA"],
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tech: string[];
  features: string[];
  github: string;
  demo?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "downtube",
    name: "DownTube",
    description: "A clean YouTube video & audio downloader with format selection.",
    tech: ["Python", "Flask", "pytube"],
    features: ["MP4 / MP3 export", "Quality picker", "Batch queue", "Dark UI"],
    github: "https://github.com/ayan-singha-roy/downtube",
  },
  {
    id: "morse",
    name: "Morse Code Generator",
    description: "Text ↔ Morse converter with audio playback and visual flash.",
    tech: ["JavaScript", "Web Audio API", "HTML/CSS"],
    features: ["Bidirectional convert", "Audio output", "Speed control"],
    github: "https://github.com/ayan-singha-roy/morse-code",
  },
  {
    id: "team-portfolio",
    name: "Team Portfolio Website",
    description: "Hackathon team site — built end-to-end in one weekend.",
    tech: ["React", "Tailwind", "Framer Motion"],
    features: ["Member cards", "Project gallery", "Contact form"],
    github: "https://github.com/ayan-singha-roy/team-portfolio",
    demo: "https://team-portfolio.example.com",
  },
  {
    id: "ai-next",
    name: "Future AI Project",
    description: "Placeholder — in active R&D. Stay tuned.",
    tech: ["Python", "PyTorch", "FastAPI"],
    features: ["TBA"],
    github: "https://github.com/ayan-singha-roy",
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
