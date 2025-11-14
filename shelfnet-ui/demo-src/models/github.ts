export type RepoOwner = {
  login: string;
  avatar_url?: string;
  html_url: string;
};

export type RepoSummary = {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  stargazers_count: number;
  html_url: string;
  owner: RepoOwner;
  language?: string;
  forks_count: number;
  updated_at: string;
};

export type RepoSearchResponse = {
  total_count: number;
  items: RepoSummary[];
};
