import { AppState, User, AnneeScolaire } from '../types';

const STORAGE_KEY = 'ecole_gestion_data';

// Données initiales avec le super admin
export const getInitialData = (): AppState => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const defaultAnneeScolaire: AnneeScolaire = {
    id: 'annee-1',
    nom: `${currentYear}-${nextYear}`,
    dateDebut: `${currentYear}-09-01`,
    dateFin: `${nextYear}-06-30`,
    estActive: true,
  };

  const superAdmin: User = {
    id: 'user-1',
    email: 'admin@ecole.com',
    password: 'admin123',
    nom: 'Administrateur',
    prenom: 'Système',
    role: 'super_admin',
    dateCreation: new Date().toISOString(),
  };

  return {
    users: [superAdmin],
    currentUser: null,
    annesScolaires: [defaultAnneeScolaire],
    eleves: [],
    matieres: [
      { id: 'mat-1', nom: 'Mathématiques', code: 'MATH', coefficient: 4, couleur: '#3b82f6' },
      { id: 'mat-2', nom: 'Français', code: 'FR', coefficient: 4, couleur: '#10b981' },
      { id: 'mat-3', nom: 'Anglais', code: 'ANG', coefficient: 2, couleur: '#f59e0b' },
      { id: 'mat-4', nom: 'Sciences Physiques', code: 'PC', coefficient: 3, couleur: '#8b5cf6' },
      { id: 'mat-5', nom: 'Sciences de la Vie et de la Terre', code: 'SVT', coefficient: 3, couleur: '#059669' },
      { id: 'mat-6', nom: 'Histoire-Géographie', code: 'HG', coefficient: 3, couleur: '#dc2626' },
      { id: 'mat-7', nom: 'Éducation Physique et Sportive', code: 'EPS', coefficient: 1, couleur: '#0891b2' },
    ],
    notes: [],
    bulletins: [],
    emploiDuTemps: [],
    settings: {
      nomEcole: 'École Excellence',
      adresseEcole: 'Bamako, Mali',
      telephoneEcole: '+223 XX XX XX XX',
      emailEcole: 'contact@ecole.com',
      devise: 'Savoir, Discipline, Excellence',
      anneeScolaireActive: defaultAnneeScolaire.id,
    },
    theme: 'light',
    accentColor: 'blue',
  };
};

// Charger les données depuis localStorage
export const loadData = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // S'assurer que le super admin existe toujours
      const superAdminExists = data.users.some((u: User) => u.role === 'super_admin');
      if (!superAdminExists) {
        const initialData = getInitialData();
        data.users.unshift(initialData.users[0]);
      }
      return data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
  return getInitialData();
};

// Sauvegarder les données dans localStorage
export const saveData = (data: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
};

// Générer un ID unique
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
