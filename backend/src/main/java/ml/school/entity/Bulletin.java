package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="bulletins") @Getter @Setter @NoArgsConstructor
public class Bulletin {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Eleve eleve;
 @ManyToOne(optional=false) private Classe classe;
 @ManyToOne(optional=false) private AnneeScolaire anneeScolaire;
 @Column(nullable=false) private java.math.BigDecimal moyenne;
 @Column(nullable=false) private boolean annuel;
}