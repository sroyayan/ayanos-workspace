import { PROFILE } from "@/lib/ayanos-data";

/**
 * Using a free proxy API for LeetCode stats since the official GraphQL endpoint
 * blocks browser requests (CORS + Bot Protection).
 */

export interface LeetCodeProfile {
  username: string;
  profile: {
    realName: string | null;
    userAvatar: string | null;
    ranking: number;
    reputation: number;
  };
  submitStatsGlobal: {
    acSubmissionNum: { difficulty: string; count: number }[];
  };
  badges: { id: string; displayName: string; icon: string | null }[];
}

export interface LeetCodeContest {
  rating: number | null;
  attendedContestsCount: number | null;
  globalRanking: number | null;
}

export interface LeetCodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  status: number; // 10 = Accepted
}

export const LEETCODE_STATUS = {
  accepted: 10,
} as const;

const USERNAME = PROFILE.leetcodeUsername;
const API_URL = `https://leetcode-api-faisalshohag.vercel.app/${USERNAME}`;

let cachedData: any = null;
let cachedTime = 0;

async function fetchLeetcodeApi() {
  if (cachedData && Date.now() - cachedTime < 60000) {
    return cachedData;
  }
  let res: Response;
  try {
    res = await fetch(API_URL);
  } catch {
    throw new Error("Could not reach LeetCode API proxy.");
  }
  
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("LeetCode API is rate-limiting requests right now. Try again in a minute.");
    }
    throw new Error(`LeetCode API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(data.errors[0]?.message ?? `User "${USERNAME}" not found.`);
  }

  cachedData = data;
  cachedTime = Date.now();
  return data;
}

/** Full public profile (stats + contest ranking + badges) for PROFILE.leetcodeUsername. */
export async function fetchLeetCodeProfile(): Promise<LeetCodeProfile> {
  const data = await fetchLeetcodeApi();

  if (data.errors || !data.totalSolved && data.totalSolved !== 0) {
    throw new Error(`User "${USERNAME}" not found on LeetCode.`);
  }

  return {
    username: USERNAME,
    profile: {
      realName: null, // The proxy API doesn't return realName
      userAvatar: null, // The proxy API doesn't return userAvatar
      ranking: data.ranking ?? 0,
      reputation: data.reputation ?? 0,
    },
    submitStatsGlobal: {
      acSubmissionNum: data.matchedUserStats?.acSubmissionNum ?? [],
    },
    badges: [], // The proxy API doesn't return badges
  };
}

/** Contest ranking (rating is null until the user attends their first contest). */
export async function fetchLeetCodeContest(): Promise<LeetCodeContest> {
  return {
    rating: null,
    attendedContestsCount: null,
    globalRanking: null,
  };
}

/** Most recent accepted submissions (a few user count, no auth needed). */
export async function fetchLeetCodeRecentSubmissions(limit = 5): Promise<LeetCodeSubmission[]> {
  const data = await fetchLeetcodeApi();
  const recent = data.recentSubmissions ?? [];
  return recent.slice(0, limit).map((s: any) => ({
    title: s.title,
    titleSlug: s.titleSlug,
    timestamp: s.timestamp,
    status: s.statusDisplay === "Accepted" ? 10 : 0,
  }));
}

/** "Accepted AFL" vs "Accepted #" helper: submitStats acSubmissionNum count per difficulty. */
export function solvedByDifficulty(profile: LeetCodeProfile): {
  all: number;
  easy: number;
  medium: number;
  hard: number;
} {
  const byDifficulty: Record<string, number> = {};
  for (const entry of profile.submitStatsGlobal.acSubmissionNum) {
    byDifficulty[entry.difficulty.toLowerCase()] = entry.count;
  }
  return {
    all: byDifficulty["all"] ?? 0,
    easy: byDifficulty["easy"] ?? 0,
    medium: byDifficulty["medium"] ?? 0,
    hard: byDifficulty["hard"] ?? 0,
  };
}

