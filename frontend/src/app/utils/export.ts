import * as XLSX from 'xlsx';
import { Eleve, Note, User, AnneeScolaire, AppState } from '../types';

// Export vers Excel
export const exportToExcel = (data: AppState, fileName: string = 'export_ecole') => {
  const workbook = XLSX.utils.book_new();

  // Feuille des élèves
  const elevesData = data.eleves.map(e => ({
    Matricule: e.matricule,
    Nom: e.nom,
    Prénom: e.prenom,
    'Date de naissance': e.dateNaissance,
    Sexe: e.sexe,
    Classe: e.classe,
    'Téléphone tuteur': e.telephoneTuteur,
    Adresse: e.adresse,
    Statut: e.statut,
  }));
  const elevesSheet = XLSX.utils.json_to_sheet(elevesData);
  XLSX.utils.book_append_sheet(workbook, elevesSheet, 'Élèves');

  // Feuille des utilisateurs (sans mots de passe)
  const usersData = data.users.map(u => ({
    Email: u.email,
    Nom: u.nom,
    Prénom: u.prenom,
    Rôle: u.role,
    Téléphone: u.telephone || '',
    'Date de création': new Date(u.dateCreation).toLocaleDateString('fr-FR'),
  }));
  const usersSheet = XLSX.utils.json_to_sheet(usersData);
  XLSX.utils.book_append_sheet(workbook, usersSheet, 'Utilisateurs');

  // Feuille des notes
  const notesData = data.notes.map(n => {
    const eleve = data.eleves.find(e => e.id === n.eleveId);
    const matiere = data.matieres.find(m => m.id === n.matiereId);
    return {
      Élève: eleve ? `${eleve.nom} ${eleve.prenom}` : '',
      Matière: matiere?.nom || '',
      Trimestre: n.trimestre,
      Devoir: n.noteDevoir,
      Composition: n.noteComposition,
      Moyenne: n.moyenne,
      Appréciation: n.appreciation || '',
    };
  });
  const notesSheet = XLSX.utils.json_to_sheet(notesData);
  XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes');

  // Télécharger le fichier
  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Import depuis Excel
export const importFromExcel = (file: File): Promise<Partial<AppState>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const result: Partial<AppState> = {};

        // Importer les élèves si la feuille existe
        if (workbook.SheetNames.includes('Élèves')) {
          const elevesSheet = workbook.Sheets['Élèves'];
          const elevesJson = XLSX.utils.sheet_to_json(elevesSheet);
          result.eleves = elevesJson.map((row: any, index: number) => ({
            id: `eleve-import-${Date.now()}-${index}`,
            matricule: row.Matricule || `MAT${Date.now()}${index}`,
            nom: row.Nom || '',
            prenom: row.Prénom || row.Prenom || '',
            dateNaissance: row['Date de naissance'] || '',
            lieuNaissance: row['Lieu de naissance'] || 'Mali',
            sexe: row.Sexe === 'M' ? 'M' : 'F',
            classe: row.Classe || '',
            telephoneTuteur: row['Téléphone tuteur'] || row['Telephone tuteur'] || '',
            adresse: row.Adresse || '',
            anneeScolaireId: '',
            dateInscription: new Date().toISOString(),
            statut: 'actif',
          }));
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// Export vers SQL (génération de script SQL)
export const exportToSQL = (data: AppState) => {
  let sql = '-- Export de la base de données de l\'école\n';
  sql += `-- Date: ${new Date().toLocaleString('fr-FR')}\n\n`;

  // Table élèves
  sql += '-- Table des élèves\n';
  sql += 'CREATE TABLE IF NOT EXISTS eleves (\n';
  sql += '  id VARCHAR(100) PRIMARY KEY,\n';
  sql += '  matricule VARCHAR(50) UNIQUE,\n';
  sql += '  nom VARCHAR(100),\n';
  sql += '  prenom VARCHAR(100),\n';
  sql += '  date_naissance DATE,\n';
  sql += '  lieu_naissance VARCHAR(100),\n';
  sql += '  sexe CHAR(1),\n';
  sql += '  classe VARCHAR(50),\n';
  sql += '  telephone_tuteur VARCHAR(20),\n';
  sql += '  adresse TEXT,\n';
  sql += '  statut VARCHAR(20),\n';
  sql += '  date_inscription DATETIME\n';
  sql += ');\n\n';

  data.eleves.forEach(e => {
    sql += `INSERT INTO eleves VALUES ('${e.id}', '${e.matricule}', '${e.nom}', '${e.prenom}', '${e.dateNaissance}', '${e.lieuNaissance}', '${e.sexe}', '${e.classe}', '${e.telephoneTuteur}', '${e.adresse}', '${e.statut}', '${e.dateInscription}');\n`;
  });

  sql += '\n-- Table des notes\n';
  sql += 'CREATE TABLE IF NOT EXISTS notes (\n';
  sql += '  id VARCHAR(100) PRIMARY KEY,\n';
  sql += '  eleve_id VARCHAR(100),\n';
  sql += '  matiere_id VARCHAR(100),\n';
  sql += '  trimestre INT,\n';
  sql += '  note_devoir DECIMAL(5,2),\n';
  sql += '  note_composition DECIMAL(5,2),\n';
  sql += '  moyenne DECIMAL(5,2),\n';
  sql += '  appreciation TEXT\n';
  sql += ');\n\n';

  data.notes.forEach(n => {
    sql += `INSERT INTO notes VALUES ('${n.id}', '${n.eleveId}', '${n.matiereId}', ${n.trimestre}, ${n.noteDevoir}, ${n.noteComposition}, ${n.moyenne}, '${n.appreciation || ''}');\n`;
  });

  // Télécharger le fichier SQL
  const blob = new Blob([sql], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export_ecole_${new Date().toISOString().split('T')[0]}.sql`;
  a.click();
  URL.revokeObjectURL(url);
};

// Télécharger les données complètes en JSON (backup complet)
export const exportToJSON = (data: AppState) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_ecole_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Importer depuis JSON
export const importFromJSON = (file: File): Promise<AppState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
