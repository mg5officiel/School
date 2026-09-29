import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, User, Eleve, Note, Bulletin, AnneeScolaire, SeanceEmploiDuTemps, ThemeMode, AccentColor } from '../types';
import { loadData, saveData, generateId } from '../utils/storage';

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (user: Omit<User, 'id' | 'dateCreation'>) => void;
  deleteUser: (userId: string) => void;
  addEleve: (eleve: Omit<Eleve, 'id'>) => void;
  updateEleve: (eleveId: string, updates: Partial<Eleve>) => void;
  deleteEleve: (eleveId: string) => void;
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  addBulletin: (bulletin: Omit<Bulletin, 'id' | 'dateGeneration'>) => void;
  addAnneeScolaire: (annee: Omit<AnneeScolaire, 'id'>) => void;
  setAnneeScolaireActive: (anneeId: string) => void;
  addSeanceEmploiDuTemps: (seance: Omit<SeanceEmploiDuTemps, 'id'>) => void;
  updateSeanceEmploiDuTemps: (seanceId: string, updates: Partial<SeanceEmploiDuTemps>) => void;
  deleteSeanceEmploiDuTemps: (seanceId: string) => void;
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  importData: (data: Partial<AppState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadData());

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    saveData(state);
  }, [state]);

  // Appliquer le thème au document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    document.documentElement.setAttribute('data-accent', state.accentColor);
  }, [state.theme, state.accentColor]);

  const login = (email: string, password: string): User | null => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      setState(prev => ({
        ...prev,
        currentUser: { ...user, derniereConnexion: new Date().toISOString() },
      }));
      return user;
    }
    return null;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u),
      currentUser: prev.currentUser?.id === userId ? { ...prev.currentUser, ...updates } : prev.currentUser,
    }));
  };

  const addUser = (user: Omit<User, 'id' | 'dateCreation'>) => {
    const newUser: User = {
      ...user,
      id: generateId('user'),
      dateCreation: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
  };

  const deleteUser = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId && u.role !== 'super_admin'),
    }));
  };

  const addEleve = (eleve: Omit<Eleve, 'id'>) => {
    const newEleve: Eleve = {
      ...eleve,
      id: generateId('eleve'),
    };
    setState(prev => ({
      ...prev,
      eleves: [...prev.eleves, newEleve],
    }));
  };

  const updateEleve = (eleveId: string, updates: Partial<Eleve>) => {
    setState(prev => ({
      ...prev,
      eleves: prev.eleves.map(e => e.id === eleveId ? { ...e, ...updates } : e),
    }));
  };

  const deleteEleve = (eleveId: string) => {
    setState(prev => ({
      ...prev,
      eleves: prev.eleves.filter(e => e.id !== eleveId),
    }));
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: generateId('note'),
    };
    setState(prev => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === noteId ? { ...n, ...updates } : n),
    }));
  };

  const addBulletin = (bulletin: Omit<Bulletin, 'id' | 'dateGeneration'>) => {
    const newBulletin: Bulletin = {
      ...bulletin,
      id: generateId('bulletin'),
      dateGeneration: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      bulletins: [...prev.bulletins, newBulletin],
    }));
  };

  const addAnneeScolaire = (annee: Omit<AnneeScolaire, 'id'>) => {
    const newAnnee: AnneeScolaire = {
      ...annee,
      id: generateId('annee'),
    };
    setState(prev => ({
      ...prev,
      annesScolaires: [...prev.annesScolaires, newAnnee],
    }));
  };

  const setAnneeScolaireActive = (anneeId: string) => {
    setState(prev => ({
      ...prev,
      annesScolaires: prev.annesScolaires.map(a => ({
        ...a,
        estActive: a.id === anneeId,
      })),
      settings: {
        ...prev.settings,
        anneeScolaireActive: anneeId,
      },
    }));
  };

  const addSeanceEmploiDuTemps = (seance: Omit<SeanceEmploiDuTemps, 'id'>) => {
    const newSeance: SeanceEmploiDuTemps = {
      ...seance,
      id: generateId('seance'),
    };
    setState(prev => ({
      ...prev,
      emploiDuTemps: [...prev.emploiDuTemps, newSeance],
    }));
  };

  const updateSeanceEmploiDuTemps = (seanceId: string, updates: Partial<SeanceEmploiDuTemps>) => {
    setState(prev => ({
      ...prev,
      emploiDuTemps: prev.emploiDuTemps.map(s => s.id === seanceId ? { ...s, ...updates } : s),
    }));
  };

  const deleteSeanceEmploiDuTemps = (seanceId: string) => {
    setState(prev => ({
      ...prev,
      emploiDuTemps: prev.emploiDuTemps.filter(s => s.id !== seanceId),
    }));
  };

  const updateSettings = (updates: Partial<AppState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  };

  const setTheme = (theme: ThemeMode) => {
    setState(prev => ({ ...prev, theme }));
  };

  const setAccentColor = (color: AccentColor) => {
    setState(prev => ({ ...prev, accentColor: color }));
  };

  const importData = (data: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        login,
        logout,
        updateUser,
        addUser,
        deleteUser,
        addEleve,
        updateEleve,
        deleteEleve,
        addNote,
        updateNote,
        addBulletin,
        addAnneeScolaire,
        setAnneeScolaireActive,
        addSeanceEmploiDuTemps,
        updateSeanceEmploiDuTemps,
        deleteSeanceEmploiDuTemps,
        updateSettings,
        setTheme,
        setAccentColor,
        importData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
