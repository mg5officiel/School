package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="matieres") @Getter @Setter @NoArgsConstructor
public class Matiere {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=80) private String nom;
 @Column(length=20) private String coefficient;
}