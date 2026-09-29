import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Parametres: React.FC = () => {
  const { state, updateSettings } = useApp();
  const [formData, setFormData] = useState(state.settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('Paramètres enregistrés avec succès');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/20">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres de l'école</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de l'école
            </label>
            <input
              type="text"
              value={formData.nomEcole}
              onChange={(e) => setFormData({ ...formData, nomEcole: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={formData.adresseEcole}
              onChange={(e) => setFormData({ ...formData, adresseEcole: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephoneEcole}
                onChange={(e) => setFormData({ ...formData, telephoneEcole: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.emailEcole}
                onChange={(e) => setFormData({ ...formData, emailEcole: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Devise (optionnel)
            </label>
            <input
              type="text"
              value={formData.devise || ''}
              onChange={(e) => setFormData({ ...formData, devise: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="ex: Savoir, Discipline, Excellence"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
          >
            <Save className="w-5 h-5" />
            Enregistrer les paramètres
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
