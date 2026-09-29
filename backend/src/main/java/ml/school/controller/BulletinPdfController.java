package ml.school.controller;

import lombok.RequiredArgsConstructor;
import ml.school.service.BulletinPdfService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bulletins")
@RequiredArgsConstructor
public class BulletinPdfController {
    private final BulletinPdfService bulletinPdfService;

    @GetMapping("/{bulletinId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT','SECRETAIRE','SCENCEUR')")
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable Long bulletinId,
            Authentication authentication) {

        byte[] pdf = bulletinPdfService.generate(bulletinId, authentication.getName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("bulletin-" + bulletinId + ".pdf")
                                .build()
                                .toString())
                .body(pdf);
    }
}