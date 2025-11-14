package nochill.shelfnet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.dto.PagedResponse;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.GoogleBooksIntegrationService;
import nochill.shelfnet.data.service.mapper.GoogleBookMapper;
import nochill.shelfnet.data.util.PaginationUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@Data
@Builder
@RequestMapping("/google-books")
@PreAuthorize("isAuthenticated()")
@Tag(name = "GoogleBooks", description = "Google Books integration endpoints")
public class GoogleBooksController {

    private final GoogleBooksIntegrationService integrationService;
    private final GoogleBookMapper mapper;

    @Operation(summary = "Search Google Books volumes")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Google search results", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<Book>> search(@RequestParam String query,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size) {
        var resp = integrationService.searchGoogleBooks(query);
        var mapped = resp.items().stream().map(mapper::fromGoogleVolume).toList();
        return ResponseEntity.ok(PaginationUtils.paginate(mapped, page, size));
    }

    @Operation(summary = "Get single Google Books volume mapped to internal Book")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mapped Book", content = @Content(schema = @Schema(implementation = Book.class))),
            @ApiResponse(responseCode = "404", description = "Volume not found", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/{googleId}")
    public ResponseEntity<Book> getById(@PathVariable String googleId) {
        var dto = integrationService.getGoogleBookById(googleId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mapper.fromGoogleVolume(dto));
    }
}
