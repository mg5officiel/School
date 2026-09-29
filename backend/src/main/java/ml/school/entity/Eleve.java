package ml.school.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "eleves")
@Getter @Setter @NoArgsConstructor
public class Eleve {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String prenom;

    @NotBlank @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String nom;

    @Size(max = 30)
    @Column(unique = true, length = 30)
    private String matricule;

    @Size(max = 20)
    @Column(length = 20)
    private String sexe;

    @Size(max = 30)
    @Column(length = 30)
    private String telephone;

    @ManyToOne(optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private Parent parent;
}