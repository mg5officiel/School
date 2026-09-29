package ml.school.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.security.Key;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final String privateKeyPem;
    private final String publicKeyPem;

    public SecurityConfig(
            @Value("${security.jwt.private-key:}") String privateKeyPem,
            @Value("${security.jwt.public-key:}") String publicKeyPem) {
        this.privateKeyPem = privateKeyPem;
        this.publicKeyPem = publicKeyPem;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(content -> {})
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31_536_000)))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/actuator/health").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

        return http.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("role");
        authorities.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    @Bean
    JwtDecoder jwtDecoder() throws Exception {
        return NimbusJwtDecoder.withPublicKey(publicKey()).build();
    }

    @Bean
    JwtEncoder jwtEncoder() throws Exception {
        RSAKey rsaKey = new RSAKey.Builder(publicKey())
                .privateKey(privateKey())
                .build();

        return new NimbusJwtEncoder(
                new ImmutableJWKSet<>(new JWKSet(rsaKey)));
    }

    private RSAPublicKey publicKey() throws Exception {
        if (publicKeyPem.isBlank()) {
            throw new IllegalStateException("JWT_PUBLIC_KEY missing");
        }
        return (RSAPublicKey) readKey(publicKeyPem, false);
    }

    private RSAPrivateKey privateKey() throws Exception {
        if (privateKeyPem.isBlank()) {
            throw new IllegalStateException("JWT_PRIVATE_KEY missing");
        }
        return (RSAPrivateKey) readKey(privateKeyPem, true);
    }

    private Key readKey(String pem, boolean privateKey) throws Exception {
        String normalized = pem
                .replace("\\n", "\n")
                .replaceAll("-----BEGIN [A-Z ]+-----", "")
                .replaceAll("-----END [A-Z ]+-----", "")
                .replaceAll("\\s", "");

        byte[] decoded = Base64.getDecoder().decode(normalized);
        KeyFactory factory = KeyFactory.getInstance("RSA");

        return privateKey
                ? factory.generatePrivate(new PKCS8EncodedKeySpec(decoded))
                : factory.generatePublic(new X509EncodedKeySpec(decoded));
    }
}
