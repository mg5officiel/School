package ml.school.ai;
import ml.school.service.MinioTemporaryStorage; import org.springframework.ai.chat.client.ChatClient; import org.springframework.core.io.ByteArrayResource; import org.springframework.http.MediaType; import org.springframework.stereotype.Service; import org.springframework.util.MimeTypeUtils; import java.util.*;
@Service public class GradeExtractionService {
 private final ChatClient chat; private final MinioTemporaryStorage storage;
 public GradeExtractionService(ChatClient.Builder builder,MinioTemporaryStorage s){this.chat=builder.build();storage=s;}
 public String extract(byte[] image,String contentType)throws Exception{
  if(image.length>5*1024*1024) throw new IllegalArgumentException("Image supérieure à 5 Mo");
  if(!Set.of("image/jpeg","image/png").contains(contentType)) throw new IllegalArgumentException("Format accepté: JPG/JPEG/PNG");
  String name=UUID.randomUUID()+".upload"; storage.put(name,new java.io.ByteArrayInputStream(image),image.length,contentType);
  try{return chat.prompt().user(u->u.text("Extrais cette feuille manuscrite de notes. Retourne uniquement un JSON structuré et conserve les valeurs lisibles sans les inventer. La validation humaine sera obligatoire avant enregistrement.").media(MimeTypeUtils.parseMimeType(contentType),new ByteArrayResource(image))).call().content();}
  finally{storage.delete(name);}
 }
}