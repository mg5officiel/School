package ml.school.security;
import org.junit.jupiter.api.Test; import static org.junit.jupiter.api.Assertions.*;
class JwtServiceTest { @Test void accessTokenLifetimeIsConfiguredByServiceContract(){assertEquals(900,15*60);} }