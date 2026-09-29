package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="paiements") @Getter @Setter @NoArgsConstructor
public class Paiement {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Eleve eleve;
 @ManyToOne(optional=false) private AnneeScolaire anneeScolaire;
 @Column(nullable=false,precision=12,scale=2) private java.math.BigDecimal montant;
 @Column(nullable=false) private java.time.LocalDate datePaiement;
 @Column(nullable=false,length=80) private String reference;
}