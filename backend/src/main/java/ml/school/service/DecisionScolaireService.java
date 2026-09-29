package ml.school.service;

import lombok.RequiredArgsConstructor;
import ml.school.entity.Bulletin;
import ml.school.entity.Inscription;
import ml.school.repository.BulletinRepository;
import ml.school.repository.InscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DecisionScolaireService {

    public static final BigDecimal SEUIL_PASSAGE = new BigDecimal("10.00");

    private final BulletinRepository bulletinRepository;
    private final InscriptionRepository inscriptionRepository;
    private final AuditService auditService;

    public boolean estAdmisParDefaut(Bulletin bulletin) {
        return bulletin.getMoyenne().compareTo(SEUIL_PASSAGE) >= 0;
    }

    @Transactional
    public Inscription autoriserPassageExceptionnel(Long inscriptionId, String username) {
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));

        Bulletin bulletin = bulletinRepository.findByEleveAndAnneeScolaire(
                inscription.getEleve(), inscription.getAnneeScolaire())
                .orElseThrow(() -> new IllegalArgumentException("Bulletin annuel introuvable"));

        if (bulletin.getMoyenne().compareTo(SEUIL_PASSAGE) >= 0) {
            throw new IllegalArgumentException(
                    "Le passage exceptionnel du proviseur concerne uniquement une moyenne inférieure à 10/20");
        }

        inscription.setRedoublant(false);
        Inscription saved = inscriptionRepository.save(inscription);

        auditService.log(
                "PASSAGE_EXCEPTIONNEL",
                username,
                "Inscription#" + inscriptionId,
                "Passage autorisé par le proviseur malgré une moyenne de "
                        + bulletin.getMoyenne() + "/20"
        );

        return saved;
    }
}