package nochill.shelfnet.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.BookService;
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
public class BookController {

    private final BookService bookService;

    /** Get all books. */
    @GetMapping
    public ResponseEntity<List<Book>> getAll() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    /** Add a new book. */
    @PostMapping
    public ResponseEntity<Book> add(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    /** Search books by query. */
    @GetMapping("/search")
    public ResponseEntity<List<Book>> search(@RequestParam String query) {
        return ResponseEntity.ok(bookService.searchBooks(query));
    }
}
