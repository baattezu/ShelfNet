package nochill.shelfnet.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.UserInteraction;
import nochill.shelfnet.data.service.InteractionService;
import nochill.shelfnet.data.dto.PagedResponse;
import nochill.shelfnet.data.util.PaginationUtils;
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
@PreAuthorize("isAuthenticated()")
@Tag(name = "Interactions", description = "User interactions with books: favorite, read, rating, review")
public class InteractionController {

    private final InteractionService interactionService;

    /** Add a new interaction for a book. */
    @Operation(summary = "Add interaction for a book")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Interaction saved", content = @Content(schema = @Schema(implementation = UserInteraction.class))),
            @ApiResponse(responseCode = "400", description = "Invalid payload", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @PostMapping("/books/{id}/interactions")
    public ResponseEntity<UserInteraction> add(@PathVariable("id") String bookId, @RequestBody UserInteraction interaction) {
        return ResponseEntity.ok(interactionService.addInteraction(bookId, interaction));
    }

    /** Get interactions by user id. */
    @Operation(summary = "Get all interactions for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List returned", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/users/{userId}/interactions")
    public ResponseEntity<PagedResponse<UserInteraction>> byUser(@PathVariable String userId,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size) {
        var list = interactionService.getInteractionsByUser(userId);
        return ResponseEntity.ok(PaginationUtils.paginate(list, page, size));
    }

    /** Get interactions for a book. */
    @Operation(summary = "Get all interactions for a book")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List returned", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/books/{id}/interactions")
    public ResponseEntity<PagedResponse<UserInteraction>> byBook(@PathVariable("id") String bookId,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size) {
        var list = interactionService.getInteractionsByBook(bookId);
        return ResponseEntity.ok(PaginationUtils.paginate(list, page, size));
    }
}
