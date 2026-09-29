import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateBulletinPDF } from '../utils/pdfGenerator';

export const Bulletins: React.FC = () => {
  const { state, addNote, addBulletin } = useApp();
  const [selectedEleve, setSelectedEleve] = useState('');
  const [selectedTrimestre, setSelectedTrimestre] = useState<1 | 2 | 3>(1);

  const anneeScolaireActive = state.annesScolaires.find(a => a.estActive);
  const eleves = state.eleves.filter(e => e.anneeScolaireId === anneeScolaireActive?.id);

  const handleGeneratePDF = (eleveId: string, trimestre: number) => {
    const eleve = state.eleves.find(e => e.id === eleveId);
    if (!eleve) return;

    const notes = state.notes.filter(n => n.eleveId === eleveId && n.trimestre === trimestre);
    const bulletin = state.bulletins.find(b => b.eleveId === eleveId && b.trimestre === trimestre);

    if (!bulletin || notes.length === 0) {
      alert('Aucune note ou bulletin disponible pour cet élève et ce trimestre');
      return;
    }

    generateBulletinPDF(eleve, bulletin, notes, state.matieres, state.settings, trimestre);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
          <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bulletins scolaires</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={selectedEleve}
          onChange={(e) => setSelectedEleve(e.target.value)}
          className="px-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">Sélectionner un élève</option>
          {eleves.map(e => (
            <option key={e.id} value={e.id}>{e.prenom} {e.nom} - {e.classe}</option>
          ))}
        </select>
        <select
          value={selectedTrimestre}
          onChange={(e) => setSelectedTrimestre(Number(e.target.value) as 1 | 2 | 3)}
          className="px-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value={1}>1er Trimestre</option>
          <option value={2}>2ème Trimestre</option>
          <option value={3}>3ème Trimestre</option>
        </select>
      </div>

      {selectedEleve && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Notes du trimestre {selectedTrimestre}
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGeneratePDF(selectedEleve, selectedTrimestre)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium"
            >
              <Download className="w-4 h-4" />
              Générer PDF
            </motion.button>
          </div>

          <NotesTable eleveId={selectedEleve} trimestre={selectedTrimestre} />
        </motion.div>
      )}
    </div>
  );
};

const NotesTable: React.FC<{ eleveId: string; trimestre: number }> = ({ eleveId, trimestre }) => {
  const { state, addNote } = useApp();
  const notes = state.notes.filter(n => n.eleveId === eleveId && n.trimestre === trimestre);
  const anneeScolaireActive = state.annesScolaires.find(a => a.estActive);

  const handleAddNote = (matiereId: string) => {
    const noteDevoir = parseFloat(prompt('Note de devoir (sur 20):') || '0');
    const noteComposition = parseFloat(prompt('Note de composition (sur 20):') || '0');

    if (noteDevoir >= 0 && noteComposition >= 0) {
      const moyenne = (noteDevoir + noteComposition) / 2;
      addNote({
        eleveId,
        matiereId,
        trimestre: trimestre as 1 | 2 | 3,
        anneeScolaireId: anneeScolaireActive?.id || '',
        noteDevoir,
        noteComposition,
        moyenne,
        appreciation: moyenne >= 16 ? 'Excellent' : moyenne >= 14 ? 'Très bien' : moyenne >= 12 ? 'Bien' : moyenne >= 10 ? 'Assez bien' : 'Insuffisant',
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-3 font-bold text-gray-900 dark:text-white">Matière</th>
            <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Coef.</th>
            <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Devoir</th>
            <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Compo.</th>
            <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Moyenne</th>
            <th className="text-center p-3 font-bold text-gray-900 dark:text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {state.matieres.map(matiere => {
            const note = notes.find(n => n.matiereId === matiere.id);
            return (
              <tr key={matiere.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-3 text-gray-900 dark:text-white">{matiere.nom}</td>
                <td className="p-3 text-center text-gray-900 dark:text-white">{matiere.coefficient}</td>
                <td className="p-3 text-center text-gray-900 dark:text-white">
                  {note ? note.noteDevoir.toFixed(2) : '-'}
                </td>
                <td className="p-3 text-center text-gray-900 dark:text-white">
                  {note ? note.noteComposition.toFixed(2) : '-'}
                </td>
                <td className="p-3 text-center">
                  <span className={`font-bold ${note && note.moyenne >= 10 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {note ? note.moyenne.toFixed(2) : '-'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {!note && (
                    <button
                      onClick={() => handleAddNote(matiere.id)}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      Ajouter
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
