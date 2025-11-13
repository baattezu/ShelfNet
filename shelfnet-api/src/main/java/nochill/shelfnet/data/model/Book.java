package nochill.shelfnet.data.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Book entity stored in MongoDB.
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

    private String title;
    private String author;
    private String genre;
    private String publisher;
    private Integer year;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    /** Difficulty level label (e.g. easy, medium, hard). */
    private String difficulty;
}

