package nochill.shelfnet;

import nochill.shelfnet.data.model.Book;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Basic unit tests (no Spring context) to keep build green without requiring MongoDB running.
 */
class ShelfNetApplicationTests {

    @Test
    void bookBuilderWorks() {
        Book book = Book.builder()
                .title("Test Title")
                .author("Author")
                .genre("Genre")
                .publisher("Publisher")
                .year(2024)
                .difficulty("easy")
                .build();
        assertNotNull(book.getId());
        assertEquals("Test Title", book.getTitle());
        assertEquals(2024, book.getYear());
    }
}
