package nochill.shelfnet.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nochill.shelfnet.data.dto.FeedResponse;
import nochill.shelfnet.data.service.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FeedController {

    private final FeedService feedService;

    @GetMapping("/home")
    public ResponseEntity<FeedResponse> getHomeFeed(@AuthenticationPrincipal User principal) {
        if (principal == null || principal.getUsername() == null || principal.getUsername().isBlank()) {
            log.warn("Rejecting feed request due to missing authenticated principal");
            return ResponseEntity.badRequest().body(FeedResponse.empty());
        }

        String userId = principal.getUsername();
        log.info("Building home feed for userId={}", userId);

        try {
            FeedResponse response = feedService.buildHomeFeed(userId);
            log.debug("Home feed built for userId={} with trending={} popular={} communities={}",
                    userId,
                    response.trendingBooks().size(),
                    response.popularOnShelfNet().size(),
                    response.communityPicks().size());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid feed request for userId={}: {}", userId, ex.getMessage());
            return ResponseEntity.badRequest().body(FeedResponse.empty());
        } catch (Exception ex) {
            log.error("Failed to build home feed for userId={}", userId, ex);
            return ResponseEntity.internalServerError().body(FeedResponse.empty());
        }
    }
}
