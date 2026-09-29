package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="annees_scolaires") @Getter @Setter @NoArgsConstructor
public class AnneeScolaire {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true,length=9) private String libelle;
 @Column(nullable=false) private boolean active;
}