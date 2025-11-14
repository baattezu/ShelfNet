package nochill.shelfnet.data.dto;

import java.util.List;

/**
 * Search response wrapper for Google Books volumes.
 */
public record GoogleVolumeSearchResponse(
        Integer totalItems,
        List<GoogleVolumeDto> items
) {}

