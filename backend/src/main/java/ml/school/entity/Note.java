package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="notes") @Getter @Setter @NoArgsConstructor
public class Note {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private java.math.BigDecimal valeur;
 @ManyToOne(optional=false) private Eleve eleve;
 @ManyToOne(optional=false) private Evaluation evaluation;
}