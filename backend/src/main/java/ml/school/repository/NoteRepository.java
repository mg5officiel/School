package ml.school.repository;

import ml.school.entity.AnneeScolaire;
import ml.school.entity.Eleve;
import ml.school.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByEleveAndEvaluation_AnneeScolaire(Eleve eleve, AnneeScolaire anneeScolaire);
}