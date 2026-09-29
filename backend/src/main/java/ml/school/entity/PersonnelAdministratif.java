package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="personnels_administratifs") @Getter @Setter @NoArgsConstructor
public class PersonnelAdministratif {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=50) private String prenom;
 @Column(nullable=false,length=50) private String nom;
 @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private Role role;
}