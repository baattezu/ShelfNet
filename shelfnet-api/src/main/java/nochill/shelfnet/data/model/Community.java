package nochill.shelfnet.data.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Community document that groups readers around shared interests and featured books.
 */
@Document(collection = "communities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Community {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String name;
    private String description;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<String> memberIds = new ArrayList<>();

    /**
     * Books the community currently highlights or promotes.
     */
    @Builder.Default
    private List<String> featuredBookIds = new ArrayList<>();
}

