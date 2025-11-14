package nochill.shelfnet.data.repo;

import nochill.shelfnet.data.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for community discovery features.
 */
@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findByMemberIdsContaining(String userId);
}
