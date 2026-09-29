package ml.school.controller;

import lombok.RequiredArgsConstructor;
import ml.school.entity.Inscription;
import ml.school.service.DecisionScolaireService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decisions-scolaires")
@RequiredArgsConstructor
public class DecisionScolaireController {

    private final DecisionScolaireService service;

    @PostMapping("/inscriptions/{inscriptionId}/decision")
    @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    public Inscription enregistrerDecision(
            @PathVariable Long inscriptionId,
            @RequestParam Long nouvelleAnneeId,
            @RequestParam Long classeCibleId,
            org.springframework.security.core.Authentication authentication) {

        return service.enregistrerDecisionAutomatique(
                inscriptionId,
                nouvelleAnneeId,
                classeCibleId,
                authentication.getName());
    }

    @PostMapping("/inscriptions/{inscriptionId}/passage-exceptionnel")
    @PreAuthorize("hasRole('PROVISEUR')")
    public Inscription autoriserPassageExceptionnel(
            @PathVariable Long inscriptionId,
            @RequestParam Long nouvelleAnneeId,
            @RequestParam Long classeCibleId,
            org.springframework.security.core.Authentication authentication) {

        return service.autoriserPassageExceptionnel(
                inscriptionId,
                nouvelleAnneeId,
                classeCibleId,
                authentication.getName());
    }
}