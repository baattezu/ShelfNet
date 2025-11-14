package nochill.shelfnet.data.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import nochill.shelfnet.data.model.UserProfile;

/**
 * Authentication response with JWT token and user id.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    /** JWT token string. Exposed as 'token' field in JSON per spec. */
    @JsonProperty("token")
    private String jwtToken;
    @JsonProperty("user")
    private UserProfile userProfile;
}

