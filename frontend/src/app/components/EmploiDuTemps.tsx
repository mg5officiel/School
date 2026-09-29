import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmploiDuTemps: React.FC = () => {
  const { state, addSeanceEmploiDuTemps, deleteSeanceEmploiDuTemps } = useApp();
  const [selectedClasse, setSelectedClasse] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const classes = [...new Set(state.eleves.map(e => e.classe))].sort();
  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const;
  const heures = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];

  const seancesFiltered = state.emploiDuTemps.filter(s => !selectedClasse || s.classe === selectedClasse);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emploi du temps</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Ajouter une séance
        </motion.button>
      </div>

      <div className="flex gap-4">
        <select
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
          className="px-4 py-2 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="">Toutes les classes</option>
          {classes.map(classe => (
            <option key={classe} value={classe}>{classe}</option>
          ))}
        </select>
      </div>

      <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left font-bold text-gray-900 dark:text-white">Horaire</th>
              {jours.map(jour => (
                <th key={jour} className="p-3 text-center font-bold text-gray-900 dark:text-white capitalize">
                  {jour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heures.map(horaire => (
              <tr key={horaire} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{horaire}</td>
                {jours.map(jour => {
                  const seance = seancesFiltered.find(s =>
                    s.jour === jour && `${s.heureDebut}-${s.heureFin}` === horaire
                  );
                  const matiere = seance ? state.matieres.find(m => m.id === seance.matiereId) : null;

                  return (
                    <td key={jour} className="p-2">
                      {seance && matiere ? (
                        <div className="relative group">
                          <div
                            className="p-3 rounded-lg text-center text-white font-medium text-sm"
                            style={{ backgroundColor: matiere.couleur || '#3b82f6' }}
                          >
                            <div>{matiere.nom}</div>
                            {seance.professeur && (
                              <div className="text-xs opacity-90 mt-1">{seance.professeur}</div>
                            )}
                            {seance.salle && (
                              <div className="text-xs opacity-80">Salle {seance.salle}</div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteSeanceEmploiDuTemps(seance.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-16"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddSeanceModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const AddSeanceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, addSeanceEmploiDuTemps } = useApp();
  const [formData, setFormData] = useState({
    jour: 'lundi' as any,
    heureDebut: '08:00',
    heureFin: '09:00',
    matiereId: '',
    classe: '',
    professeur: '',
    salle: '',
  });

  const classes = [...new Set(state.eleves.map(e => e.classe))].sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSeanceEmploiDuTemps(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-gray-700/20 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ajouter une séance</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jour</label>
              <select
                value={formData.jour}
                onChange={(e) => setFormData({ ...formData, jour: e.target.value as any })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="lundi">Lundi</option>
                <option value="mardi">Mardi</option>
                <option value="mercredi">Mercredi</option>
                <option value="jeudi">Jeudi</option>
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Classe</label>
              <select
                value={formData.classe}
                onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              >
                <option value="">Sélectionner</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Heure début</label>
              <input
                type="time"
                value={formData.heureDebut}
                onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Heure fin</label>
              <input
                type="time"
                value={formData.heureFin}
                onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Matière</label>
              <select
                value={formData.matiereId}
                onChange={(e) => setFormData({ ...formData, matiereId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              >
                <option value="">Sélectionner</option>
                {state.matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Professeur</label>
              <input
                type="text"
                value={formData.professeur}
                onChange={(e) => setFormData({ ...formData, professeur: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Salle</label>
              <input
                type="text"
                value={formData.salle}
                onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium"
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
