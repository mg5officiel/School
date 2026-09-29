package ml.school.entity;
import jakarta.persistence.*; import lombok.*; import java.time.Instant;
@Entity @Table(name="refresh_tokens") @Getter @Setter @NoArgsConstructor
public class RefreshToken {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true,length=128) private String tokenHash;
 @ManyToOne(optional=false) private Utilisateur utilisateur;
 @Column(nullable=false) private Instant expiresAt;
 @Column(nullable=false) private boolean revoked;
}