package ml.school.service;
import io.minio.*; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service; import java.io.InputStream;
@Service public class MinioTemporaryStorage {
 private final MinioClient client; private final String bucket;
 public MinioTemporaryStorage(MinioClient c,@Value("${minio.bucket}") String b){client=c;bucket=b;}
 public String put(String name,InputStream in,long size,String type)throws Exception{client.putObject(PutObjectArgs.builder().bucket(bucket).object(name).stream(in,size,-1).contentType(type).build());return name;}
 public void delete(String name){try{client.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(name).build());}catch(Exception ignored){}}
}