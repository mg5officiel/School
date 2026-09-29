import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Plus, Trash2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Utilisateurs: React.FC = () => {
  const { state, addUser, deleteUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const getRoleLabel = (role: string) => {
    const labels: any = {
      super_admin: 'Super Admin',
      directeur: 'Directeur',
      surveillant: 'Surveillant',
      secretaire: 'Secrétaire',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: any = {
      super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      directeur: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      surveillant: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      secretaire: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
            <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Ajouter un utilisateur
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                  {user.prenom[0]}{user.nom[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{user.prenom} {user.nom}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rôle:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              {user.telephone && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Téléphone:</span>
                  <span className="text-gray-900 dark:text-white">{user.telephone}</span>
                </div>
              )}
            </div>
            {user.role !== 'super_admin' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (confirm(`Supprimer l'utilisateur ${user.prenom} ${user.nom} ?`)) {
                    deleteUser(user.id);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const AddUserModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addUser } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'secretaire' as any,
    telephone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 max-w-lg w-full border border-white/20 dark:border-gray-700/20 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ajouter un utilisateur</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
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
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="directeur">Directeur</option>
              <option value="surveillant">Surveillant</option>
              <option value="secretaire">Secrétaire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone (optionnel)</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium"
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
