// Types pour l'application de gestion scolaire

export type UserRole = 'super_admin' | 'directeur' | 'surveillant' | 'secretaire';

export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: UserRole;
  photo?: string;
  telephone?: string;
  dateCreation: string;
  derniereConnexion?: string;
}

export interface AnneeScolaire {
  id: string;
  nom: string; // ex: "2025-2026"
  dateDebut: string;
  dateFin: string;
  estActive: boolean;
}

export interface Eleve {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: 'M' | 'F';
  classe: string;
  photo?: string;
  nomPere?: string;
  nomMere?: string;
  telephoneTuteur: string;
  adresse: string;
  anneeScolaireId: string;
  dateInscription: string;
  statut: 'actif' | 'inactif' | 'transfere';
}

export interface Matiere {
  id: string;
  nom: string;
  code: string;
  coefficient: number;
  couleur?: string;
}

export interface Note {
  id: string;
  eleveId: string;
  matiereId: string;
  trimestre: 1 | 2 | 3;
  anneeScolaireId: string;
  noteDevoir: number;
  noteComposition: number;
  moyenne: number;
  appreciation?: string;
}

export interface Bulletin {
  id: string;
  eleveId: string;
  anneeScolaireId: string;
  trimestre: 1 | 2 | 3;
  notes: Note[];
  moyenneGenerale: number;
  rang: number;
  totalEleves: number;
  appreciation: string;
  dateGeneration: string;
}

export interface SeanceEmploiDuTemps {
  id: string;
  jour: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi';
  heureDebut: string;
  heureFin: string;
  matiereId: string;
  classe: string;
  professeur?: string;
  salle?: string;
}

export interface AppSettings {
  nomEcole: string;
  logoEcole?: string;
  adresseEcole: string;
  telephoneEcole: string;
  emailEcole: string;
  devise?: string;
  anneeScolaireActive: string;
}

export interface AppState {
  users: User[];
  currentUser: User | null;
  annesScolaires: AnneeScolaire[];
  eleves: Eleve[];
  matieres: Matiere[];
  notes: Note[];
  bulletins: Bulletin[];
  emploiDuTemps: SeanceEmploiDuTemps[];
  settings: AppSettings;
  theme: ThemeMode;
  accentColor: AccentColor;
}
