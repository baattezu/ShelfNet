package nochill.shelfnet.data.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

/**
 * User interaction with a book (e.g., read status, rating).
 */
@Document(collection = "user_interactions")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInteraction {
    /** Document id (UUID string). */
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    /** Id of the user profile. */
    private String userId;
    /** Id of the book. */
    private String bookId;

    /** Nature of the interaction. */
    private InteractionType type;

    /** Optional numeric value (e.g. rating score). */
    private Double value;
}
