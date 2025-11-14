package nochill.shelfnet.data.util;

import nochill.shelfnet.data.dto.PagedResponse;
import java.util.Collections;
import java.util.List;

/** Utility for manual in-memory pagination. */
public final class PaginationUtils {
    private PaginationUtils() {}

    public static <T> PagedResponse<T> paginate(List<T> all, int page, int size) {
        if (size <= 0) size = 20;
        if (page < 0) page = 0;
        long total = all == null ? 0 : all.size();
        int totalPages = size == 0 ? 0 : (int) ((total + size - 1) / size);
        if (all == null || all.isEmpty()) {
            return new PagedResponse<>(List.of(), page, size, 0, 0);
        }
        int from = page * size;
        if (from >= all.size()) {
            return new PagedResponse<>(Collections.emptyList(), page, size, total, totalPages);
        }
        int to = Math.min(from + size, all.size());
        List<T> slice = all.subList(from, to);
        return new PagedResponse<>(slice, page, size, total, totalPages);
    }
}

