package ml.school.service;
import ml.school.entity.*; import ml.school.repository.*; import org.springframework.stereotype.Service; import java.nio.charset.StandardCharsets; import java.security.MessageDigest; import java.time.Instant; import java.util.*; 
@Service public class RefreshTokenService {
 private final RefreshTokenRepository repo; private final UtilisateurRepository users;
 public RefreshTokenService(RefreshTokenRepository repo,UtilisateurRepository users){this.repo=repo;this.users=users;}
 public String create(Utilisateur u,long days){String raw=UUID.randomUUID()+"."+UUID.randomUUID(); RefreshToken t=new RefreshToken(); t.setTokenHash(hash(raw)); t.setUtilisateur(u); t.setExpiresAt(Instant.now().plusSeconds(days*86400)); t.setRevoked(false); repo.save(t); return raw;}
 public Utilisateur validate(String raw){return repo.findByTokenHash(hash(raw)).filter(t->!t.isRevoked()&&t.getExpiresAt().isAfter(Instant.now())).map(RefreshToken::getUtilisateur).orElseThrow(()->new IllegalArgumentException("Refresh token invalide ou expiré"));}
 public void revoke(String raw){repo.findByTokenHash(hash(raw)).ifPresent(t->{t.setRevoked(true);repo.save(t);});}
 private String hash(String s){try{byte[] b=MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8)); return Base64.getUrlEncoder().withoutPadding().encodeToString(b);}catch(Exception e){throw new IllegalStateException(e);}}
}