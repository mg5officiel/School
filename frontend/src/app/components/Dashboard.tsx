import React from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Calendar, TrendingUp, GraduationCap, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const { state } = useApp();

  const anneeScolaireActive = state.annesScolaires.find(a => a.estActive);
  const elevesActifs = state.eleves.filter(e => e.statut === 'actif' && e.anneeScolaireId === anneeScolaireActive?.id);

  // Statistiques par classe
  const elevesParClasse: { [key: string]: number } = {};
  elevesActifs.forEach(e => {
    elevesParClasse[e.classe] = (elevesParClasse[e.classe] || 0) + 1;
  });

  const dataClasses = Object.entries(elevesParClasse).map(([classe, count]) => ({
    name: classe,
    eleves: count,
  }));

  // Répartition par sexe
  const garcons = elevesActifs.filter(e => e.sexe === 'M').length;
  const filles = elevesActifs.filter(e => e.sexe === 'F').length;

  const dataSexe = [
    { name: 'Garçons', value: garcons },
    { name: 'Filles', value: filles },
  ];

  const COLORS = ['#3b82f6', '#ec4899'];

  const stats = [
    {
      label: 'Élèves actifs',
      value: elevesActifs.length,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Classes',
      value: Object.keys(elevesParClasse).length,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Utilisateurs',
      value: state.users.length,
      icon: User,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Bulletins générés',
      value: state.bulletins.length,
      icon: GraduationCap,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className="w-6 h-6 text-gray-700 dark:text-white" />
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} opacity-20`}></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique par classe */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Élèves par classe
          </h3>
          {dataClasses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataClasses}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                <YAxis tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="eleves" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </motion.div>

        {/* Graphique par sexe */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Répartition par sexe
          </h3>
          {garcons > 0 || filles > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataSexe}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataSexe.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </motion.div>
      </div>

      {/* Activités récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Bienvenue dans le système de gestion scolaire
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Année scolaire active: {anneeScolaireActive?.nom || 'Aucune'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Gérez les élèves, les emplois du temps, et générez des bulletins scolaires
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
