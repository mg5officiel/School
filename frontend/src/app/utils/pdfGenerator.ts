import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Eleve, Bulletin, Note, Matiere, AppSettings } from '../types';

export const generateBulletinPDF = (
  eleve: Eleve,
  bulletin: Bulletin,
  notes: Note[],
  matieres: Matiere[],
  settings: AppSettings,
  trimestre: number
) => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.nomEcole, 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.adresseEcole, 105, 28, { align: 'center' });
  doc.text(`Tél: ${settings.telephoneEcole}`, 105, 34, { align: 'center' });

  if (settings.devise) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(settings.devise, 105, 40, { align: 'center' });
  }

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);

  // Titre du bulletin
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`BULLETIN SCOLAIRE - ${trimestre}${trimestre === 1 ? 'er' : 'ème'} TRIMESTRE`, 105, 55, { align: 'center' });

  // Informations de l'élève
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom: ${eleve.nom}`, 20, 70);
  doc.text(`Prénom: ${eleve.prenom}`, 20, 77);
  doc.text(`Matricule: ${eleve.matricule}`, 20, 84);
  doc.text(`Classe: ${eleve.classe}`, 120, 70);
  doc.text(`Date de naissance: ${new Date(eleve.dateNaissance).toLocaleDateString('fr-FR')}`, 120, 77);
  doc.text(`Sexe: ${eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}`, 120, 84);

  // Tableau des notes
  const tableData = notes.map(note => {
    const matiere = matieres.find(m => m.id === note.matiereId);
    return [
      matiere?.nom || '',
      matiere?.coefficient?.toString() || '',
      note.noteDevoir.toFixed(2),
      note.noteComposition.toFixed(2),
      note.moyenne.toFixed(2),
      (note.moyenne * (matiere?.coefficient || 1)).toFixed(2),
      note.appreciation || '-',
    ];
  });

  // Calcul des totaux
  const totalCoefficients = notes.reduce((sum, note) => {
    const matiere = matieres.find(m => m.id === note.matiereId);
    return sum + (matiere?.coefficient || 0);
  }, 0);

  const totalPoints = notes.reduce((sum, note) => {
    const matiere = matieres.find(m => m.id === note.matiereId);
    return sum + (note.moyenne * (matiere?.coefficient || 1));
  }, 0);

  const moyenneGenerale = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;

  autoTable(doc, {
    startY: 95,
    head: [['Matière', 'Coef.', 'Devoir', 'Compo.', 'Moyenne', 'Total', 'Appréciation']],
    body: tableData,
    foot: [
      ['TOTAL', totalCoefficients.toString(), '', '', '', totalPoints.toFixed(2), ''],
    ],
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202], fontSize: 10, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontSize: 10, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 45 },
    },
  });

  // Résultats
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Moyenne Générale: ${moyenneGenerale.toFixed(2)}/20`, 20, finalY);
  doc.text(`Rang: ${bulletin.rang}/${bulletin.totalEleves}`, 120, finalY);

  // Appréciation générale
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Appréciation générale:', 20, finalY + 10);

  // Encadré pour l'appréciation
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, finalY + 13, 170, 20);

  doc.setFontSize(10);
  const appreciationLines = doc.splitTextToSize(bulletin.appreciation, 160);
  doc.text(appreciationLines, 25, finalY + 18);

  // Décision et signature
  const decisionY = finalY + 40;

  let decision = 'PASSE EN CLASSE SUPÉRIEURE';
  if (moyenneGenerale < 10) {
    decision = 'REDOUBLE';
  } else if (moyenneGenerale < 12) {
    decision = 'ADMIS AVEC RÉSERVE';
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Décision: ${decision}`, 20, decisionY);

  // Signatures
  doc.setFont('helvetica', 'normal');
  doc.text('Le Directeur', 20, decisionY + 20);
  doc.text('Le Parent', 105, decisionY + 20);
  doc.text("Fait à Bamako, le " + new Date().toLocaleDateString('fr-FR'), 20, decisionY + 35);

  // Télécharger le PDF
  doc.save(`Bulletin_${eleve.nom}_${eleve.prenom}_T${trimestre}.pdf`);
};
