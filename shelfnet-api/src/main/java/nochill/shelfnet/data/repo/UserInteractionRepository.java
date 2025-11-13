package nochill.shelfnet.data.repo;

import nochill.shelfnet.data.model.UserInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Mongo repository for user interactions.
 */
@Repository
public interface UserInteractionRepository extends MongoRepository<UserInteraction, String> {
    /** Find all interactions of a given user. */
    List<UserInteraction> findByUserId(String userId);
    /** Find interactions for a user and book. */
    List<UserInteraction> findByUserIdAndBookId(String userId, String bookId);
}

