package nochill.shelfnet.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.UserInteraction;
import nochill.shelfnet.data.service.InteractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for user interactions with books.
 */
@RestController
@AllArgsConstructor
@Data
@Builder
@RequestMapping("/interactions")
@PreAuthorize("isAuthenticated()")
public class InteractionController {

    private final InteractionService interactionService;

    /** Add a new interaction. */
    @PostMapping
    public ResponseEntity<UserInteraction> add(@RequestBody UserInteraction interaction) {
        return ResponseEntity.ok(interactionService.addInteraction(interaction));
    }

    /** Get interactions by user id. */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserInteraction>> byUser(@PathVariable String userId) {
        return ResponseEntity.ok(interactionService.getInteractionsByUser(userId));
    }
}
