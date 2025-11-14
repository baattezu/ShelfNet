package nochill.shelfnet.data.dto;

import java.util.List;

/**
 * DTO representing a Google Books volume (simplified).
 */
public record GoogleVolumeDto(
        String id,
        String title,
        List<String> authors,
        List<String> categories,
        String description,
        String thumbnail,
        Integer publishedYear,
        Double averageRating,
        Integer ratingsCount,
        String language
) {}

