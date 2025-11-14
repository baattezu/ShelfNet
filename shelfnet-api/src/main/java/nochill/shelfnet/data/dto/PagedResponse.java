package nochill.shelfnet.data.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Generic paginated response wrapper.
 */
@Schema(description = "Generic paginated response wrapper")
public record PagedResponse<T>(
        @Schema(description = "Items on the current page") List<T> items,
        @Schema(description = "Zero-based page index") int page,
        @Schema(description = "Requested page size") int size,
        @Schema(description = "Total number of items (unpaged)") long total,
        @Schema(description = "Total number of pages") int totalPages
) {}

