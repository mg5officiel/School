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

    private final DecisionScolaireService decisionScolaireService;

    @PostMapping("/inscriptions/{inscriptionId}/passage-exceptionnel")
    @PreAuthorize("hasRole('PROVISEUR')")
    public Inscription autoriserPassageExceptionnel(
            @PathVariable Long inscriptionId,
            org.springframework.security.core.Authentication authentication) {
        return decisionScolaireService.autoriserPassageExceptionnel(
                inscriptionId, authentication.getName());
    }
}