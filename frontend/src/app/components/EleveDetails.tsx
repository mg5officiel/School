import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Edit, Calendar, Phone, MapPin, User, Users, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Eleve } from '../types';

interface EleveDetailsProps {
  eleve: Eleve;
  onBack: () => void;
}

export const EleveDetails: React.FC<EleveDetailsProps> = ({ eleve, onBack }) => {
  const { state, updateEleve } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(eleve);

  const handleSave = () => {
    updateEleve(eleve.id, formData);
    setIsEditing(false);
  };

  const notesEleve = state.notes.filter(n => n.eleveId === eleve.id);
  const bulletinsEleve = state.bulletins.filter(b => b.eleveId === eleve.id);

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Détails de l'élève
        </h2>
      </div>

      {/* Carte principale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 shadow-lg"
      >
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
              {eleve.prenom[0]}{eleve.nom[0]}
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {eleve.prenom} {eleve.nom}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                Matricule: {eleve.matricule}
              </p>
              <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                eleve.statut === 'actif' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                {eleve.statut}
              </span>
            </div>
          </div>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </motion.button>
          )}
        </div>

        {/* Informations */}
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prénom</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Classe</label>
                <input
                  type="text"
                  value={formData.classe}
                  onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone tuteur</label>
                <input
                  type="tel"
                  value={formData.telephoneTuteur}
                  onChange={(e) => setFormData({ ...formData, telephoneTuteur: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
              >
                Enregistrer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setFormData(eleve);
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium"
              >
                Annuler
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={Calendar} label="Date de naissance" value={new Date(eleve.dateNaissance).toLocaleDateString('fr-FR')} />
            <InfoItem icon={MapPin} label="Lieu de naissance" value={eleve.lieuNaissance} />
            <InfoItem icon={User} label="Sexe" value={eleve.sexe === 'M' ? 'Masculin' : 'Féminin'} />
            <InfoItem icon={Users} label="Classe" value={eleve.classe} />
            <InfoItem icon={Phone} label="Téléphone tuteur" value={eleve.telephoneTuteur} />
            <InfoItem icon={MapPin} label="Adresse" value={eleve.adresse} />
            {eleve.nomPere && <InfoItem icon={User} label="Nom du père" value={eleve.nomPere} />}
            {eleve.nomMere && <InfoItem icon={User} label="Nom de la mère" value={eleve.nomMere} />}
          </div>
        )}
      </motion.div>

      {/* Résultats scolaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Notes ({notesEleve.length})
            </h3>
          </div>
          {notesEleve.length > 0 ? (
            <div className="space-y-2">
              {notesEleve.slice(0, 5).map(note => {
                const matiere = state.matieres.find(m => m.id === note.matiereId);
                return (
                  <div key={note.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{matiere?.nom}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{note.moyenne.toFixed(2)}/20</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">Aucune note enregistrée</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Bulletins ({bulletinsEleve.length})
            </h3>
          </div>
          {bulletinsEleve.length > 0 ? (
            <div className="space-y-2">
              {bulletinsEleve.map(bulletin => (
                <div key={bulletin.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Trimestre {bulletin.trimestre}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {bulletin.moyenneGenerale.toFixed(2)}/20
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">Aucun bulletin généré</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);
