import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Save, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Profil: React.FC = () => {
  const { state, updateUser } = useApp();
  const user = state.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser(user.id, formData);
      setIsEditing(false);
      alert('Profil mis à jour avec succès');
    }
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    if (user && user.password === oldPassword) {
      updateUser(user.id, { password: newPassword });
      setShowPasswordModal(false);
      alert('Mot de passe modifié avec succès');
    } else {
      alert('Ancien mot de passe incorrect');
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20">
          <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mon Profil</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte de profil */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-3xl mb-4">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 capitalize">
              {user.role.replace('_', ' ')}
            </p>
            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white font-medium">{user.email}</span>
              </div>
              {user.telephone && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <span className="text-gray-600 dark:text-gray-400">Téléphone:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{user.telephone}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="text-gray-600 dark:text-gray-400">Membre depuis:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Formulaire de modification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations personnelles</h3>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl font-medium text-sm"
              >
                Modifier
              </motion.button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-medium"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setFormData({
                      nom: user.nom,
                      prenom: user.prenom,
                      email: user.email,
                      telephone: user.telephone || '',
                    });
                    setIsEditing(false);
                  }}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium"
                >
                  Annuler
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Nom" value={user.nom} />
                <InfoField label="Prénom" value={user.prenom} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Téléphone" value={user.telephone || 'Non renseigné'} />
                <InfoField label="Rôle" value={user.role.replace('_', ' ')} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl font-medium text-sm mt-6"
              >
                <Lock className="w-4 h-4" />
                Changer le mot de passe
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
};

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
    <p className="font-medium text-gray-900 dark:text-white">{value}</p>
  </div>
);

const ChangePasswordModal: React.FC<{
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => void;
}> = ({ onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    onSubmit(oldPassword, newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 max-w-md w-full border border-white/20 dark:border-gray-700/20 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Changer le mot de passe</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ancien mot de passe</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium"
            >
              Modifier
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
