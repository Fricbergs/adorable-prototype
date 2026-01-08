import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { recordMorseAssessment } from '../../domain/residentDataHelpers';

/**
 * MorseScaleModal - Fall risk assessment using Morse scale
 * Based on AD-23 spec: 6 criteria with point values
 */
const MorseScaleModal = ({ resident, onSave, onClose }) => {
  const [factors, setFactors] = useState({
    fallHistory: 0,         // 0 or 25 points
    secondaryDiagnosis: 0,  // 0 or 15 points
    ambulatoryAid: 0,       // 0, 15, or 30 points
    ivTherapy: 0,           // 0 or 20 points
    gait: 0,                // 0, 10, or 20 points
    mentalStatus: 0         // 0 or 15 points
  });
  const [assessedBy, setAssessedBy] = useState('Māsa');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFactorChange = (factor, value) => {
    setFactors(prev => ({ ...prev, [factor]: parseInt(value) }));
  };

  // Calculate total score
  const totalScore = Object.values(factors).reduce((sum, val) => sum + val, 0);

  // Determine risk level
  const getRiskLevel = () => {
    if (totalScore >= 51) return { level: 'high', label: 'Augsts risks', color: 'red' };
    if (totalScore >= 25) return { level: 'medium', label: 'Vidējs risks', color: 'yellow' };
    return { level: 'low', label: 'Zems risks', color: 'green' };
  };

  const riskLevel = getRiskLevel();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      recordMorseAssessment(resident.id, {
        factors,
        assessedBy,
        notes,
        assessedAt: new Date().toISOString()
      });
      onSave();
    } catch (error) {
      console.error('Error saving Morse assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const riskColors = {
    red: 'bg-red-100 text-red-700 border-red-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    green: 'bg-green-100 text-green-700 border-green-300'
  };

  // Morse scale criteria with options
  const criteria = [
    {
      id: 'fallHistory',
      label: 'Kritieni anamnēzē',
      description: 'Vai pēdējo 3 mēnešu laikā ir bijuši kritieni?',
      options: [
        { value: 0, label: 'Nē' },
        { value: 25, label: 'Jā' }
      ]
    },
    {
      id: 'secondaryDiagnosis',
      label: 'Sekundārā diagnoze',
      description: 'Vai ir vairāk nekā viena diagnoze?',
      options: [
        { value: 0, label: 'Nē' },
        { value: 15, label: 'Jā' }
      ]
    },
    {
      id: 'ambulatoryAid',
      label: 'Pārvietošanās palīglīdzekļi',
      description: 'Kāds palīglīdzeklis tiek lietots?',
      options: [
        { value: 0, label: 'Nav / gultas režīms / māsas palīdzība' },
        { value: 15, label: 'Kruķi / staigulītis / spieķis' },
        { value: 30, label: 'Turas pie mēbelēm' }
      ]
    },
    {
      id: 'ivTherapy',
      label: 'Intravenozā terapija',
      description: 'Vai ir IV katetrs vai infūzija?',
      options: [
        { value: 0, label: 'Nē' },
        { value: 20, label: 'Jā' }
      ]
    },
    {
      id: 'gait',
      label: 'Gaita',
      description: 'Novērtējiet pacienta gaitu',
      options: [
        { value: 0, label: 'Normāla / gultas režīms / ratiņkrēsls' },
        { value: 10, label: 'Vāja (šļūc ar kājām, īsi soļi)' },
        { value: 20, label: 'Traucēta (nestabila, vajag palīdzību)' }
      ]
    },
    {
      id: 'mentalStatus',
      label: 'Garīgais stāvoklis',
      description: 'Vai pacients apzinās savus ierobežojumus?',
      options: [
        { value: 0, label: 'Orientēts uz savām spējām' },
        { value: 15, label: 'Pārvērtē savas spējas / aizmirst ierobežojumus' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Morsa skala - Kritienu risks
              </h2>
              <p className="text-sm text-gray-500">
                Novērtējiet kritienu risku
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score display */}
        <div className={`mx-6 mt-4 p-4 rounded-lg border-2 ${riskColors[riskLevel.color]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Kopējais punktu skaits</p>
              <p className="text-3xl font-bold">{totalScore}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Riska līmenis</p>
              <p className="text-xl font-bold">{riskLevel.label}</p>
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span>0-24: Zems risks</span>
            <span className="mx-2">|</span>
            <span>25-50: Vidējs risks</span>
            <span className="mx-2">|</span>
            <span>51+: Augsts risks</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {criteria.map(criterion => (
            <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                {criterion.label}
              </label>
              <p className="text-xs text-gray-500 mb-2">{criterion.description}</p>
              <div className="space-y-1">
                {criterion.options.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={criterion.id}
                      value={option.value}
                      checked={factors[criterion.id] === option.value}
                      onChange={(e) => handleFactorChange(criterion.id, e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">{option.value} punkti</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piezīmes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Papildus novērojumi..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atcelt
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saglabā...' : 'Saglabāt novērtējumu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MorseScaleModal;
