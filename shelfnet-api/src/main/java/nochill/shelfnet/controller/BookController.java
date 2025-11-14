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
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.BookService;
import nochill.shelfnet.data.dto.PagedResponse;
import nochill.shelfnet.data.util.PaginationUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Data
@Builder
@RequestMapping("/books")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Books", description = "Operations with local and unified book model")
public class BookController {

    private final BookService bookService;

    /** Get all books. */
    @Operation(summary = "Get all books")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of books returned", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping
    public ResponseEntity<PagedResponse<Book>> getAll(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "20") int size) {
        var all = bookService.getAllBooks();
        return ResponseEntity.ok(PaginationUtils.paginate(all, page, size));
    }

    /** Add a new book. */
    @Operation(summary = "Add a new local book")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book created", content = @Content(schema = @Schema(implementation = Book.class))),
            @ApiResponse(responseCode = "400", description = "Validation error", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @PostMapping
    public ResponseEntity<Book> add(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    /** Search books by query. */
    @Operation(summary = "Search local books by query")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Search results", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<Book>> search(@RequestParam String query,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size) {
        var results = bookService.searchBooks(query);
        return ResponseEntity.ok(PaginationUtils.paginate(results, page, size));
    }

    /** Popular books computed from interactions and ratings. */
    @Operation(summary = "Get popular books by composite metrics")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Popular books list", content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @GetMapping("/popular")
    public ResponseEntity<PagedResponse<Book>> popular(@RequestParam(defaultValue = "10") int limit,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        var list = bookService.getPopularBooks(limit); // limit applies before pagination
        return ResponseEntity.ok(PaginationUtils.paginate(list, page, size));
    }
}
