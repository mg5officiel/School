package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="enseignants") @Getter @Setter @NoArgsConstructor
public class Enseignant {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=50) private String prenom;
 @Column(nullable=false,length=50) private String nom;
 @Column(length=30) private String telephone;
}