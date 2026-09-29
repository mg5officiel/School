import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Download, Upload, Database, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToExcel, exportToSQL, exportToJSON, importFromExcel, importFromJSON } from '../utils/export';

export const ImportExport: React.FC = () => {
  const { state, importData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await importFromExcel(file);
        importData(data);
        alert('Données importées avec succès depuis Excel');
      } catch (error) {
        alert('Erreur lors de l\'importation: ' + error);
      }
    }
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const data = await importFromJSON(file);
        if (confirm('Attention: cette opération va remplacer toutes les données actuelles. Continuer?')) {
          importData(data);
          alert('Backup restauré avec succès');
        }
      } catch (error) {
        alert('Erreur lors de la restauration: ' + error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20">
          <Database className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import / Export des données</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Excel */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Export Excel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exporter vers un fichier Excel</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportToExcel(state)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg"
          >
            <Download className="w-5 h-5" />
            Télécharger Excel
          </motion.button>
        </motion.div>

        {/* Import Excel */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Import Excel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Importer depuis un fichier Excel</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Importer Excel
          </motion.button>
        </motion.div>

        {/* Export SQL */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Export SQL</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Générer un script SQL</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportToSQL(state)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg"
          >
            <Download className="w-5 h-5" />
            Télécharger SQL
          </motion.button>
        </motion.div>

        {/* Backup complet */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
              <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Backup complet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sauvegarde/restauration complète</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportToJSON(state)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium text-sm shadow-lg"
            >
              <Download className="w-4 h-4" />
              Backup
            </motion.button>
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => jsonInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium text-sm shadow-lg"
            >
              <Upload className="w-4 h-4" />
              Restaurer
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Informations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
      >
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Informations importantes</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <span>Les données sont automatiquement sauvegardées dans le navigateur (localStorage)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400">•</span>
            <span>L'export Excel permet de partager les données avec d'autres applications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400">•</span>
            <span>L'export SQL génère un script pour importer dans une base de données</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 dark:text-orange-400">•</span>
            <span>Le backup complet sauvegarde TOUTES les données (utilisateurs, élèves, notes, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400">•</span>
            <span>Faites des backups réguliers pour éviter la perte de données</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
