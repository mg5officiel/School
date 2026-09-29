package ml.school.service;
import ml.school.dto.auth.*; import ml.school.entity.*; import ml.school.repository.*; import ml.school.security.JwtService; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service;
@Service public class AuthService {
 private final UtilisateurRepository users; private final PasswordEncoder encoder; private final JwtService jwt; private final RefreshTokenService refresh;
 public AuthService(UtilisateurRepository u,PasswordEncoder e,JwtService j,RefreshTokenService r){users=u;encoder=e;jwt=j;refresh=r;}
 public AuthResponse login(LoginRequest r){Utilisateur u=users.findByUsername(r.username()).filter(Utilisateur::isActif).orElseThrow(()->new IllegalArgumentException("Identifiants invalides")); if(!encoder.matches(r.password(),u.getPassword())) throw new IllegalArgumentException("Identifiants invalides"); return tokens(u);}
 public AuthResponse refresh(String raw){return tokens(refresh.validate(raw));}
 public void logout(String raw){refresh.revoke(raw);}
 private AuthResponse tokens(Utilisateur u){long a=900; return new AuthResponse(jwt.accessToken(u.getUsername(),u.getRole().name(),a),refresh.create(u,7),a);}
}