package nochill.shelfnet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.dto.PagedResponse;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.SearchService;
import nochill.shelfnet.data.util.PaginationUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Data
@Builder
@RequestMapping("/search")
@PreAuthorize("isAuthenticated()")
@Tag(name = "UnifiedSearch", description = "Unified search across local and Google Books")
public class SearchController {

    private final SearchService searchService;

    @Operation(summary = "Unified search combining local MongoDB and Google Books results")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Unified search result list", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/unified")
    public ResponseEntity<PagedResponse<Book>> unified(@RequestParam(required = false) String query,
                                              @RequestParam(required = false) String genre,
                                              @RequestParam(required = false) Integer limit,
                                              @RequestParam(defaultValue = "ru") String language,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        var results = searchService.unifiedSearch(query, genre, limit, language);
        return ResponseEntity.ok(PaginationUtils.paginate(results, page, size));
    }
}
