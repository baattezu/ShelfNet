package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
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
 * Simple heuristic recommendation service (user-based + item-based hybrid).
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class RecommendationService {

    private final UserProfileRepository userProfileRepository;
    private final BookRepository bookRepository;
    private final UserInteractionRepository interactionRepository;

    /** Get recommended books for user using genre/author/tag overlap heuristics. */
    public List<Book> getRecommendationsForUser(String userId) {
        UserProfile user = userProfileRepository.findById(userId).orElse(null);
        if (user == null) return List.of();

        // Books user already interacted with
        Set<String> interactedBookIds = interactionRepository.findByUserId(userId).stream()
                .map(UserInteraction::getBookId)
                .collect(Collectors.toSet());

        List<Book> allBooks = bookRepository.findAll();

        // Score books
        Map<Book, Integer> scoreMap = new HashMap<>();
        for (Book book : allBooks) {
            if (interactedBookIds.contains(book.getId())) continue; // skip already interacted
            int score = 0;
            if (book.getGenre() != null && user.getFavoriteGenres().contains(book.getGenre())) score += 5;
            if (user.getFavoriteAuthors().contains(book.getAuthor())) score += 7;
            if (book.getTags() != null) {
                for (String tag : book.getTags()) {
                    if (user.getFavoriteGenres().contains(tag)) score += 2; // treat genre list as interest tags too
                }
            }
            scoreMap.put(book, score);
        }

        // User-based: find similar users and incorporate their liked books
        List<UserProfile> others = userProfileRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .collect(Collectors.toList());
        for (UserProfile other : others) {
            int overlap = overlap(user.getFavoriteGenres(), other.getFavoriteGenres())
                    + overlap(user.getFavoriteAuthors(), other.getFavoriteAuthors());
            if (overlap > 0) {
                // Books the other has READ or rated
                List<String> liked = interactionRepository.findByUserId(other.getId()).stream()
                        .filter(i -> i.getType() == InteractionType.READ || i.getType() == InteractionType.RATING)
                        .map(UserInteraction::getBookId)
                        .toList();
                for (Book b : allBooks) {
                    if (liked.contains(b.getId()) && !interactedBookIds.contains(b.getId())) {
                        scoreMap.merge(b, overlap, Integer::sum);
                    }
                }
            }
        }

        return scoreMap.entrySet().stream()
                .filter(e -> e.getValue() > 0)
                .sorted(Map.Entry.<Book, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .limit(10)
                .collect(Collectors.toList());
    }

    private int overlap(List<String> a, List<String> b) {
        if (a == null || b == null) return 0;
        Set<String> setA = new HashSet<>(a);
        int count = 0;
        for (String x : b) if (setA.contains(x)) count++;
        return count;
    }
}

