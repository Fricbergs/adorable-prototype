import React, { useState } from 'react';
import { X, Wrench, Check } from 'lucide-react';
import { TECHNICAL_AIDS } from '../../constants/residentConstants';
import { addTechnicalAid, getResidentTechnicalAids } from '../../domain/residentDataHelpers';

/**
 * TechnicalAidsModal - Manage technical/assistive aids for resident
 * Based on AD-25 spec: checkbox list of aids by category
 */
const TechnicalAidsModal = ({ resident, onSave, onClose }) => {
  // Get existing aids for this resident
  const existingAids = getResidentTechnicalAids(resident.id)
    .filter(a => a.status === 'active')
    .map(a => a.aidType);

  const [selectedAids, setSelectedAids] = useState(new Set(existingAids));
  const [customAid, setCustomAid] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedBy, setAssignedBy] = useState('Māsa');
  const [isSaving, setIsSaving] = useState(false);

  const toggleAid = (aidType) => {
    setSelectedAids(prev => {
      const newSet = new Set(prev);
      if (newSet.has(aidType)) {
        newSet.delete(aidType);
      } else {
        newSet.add(aidType);
      }
      return newSet;
    });
  };

  const addCustomAid = () => {
    if (customAid.trim()) {
      setSelectedAids(prev => new Set([...prev, `custom:${customAid.trim()}`]));
      setCustomAid('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      // Add new aids that weren't previously assigned
      const newAids = [...selectedAids].filter(aid => !existingAids.includes(aid));

      for (const aidType of newAids) {
        const isCustom = aidType.startsWith('custom:');
        const description = isCustom
          ? aidType.replace('custom:', '')
          : getAllAidItems().find(item => item.value === aidType)?.label || aidType;

        addTechnicalAid(resident.id, {
          category: isCustom ? 'other' : findCategory(aidType),
          aidType: isCustom ? 'custom' : aidType,
          description,
          assignedBy,
          notes
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving technical aids:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to find category for an aid type
  const findCategory = (aidType) => {
    for (const [category, config] of Object.entries(TECHNICAL_AIDS)) {
      if (config.items.some(item => item.value === aidType)) {
        return category;
      }
    }
    return 'other';
  };

  // Get all aid items as flat array
  const getAllAidItems = () => {
    return Object.values(TECHNICAL_AIDS).flatMap(category => category.items);
  };

  // Additional aids not in the predefined list
  const additionalAids = [
    { value: 'compression_socks', label: 'Kompresijas zeķes' },
    { value: 'anti_slip_socks', label: 'Pretslīdes zeķes' },
    { value: 'pressure_cushion', label: 'Pretspiediena spilvens' },
    { value: 'transfer_belt', label: 'Pārvietošanas josta' },
    { value: 'bed_wedge', label: 'Gultas ķīlis' },
    { value: 'grab_bars', label: 'Rokturi' },
    { value: 'commode', label: 'Tualetes krēsls' },
    { value: 'urinal', label: 'Urināls' },
    { value: 'feeding_cup', label: 'Dzeršanas trauks ar snīpi' },
    { value: 'adaptive_cutlery', label: 'Adaptīvie galda piederumi' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Tehniskie palīglīdzekļi
              </h2>
              <p className="text-sm text-gray-500">
                Izvēlētos: {selectedAids.size} palīglīdzekļi
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Categories from constants */}
          {Object.entries(TECHNICAL_AIDS).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {category.label}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.items.map(item => (
                  <label
                    key={item.value}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedAids.has(item.value)
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedAids.has(item.value)
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {selectedAids.has(item.value) && <Check className="w-3 h-3" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedAids.has(item.value)}
                      onChange={() => toggleAid(item.value)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Additional common aids */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Papildus palīglīdzekļi
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {additionalAids.map(item => (
                <label
                  key={item.value}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedAids.has(item.value)
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    selectedAids.has(item.value)
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAids.has(item.value) && <Check className="w-3 h-3" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAids.has(item.value)}
                    onChange={() => toggleAid(item.value)}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom aid input */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Cits palīglīdzeklis
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAid}
                onChange={(e) => setCustomAid(e.target.value)}
                placeholder="Ievadīt citu palīglīdzekli..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomAid();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomAid}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Pievienot
              </button>
            </div>
            {/* Show custom aids that have been added */}
            {[...selectedAids].filter(a => a.startsWith('custom:')).map(aid => (
              <span
                key={aid}
                className="inline-flex items-center gap-1 mt-2 mr-2 px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm"
              >
                {aid.replace('custom:', '')}
                <button
                  type="button"
                  onClick={() => toggleAid(aid)}
                  className="hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piezīmes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Papildus informācija par palīglīdzekļiem..."
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
              {isSaving ? 'Saglabā...' : 'Saglabāt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicalAidsModal;
