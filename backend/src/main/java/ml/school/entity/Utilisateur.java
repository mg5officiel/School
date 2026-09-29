package ml.school.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="utilisateurs") @Getter @Setter @NoArgsConstructor
public class Utilisateur {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true,length=50) private String username;
 @Column(nullable=false,unique=true,length=120) private String email;
 @Column(nullable=false) private String password;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private Role role;
 @Column(nullable=false) private boolean actif=true;
}