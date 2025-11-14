import type { RepoSearchResponse, RepoSummary } from "@/src/models/github";

const GITHUB_ENDPOINT = "https://api.github.com";

export async function searchRepositories(
  query: string
): Promise<RepoSummary[]> {
  const response = await fetch(
    `${GITHUB_ENDPOINT}/search/repositories?q=${encodeURIComponent(
      query
    )}&per_page=5`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "shelfnet-ui-demo",
      },
      next: { revalidate: 60 },
    }
  );

  if (response.status === 403) {
    throw new Error("GitHub rate limit hit – try again in a bit.");
  }

  if (!response.ok) {
    throw new Error("Unable to fetch repositories right now");
  }

  const data = (await response.json()) as RepoSearchResponse;
  return data.items ?? [];
}
