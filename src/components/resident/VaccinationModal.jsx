import React, { useState, useEffect } from 'react';
import { X, Syringe } from 'lucide-react';
import { VACCINATION_TYPES } from '../../constants/residentConstants';
import { addVaccination, updateVaccination } from '../../domain/residentDataHelpers';

/**
 * VaccinationModal - Add/Edit vaccination record
 * Based on AD-26 spec: Datums, Vakcīna, Sērija
 */
const VaccinationModal = ({ resident, vaccination, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    vaccineName: '',
    vaccineType: 'other',
    series: '',
    administeredDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
    administeredBy: 'Māsa',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with existing vaccination data
  useEffect(() => {
    if (vaccination) {
      setFormData({
        vaccineName: vaccination.vaccineName || '',
        vaccineType: vaccination.vaccineType || 'other',
        series: vaccination.series || '',
        administeredDate: vaccination.administeredDate || new Date().toISOString().split('T')[0],
        expirationDate: vaccination.expirationDate || '',
        administeredBy: vaccination.administeredBy || 'Māsa',
        notes: vaccination.notes || ''
      });
    }
  }, [vaccination]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // When vaccine type changes, auto-fill vaccine name
  const handleTypeChange = (type) => {
    handleChange('vaccineType', type);
    const vaccineConfig = VACCINATION_TYPES.find(v => v.value === type);
    if (vaccineConfig && type !== 'other') {
      handleChange('vaccineName', vaccineConfig.label);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vaccineName.trim()) {
      newErrors.vaccineName = 'Vakcīnas nosaukums ir obligāts';
    }
    if (!formData.administeredDate) {
      newErrors.administeredDate = 'Datums ir obligāts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (vaccination?.id) {
        updateVaccination(vaccination.id, formData);
      } else {
        addVaccination(resident.id, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving vaccination:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Common vaccines with pre-filled names
  const commonVaccines = [
    { type: 'covid19', name: 'Comirnaty (COVID-19)' },
    { type: 'flu', name: 'Influvac Tetra' },
    { type: 'pneumococcal', name: 'Prevenar 13' },
    { type: 'tetanus', name: 'Tetanus Toxoid' },
    { type: 'shingles', name: 'Shingrix' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Syringe className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {vaccination ? 'Rediģēt vakcināciju' : 'Pievienot vakcināciju'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Vaccine Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vakcīnas tips
            </label>
            <select
              value={formData.vaccineType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {VACCINATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick select common vaccines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biežāk lietotās vakcīnas
            </label>
            <div className="flex flex-wrap gap-2">
              {commonVaccines.map(vaccine => (
                <button
                  key={vaccine.type}
                  type="button"
                  onClick={() => {
                    handleTypeChange(vaccine.type);
                    handleChange('vaccineName', vaccine.name);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded transition-colors"
                >
                  {vaccine.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Vaccine Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vakcīnas nosaukums <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.vaccineName}
              onChange={(e) => handleChange('vaccineName', e.target.value)}
              placeholder="piem., Comirnaty, Influvac"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.vaccineName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.vaccineName && (
              <p className="mt-1 text-sm text-red-500">{errors.vaccineName}</p>
            )}
          </div>

          {/* Series/Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sērijas numurs
            </label>
            <input
              type="text"
              value={formData.series}
              onChange={(e) => handleChange('series', e.target.value)}
              placeholder="piem., ABC123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Administration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vakcinācijas datums <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.administeredDate}
              onChange={(e) => handleChange('administeredDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.administeredDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.administeredDate && (
              <p className="mt-1 text-sm text-red-500">{errors.administeredDate}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Piezīmes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
              placeholder="Reakcijas, blaknes..."
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

export default VaccinationModal;
