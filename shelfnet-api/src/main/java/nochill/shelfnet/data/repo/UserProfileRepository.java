package nochill.shelfnet.data.repo;

import nochill.shelfnet.data.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Mongo repository for user profiles.
 */
@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    // Additional query methods can be declared here.
    Optional<UserProfile> findByEmail(String email);
}
