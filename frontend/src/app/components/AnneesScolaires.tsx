import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Plus, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnneesScolaires: React.FC = () => {
  const { state, addAnneeScolaire, setAnneeScolaireActive } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Années scolaires</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Ajouter une année
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.annesScolaires.map((annee, index) => (
          <motion.div
            key={annee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg relative"
          >
            {annee.estActive && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {annee.nom}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Début:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(annee.dateDebut).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fin:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(annee.dateFin).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {!annee.estActive && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnneeScolaireActive(annee.id)}
                className="w-full py-2 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all font-medium text-sm"
              >
                Activer cette année
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {showAddModal && <AddAnneeModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const AddAnneeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addAnneeScolaire } = useApp();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    nom: `${currentYear}-${currentYear + 1}`,
    dateDebut: `${currentYear}-09-01`,
    dateFin: `${currentYear + 1}-06-30`,
    estActive: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnneeScolaire(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-gray-700/20 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ajouter une année scolaire</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l'année (ex: 2025-2026)</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <input
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="estActive"
              checked={formData.estActive}
              onChange={(e) => setFormData({ ...formData, estActive: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="estActive" className="text-sm font-medium">
              Définir comme année active
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium"
            >
              Ajouter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium"
            >
              Annuler
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
