package ml.school.controller;

import jakarta.validation.Valid;
import ml.school.entity.*;
import ml.school.repository.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eleves")
class EleveController {
    private final EleveRepository r;
    EleveController(EleveRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SECRETAIRE','SCENCEUR')")
    List<Eleve> all(){return r.findAll();}
    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SECRETAIRE','SCENCEUR')")
    Eleve one(@PathVariable Long id){return r.findById(id).orElseThrow();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Eleve add(@Valid @RequestBody Eleve x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Eleve edit(@PathVariable Long id,@Valid @RequestBody Eleve x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/parents")
class ParentController {
    private final ParentRepository r;
    ParentController(ParentRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE','ENSEIGNANT','SURVEILLANT','SCENCEUR')")
    List<Parent> all(){return r.findAll();}
    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE','ENSEIGNANT','SURVEILLANT','SCENCEUR')")
    Parent one(@PathVariable Long id){return r.findById(id).orElseThrow();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Parent add(@Valid @RequestBody Parent x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Parent edit(@PathVariable Long id,@Valid @RequestBody Parent x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/classes")
class ClasseController {
    private final ClasseRepository r;
    ClasseController(ClasseRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SECRETAIRE','SCENCEUR')")
    List<Classe> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Classe add(@Valid @RequestBody Classe x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Classe edit(@PathVariable Long id,@Valid @RequestBody Classe x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/annees-scolaires")
class AnneeController {
    private final AnneeScolaireRepository r;
    AnneeController(AnneeScolaireRepository r){this.r=r;}
    @GetMapping @PreAuthorize("isAuthenticated()")
    List<AnneeScolaire> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    AnneeScolaire add(@Valid @RequestBody AnneeScolaire x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    AnneeScolaire edit(@PathVariable Long id,@Valid @RequestBody AnneeScolaire x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/filieres")
class FiliereController {
    private final FiliereRepository r;
    FiliereController(FiliereRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    List<Filiere> all(){return r.findAll();}
    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    Filiere one(@PathVariable Long id){return r.findById(id).orElseThrow();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Filiere add(@Valid @RequestBody Filiere x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Filiere edit(@PathVariable Long id,@Valid @RequestBody Filiere x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/enseignants")
class EnseignantController {
    private final EnseignantRepository r;
    EnseignantController(EnseignantRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    List<Enseignant> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Enseignant add(@Valid @RequestBody Enseignant x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Enseignant edit(@PathVariable Long id,@Valid @RequestBody Enseignant x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/matieres")
class MatiereController {
    private final MatiereRepository r;
    MatiereController(MatiereRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    List<Matiere> all(){return r.findAll();}
    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    Matiere one(@PathVariable Long id){return r.findById(id).orElseThrow();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Matiere add(@Valid @RequestBody Matiere x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Matiere edit(@PathVariable Long id,@Valid @RequestBody Matiere x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/inscriptions")
class InscriptionController {
    private final InscriptionRepository r;
    InscriptionController(InscriptionRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SECRETAIRE','SCENCEUR')")
    List<Inscription> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Inscription add(@Valid @RequestBody Inscription x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    Inscription edit(@PathVariable Long id,@Valid @RequestBody Inscription x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/notes")
class NoteController {
    private final NoteRepository r;
    NoteController(NoteRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SCENCEUR')")
    List<Note> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT')")
    Note add(@Valid @RequestBody Note x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT')")
    Note edit(@PathVariable Long id,@Valid @RequestBody Note x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/evaluations")
class EvaluationController {
    private final EvaluationRepository r;
    EvaluationController(EvaluationRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SCENCEUR')")
    List<Evaluation> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT')")
    Evaluation add(@Valid @RequestBody Evaluation x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT')")
    Evaluation edit(@PathVariable Long id,@Valid @RequestBody Evaluation x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/bulletins")
class BulletinController {
    private final BulletinRepository r;
    BulletinController(BulletinRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    List<Bulletin> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Bulletin add(@Valid @RequestBody Bulletin x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Bulletin edit(@PathVariable Long id,@Valid @RequestBody Bulletin x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/absences")
class AbsenceController {
    private final AbsenceRepository r;
    AbsenceController(AbsenceRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SCENCEUR')")
    List<Absence> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SCENCEUR')")
    Absence add(@Valid @RequestBody Absence x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SURVEILLANT','SCENCEUR')")
    Absence edit(@PathVariable Long id,@Valid @RequestBody Absence x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SURVEILLANT','SCENCEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/paiements")
class PaiementController {
    private final PaiementRepository r;
    PaiementController(PaiementRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','COMPTABLE','SECRETAIRE')")
    List<Paiement> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','COMPTABLE')")
    Paiement add(@Valid @RequestBody Paiement x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','COMPTABLE')")
    Paiement edit(@PathVariable Long id,@Valid @RequestBody Paiement x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/personnels-administratifs")
class PersonnelController {
    private final PersonnelAdministratifRepository r;
    PersonnelController(PersonnelAdministratifRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','SECRETAIRE')")
    List<PersonnelAdministratif> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    PersonnelAdministratif add(@Valid @RequestBody PersonnelAdministratif x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    PersonnelAdministratif edit(@PathVariable Long id,@Valid @RequestBody PersonnelAdministratif x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/cours")
class CoursController {
    private final CoursRepository r;
    CoursController(CoursRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    List<Cours> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Cours add(@Valid @RequestBody Cours x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    Cours edit(@PathVariable Long id,@Valid @RequestBody Cours x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}

@RestController
@RequestMapping("/api/emplois-du-temps")
class EmploiController {
    private final EmploiDuTempsRepository r;
    EmploiController(EmploiDuTempsRepository r){this.r=r;}
    @GetMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR','SURVEILLANT')")
    List<EmploiDuTemps> all(){return r.findAll();}
    @PostMapping @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    EmploiDuTemps add(@Valid @RequestBody EmploiDuTemps x){return r.save(x);}
    @PutMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    EmploiDuTemps edit(@PathVariable Long id,@Valid @RequestBody EmploiDuTemps x){x.setId(id);return r.save(x);}
    @DeleteMapping("/{id}") @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR')")
    void del(@PathVariable Long id){r.deleteById(id);}
}
