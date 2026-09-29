package ml.school.security;
import org.springframework.context.annotation.*; import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; import org.springframework.security.config.annotation.web.builders.HttpSecurity; import org.springframework.security.config.http.SessionCreationPolicy; import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.security.oauth2.jwt.*; import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter; import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter; import org.springframework.security.web.SecurityFilterChain; import java.security.interfaces.*; import java.security.spec.*; import java.security.*; import java.util.Base64;
@Configuration @EnableMethodSecurity public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  http.csrf(c->c.disable()).cors(c->{}).headers(h->h.frameOptions(x->x.deny()).contentTypeOptions(x->{}).httpStrictTransportSecurity(x->x.includeSubDomains(true).maxAgeInSeconds(31536000))).sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .authorizeHttpRequests(a->a.requestMatchers("/auth/**","/actuator/health").permitAll().anyRequest().authenticated())
   .oauth2ResourceServer(o->o.jwt(j->j.jwtAuthenticationConverter(jwtAuthenticationConverter())));
  return http.build();
 }
 @Bean JwtAuthenticationConverter jwtAuthenticationConverter(){
  var c=new JwtGrantedAuthoritiesConverter(); c.setAuthoritiesClaimName("role"); c.setAuthorityPrefix("ROLE_");
  var x=new JwtAuthenticationConverter(); x.setJwtGrantedAuthoritiesConverter(c); return x;
 }
 @Bean JwtDecoder jwtDecoder() throws Exception { return NimbusJwtDecoder.withPublicKey(publicKey()).build(); }
 @Bean JwtEncoder jwtEncoder() throws Exception { var k=new org.springframework.security.oauth2.jwt.NimbusJwtEncoder(new com.nimbusds.jose.jwk.source.ImmutableJWKSet<>(new com.nimbusds.jose.jwk.JWKSet(new com.nimbusds.jose.jwk.RSAKey.Builder((RSAPublicKey)publicKey()).privateKey((RSAPrivateKey)privateKey()).build()))); return k; }
 private RSAPublicKey publicKey() throws Exception { String s=System.getenv("JWT_PUBLIC_KEY"); if(s==null||s.isBlank()) throw new IllegalStateException("JWT_PUBLIC_KEY missing"); return (RSAPublicKey)readKey(s,false); }
 private RSAPrivateKey privateKey() throws Exception { String s=System.getenv("JWT_PRIVATE_KEY"); if(s==null||s.isBlank()) throw new IllegalStateException("JWT_PRIVATE_KEY missing"); return (RSAPrivateKey)readKey(s,true); }
 private Key readKey(String pem,boolean priv) throws Exception {
  String b=pem.replace("\\n","\n").replaceAll("-----BEGIN [A-Z ]+-----","").replaceAll("-----END [A-Z ]+-----","").replaceAll("\\s","");
  byte[] d=Base64.getDecoder().decode(b); KeyFactory f=KeyFactory.getInstance("RSA");
  return priv?f.generatePrivate(new PKCS8EncodedKeySpec(d)):f.generatePublic(new X509EncodedKeySpec(d));
 }
}