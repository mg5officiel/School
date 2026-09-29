package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="classes") @Getter @Setter @NoArgsConstructor
public class Classe {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=50) private String nom;
 @Column(nullable=false,length=30) private String niveau;
}