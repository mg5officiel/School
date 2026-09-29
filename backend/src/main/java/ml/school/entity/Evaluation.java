package ml.school.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluations")
@Getter @Setter @NoArgsConstructor
public class Evaluation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String libelle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private TypeEvaluation typeEvaluation = TypeEvaluation.NOTE_CLASSE;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Trimestre trimestre;

    @ManyToOne(optional = false)
    private Matiere matiere;

    @ManyToOne(optional = false)
    private Classe classe;

    @ManyToOne(optional = false)
    private AnneeScolaire anneeScolaire;

    @PrePersist
    @PreUpdate
    private void validatePeriode() {
        if (typeEvaluation == TypeEvaluation.NOTE_CLASSE && trimestre != null) {
            throw new IllegalArgumentException("Une note de classe ne doit pas avoir de trimestre");
        }
        if (typeEvaluation == TypeEvaluation.NOTE_TRIMESTRIELLE && trimestre == null) {
            throw new IllegalArgumentException("Une note trimestrielle doit avoir un trimestre");
        }
    }
}
