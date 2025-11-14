package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.repo.BookRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Service for book operations.
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    /** Return all books. */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /** Simple search by query in title, author, genre, or tags. */
    public List<Book> searchBooks(String query) {
        if (query == null || query.isBlank()) {
            return getAllBooks();
        }
        String q = query.toLowerCase(Locale.ROOT);
        return bookRepository.findAll().stream()
                .filter(b -> containsIgnoreCase(b.getTitle(), q)
                        || containsIgnoreCase(b.getAuthor(), q)
                        || containsIgnoreCase(b.getGenre(), q)
                        || (b.getTags() != null && b.getTags().stream().anyMatch(t -> containsIgnoreCase(t, q))))
                .collect(Collectors.toList());
    }

    private boolean containsIgnoreCase(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    /** Persist new book. */
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    /** Compute popular books list sorted by composite popularity score. */
    public List<Book> getPopularBooks(int limit) {
        return bookRepository.findAll().stream()
                .sorted(Comparator.comparingDouble(this::popularityScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private double popularityScore(Book b) {
        double ratingComponent = b.getAvgRating() != null ? b.getAvgRating() : 0.0;
        double likesComponent = b.getLikesCount() != null ? b.getLikesCount() : 0.0;
        double readComponent = b.getReadCount() != null ? b.getReadCount() : 0.0;
        double googleBoost = b.getGoogleTrendingBoost() != null ? b.getGoogleTrendingBoost() * 10.0 : 0.0;
        return ratingComponent * 2 + likesComponent + readComponent + googleBoost; // weights
    }
}
