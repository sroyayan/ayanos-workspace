import { PROFILE } from "@/lib/ayanos-data";

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string | null;
  twitter_username: string | null;
  blog: string | null;
  company: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  visibility: "public" | "private";
}

export interface GitHubLanguages {
  [language: string]: number;
}

const GITHUB_API = "https://api.github.com";
const USERNAME = PROFILE.githubUsername;

async function fetchWithError<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "AyanOS-Portfolio",
    },
  });

  if (!res.ok) {
    if (res.status === 403) {
      const retryAfter = res.headers.get("Retry-After");
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000;
      throw new Error(
        `GitHub API rate limited. Try again in ${Math.ceil(waitTime / 1000)} seconds.`,
      );
    }
    if (res.status === 404) {
      throw new Error(`GitHub user "${USERNAME}" not found.`);
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchGitHubProfile(): Promise<GitHubProfile> {
  return fetchWithError<GitHubProfile>(`${GITHUB_API}/users/${USERNAME}`);
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  return fetchWithError<GitHubRepo[]>(
    `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=20`,
  );
}

export async function fetchRepoLanguages(repo: string): Promise<GitHubLanguages> {
  return fetchWithError<GitHubLanguages>(`${GITHUB_API}/repos/${USERNAME}/${repo}/languages`);
}

export async function fetchAllRepoLanguages(repos: GitHubRepo[]): Promise<GitHubLanguages> {
  const languageTotals: GitHubLanguages = {};

  for (const repo of repos) {
    if (repo.visibility === "private") continue;
    try {
      const langs = await fetchRepoLanguages(repo.name);
      for (const [lang, bytes] of Object.entries(langs)) {
        languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
      }
    } catch {
      continue;
    }
  }

  return languageTotals;
}

export function computeLanguagePercentages(languages: GitHubLanguages): {
  name: string;
  pct: number;
  color: string;
}[] {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  if (totalBytes === 0) return [];

  const languageColors: Record<string, string> = {
    Python: "var(--color-accent)",
    JavaScript: "var(--color-warning)",
    TypeScript: "var(--color-purple)",
    C: "var(--color-pink)",
    "C++": "var(--color-pink)",
    CSS: "var(--color-accent)",
    HTML: "var(--color-orange)",
    Rust: "var(--color-orange)",
    Go: "var(--color-success)",
    Java: "var(--color-destructive)",
    Shell: "var(--color-muted-foreground)",
    Dockerfile: "var(--color-success)",
    Vue: "var(--color-success)",
    Svelte: "var(--color-orange)",
    Jupyter: "var(--color-warning)",
    MDX: "var(--color-muted-foreground)",
  };

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      pct: Math.round((bytes / totalBytes) * 100),
      color: languageColors[name] || "var(--color-muted-foreground)",
    }));
}
