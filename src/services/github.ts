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

