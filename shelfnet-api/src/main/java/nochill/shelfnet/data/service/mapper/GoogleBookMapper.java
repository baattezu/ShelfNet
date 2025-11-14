package nochill.shelfnet.data.service.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import nochill.shelfnet.data.dto.GoogleVolumeDto;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.model.BookSource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Mapper utilities for Google Books volume objects.
 */
@Component
public class GoogleBookMapper {

    /** Parse a Google Books volume JSON node into GoogleVolumeDto. */
    public GoogleVolumeDto parseJson(JsonNode volumeNode) {
        if (volumeNode == null) return null;
        String id = text(volumeNode, "id");
        JsonNode info = volumeNode.get("volumeInfo");
        if (info == null) return new GoogleVolumeDto(id, null, List.of(), List.of(), null, null, null, null, null, null);
        String title = text(info, "title");
        List<String> authors = array(info.get("authors"));
        List<String> categories = array(info.get("categories"));
        String description = text(info, "description");
        String language = text(info, "language");
        Integer publishedYear = null;
        String publishedDate = text(info, "publishedDate");
        if (publishedDate != null && publishedDate.length() >= 4) {
            try { publishedYear = Integer.parseInt(publishedDate.substring(0,4)); } catch (NumberFormatException ignored) {}
        }
        Double averageRating = doubleVal(info, "averageRating");
        Integer ratingsCount = intVal(info, "ratingsCount");
        String thumbnail = null;
        JsonNode imageLinks = info.get("imageLinks");
        if (imageLinks != null) {
            thumbnail = text(imageLinks, "thumbnail");
            if (thumbnail == null) thumbnail = text(imageLinks, "smallThumbnail");
        }
        return new GoogleVolumeDto(id, title, authors, categories, description, thumbnail, publishedYear, averageRating, ratingsCount, language);
    }

    /** Convert GoogleVolumeDto to internal Book model. */
    public Book fromGoogleVolume(GoogleVolumeDto dto) {
        if (dto == null) return null;
        return Book.builder()
                .title(dto.title())
                .authors(dto.authors() != null ? dto.authors() : new ArrayList<>())
                .author(dto.authors() != null && !dto.authors().isEmpty() ? dto.authors().get(0) : null)
                .categories(dto.categories() != null ? dto.categories() : new ArrayList<>())
                .genre(dto.categories() != null && !dto.categories().isEmpty() ? dto.categories().get(0) : null)
                .thumbnail(dto.thumbnail())
                .year(dto.publishedYear())
                .publisher(null) // publisher can be added if needed
                .googleId(dto.id())
                .source(BookSource.GOOGLE)
                .avgRating(dto.averageRating() != null ? dto.averageRating() : 0.0)
                .tags(new ArrayList<>())
                .build();
    }

    private String text(JsonNode node, String field) { return node != null && node.get(field) != null && !node.get(field).isNull() ? node.get(field).asText() : null; }
    private Double doubleVal(JsonNode node, String field) { return node != null && node.get(field) != null && node.get(field).isNumber() ? node.get(field).asDouble() : null; }
    private Integer intVal(JsonNode node, String field) { return node != null && node.get(field) != null && node.get(field).isNumber() ? node.get(field).asInt() : null; }
    private List<String> array(JsonNode arrNode) {
        if (arrNode == null || !arrNode.isArray()) return List.of();
        return StreamSupport.stream(arrNode.spliterator(), false)
                .map(JsonNode::asText)
                .collect(Collectors.toList());
    }
}

