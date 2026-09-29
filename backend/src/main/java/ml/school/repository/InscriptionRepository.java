package ml.school.repository;

import ml.school.entity.AnneeScolaire;
import ml.school.entity.Eleve;
import ml.school.entity.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    Optional<Inscription> findByEleveAndAnneeScolaire(Eleve eleve, AnneeScolaire anneeScolaire);
}