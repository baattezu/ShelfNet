package nochill.shelfnet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Tag(name = "Auth", description = "Authentication endpoints (login, register, token refresh)")
public class AuthController {

    private final AuthService authService;

    /** Register new user and return JWT. */
    @Operation(summary = "Register new user profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User registered", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /** Login existing user and return JWT. */
    @Operation(summary = "Authenticate user and return JWT")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authenticated", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
