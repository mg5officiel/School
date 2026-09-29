package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="emplois_du_temps") @Getter @Setter @NoArgsConstructor
public class EmploiDuTemps {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Classe classe;
 @ManyToOne(optional=false) private Cours cours;
 @Column(nullable=false,length=15) private String jour;
 @Column(nullable=false,length=10) private String heureDebut;
 @Column(nullable=false,length=10) private String heureFin;
}