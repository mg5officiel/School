package ml.school.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "matieres")
@Getter @Setter @NoArgsConstructor
public class Matiere {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String nom;

    @NotBlank @Size(max = 30)
    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @NotNull @DecimalMin("0.01") @Digits(integer = 4, fraction = 2)
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal coefficient;

    @NotBlank @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String niveau;

    @ManyToOne(optional = false)
    @JoinColumn(name = "filiere_id", nullable = false)
    private Filiere filiere;
}