package ml.school.security;
import org.springframework.security.oauth2.jwt.*; import org.springframework.stereotype.Service; import java.time.Instant; import java.util.Map;
@Service public class JwtService {
 private final JwtEncoder encoder;
 public JwtService(JwtEncoder encoder){this.encoder=encoder;}
 public String accessToken(String username,String role,long seconds){
  Instant now=Instant.now(); var claims=JwtClaimsSet.builder().issuer("ml.school").subject(username).issuedAt(now).expiresAt(now.plusSeconds(seconds)).claim("role",role).build();
  return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
 }
}