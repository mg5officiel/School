package ml.school.service;

import ml.school.audit.AuditService;
import ml.school.dto.auth.AuthResponse;
import ml.school.dto.auth.LoginRequest;
import ml.school.entity.Utilisateur;
import ml.school.repository.UtilisateurRepository;
import ml.school.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final long ACCESS_TOKEN_SECONDS = 15 * 60L;
    private static final long REFRESH_TOKEN_DAYS = 7L;

    private final UtilisateurRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final RefreshTokenService refresh;
    private final AuditService audit;

    public AuthService(
            UtilisateurRepository users,
            PasswordEncoder encoder,
            JwtService jwt,
            RefreshTokenService refresh,
            AuditService audit) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.refresh = refresh;
        this.audit = audit;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Utilisateur user = users.findByUsername(request.username())
                .filter(Utilisateur::isActif)
                .orElseThrow(() -> new IllegalArgumentException("Identifiants invalides"));

        if (!encoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Identifiants invalides");
        }

        audit.log("LOGIN", user.getUsername(), "Utilisateur", user.getId().toString());
        return tokens(user);
    }

    @Transactional
    public AuthResponse refresh(String rawToken) {
        Utilisateur user = refresh.validate(rawToken);
        refresh.revoke(rawToken);
        audit.log("REFRESH_TOKEN", user.getUsername(), "Utilisateur", user.getId().toString());
        return tokens(user);
    }

    @Transactional
    public void logout(String rawToken) {
        refresh.revoke(rawToken);
        audit.log("LOGOUT", null, "RefreshToken", "Révocation du refresh token");
    }

    private AuthResponse tokens(Utilisateur user) {
        return new AuthResponse(
                jwt.accessToken(
                        user.getUsername(),
                        user.getRole().name(),
                        ACCESS_TOKEN_SECONDS),
                refresh.create(user, REFRESH_TOKEN_DAYS),
                ACCESS_TOKEN_SECONDS);
    }
}
