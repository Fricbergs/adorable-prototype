import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { recordBradenAssessment } from '../../domain/residentDataHelpers';

/**
 * BradenScaleModal - Pressure ulcer risk assessment using Braden scale
 * Based on AD-22 spec: 6 criteria with 1-4 scoring (lower total = higher risk)
 */
const BradenScaleModal = ({ resident, onSave, onClose }) => {
  const [factors, setFactors] = useState({
    sensoryPerception: 3,  // 1-4 points
    moisture: 3,           // 1-4 points
    activity: 3,           // 1-4 points
    mobility: 3,           // 1-4 points
    nutrition: 3,          // 1-4 points
    frictionShear: 2       // 1-3 points
  });
  const [assessedBy, setAssessedBy] = useState('Māsa');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFactorChange = (factor, value) => {
    setFactors(prev => ({ ...prev, [factor]: parseInt(value) }));
  };

  // Calculate total score (6-23 range)
  const totalScore = Object.values(factors).reduce((sum, val) => sum + val, 0);

  // Determine risk level (lower score = higher risk)
  const getRiskLevel = () => {
    if (totalScore <= 12) return { level: 'very_high', label: 'Ļoti augsts risks', color: 'red' };
    if (totalScore <= 14) return { level: 'high', label: 'Augsts risks', color: 'orange' };
    if (totalScore <= 18) return { level: 'medium', label: 'Vidējs risks', color: 'yellow' };
    return { level: 'low', label: 'Zems risks', color: 'green' };
  };

  const riskLevel = getRiskLevel();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      recordBradenAssessment(resident.id, {
        factors,
        assessedBy,
        notes,
        assessedAt: new Date().toISOString()
      });
      onSave();
    } catch (error) {
      console.error('Error saving Braden assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const riskColors = {
    red: 'bg-red-100 text-red-700 border-red-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    green: 'bg-green-100 text-green-700 border-green-300'
  };

  // Braden scale criteria with options
  const criteria = [
    {
      id: 'sensoryPerception',
      label: 'Sensorā uztvere',
      description: 'Spēja adekvāti reaģēt uz spiediena izraisītu diskomfortu',
      options: [
        { value: 1, label: 'Pilnībā ierobežota - neatbild uz sāpīgiem stimuliem' },
        { value: 2, label: 'Ļoti ierobežota - reaģē tikai uz spēcīgiem stimuliem' },
        { value: 3, label: 'Nedaudz ierobežota - reaģē uz verbāliem norādījumiem' },
        { value: 4, label: 'Nav traucējumu - reaģē uz verbāliem norādījumiem' }
      ]
    },
    {
      id: 'moisture',
      label: 'Mitrums',
      description: 'Cik lielā mērā āda ir pakļauta mitrumam',
      options: [
        { value: 1, label: 'Pastāvīgi mitra - āda gandrīz vienmēr ir mitra' },
        { value: 2, label: 'Ļoti mitra - āda bieži ir mitra' },
        { value: 3, label: 'Reizēm mitra - āda reizēm ir mitra' },
        { value: 4, label: 'Reti mitra - āda parasti ir sausa' }
      ]
    },
    {
      id: 'activity',
      label: 'Aktivitāte',
      description: 'Fiziskās aktivitātes līmenis',
      options: [
        { value: 1, label: 'Gulošs - guļ gultā' },
        { value: 2, label: 'Sēdošs - staigāšanas spējas ļoti ierobežotas' },
        { value: 3, label: 'Reizēm staigā - staigā reizēm dienas laikā' },
        { value: 4, label: 'Staigā bieži - staigā ārpus istabas vismaz 2x dienā' }
      ]
    },
    {
      id: 'mobility',
      label: 'Mobilitāte',
      description: 'Spēja mainīt un kontrolēt ķermeņa stāvokli',
      options: [
        { value: 1, label: 'Pilnībā nekustīgs - nemaina ķermeņa stāvokli bez palīdzības' },
        { value: 2, label: 'Ļoti ierobežota - veic nelielas pozīcijas izmaiņas' },
        { value: 3, label: 'Nedaudz ierobežota - bieži maina pozīciju patstāvīgi' },
        { value: 4, label: 'Nav ierobežojumu - maina pozīciju bez palīdzības' }
      ]
    },
    {
      id: 'nutrition',
      label: 'Uzturs',
      description: 'Parastais uztura uzņemšanas režīms',
      options: [
        { value: 1, label: 'Ļoti slikts - reti apēd pilnu maltīti' },
        { value: 2, label: 'Iespējams nepietiekams - reti apēd vairāk nekā pusi maltītes' },
        { value: 3, label: 'Adekvāts - apēd vairāk nekā pusi maltītes' },
        { value: 4, label: 'Izcils - apēd lielāko daļu maltītes' }
      ]
    },
    {
      id: 'frictionShear',
      label: 'Berze un bīde',
      description: 'Berzes un bīdes ietekme uz ādu',
      maxValue: 3,
      options: [
        { value: 1, label: 'Problēma - vajadzīga maksimāla palīdzība kustībām' },
        { value: 2, label: 'Potenciāla problēma - kustas ar zināmām grūtībām' },
        { value: 3, label: 'Nav acīmredzamas problēmas - kustas patstāvīgi gultā/krēslā' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Bradena skala - Izgulējumu risks
              </h2>
              <p className="text-sm text-gray-500">
                Novērtējiet spiediena čūlas risku
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
            <span>≤12: Ļoti augsts</span>
            <span className="mx-2">|</span>
            <span>13-14: Augsts</span>
            <span className="mx-2">|</span>
            <span>15-18: Vidējs</span>
            <span className="mx-2">|</span>
            <span>19+: Zems</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {criteria.map(criterion => (
            <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    {criterion.label}
                  </label>
                  <p className="text-xs text-gray-500">{criterion.description}</p>
                </div>
                <span className="text-lg font-bold text-orange-600 ml-2">
                  {factors[criterion.id]}
                </span>
              </div>
              <div className="space-y-1">
                {criterion.options.map(option => (
                  <label key={option.value} className="flex items-start gap-2 cursor-pointer py-1">
                    <input
                      type="radio"
                      name={criterion.id}
                      value={option.value}
                      checked={factors[criterion.id] === option.value}
                      onChange={(e) => handleFactorChange(criterion.id, e.target.value)}
                      className="mt-0.5 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                    <span className="text-xs text-gray-400">{option.value}</span>
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
              placeholder="Papildus novērojumi par ādas stāvokli..."
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

export default BradenScaleModal;
