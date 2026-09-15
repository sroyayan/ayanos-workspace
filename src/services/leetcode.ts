import { PROFILE } from "@/lib/ayanos-data";

/**
 * LeetCode has no official public REST API. The public profile data is served
 * through the same GraphQL endpoint the website itself uses:
 *   https://leetcode.com/graphql
 * It requires a same-origin Referer/User-Agent header combo, otherwise
 * LeetCode's bot protection returns 403. Unauthenticated access returns
 * public-profile only (no email, no full submission history).
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

const GRAPHQL_URL = "https://leetcode.com/graphql";
const USERNAME = PROFILE.leetcodeUsername;

const PROFILE_QUERY = `query userProfilePublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { realName userAvatar ranking reputation }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    badges { id displayName icon }
  }
  userContestRanking(username: $username) {
    rating attendedContestsCount globalRanking
  }
}`;

const SUBMISSION_QUERY = `query recentSubmissions($username: String!, $limit: Int) {
  recentSubmissionList(username: $username, limit: $limit) {
    title titleSlug timestamp status
  }
}`;

interface GraphQLBody<T> {
  data?: T;
  errors?: { message: string }[];
}

async function graphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Referer: `https://leetcode.com/u/${USERNAME}/`,
      "User-Agent": "ayanos-workspace (portfolio)",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("LeetCode is rate-limiting requests right now. Try again in a minute.");
    }
    throw new Error(`LeetCode API error: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLBody<T> = (await res.json()) as GraphQLBody<T>;
  if (json.errors?.length) {
    throw new Error(json.errors[0].message ?? "LeetCode API error.");
  }
  if (!json.data) {
    throw new Error(`User "${USERNAME}" not found on LeetCode.`);
  }
  return json.data;
}

/** Full public profile (stats + contest ranking + badges) for PROFILE.leetcodeUsername. */
export async function fetchLeetCodeProfile(): Promise<LeetCodeProfile> {
  return graphQL<LeetCodeProfile>(PROFILE_QUERY, { username: USERNAME });
}

/** Contest ranking (rating is null until the user attends their first contest). */
export async function fetchLeetCodeContest(): Promise<LeetCodeContest> {
  const data = await graphQL<{ userContestRanking: LeetCodeContest | null }>(PROFILE_QUERY, {
    username: USERNAME,
  });
  return (
    data.userContestRanking ?? {
      rating: null,
      attendedContestsCount: null,
      globalRanking: null,
    }
  );
}

/** Most recent accepted submissions (a few user count, no auth needed). */
export async function fetchLeetCodeRecentSubmissions(limit = 5): Promise<LeetCodeSubmission[]> {
  const data = await graphQL<{ recentSubmissionList: LeetCodeSubmission[] }>(SUBMISSION_QUERY, {
    username: USERNAME,
    limit,
  });
  return data.recentSubmissionList ?? [];
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
