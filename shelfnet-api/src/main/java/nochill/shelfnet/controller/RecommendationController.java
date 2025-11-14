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
import nochill.shelfnet.data.dto.RecommendationItem;
import nochill.shelfnet.data.dto.PagedResponse;
import nochill.shelfnet.data.service.RecommendationService;
import nochill.shelfnet.data.util.PaginationUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller providing recommendations.
 */
@RestController
@AllArgsConstructor
@Data
@Builder
@RequestMapping("/recommendations")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Recommendations", description = "Personalized book recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    /** Get recommendations for a user. */
    @Operation(summary = "Get recommendation list for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recommendations returned", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/{userId}")
    public ResponseEntity<PagedResponse<RecommendationItem>> recommend(@PathVariable String userId,
                                                                        @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "20") int size) {
        var list = recommendationService.getRecommendations(userId);
        return ResponseEntity.ok(PaginationUtils.paginate(list, page, size));
    }
}
