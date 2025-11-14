package nochill.shelfnet.data.dto;

import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.model.BookSource;

import java.util.ArrayList;
import java.util.List;

/**
 * Unified view of a book combining local Mongo data and Google Books information.
 */
public record BookView(
        String id,
        String title,
        List<String> authors,
        String primaryAuthor,
        String genre,
        List<String> categories,
        List<String> tags,
        String thumbnail,
        Integer year,
        Double avgRating,
        Integer likes,
        Integer reads,
        Double googleTrendingBoost,
        BookSource source,
        String googleId,
        Double score
) {
    public static BookView fromBook(Book book) {
        if (book == null) return null;

        // Calculate score based on source
        double calculatedScore;
        if (book.getSource() == BookSource.GOOGLE) {
            calculatedScore = book.getGoogleTrendingBoost() != null ? book.getGoogleTrendingBoost() : 0.0;
        } else {
            // Local books: likes + reads + rating * weight
            int likes = book.getLikesCount() != null ? book.getLikesCount() : 0;
            int reads = book.getReadCount() != null ? book.getReadCount() : 0;
            double rating = book.getAvgRating() != null ? book.getAvgRating() : 0.0;
            calculatedScore = likes + reads + (rating * 10.0);
        }

        return new BookView(
                book.getId(),
                book.getTitle(),
                book.getAuthors() != null ? book.getAuthors() : new ArrayList<>(),
                book.getAuthor(),
                book.getGenre(),
                book.getCategories() != null ? book.getCategories() : new ArrayList<>(),
                book.getTags() != null ? book.getTags() : new ArrayList<>(),
                book.getThumbnail(),
                book.getYear(),
                book.getAvgRating() != null ? book.getAvgRating() : 0.0,
                book.getLikesCount() != null ? book.getLikesCount() : 0,
                book.getReadCount() != null ? book.getReadCount() : 0,
                book.getGoogleTrendingBoost() != null ? book.getGoogleTrendingBoost() : 0.0,
                book.getSource() != null ? book.getSource() : BookSource.LOCAL,
                book.getGoogleId(),
                Math.round(calculatedScore * 100.0) / 100.0
        );
    }
}

