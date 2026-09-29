package ml.school.entity;
import jakarta.persistence.*; import lombok.*; import java.time.Instant;
@Entity @Table(name="audit_logs") @Getter @Setter @NoArgsConstructor
public class AuditLog {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private Instant dateHeure;
 @Column(nullable=false,length=100) private String action;
 @Column(length=100) private String username;
 @Column(length=100) private String cible;
 @Column(columnDefinition="text") private String details;
}