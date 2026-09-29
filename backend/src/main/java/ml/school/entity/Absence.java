package ml.school.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="absences") @Getter @Setter @NoArgsConstructor
public class Absence {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Eleve eleve;
 @Column(nullable=false) private java.time.LocalDate date;
 @Column(nullable=false) private boolean justifiee;
 @Column(length=255) private String motif;
}