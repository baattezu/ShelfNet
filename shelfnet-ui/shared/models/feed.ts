import { PopularShelfBook, TrendingBook } from "@/features/books/models/book";
import { CommunityPreview } from "@/features/community/models/community-preview";
import { RecommendedReader } from "@/features/profile/models/reader";
import { RecentActivityItem } from "@/features/profile/models/recent-activity";

export interface FeedResponse {
  trendingBooks: TrendingBook[];
  popularOnShelfNet: PopularShelfBook[];
  communityPicks: CommunityPreview[];
  suggestedCommunities: CommunityPreview[];
  recommendedReaders: RecommendedReader[];
  recentActivity: RecentActivityItem[];
}
