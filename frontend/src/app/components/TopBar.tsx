import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { state, setTheme, setAccentColor } = useApp();

  const accentColors = [
    { name: 'blue', color: '#3b82f6', label: 'Bleu' },
    { name: 'green', color: '#10b981', label: 'Vert' },
    { name: 'purple', color: '#8b5cf6', label: 'Violet' },
    { name: 'orange', color: '#f59e0b', label: 'Orange' },
    { name: 'red', color: '#ef4444', label: 'Rouge' },
  ];

  const anneeScolaireActive = state.annesScolaires.find(a => a.estActive);

  return (
    <div className="h-16 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 px-6 flex items-center justify-between">
      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {anneeScolaireActive && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Année scolaire: {anneeScolaireActive.nom}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Choix de couleur d'accentuation */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
          {accentColors.map((color) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAccentColor(color.name as any)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                state.accentColor === color.name
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.label}
            />
          ))}
        </div>

        {/* Toggle thème */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(state.theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all"
        >
          {state.theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>
      </div>
    </div>
  );
};
