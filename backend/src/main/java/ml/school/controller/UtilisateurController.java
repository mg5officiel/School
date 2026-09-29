package ml.school.controller;
import ml.school.entity.Utilisateur; import ml.school.repository.UtilisateurRepository; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/utilisateurs") @PreAuthorize("hasRole('ADMIN')") public class UtilisateurController {
 private final UtilisateurRepository repo; private final PasswordEncoder encoder; public UtilisateurController(UtilisateurRepository r,PasswordEncoder e){repo=r;encoder=e;}
 @GetMapping public List<Utilisateur> all(){return repo.findAll();}
 @GetMapping("/{id}") public Utilisateur one(@PathVariable Long id){return repo.findById(id).orElseThrow();}
 @PostMapping public Utilisateur create(@RequestBody Utilisateur u){u.setId(null);u.setPassword(encoder.encode(u.getPassword()));return repo.save(u);}
 @PutMapping("/{id}") public Utilisateur update(@PathVariable Long id,@RequestBody Utilisateur u){Utilisateur x=repo.findById(id).orElseThrow();x.setUsername(u.getUsername());x.setEmail(u.getEmail());x.setRole(u.getRole());x.setActif(u.isActif());if(u.getPassword()!=null&&!u.getPassword().isBlank())x.setPassword(encoder.encode(u.getPassword()));return repo.save(x);}
 @DeleteMapping("/{id}") public void delete(@PathVariable Long id){repo.deleteById(id);}
}