package ml.school.service;

import lombok.RequiredArgsConstructor;
import ml.school.audit.AuditService;
import ml.school.entity.Bulletin;
import ml.school.entity.Note;
import ml.school.repository.BulletinRepository;
import ml.school.repository.NoteRepository;
import org.openpdf.text.Document;
import org.openpdf.text.Element;
import org.openpdf.text.Font;
import org.openpdf.text.FontFactory;
import org.openpdf.text.Paragraph;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BulletinPdfService {
    private final BulletinRepository bulletinRepository;
    private final NoteRepository noteRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public byte[] generate(Long bulletinId, String username) {
        Bulletin bulletin = bulletinRepository.findById(bulletinId)
                .orElseThrow(() -> new IllegalArgumentException("Bulletin introuvable"));

        if (!bulletin.isAnnuel()) {
            throw new IllegalArgumentException("Le téléchargement PDF est réservé aux bulletins annuels");
        }

        List<Note> notes = noteRepository.findByEleveAndEvaluation_AnneeScolaire(
                bulletin.getEleve(), bulletin.getAnneeScolaire());

        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, output);
            document.open();

            Font title = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font bold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font normal = FontFactory.getFont(FontFactory.HELVETICA, 10);

            Paragraph heading = new Paragraph("BULLETIN SCOLAIRE", title);
            heading.setAlignment(Element.ALIGN_CENTER);
            document.add(heading);

            Paragraph year = new Paragraph(
                    "Année scolaire : " + bulletin.getAnneeScolaire().getLibelle(), normal);
            year.setAlignment(Element.ALIGN_CENTER);
            document.add(year);
            document.add(new Paragraph(" "));

            PdfPTable info = new PdfPTable(2);
            info.setWidthPercentage(100);
            info.setWidths(new float[]{1, 2});
            info.addCell(cell("Élève", bold));
            info.addCell(cell(bulletin.getEleve().getPrenom() + " " + bulletin.getEleve().getNom(), normal));
            info.addCell(cell("Matricule", bold));
            info.addCell(cell(safe(bulletin.getEleve().getMatricule()), normal));
            info.addCell(cell("Classe", bold));
            info.addCell(cell(bulletin.getClasse().getNom() + " (" + bulletin.getClasse().getNiveau() + ")", normal));
            info.addCell(cell("Type", bold));
            info.addCell(cell("Bulletin annuel", normal));
            document.add(info);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Résultats", bold));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.4f, 2.4f, 1.2f, 1.2f});
            table.addCell(cell("Matière", bold));
            table.addCell(cell("Évaluation", bold));
            table.addCell(cell("Note", bold));
            table.addCell(cell("Coeff.", bold));

            for (Note note : notes) {
                table.addCell(cell(note.getEvaluation().getMatiere().getNom(), normal));
                table.addCell(cell(note.getEvaluation().getLibelle(), normal));
                table.addCell(cell(note.getValeur().toPlainString() + "/20", normal));
                table.addCell(cell(note.getEvaluation().getMatiere().getCoefficient().toPlainString(), normal));
            }

            if (notes.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Paragraph(
                        "Aucune note enregistrée pour cette année scolaire.", normal));
                empty.setColspan(4);
                table.addCell(empty);
            }
            document.add(table);
            document.add(new Paragraph(" "));

            PdfPTable average = new PdfPTable(2);
            average.setWidthPercentage(60);
            average.setHorizontalAlignment(Element.ALIGN_RIGHT);
            average.addCell(cell("Moyenne annuelle", bold));
            average.addCell(cell(bulletin.getMoyenne().toPlainString() + "/20", bold));
            document.add(average);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "Document généré par le système de gestion scolaire.", normal));

            document.close();

            auditService.log("DOWNLOAD_BULLETIN_PDF", username,
                    "Bulletin#" + bulletinId, "Téléchargement du bulletin annuel PDF");

            return output.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de générer le bulletin PDF", e);
        }
    }

    private PdfPCell cell(String value, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(value, font));
        cell.setPadding(6);
        return cell;
    }

    private String safe(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }
}