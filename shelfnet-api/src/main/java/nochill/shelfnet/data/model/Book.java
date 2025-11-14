package nochill.shelfnet.data.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Book entity stored in MongoDB. Supports both local and Google Books sourced data.
 */
@Document(collection = "books")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Book {
    /** Document id (UUID string). */
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    /** Title of the book. */
    private String title;

    /** Single author legacy field kept for backward compatibility. */
    private String author;

    /** List of authors (preferred). */
    @Builder.Default
    private List<String> authors = new ArrayList<>();

    /** Primary genre. */
    private String genre;

    /** Publisher name (if available). */
    private String publisher;

    /** Publication year (if known). */
    private Integer year;

    /** Categories (Google Books style). */
    @Builder.Default
    private List<String> categories = new ArrayList<>();

    /** Free-form tags for local enrichment. */
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    /** Difficulty level label (e.g. easy, medium, hard). */
    private String difficulty;

    /** Thumbnail image URL. */
    private String thumbnail;

    /** Source of the book data (LOCAL or GOOGLE). */
    @Builder.Default
    private BookSource source = BookSource.LOCAL;

    /** Google volume id if sourced from Google Books. */
    private String googleId;

    /** Average rating aggregated from user interactions. */
    @Builder.Default
    private Double avgRating = 0.0;

    /** Number of users who marked as favorite (likes). */
    @Builder.Default
    private Integer likesCount = 0;

    /** Number of users who marked as READ. */
    @Builder.Default
    private Integer readCount = 0;

    /** Boost from Google trending (0..1). */
    @Builder.Default
    private Double googleTrendingBoost = 0.0;
}
