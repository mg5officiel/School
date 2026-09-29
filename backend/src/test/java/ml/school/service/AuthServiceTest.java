package ml.school.service;

import ml.school.audit.AuditService;
import ml.school.dto.auth.AuthResponse;
import ml.school.dto.auth.LoginRequest;
import ml.school.entity.Role;
import ml.school.entity.Utilisateur;
import ml.school.repository.UtilisateurRepository;
import ml.school.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    @Test
    void loginReturnsTokensForValidCredentials() {
        var users = mock(UtilisateurRepository.class);
        var encoder = mock(PasswordEncoder.class);
        var jwt = mock(JwtService.class);
        var refresh = mock(RefreshTokenService.class);
        var audit = mock(AuditService.class);
        var user = new Utilisateur();
        user.setUsername("admin");
        user.setPassword("hashed");
        user.setRole(Role.ADMIN);
        user.setActif(true);
        when(users.findByUsername("admin")).thenReturn(Optional.of(user));
        when(encoder.matches("secret", "hashed")).thenReturn(true);
        when(jwt.accessToken("admin", "ADMIN", 900)).thenReturn("access");
        when(refresh.create(user, 7)).thenReturn("refresh");
        var service = new AuthService(users, encoder, jwt, refresh, audit);
        AuthResponse response = service.login(new LoginRequest("admin", "secret"));
        assertEquals("access", response.accessToken());
        assertEquals("refresh", response.refreshToken());
        assertEquals(900, response.expiresInSeconds());
        verify(refresh).create(user, 7);
    }

    @Test
    void loginRejectsInactiveUser() {
        var users = mock(UtilisateurRepository.class);
        var encoder = mock(PasswordEncoder.class);
        var jwt = mock(JwtService.class);
        var refresh = mock(RefreshTokenService.class);
        var audit = mock(AuditService.class);
        var user = new Utilisateur();
        user.setUsername("admin");
        user.setActif(false);
        when(users.findByUsername("admin")).thenReturn(Optional.of(user));
        var service = new AuthService(users, encoder, jwt, refresh, audit);
        assertThrows(IllegalArgumentException.class, () -> service.login(new LoginRequest("admin", "secret")));
        verifyNoInteractions(encoder, jwt, refresh);
    }
}
