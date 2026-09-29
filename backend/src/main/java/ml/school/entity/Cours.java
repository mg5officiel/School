package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="cours") @Getter @Setter @NoArgsConstructor
public class Cours {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Classe classe;
 @ManyToOne(optional=false) private Matiere matiere;
 @ManyToOne(optional=false) private Enseignant enseignant;
}