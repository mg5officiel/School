package ml.school.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Bean
    MinioClient minioClient(
            @Value("${minio.endpoint}") String endpoint,
            @Value("${minio.access-key}") String accessKey,
            @Value("${minio.secret-key}") String secretKey) {
        return MinioClient.builder().endpoint(endpoint).credentials(accessKey, secretKey).build();
    }

    @Bean
    MinioBucketInitializer minioBucketInitializer(
            MinioClient client, @Value("${minio.bucket}") String bucket) {
        return new MinioBucketInitializer(client, bucket);
    }

    static class MinioBucketInitializer {
        MinioBucketInitializer(MinioClient client, String bucket) {
            try {
                boolean exists = client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
                if (!exists) client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            } catch (Exception e) {
                throw new IllegalStateException("Impossible d'initialiser le bucket MinIO", e);
            }
        }
    }
}