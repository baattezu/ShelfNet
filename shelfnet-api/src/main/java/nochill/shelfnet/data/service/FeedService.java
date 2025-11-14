package nochill.shelfnet.data.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nochill.shelfnet.data.dto.BookView;
import nochill.shelfnet.data.dto.FeedResponse;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.model.Community;
import nochill.shelfnet.data.model.UserInteraction;
import nochill.shelfnet.data.repo.BookRepository;
import nochill.shelfnet.data.repo.CommunityRepository;
import nochill.shelfnet.data.repo.UserInteractionRepository;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Feed service that orchestrates feed sections using Mongo aggregations and external integrations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FeedService {

    private static final int TRENDING_LIMIT = 8;
    private static final int POPULAR_LIMIT = 10;
    private static final int COMMUNITY_PICK_LIMIT = 10;
    private static final int COMMUNITY_SUGGESTION_LIMIT = 5;
    private static final int READER_SUGGESTION_LIMIT = 5;
    private static final int RECENT_ACTIVITY_LIMIT = 10;

    private final BookRepository bookRepository;
    private final UserInteractionRepository interactionRepository;
    private final CommunityRepository communityRepository;
    private final RecommendationService recommendationService;
    private final GoogleBooksIntegrationService googleBooksIntegrationService;
    private final MongoTemplate mongoTemplate;
    private final nochill.shelfnet.data.repo.UserProfileRepository userProfileRepository;

    public FeedResponse buildHomeFeed(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId cannot be null or blank");
        }

        log.debug("Building home feed for userId={}", userId);
        long start = System.currentTimeMillis();

        List<BookView> trending = fetchTrendingBooks();
        List<BookView> popularLocal = fetchPopularShelfNetBooks();
        List<FeedResponse.CommunityPreview> communityPicks = fetchCommunityPicks(userId);
        List<FeedResponse.CommunityPreview> suggestedCommunities = fetchSuggestedCommunities(userId);
        List<FeedResponse.ReaderPreview> recommendedReaders = fetchRecommendedReaders(userId);
        List<FeedResponse.ActivityEntry> recentActivity = fetchRecentActivity(userId);

        long duration = System.currentTimeMillis() - start;
        log.debug("Built home feed for userId={} in {}ms", userId, duration);

        return new FeedResponse(trending, popularLocal, communityPicks, suggestedCommunities, recommendedReaders, recentActivity);
    }

    private List<BookView> fetchTrendingBooks() {
        try {
            var volumes = googleBooksIntegrationService.fetchTrending();
            if (volumes == null || volumes.isEmpty()) {
                return List.of();
            }
            return volumes.stream()
                    .map(googleBooksIntegrationService.getMapper()::fromGoogleVolume)
                    .filter(Objects::nonNull)
                    .map(BookView::fromBook)
                    .limit(TRENDING_LIMIT)
                    .toList();
        } catch (Exception ex) {
            log.warn("Falling back to empty trending books feed", ex);
            return List.of();
        }
    }

    private List<BookView> fetchPopularShelfNetBooks() {
        try {
            Aggregation pipeline = Aggregation.newAggregation(
                    addPopularityScoreField(),
                    Aggregation.sort(Sort.by(Sort.Direction.DESC, "popScore")),
                    Aggregation.limit(POPULAR_LIMIT)
            );
            AggregationResults<Book> results = mongoTemplate.aggregate(pipeline, "books", Book.class);
            return nullSafeList(results.getMappedResults()).stream()
                    .map(BookView::fromBook)
                    .filter(Objects::nonNull)
                    .toList();
        } catch (Exception ex) {
            log.warn("Popular books aggregation failed", ex);
            return List.of();
        }
    }

    private List<FeedResponse.CommunityPreview> fetchCommunityPicks(String userId) {
        try {
            List<Community> joined = nullSafeList(communityRepository.findByMemberIdsContaining(userId));
            if (joined.isEmpty()) {
                // Fallback to top communities by member count
                joined = nullSafeList(communityRepository.findAll()).stream()
                        .sorted(Comparator.comparingInt(this::memberCount).reversed())
                        .limit(COMMUNITY_PICK_LIMIT)
                        .toList();
            }

            return joined.stream()
                    .limit(COMMUNITY_PICK_LIMIT)
                    .map(this::toCommunityPreview)
                    .filter(Objects::nonNull)
                    .toList();
        } catch (Exception ex) {
            log.warn("Community picks failed for user {}", userId, ex);
            return List.of();
        }
    }

    private List<FeedResponse.CommunityPreview> fetchSuggestedCommunities(String userId) {
        try {
            Set<String> joinedIds = nullSafeList(communityRepository.findByMemberIdsContaining(userId)).stream()
                    .map(Community::getId)
                    .filter(id -> id != null && !id.isBlank())
                    .collect(Collectors.toSet());
            return nullSafeList(communityRepository.findAll()).stream()
                    .filter(Objects::nonNull)
                    .filter(c -> c.getId() != null && !joinedIds.contains(c.getId()))
                    .sorted(Comparator.comparingInt(this::memberCount).reversed())
                    .limit(COMMUNITY_SUGGESTION_LIMIT)
                    .map(this::toCommunityPreview)
                    .filter(Objects::nonNull)
                    .toList();
        } catch (Exception ex) {
            log.warn("Community suggestions failed for user {}", userId, ex);
            return List.of();
        }
    }

    private List<FeedResponse.ReaderPreview> fetchRecommendedReaders(String userId) {
        try {
            var recommendations = recommendationService.getRecommendations(userId);
            if (recommendations == null || recommendations.isEmpty()) {
                return List.of();
            }

            // For now, generate mock reader data from recommendations
            // In a real implementation, this would query user profiles who read similar books
            return recommendations.stream()
                    .map(rec -> rec.book())
                    .filter(Objects::nonNull)
                    .map(Book::getAuthor)
                    .filter(author -> author != null && !author.isBlank())
                    .distinct()
                    .limit(READER_SUGGESTION_LIMIT)
                    .map(author -> new FeedResponse.ReaderPreview(
                            "reader-" + author.hashCode(),
                            author,
                            "https://via.placeholder.com/100"
                    ))
                    .toList();
        } catch (Exception ex) {
            log.warn("Recommended readers failed for user {}", userId, ex);
            return List.of();
        }
    }

    private List<FeedResponse.ActivityEntry> fetchRecentActivity(String userId) {
        try {
            List<UserInteraction> interactions = nullSafeList(interactionRepository.findByUserId(userId));
            if (interactions.isEmpty()) {
                return List.of();
            }

            Comparator<UserInteraction> byIdDesc = Comparator
                    .comparing(UserInteraction::getId, Comparator.nullsLast(String::compareTo))
                    .reversed();

            return interactions.stream()
                    .filter(Objects::nonNull)
                    .sorted(byIdDesc)
                    .limit(RECENT_ACTIVITY_LIMIT)
                    .map(interaction -> toActivityEntry(interaction, userId))
                    .filter(Objects::nonNull)
                    .toList();
        } catch (Exception ex) {
            log.warn("Recent activity fetch failed for user {}", userId, ex);
            return List.of();
        }
    }

    private AggregationOperation addPopularityScoreField() {
        return context -> new Document("$addFields", new Document("popScore",
                new Document("$add", List.of(
                        new Document("$add", List.of(
                                new Document("$ifNull", List.of("$likesCount", 0)),
                                new Document("$ifNull", List.of("$readCount", 0))
                        )),
                        new Document("$multiply", List.of(
                                new Document("$ifNull", List.of("$avgRating", 0)),
                                10
                        ))
                ))));
    }

    private Set<String> extractFeaturedBookIds(List<Community> communities) {
        if (communities == null || communities.isEmpty()) {
            return Collections.emptySet();
        }
        Set<String> ids = new LinkedHashSet<>();
        for (Community community : communities) {
            if (community == null) continue;
            nullSafeList(community.getFeaturedBookIds()).stream()
                    .filter(id -> id != null && !id.isBlank())
                    .forEach(ids::add);
        }
        return ids;
    }

    private int memberCount(Community community) {
        return community == null || community.getMemberIds() == null ? 0 : community.getMemberIds().size();
    }

    private FeedResponse.CommunityPreview toCommunityPreview(Community community) {
        if (community == null) return null;

        List<String> featuredIds = nullSafeList(community.getFeaturedBookIds()).stream()
                .filter(id -> id != null && !id.isBlank())
                .limit(2)
                .toList();

        List<FeedResponse.BookMiniView> previewBooks = List.of();
        if (!featuredIds.isEmpty()) {
            try {
                previewBooks = nullSafeList(bookRepository.findAllById(featuredIds)).stream()
                        .filter(Objects::nonNull)
                        .map(book -> new FeedResponse.BookMiniView(
                                book.getId(),
                                book.getTitle(),
                                book.getAuthor() != null ? book.getAuthor() : "Unknown",
                                book.getSource() != null ? book.getSource().name() : "LOCAL"
                        ))
                        .toList();
            } catch (Exception ex) {
                log.debug("Failed to load preview books for community {}", community.getId(), ex);
            }
        }

        return new FeedResponse.CommunityPreview(
                community.getId(),
                community.getName() != null ? community.getName() : "Unnamed Community",
                nullSafeList(community.getTags()),
                memberCount(community),
                previewBooks
        );
    }

    private FeedResponse.ActivityEntry toActivityEntry(UserInteraction interaction, String userId) {
        if (interaction == null) return null;

        try {
            Book book = interaction.getBookId() != null
                    ? bookRepository.findById(interaction.getBookId()).orElse(null)
                    : null;

            if (book == null) {
                return null;
            }

            String interactionType = interaction.getType() != null
                    ? interaction.getType().name()
                    : "UNKNOWN";

            // Fetch real user data
            var userProfile = userProfileRepository.findById(userId).orElse(null);
            String userName = userProfile != null && userProfile.getName() != null
                    ? userProfile.getName()
                    : "User " + userId.substring(0, Math.min(8, userId.length()));

            FeedResponse.ActivityEntry.UserSnippet userSnippet = new FeedResponse.ActivityEntry.UserSnippet(
                    userId,
                    userName,
                    "https://via.placeholder.com/50"
            );

            FeedResponse.ActivityEntry.BookSnippet bookSnippet = new FeedResponse.ActivityEntry.BookSnippet(
                    book.getId(),
                    book.getTitle() != null ? book.getTitle() : "Unknown Title",
                    book.getAuthor() != null ? book.getAuthor() : "Unknown Author"
            );

            return new FeedResponse.ActivityEntry(
                    interactionType,
                    Instant.now().minus(1, ChronoUnit.HOURS), // Mock timestamp
                    userSnippet,
                    bookSnippet
            );
        } catch (Exception ex) {
            log.debug("Failed to build activity entry for interaction {}", interaction.getId(), ex);
            return null;
        }
    }

    private <T> List<T> nullSafeList(List<T> source) {
        return source == null ? List.of() : source;
    }
}
