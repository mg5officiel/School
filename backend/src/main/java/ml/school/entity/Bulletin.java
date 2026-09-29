package ml.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bulletins")
@Getter @Setter @NoArgsConstructor
public class Bulletin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Eleve eleve;

    @ManyToOne(optional = false)
    private Classe classe;

    @ManyToOne(optional = false)
    private AnneeScolaire anneeScolaire;

    @Column(nullable = false)
    private java.math.BigDecimal moyenne;

    @Column(nullable = false)
    private boolean annuel;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Trimestre trimestre;

    @PrePersist
    @PreUpdate
    private void validatePeriode() {
        if (annuel && trimestre != null) {
            throw new IllegalArgumentException("Un bulletin annuel ne doit pas avoir de trimestre");
        }
        if (!annuel && trimestre == null) {
            throw new IllegalArgumentException("Un bulletin trimestriel doit avoir un trimestre");
        }
    }
}
