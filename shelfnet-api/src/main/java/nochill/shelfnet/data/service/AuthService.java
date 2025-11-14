package nochill.shelfnet.data.service;

import lombok.RequiredArgsConstructor;
import nochill.shelfnet.data.dto.AuthRequest;
import nochill.shelfnet.data.dto.AuthResponse;
import nochill.shelfnet.data.model.UserProfile;
import nochill.shelfnet.data.repo.UserProfileRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service handling registration and login operations.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserProfileRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /** Register a new user and return JWT. */
    public AuthResponse register(AuthRequest request) {
        userRepo.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already registered");
        });
        UserProfile user = UserProfile.builder()
                .email(request.getEmail())
                .name(request.getName()) // default name; could be extended
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .readingLevel("beginner")
                .build();
        user = userRepo.save(user);
        String token = jwtService.generateToken(user);
        return AuthResponse.builder().jwtToken(token).userProfile(user).build();
    }

    /** Authenticate user by email & password and return JWT. */
    public AuthResponse login(AuthRequest request) {
        UserProfile user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtService.generateToken(user);
        return AuthResponse.builder().jwtToken(token).userProfile(user).build();
    }
}

