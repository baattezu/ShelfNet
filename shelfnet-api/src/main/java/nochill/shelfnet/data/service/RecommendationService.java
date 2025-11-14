package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.dto.RecommendationItem;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.model.InteractionType;
import nochill.shelfnet.data.model.UserInteraction;
import nochill.shelfnet.data.model.UserProfile;
import nochill.shelfnet.data.repo.BookRepository;
import nochill.shelfnet.data.repo.UserInteractionRepository;
import nochill.shelfnet.data.repo.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Advanced recommendation service combining multiple signals.
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class RecommendationService {

    private final UserProfileRepository userProfileRepository;
    private final BookRepository bookRepository;
    private final UserInteractionRepository interactionRepository;
    private final GoogleBooksIntegrationService googleBooksIntegrationService;

    // Weight configuration
    private static final double W_USER_AFFINITY = 0.35;
    private static final double W_POPULARITY = 0.25;
    private static final double W_GOOGLE_TREND = 0.15;
    private static final double W_CONTENT_SIMILARITY = 0.25;

    /** Get recommendation items for a user. */
    public List<RecommendationItem> getRecommendations(String userId) {
        UserProfile user = userProfileRepository.findById(userId).orElse(null);
        if (user == null) return List.of();

        List<Book> allBooks = bookRepository.findAll();
        Set<String> interactedBookIds = interactionRepository.findByUserId(userId).stream()
                .map(UserInteraction::getBookId)
                .collect(Collectors.toSet());

        // Collaborative filtering: similar users
        Map<String, Double> userSimilarity = computeUserSimilarities(user, userId);

        // Item-based similarity pre-compute (genre + author overlap)
        Map<String, Map<String, Double>> itemSimilarities = computeItemSimilarities(allBooks);

        // Google trending books
        List<Book> trending = googleBooksIntegrationService.trendingAsBooks();
        Map<String, Double> trendingBoost = trending.stream().collect(Collectors.toMap(Book::getGoogleId, b -> b.getGoogleTrendingBoost()));

        List<RecommendationItem> items = new ArrayList<>();
        for (Book book : allBooks) {
            if (interactedBookIds.contains(book.getId())) continue; // skip already interacted
            double userAffinity = computeUserAffinity(book, user);
            double popularity = computePopularity(book);
            double googleTrend = book.getGoogleId() != null ? trendingBoost.getOrDefault(book.getGoogleId(), 0.0) : 0.0;
            double contentSimilarity = aggregateContentSimilarity(book, interactedBookIds, itemSimilarities);
            double score = W_USER_AFFINITY * userAffinity + W_POPULARITY * popularity + W_GOOGLE_TREND * googleTrend + W_CONTENT_SIMILARITY * contentSimilarity;
            if (score <= 0) continue;
            String reason = buildReason(userAffinity, popularity, googleTrend, contentSimilarity);
            items.add(new RecommendationItem(book, Math.round(score * 100.0) / 100.0, reason));
        }

        // Add pure trending Google books not yet in local DB
        for (Book trend : trending) {
            boolean existsLocally = allBooks.stream().anyMatch(b -> Objects.equals(b.getGoogleId(), trend.getGoogleId()));
            if (!existsLocally) {
                double popularity = computePopularity(trend);
                double score = W_GOOGLE_TREND * trend.getGoogleTrendingBoost() + W_POPULARITY * popularity;
                items.add(new RecommendationItem(trend, Math.round(score * 100.0) / 100.0, "Google trending"));
            }
        }

        return items.stream()
                .sorted(Comparator.comparingDouble(RecommendationItem::score).reversed())
                .limit(15)
                .collect(Collectors.toList());
    }

    private Map<String, Double> computeUserSimilarities(UserProfile user, String userId) {
        List<UserProfile> others = userProfileRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());
        Map<String, Double> sim = new HashMap<>();
        for (UserProfile other : others) {
            double overlapGenres = jaccard(user.getFavoriteGenres(), other.getFavoriteGenres());
            double overlapAuthors = jaccard(user.getFavoriteAuthors(), other.getFavoriteAuthors());
            double s = (overlapGenres + overlapAuthors) / 2.0;
            if (s > 0) sim.put(other.getId(), s);
        }
        return sim;
    }

    private Map<String, Map<String, Double>> computeItemSimilarities(List<Book> books) {
        Map<String, Map<String, Double>> itemSim = new HashMap<>();
        for (Book a : books) {
            Map<String, Double> inner = new HashMap<>();
            for (Book b : books) {
                if (a == b) continue;
                double genreSim = jaccard(singletonList(a.getGenre()), singletonList(b.getGenre()));
                double authorSim = jaccard(singletonList(a.getAuthor()), singletonList(b.getAuthor()));
                double tagSim = jaccard(a.getTags(), b.getTags());
                double sim = (genreSim * 0.4) + (authorSim * 0.4) + (tagSim * 0.2);
                if (sim > 0) inner.put(b.getId(), sim);
            }
            itemSim.put(a.getId(), inner);
        }
        return itemSim;
    }

    private double aggregateContentSimilarity(Book target, Set<String> interactedBookIds, Map<String, Map<String, Double>> itemSimilarities) {
        Map<String, Double> sims = itemSimilarities.getOrDefault(target.getId(), Map.of());
        double sum = 0; int count = 0;
        for (String id : interactedBookIds) {
            if (sims.containsKey(id)) { sum += sims.get(id); count++; }
        }
        return count == 0 ? 0.0 : sum / count;
    }

    private double computeUserAffinity(Book book, UserProfile user) {
        double genreAffinity = user.getFavoriteGenres().contains(book.getGenre()) ? 1.0 : 0.0;
        double authorAffinity = user.getFavoriteAuthors().contains(book.getAuthor()) ? 1.0 : 0.0;
        return (genreAffinity + authorAffinity) / 2.0;
    }

    private double computePopularity(Book b) {
        double likes = b.getLikesCount() != null ? b.getLikesCount() : 0.0;
        double reads = b.getReadCount() != null ? b.getReadCount() : 0.0;
        double rating = b.getAvgRating() != null ? b.getAvgRating() : 0.0;
        return (likes + reads) / 50.0 + rating / 5.0; // normalize
    }

    private double jaccard(List<String> a, List<String> b) {
        if (a == null || b == null || a.isEmpty() || b.isEmpty()) return 0.0;
        Set<String> sa = new HashSet<>(a);
        Set<String> sb = new HashSet<>(b);
        Set<String> inter = new HashSet<>(sa); inter.retainAll(sb);
        Set<String> union = new HashSet<>(sa); union.addAll(sb);
        return union.isEmpty() ? 0.0 : (double) inter.size() / union.size();
    }

    private List<String> singletonList(String v) { return v == null ? List.of() : List.of(v); }

    private String buildReason(double userAffinity, double popularity, double googleTrend, double contentSimilarity) {
        List<String> reasons = new ArrayList<>();
        if (userAffinity > 0.5) reasons.add("matches your interests");
        if (contentSimilarity > 0.3) reasons.add("similar to books you've interacted with");
        if (googleTrend > 0.1) reasons.add("popular now on Google");
        if (popularity > 0.2) reasons.add("locally popular");
        return String.join(", ", reasons);
    }
}
