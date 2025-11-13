package nochill.shelfnet.controller;

import lombok.RequiredArgsConstructor;
import nochill.shelfnet.data.dto.AuthRequest;
import nochill.shelfnet.data.dto.AuthResponse;
import nochill.shelfnet.data.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller providing registration and login endpoints.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Register new user and return JWT. */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /** Login existing user and return JWT. */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
