package ml.school.config;
import ml.school.entity.*; import ml.school.repository.UtilisateurRepository; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration public class AdminInitializer {
 @Bean CommandLineRunner createInitialAdmin(UtilisateurRepository repo,PasswordEncoder encoder){
  return args->{String u=System.getenv("ADMIN_USERNAME"),e=System.getenv("ADMIN_EMAIL"),p=System.getenv("ADMIN_PASSWORD"); if(u==null||e==null||p==null||p.isBlank()) return; if(repo.findByUsername(u).isEmpty()){Utilisateur a=new Utilisateur();a.setUsername(u);a.setEmail(e);a.setPassword(encoder.encode(p));a.setRole(Role.ADMIN);a.setActif(true);repo.save(a);}};
 }
}