package nochill.shelfnet.data.dto;

import nochill.shelfnet.data.model.Book;

/**
 * Recommendation result item with score and reason.
 */
public record RecommendationItem(
        Book book,
        Double score,
        String reason
) {}

