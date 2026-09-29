package ml.school.service;

import lombok.RequiredArgsConstructor;
import ml.school.audit.AuditService;
import ml.school.entity.AnneeScolaire;
import ml.school.entity.Bulletin;
import ml.school.entity.Classe;
import ml.school.entity.Inscription;
import ml.school.repository.AnneeScolaireRepository;
import ml.school.repository.BulletinRepository;
import ml.school.repository.ClasseRepository;
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
    private final AnneeScolaireRepository anneeScolaireRepository;
    private final ClasseRepository classeRepository;
    private final AuditService auditService;

    public boolean estAdmisParDefaut(Bulletin bulletin) {
        return bulletin.getMoyenne().compareTo(SEUIL_PASSAGE) >= 0;
    }

    @Transactional
    public Inscription enregistrerDecisionAutomatique(
            Long inscriptionId, Long nouvelleAnneeId, Long classeCibleId, String username) {

        Inscription inscriptionActuelle = chargerInscription(inscriptionId);
        Bulletin bulletin = chargerBulletinAnnuel(inscriptionActuelle);
        boolean passage = estAdmisParDefaut(bulletin);

        return creerInscriptionSuivante(
                inscriptionActuelle, nouvelleAnneeId, classeCibleId, !passage, username,
                passage ? "PASSAGE_AUTOMATIQUE" : "REDOUBLEMENT_AUTOMATIQUE",
                "Décision basée sur la moyenne annuelle de " + bulletin.getMoyenne() + "/20");
    }

    @Transactional
    public Inscription autoriserPassageExceptionnel(
            Long inscriptionId, Long nouvelleAnneeId, Long classeCibleId, String username) {

        Inscription inscriptionActuelle = chargerInscription(inscriptionId);
        Bulletin bulletin = chargerBulletinAnnuel(inscriptionActuelle);

        if (bulletin.getMoyenne().compareTo(SEUIL_PASSAGE) >= 0) {
            throw new IllegalArgumentException(
                    "Le passage exceptionnel concerne uniquement une moyenne inférieure à 10/20");
        }

        return creerInscriptionSuivante(
                inscriptionActuelle, nouvelleAnneeId, classeCibleId, false, username,
                "PASSAGE_EXCEPTIONNEL",
                "Passage autorisé par le proviseur malgré une moyenne de "
                        + bulletin.getMoyenne() + "/20");
    }

    private Inscription chargerInscription(Long id) {
        return inscriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inscription introuvable"));
    }

    private Bulletin chargerBulletinAnnuel(Inscription inscription) {
        Bulletin bulletin = bulletinRepository
                .findByEleveAndAnneeScolaireAndAnnuelTrue(
                        inscription.getEleve(), inscription.getAnneeScolaire())
                .orElseThrow(() -> new IllegalArgumentException("Bulletin annuel introuvable"));
        return bulletin;
    }

    private Inscription creerInscriptionSuivante(
            Inscription inscriptionActuelle, Long nouvelleAnneeId, Long classeCibleId,
            boolean redoublant, String username, String action, String details) {

        AnneeScolaire nouvelleAnnee = anneeScolaireRepository.findById(nouvelleAnneeId)
                .orElseThrow(() -> new IllegalArgumentException("Nouvelle année scolaire introuvable"));

        Classe classeCible = classeRepository.findById(classeCibleId)
                .orElseThrow(() -> new IllegalArgumentException("Classe cible introuvable"));

        if (inscriptionRepository
                .findByEleveAndAnneeScolaire(inscriptionActuelle.getEleve(), nouvelleAnnee)
                .isPresent()) {
            throw new IllegalArgumentException(
                    "L'élève possède déjà une inscription pour cette année scolaire");
        }

        Inscription nouvelleInscription = new Inscription();
        nouvelleInscription.setEleve(inscriptionActuelle.getEleve());
        nouvelleInscription.setAnneeScolaire(nouvelleAnnee);
        nouvelleInscription.setClasse(classeCible);
        nouvelleInscription.setRedoublant(redoublant);

        Inscription saved = inscriptionRepository.save(nouvelleInscription);

        auditService.log(
                action,
                username,
                "Eleve#" + inscriptionActuelle.getEleve().getId(),
                details + "; année=" + nouvelleAnnee.getLibelle()
                        + "; classe choisie manuellement=" + classeCible.getNom()
                        + "; redoublant=" + redoublant);

        return saved;
    }
}
