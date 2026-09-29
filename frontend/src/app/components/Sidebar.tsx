import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  User,
  GraduationCap,
  LogOut,
  CalendarDays,
  Download,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { state, logout } = useApp();
  const user = state.currentUser;

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['super_admin', 'directeur', 'surveillant', 'secretaire'] },
    { id: 'eleves', label: 'Élèves', icon: Users, roles: ['super_admin', 'directeur', 'surveillant', 'secretaire'] },
    { id: 'emploi-du-temps', label: 'Emploi du temps', icon: Calendar, roles: ['super_admin', 'directeur', 'secretaire'] },
    { id: 'bulletins', label: 'Bulletins', icon: FileText, roles: ['super_admin', 'directeur', 'secretaire'] },
    { id: 'annees', label: 'Années scolaires', icon: CalendarDays, roles: ['super_admin', 'directeur'] },
    { id: 'import-export', label: 'Import/Export', icon: Download, roles: ['super_admin', 'directeur'] },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: User, roles: ['super_admin'] },
    { id: 'parametres', label: 'Paramètres', icon: Settings, roles: ['super_admin', 'directeur'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 h-screen backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">
              École
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {state.settings.nomEcole}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Profil utilisateur */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {user?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange('profil')}
          className="w-full mb-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all"
        >
          <User className="w-4 h-4" />
          Mon profil
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </motion.button>
      </div>
    </div>
  );
};
