import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { Eleves } from './components/Eleves';
import { EleveDetails } from './components/EleveDetails';
import { EmploiDuTemps } from './components/EmploiDuTemps';
import { Bulletins } from './components/Bulletins';
import { Utilisateurs } from './components/Utilisateurs';
import { Parametres } from './components/Parametres';
import { AnneesScolaires } from './components/AnneesScolaires';
import { ImportExport } from './components/ImportExport';
import { Profil } from './components/Profil';
import { Eleve } from './types';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);

  if (!state.currentUser) {
    return <Login />;
  }

  const getViewTitle = () => {
    const titles: { [key: string]: string } = {
      dashboard: 'Tableau de bord',
      eleves: 'Gestion des élèves',
      'emploi-du-temps': 'Emploi du temps',
      bulletins: 'Bulletins scolaires',
      utilisateurs: 'Gestion des utilisateurs',
      parametres: 'Paramètres',
      annees: 'Années scolaires',
      'import-export': 'Import / Export',
      profil: 'Mon profil',
    };
    return selectedEleve ? 'Détails de l\'élève' : titles[currentView] || 'Tableau de bord';
  };

  const renderView = () => {
    if (selectedEleve) {
      return <EleveDetails eleve={selectedEleve} onBack={() => setSelectedEleve(null)} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'eleves':
        return <Eleves onViewDetails={setSelectedEleve} />;
      case 'emploi-du-temps':
        return <EmploiDuTemps />;
      case 'bulletins':
        return <Bulletins />;
      case 'utilisateurs':
        return <Utilisateurs />;
      case 'parametres':
        return <Parametres />;
      case 'annees':
        return <AnneesScolaires />;
      case 'import-export':
        return <ImportExport />;
      case 'profil':
        return <Profil />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={(view) => {
        setCurrentView(view);
        setSelectedEleve(null);
      }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={getViewTitle()} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}