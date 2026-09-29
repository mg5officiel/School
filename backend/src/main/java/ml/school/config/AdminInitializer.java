package ml.school.config;

import ml.school.entity.Role;
import ml.school.entity.Utilisateur;
import ml.school.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createInitialAdmin(
            UtilisateurRepository repo,
            PasswordEncoder encoder,
            @Value("${school.admin.username:}") String username,
            @Value("${school.admin.email:}") String email,
            @Value("${school.admin.password:}") String password) {

        return args -> {
            if (username.isBlank() || email.isBlank() || password.isBlank()) {
                return;
            }

            if (repo.findByUsername(username).isEmpty()) {
                Utilisateur admin = new Utilisateur();
                admin.setUsername(username);
                admin.setEmail(email);
                admin.setPassword(encoder.encode(password));
                admin.setRole(Role.ADMIN);
                admin.setActif(true);
                repo.save(admin);
            }
        };
    }
}
