package nochill.shelfnet.data.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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
    private String userId;
}

