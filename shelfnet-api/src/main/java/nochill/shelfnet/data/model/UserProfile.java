package nochill.shelfnet.data.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * User profile stored in MongoDB.
 */
@Document(collection = "user_profiles")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {
    /** MongoDB document id (UUID as string). */
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String name;

    /** Unique email for authentication */
    @Indexed(unique = true)
    private String email;

    /** BCrypt password hash (never exposed). */
    @JsonIgnore
    private String passwordHash;

    @Builder.Default
    private List<String> favoriteGenres = new ArrayList<>();

    @Builder.Default
    private List<String> favoriteAuthors = new ArrayList<>();

    /** Reading level (free-form string). Example: beginner, intermediate, advanced. */
    private String readingLevel;
}
