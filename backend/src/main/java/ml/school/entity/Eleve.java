package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="eleves") @Getter @Setter @NoArgsConstructor
public class Eleve {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=50) private String prenom;
 @Column(nullable=false,length=50) private String nom;
 @Column(unique=true,length=30) private String matricule;
 @Column(length=20) private String sexe;
 @Column(length=30) private String telephone;
}