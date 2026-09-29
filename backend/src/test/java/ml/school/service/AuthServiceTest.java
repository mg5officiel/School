package ml.school.service;

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
        UtilisateurRepository users = mock(UtilisateurRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        JwtService jwt = mock(JwtService.class);
        RefreshTokenService refresh = mock(RefreshTokenService.class);

        Utilisateur user = new Utilisateur();
        user.setUsername("admin");
        user.setPassword("hashed");
        user.setRole(Role.ADMIN);
        user.setActif(true);

        when(users.findByUsername("admin")).thenReturn(Optional.of(user));
        when(encoder.matches("secret", "hashed")).thenReturn(true);
        when(jwt.accessToken("admin", "ADMIN", 900)).thenReturn("access");
        when(refresh.create(user, 7)).thenReturn("refresh");

        AuthService service = new AuthService(users, encoder, jwt, refresh);
        AuthResponse response = service.login(new LoginRequest("admin", "secret"));

        assertEquals("access", response.accessToken());
        assertEquals("refresh", response.refreshToken());
        assertEquals(900, response.expiresInSeconds());
        verify(refresh).create(user, 7);
    }

    @Test
    void loginRejectsInactiveUser() {
        UtilisateurRepository users = mock(UtilisateurRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        JwtService jwt = mock(JwtService.class);
        RefreshTokenService refresh = mock(RefreshTokenService.class);

        Utilisateur user = new Utilisateur();
        user.setUsername("admin");
        user.setActif(false);

        when(users.findByUsername("admin")).thenReturn(Optional.of(user));

        AuthService service = new AuthService(users, encoder, jwt, refresh);

        assertThrows(IllegalArgumentException.class,
                () -> service.login(new LoginRequest("admin", "secret")));
        verifyNoInteractions(encoder, jwt, refresh);
    }
}
