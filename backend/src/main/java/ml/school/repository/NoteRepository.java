package ml.school.repository;

import ml.school.entity.AnneeScolaire;
import ml.school.entity.Eleve;
import ml.school.entity.Note;
import ml.school.entity.Trimestre;
import ml.school.entity.TypeEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByEleveAndEvaluation_AnneeScolaire(Eleve eleve, AnneeScolaire anneeScolaire);

    List<Note> findByEleveAndEvaluation_AnneeScolaireAndEvaluation_TypeEvaluation(
            Eleve eleve, AnneeScolaire anneeScolaire, TypeEvaluation typeEvaluation);

    List<Note> findByEleveAndEvaluation_AnneeScolaireAndEvaluation_TypeEvaluationAndEvaluation_Trimestre(
            Eleve eleve, AnneeScolaire anneeScolaire, TypeEvaluation typeEvaluation, Trimestre trimestre);
}
