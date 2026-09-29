package ml.school.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "filieres")
@Getter @Setter @NoArgsConstructor
public class Filiere {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 30)
    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @NotBlank @Size(max = 100)
    @Column(nullable = false, unique = true, length = 100)
    private String nom;
}