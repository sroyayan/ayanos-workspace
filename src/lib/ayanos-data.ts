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
  email: "ayansingharoy7906@gmail.com",
  github: "https://github.com/sroyayan",
  githubUsername: "sroyayan",
  linkedin: "https://linkedin.com/in/sroyayan",
  leetcode: "https://leetcode.com/u/sroyayan/",
  leetcodeUsername: "sroyayan",
  instagram: "https://www.instagram.com/4yan_s.r0y/",
};

export const SOCIALS = [
  { key: "github", label: "GitHub", handle: "@sroyayan", href: PROFILE.github, icon: "⎇" },
  {
    key: "leetcode",
    label: "LeetCode",
    handle: "u/sroyayan",
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
    { name: "C", level: 4 },
    { name: "SQL", level: 4 },
  ],
  libraries: [
    { name: "FastAPI", level: 4 },
    { name: "NumPy", level: 3 },
    { name: "Pandas", level: 3 },
    { name: "Pillow (PIL)", level: 4 },
    { name: "Tkinter", level: 4 },
    { name: "Scapy", level: 3 },
  ],
  tools: [
    { name: "Git & GitHub", level: 5 },
    { name: "VS Code", level: 5 },
    { name: "MongoDB", level: 4 },
    { name: "Linux", level: 3 },
  ],
  concepts: [
    { name: "Machine Learning", level: 3 },
    { name: "Cybersecurity", level: 4 },
    { name: "Networking", level: 3 },
    { name: "OOP", level: 4 },
    { name: "DSA", level: 4 },
  ],
} as Record<string, Skill[]>;

export const SKILL_META: Record<string, { icon: string; color: string }> = {
  languages: { icon: "λ", color: "var(--color-warning)" },
  libraries: { icon: "◈", color: "var(--color-accent)" },
  tools: { icon: "⚙", color: "var(--color-success)" },
  concepts: { icon: "✦", color: "var(--color-purple)" },
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
    id: "legalmetrix",
    name: "LegalMetriX",
    description:
      "AI-powered compliance verification system for packaged commodities using FastAPI, MongoDB, OCR, and Gemini Vision API.",
    tech: ["Python", "FastAPI", "MongoDB", "OCR", "Gemini Vision"],
    features: ["OCR extraction", "Gemini analysis", "Compliance verification"],
    github: "https://github.com/sroyayan/LegalMetriX",
    status: "wip",
  },
  {
    id: "agriguard-ai",
    name: "AgriGuard AI",
    description:
      "AI-powered crop disease detection and plant health monitoring platform using machine learning and image analysis.",
    tech: ["Python", "Machine Learning"],
    features: ["Disease identification", "Treatment suggestions", "Computer vision"],
    github: "https://github.com/sroyayan/AgriGuard-AI",
    status: "wip",
  },
  {
    id: "network-packet-analyzer",
    name: "Network Packet Analyzer",
    description: "A Python packet analysis tool capable of capturing and inspecting live network traffic using Scapy.",
    tech: ["Python", "Scapy"],
    features: ["Packet capture", "Protocol inspection", "TCP/UDP/ICMP analysis"],
    github: "https://github.com/sroyayan/network-packet-analyzer",
    status: "live",
  },
  {
    id: "keyboard-activity-monitor",
    name: "Keyboard Activity Monitor",
    description: "A desktop-based keyboard activity monitoring application with activity logs and timestamps.",
    tech: ["Python", "Tkinter"],
    features: ["Keystroke logging", "Activity logs", "GUI"],
    github: "https://github.com/sroyayan/keyboard_activity_monitor",
    status: "live",
  },
  {
    id: "image-encryption-tool",
    name: "Image Encryption Tool",
    description: "An image encryption and decryption application using pixel-level transformations.",
    tech: ["Python", "Pillow (PIL)"],
    features: ["Pixel transformation", "Security workflows"],
    github: "https://github.com/sroyayan/image-encryption-tool",
    status: "live",
  },
  {
    id: "caesar-cipher",
    name: "Caesar Cipher Encryption Tool",
    description: "A cryptography application implementing Caesar Cipher encryption and decryption.",
    tech: ["Python"],
    features: ["Encryption/Decryption", "Interactive text processing"],
    github: "https://github.com/sroyayan/caesar-cipher",
    status: "live",
  }
];

// Note: GitHub stats are now fetched live from the GitHub API in the github.stats
// panel (src/services/github.ts) — no hardcoded GITHUB_STATS object.
// LeetCode stats are fetched live in the leetcode.stats panel
// (src/services/leetcode.ts) — no hardcoded LEETCODE object.



export const EDUCATION = [
  {
    institution: "Sanaka Educational Trust's Group of Institutions",
    degree: "B.Tech in Computer Science & Engineering (AI & ML)",
    year: "2024 – Present",
  },
  {
    institution: "Joypur High School",
    degree: "Higher Secondary (PCMB) – 85.6%",
    year: "2024",
  },
  {
    institution: "Changdoba High School",
    degree: "Madhyamik – 76.42%",
    year: "2022",
  },
];

export const EXPERIENCE = [
  {
    role: "Cybersecurity Intern",
    company: "Prodigy InfoTech",
    year: "2026",
    details: [
      "Completed a cybersecurity internship focused on developing Python-based security and monitoring tools.",
      "Designed and implemented encryption systems, activity monitoring applications, and network traffic analysis tools.",
      "Applied concepts of cryptography, packet inspection, logging, and system monitoring in practical projects.",
      "Utilized Git and GitHub for version control, documentation, and project management.",
    ],
  },
];

export const CERTIFICATIONS = [
  "Introduction to GitHub – GitHub Skills",
  "Generative AI Fundamentals – Google Cloud Skills Boost",
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
