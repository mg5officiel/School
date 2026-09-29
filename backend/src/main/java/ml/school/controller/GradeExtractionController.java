package ml.school.controller;

import ml.school.ai.GradeExtractionService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/notes/import")
public class GradeExtractionController {

    private final GradeExtractionService service;

    public GradeExtractionController(GradeExtractionService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','PROVISEUR','ENSEIGNANT')")
    public String extract(@RequestPart MultipartFile file) throws Exception {
        return service.extract(file.getBytes(), file.getContentType());
    }
}