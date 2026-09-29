package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="evaluations") @Getter @Setter @NoArgsConstructor
public class Evaluation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=80) private String libelle;
 @ManyToOne(optional=false) private Matiere matiere;
 @ManyToOne(optional=false) private Classe classe;
 @ManyToOne(optional=false) private AnneeScolaire anneeScolaire;
}