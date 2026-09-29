package ml.school.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JwtServiceTest {

    @Test
    void accessTokenContainsExpectedClaimsAndExpiration() {
        JwtEncoder encoder = mock(JwtEncoder.class);
        Instant before = Instant.now();

        when(encoder.encode(any(JwtEncoderParameters.class)))
                .thenAnswer(invocation -> {
                    var claims = invocation.getArgument(JwtEncoderParameters.class)
                            .getClaims();
                    return Jwt.withTokenValue("access-token")
                            .header("alg", "RS256")
                            .issuer(claims.getIssuer())
                            .subject(claims.getSubject())
                            .issuedAt(claims.getIssuedAt())
                            .expiresAt(claims.getExpiresAt())
                            .claim("role", claims.getClaimAsString("role"))
                            .build();
                });

        JwtService service = new JwtService(encoder);

        assertEquals("access-token", service.accessToken("admin", "ADMIN", 900));

        var captor = org.mockito.ArgumentCaptor.forClass(JwtEncoderParameters.class);
        verify(encoder).encode(captor.capture());

        var claims = captor.getValue().getClaims();
        assertEquals("ml.school", claims.getIssuer());
        assertEquals("admin", claims.getSubject());
        assertEquals("ADMIN", claims.getClaimAsString("role"));
        assertNotNull(claims.getIssuedAt());
        assertNotNull(claims.getExpiresAt());

        long lifetime = claims.getExpiresAt().getEpochSecond()
                - claims.getIssuedAt().getEpochSecond();

        assertEquals(900, lifetime);
        assertFalse(claims.getExpiresAt().isBefore(before));
    }
}
