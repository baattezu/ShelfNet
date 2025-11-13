package nochill.shelfnet.controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import nochill.shelfnet.data.model.UserProfile;
import nochill.shelfnet.data.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for user profiles.
 */
@RestController
@AllArgsConstructor
@Data
@Builder
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    /** Register a new user. */
    @PostMapping
    public ResponseEntity<UserProfile> register(@RequestBody UserProfile user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    /** Get user by id. */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable String id) {
        UserProfile profile = userService.getUserById(id);
        return profile == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(profile);
    }
}
