package ml.school.repository;

import ml.school.entity.AnneeScolaire;
import ml.school.entity.Bulletin;
import ml.school.entity.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BulletinRepository extends JpaRepository<Bulletin, Long> {
    Optional<Bulletin> findByEleveAndAnneeScolaire(Eleve eleve, AnneeScolaire anneeScolaire);
}