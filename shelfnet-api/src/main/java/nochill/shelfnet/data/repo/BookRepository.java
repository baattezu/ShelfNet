package nochill.shelfnet.data.repo;

import nochill.shelfnet.data.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for books.
 */
@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    // Custom search queries could be added if needed.
}

