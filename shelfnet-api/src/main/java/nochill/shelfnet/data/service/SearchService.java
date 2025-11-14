package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.dto.GoogleVolumeSearchResponse;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.mapper.GoogleBookMapper;
import nochill.shelfnet.data.repo.BookRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Unified search service combining local Mongo books and Google Books results.
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class SearchService {

    private final BookRepository bookRepository;
    private final GoogleBooksIntegrationService googleBooksIntegrationService;
    private final GoogleBookMapper mapper;

    /** Unified search combining local and Google sources. */
    public List<Book> unifiedSearch(String query, String genre, Integer limit, String language) {
        if (limit == null || limit <= 0) limit = 20;
        List<Book> local = filterLocal(query, genre);

        GoogleVolumeSearchResponse googleResp = googleBooksIntegrationService.searchGoogleBooks(query != null ? query : "");
        List<Book> googleBooks = googleResp.items().stream()
                .filter(v -> language == null || v.language() == null || v.language().equalsIgnoreCase(language))
                .map(mapper::fromGoogleVolume)
                .toList();

        // Merge while avoiding duplicates by googleId or title
        Map<String, Book> merged = new LinkedHashMap<>();
        for (Book b : local) merged.put(b.getId(), b);
        for (Book g : googleBooks) {
            String key = g.getGoogleId() != null ? g.getGoogleId() : g.getTitle();
            if (merged.values().stream().noneMatch(existing -> Objects.equals(existing.getGoogleId(), g.getGoogleId()) || Objects.equals(existing.getTitle(), g.getTitle()))) {
                merged.put(key, g);
            }
        }

        // Ranking: local popularity first, then Google relevance proxy (avgRating + trending boost)
        return merged.values().stream()
                .sorted(Comparator.comparingDouble(this::rankingScore).reversed())
                .limit(limit)
                .toList();
    }

    private List<Book> filterLocal(String query, String genre) {
        return bookRepository.findAll().stream()
                .filter(b -> (query == null || query.isBlank() || contains(b, query))
                        && (genre == null || genre.isBlank() || Objects.equals(b.getGenre(), genre)))
                .toList();
    }

    private boolean contains(Book b, String q) {
        String qq = q.toLowerCase(Locale.ROOT);
        return (b.getTitle() != null && b.getTitle().toLowerCase(Locale.ROOT).contains(qq))
                || (b.getAuthor() != null && b.getAuthor().toLowerCase(Locale.ROOT).contains(qq))
                || (b.getGenre() != null && b.getGenre().toLowerCase(Locale.ROOT).contains(qq))
                || (b.getTags() != null && b.getTags().stream().anyMatch(t -> t.toLowerCase(Locale.ROOT).contains(qq)));
    }

    private double rankingScore(Book b) {
        double localPopularity = ((b.getLikesCount() != null ? b.getLikesCount() : 0) + (b.getReadCount() != null ? b.getReadCount() : 0));
        double googleRelevance = (b.getAvgRating() != null ? b.getAvgRating() : 0) + (b.getGoogleTrendingBoost() != null ? b.getGoogleTrendingBoost() * 5 : 0);
        return localPopularity + googleRelevance;
    }
}
