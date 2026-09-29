package ml.school.repository;

import ml.school.entity.AnneeScolaire;
import ml.school.entity.Bulletin;
import ml.school.entity.Eleve;
import ml.school.entity.Trimestre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BulletinRepository extends JpaRepository<Bulletin, Long> {
    Optional<Bulletin> findByEleveAndAnneeScolaireAndAnnuelTrue(Eleve eleve, AnneeScolaire anneeScolaire);
    Optional<Bulletin> findByEleveAndAnneeScolaireAndTrimestre(Eleve eleve, AnneeScolaire anneeScolaire, Trimestre trimestre);
}
