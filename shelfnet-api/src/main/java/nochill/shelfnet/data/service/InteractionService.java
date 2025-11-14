package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.model.InteractionType;
import nochill.shelfnet.data.model.UserInteraction;
import nochill.shelfnet.data.repo.BookRepository;
import nochill.shelfnet.data.repo.UserInteractionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for user-book interactions with metrics updates.
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class InteractionService {

    private final UserInteractionRepository interactionRepository;
    private final BookRepository bookRepository;

    /** Persist new interaction and update related book metrics. */
    public UserInteraction addInteraction(String bookId, UserInteraction interaction) {
        interaction.setBookId(bookId);
        UserInteraction saved = interactionRepository.save(interaction);
        updateBookStats(bookId);
        return saved;
    }

    /** Get interactions for a specific user. */
    public List<UserInteraction> getInteractionsByUser(String userId) {
        return interactionRepository.findByUserId(userId);
    }

    /** Get interactions for a book. */
    public List<UserInteraction> getInteractionsByBook(String bookId) {
        return interactionRepository.findByBookId(bookId);
    }

    /** Update book statistics (avgRating, likesCount, readCount). */
    public void updateBookStats(String bookId) {
        Optional<Book> opt = bookRepository.findById(bookId);
        if (opt.isEmpty()) return;
        Book book = opt.get();
        List<UserInteraction> interactions = interactionRepository.findByBookId(bookId);
        double avgRating = computeAvgRating(interactions);
        int likes = (int) interactions.stream().filter(i -> i.getType() == InteractionType.FAVORITE).count();
        int reads = (int) interactions.stream().filter(i -> i.getType() == InteractionType.READ).count();
        book.setAvgRating(avgRating);
        book.setLikesCount(likes);
        book.setReadCount(reads);
        bookRepository.save(book);
    }

    /** Compute average rating from RATING interactions. */
    public double computeAvgRating(List<UserInteraction> interactions) {
        var ratings = interactions.stream()
                .filter(i -> i.getType() == InteractionType.RATING && i.getRating() != null)
                .map(UserInteraction::getRating)
                .toList();
        if (ratings.isEmpty()) return 0.0;
        double sum = ratings.stream().mapToDouble(Double::doubleValue).sum();
        return Math.round((sum / ratings.size()) * 100.0) / 100.0; // round to 2 decimals
    }
}
