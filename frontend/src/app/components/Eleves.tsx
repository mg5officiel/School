import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Eye, Edit, Trash2, Users, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Eleve } from '../types';

interface ElevesProps {
  onViewDetails: (eleve: Eleve) => void;
}

export const Eleves: React.FC<ElevesProps> = ({ onViewDetails }) => {
  const { state, deleteEleve } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClasse, setFilterClasse] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const anneeScolaireActive = state.annesScolaires.find(a => a.estActive);
  const elevesFiltered = state.eleves
    .filter(e => e.anneeScolaireId === anneeScolaireActive?.id || !anneeScolaireActive)
    .filter(e => {
      const matchSearch = !searchTerm ||
        e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.matricule.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClasse = !filterClasse || e.classe === filterClasse;
      return matchSearch && matchClasse;
    });

  const classes = [...new Set(state.eleves.map(e => e.classe))].sort();

  const handleDelete = (id: string, nom: string, prenom: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'élève ${prenom} ${nom} ?`)) {
      deleteEleve(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Élèves
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {elevesFiltered.length} élève{elevesFiltered.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Ajouter un élève
        </motion.button>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterClasse}
            onChange={(e) => setFilterClasse(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          >
            <option value="">Toutes les classes</option>
            {classes.map(classe => (
              <option key={classe} value={classe}>{classe}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des élèves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {elevesFiltered.map((eleve, index) => (
          <motion.div
            key={eleve.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {eleve.prenom[0]}{eleve.nom[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {eleve.prenom} {eleve.nom}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {eleve.matricule}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                eleve.statut === 'actif' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                eleve.statut === 'inactif' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' :
                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              }`}>
                {eleve.statut}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Classe:</span>
                <span className="font-medium text-gray-900 dark:text-white">{eleve.classe}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Sexe:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Téléphone:</span>
                <span className="font-medium text-gray-900 dark:text-white">{eleve.telephoneTuteur}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewDetails(eleve)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Détails
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(eleve.id, eleve.nom, eleve.prenom)}
                className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {elevesFiltered.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Aucun élève trouvé
          </p>
        </div>
      )}

      {/* Modal d'ajout - sera créé dans un composant séparé */}
      {showAddModal && (
        <AddEleveModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

// Modal d'ajout d'élève
const AddEleveModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, addEleve } = useApp();
  const [formData, setFormData] = useState({
    matricule: `MAT${Date.now()}`,
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: 'Bamako',
    sexe: 'M' as 'M' | 'F',
    classe: '',
    telephoneTuteur: '',
    adresse: '',
    nomPere: '',
    nomMere: '',
  });

  const anneeScolaireActive = state.annesScolaires.find(a => a.estActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEleve({
      ...formData,
      anneeScolaireId: anneeScolaireActive?.id || '',
      dateInscription: new Date().toISOString(),
      statut: 'actif',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/20 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Ajouter un nouvel élève
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matricule
              </label>
              <input
                type="text"
                value={formData.matricule}
                onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Classe
              </label>
              <input
                type="text"
                value={formData.classe}
                onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ex: 6ème A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lieu de naissance
              </label>
              <input
                type="text"
                value={formData.lieuNaissance}
                onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sexe
              </label>
              <select
                value={formData.sexe}
                onChange={(e) => setFormData({ ...formData, sexe: e.target.value as 'M' | 'F' })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone tuteur
              </label>
              <input
                type="tel"
                value={formData.telephoneTuteur}
                onChange={(e) => setFormData({ ...formData, telephoneTuteur: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="+223 XX XX XX XX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du père
              </label>
              <input
                type="text"
                value={formData.nomPere}
                onChange={(e) => setFormData({ ...formData, nomPere: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de la mère
              </label>
              <input
                type="text"
                value={formData.nomMere}
                onChange={(e) => setFormData({ ...formData, nomMere: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse
            </label>
            <textarea
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
            >
              Ajouter l'élève
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
