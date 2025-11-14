package nochill.shelfnet.data.dto;

import java.time.Instant;
import java.util.List;

/**
 * Structured home feed response bundle for the reader-facing experience.
 */
public record FeedResponse(
        List<BookView> trendingBooks,
        List<BookView> popularOnShelfNet,
        List<CommunityPreview> communityPicks,
        List<CommunityPreview> suggestedCommunities,
        List<ReaderPreview> recommendedReaders,
        List<ActivityEntry> recentActivity
) {
    public static FeedResponse empty() {
        return new FeedResponse(List.of(), List.of(), List.of(), List.of(), List.of(), List.of());
    }

    /**
     * Minimal book representation for community previews.
     */
    public record BookMiniView(
            String id,
            String title,
            String primaryAuthor,
            String source
    ) {}

    /**
     * Community preview with featured books.
     */
    public record CommunityPreview(
            String id,
            String name,
            List<String> tags,
            Integer memberCount,
            List<BookMiniView> previewBooks
    ) {}

    /**
     * Recommended reader preview.
     */
    public record ReaderPreview(
            String id,
            String name,
            String avatar
    ) {}

    /**
     * Recent activity entry.
     */
    public record ActivityEntry(
            String type,
            Instant timestamp,
            UserSnippet user,
            BookSnippet book
    ) {
        public record UserSnippet(
                String id,
                String name,
                String avatar
        ) {}

        public record BookSnippet(
                String id,
                String title,
                String author
        ) {}
    }
}

