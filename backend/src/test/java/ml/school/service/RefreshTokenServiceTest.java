package ml.school.service;

import ml.school.entity.RefreshToken;
import ml.school.entity.Utilisateur;
import ml.school.repository.RefreshTokenRepository;
import ml.school.repository.UtilisateurRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RefreshTokenServiceTest {

    @Test
    void createStoresOnlyHashAndSevenDayExpiration() {
        RefreshTokenRepository repository = mock(RefreshTokenRepository.class);
        UtilisateurRepository users = mock(UtilisateurRepository.class);
        RefreshTokenService service = new RefreshTokenService(repository, users);

        Utilisateur user = new Utilisateur();
        String raw = service.create(user, 7);

        assertNotNull(raw);
        assertTrue(raw.contains("."));
        assertNotNull(raw.split("\\.")[0]);

        var captor = org.mockito.ArgumentCaptor.forClass(RefreshToken.class);
        verify(repository).save(captor.capture());

        RefreshToken stored = captor.getValue();
        assertNotNull(stored.getTokenHash());
        assertNotEquals(raw, stored.getTokenHash());
        assertSame(user, stored.getUtilisateur());
        assertFalse(stored.isRevoked());

        long seconds = stored.getExpiresAt().getEpochSecond() - Instant.now().getEpochSecond();
        assertTrue(seconds >= 6 * 86400);
        assertTrue(seconds <= 7 * 86400);
    }

    @Test
    void validateReturnsUserForValidToken() {
        RefreshTokenRepository repository = mock(RefreshTokenRepository.class);
        UtilisateurRepository users = mock(UtilisateurRepository.class);
        RefreshTokenService service = new RefreshTokenService(repository, users);

        Utilisateur user = new Utilisateur();
        RefreshToken stored = new RefreshToken();
        stored.setUtilisateur(user);
        stored.setExpiresAt(Instant.now().plusSeconds(3600));
        stored.setRevoked(false);

        String raw = service.create(user, 7);
        String hash = storedHashFromRepository(repository);

        stored.setTokenHash(hash);
        when(repository.findByTokenHash(hash)).thenReturn(Optional.of(stored));

        assertSame(user, service.validate(raw));
    }

    @Test
    void validateRejectsRevokedToken() {
        RefreshTokenRepository repository = mock(RefreshTokenRepository.class);
        UtilisateurRepository users = mock(UtilisateurRepository.class);
        RefreshTokenService service = new RefreshTokenService(repository, users);

        Utilisateur user = new Utilisateur();
        RefreshToken stored = new RefreshToken();
        stored.setUtilisateur(user);
        stored.setExpiresAt(Instant.now().plusSeconds(3600));
        stored.setRevoked(true);

        String raw = "raw-token";
        stored.setTokenHash(hashForTest(raw));
        when(repository.findByTokenHash(stored.getTokenHash())).thenReturn(Optional.of(stored));

        assertThrows(IllegalArgumentException.class, () -> service.validate(raw));
    }

    private static String storedHashFromRepository(RefreshTokenRepository repository) {
        var captor = org.mockito.ArgumentCaptor.forClass(RefreshToken.class);
        verify(repository).save(captor.capture());
        return captor.getValue().getTokenHash();
    }

    private static String hashForTest(String value) {
        try {
            var digest = java.security.MessageDigest.getInstance("SHA-256");
            return java.util.Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(digest.digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
