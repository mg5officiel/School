package ml.school.controller;
import jakarta.validation.Valid; import ml.school.dto.auth.*; import ml.school.service.AuthService; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/auth") public class AuthController {
 private final AuthService service; public AuthController(AuthService s){service=s;}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest r){return service.login(r);}
 @PostMapping("/refresh") public AuthResponse refresh(@Valid @RequestBody RefreshRequest r){return service.refresh(r.refreshToken());}
 @PostMapping("/logout") public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest r){service.logout(r.refreshToken());return ResponseEntity.noContent().build();}
}