package nochill.shelfnet.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.RecommendationService;
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
public class RecommendationController {

    private final RecommendationService recommendationService;

    /** Get recommendations for a user. */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Book>> recommend(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId));
    }
}
