package nochill.shelfnet.data.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.UserInteraction;
import nochill.shelfnet.data.repo.UserInteractionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for user-book interactions.
 */
@Service
@Data
@Builder
@AllArgsConstructor
public class InteractionService {

    private final UserInteractionRepository interactionRepository;

    /** Persist new interaction. */
    public UserInteraction addInteraction(UserInteraction interaction) {
        return interactionRepository.save(interaction);
    }

    /** Get interactions for a specific user. */
    public List<UserInteraction> getInteractionsByUser(String userId) {
        return interactionRepository.findByUserId(userId);
    }
}

