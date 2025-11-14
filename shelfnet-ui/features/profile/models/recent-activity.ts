export interface RecentActivityItem {
  type: "RATING" | "READ" | "REVIEW" | "FAVORITE";
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
  };
}
