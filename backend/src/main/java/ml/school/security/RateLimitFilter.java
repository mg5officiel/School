package ml.school.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException; import java.time.*; import java.util.concurrent.*;
@Component public class RateLimitFilter extends OncePerRequestFilter {
 private static class Window{long start=System.currentTimeMillis();int count;}
 private final ConcurrentHashMap<String,Window> windows=new ConcurrentHashMap<>(); private static final int LIMIT=60;
 protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String ip=req.getRemoteAddr(); Window w=windows.computeIfAbsent(ip,k->new Window()); synchronized(w){long now=System.currentTimeMillis();if(now-w.start>=60000){w.start=now;w.count=0;} if(++w.count>LIMIT){res.setStatus(429);res.setContentType("application/json");res.getWriter().write("{"message":"Trop de requêtes"}");return;}} chain.doFilter(req,res);
 }
}