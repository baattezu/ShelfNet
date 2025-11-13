package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.UserProfile;
import nochill.shelfnet.data.repo.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service for user profile operations.
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;

    /** Register (persist) a new user profile. */
    public UserProfile registerUser(UserProfile user) {
        return userProfileRepository.save(user);
    }

    /** Fetch user by id or return null. */
    public UserProfile getUserById(String id) {
        Optional<UserProfile> opt = userProfileRepository.findById(id);
        return opt.orElse(null);
    }
}

