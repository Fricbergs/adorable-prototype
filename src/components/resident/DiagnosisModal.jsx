import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { DIAGNOSIS_STATUS } from '../../constants/residentConstants';
import { addDiagnosis, updateDiagnosis } from '../../domain/residentDataHelpers';

/**
 * DiagnosisModal - Add/Edit diagnosis form
 * Based on AD-14 spec: Diagnoze, Papildus info, Uzstādīšanas datums, Statuss, Klīniskais stāvoklis
 */
const DiagnosisModal = ({ resident, diagnosis, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    diagnosedDate: new Date().toISOString().split('T')[0],
    status: 'active',
    clinicalStatus: '',
    notes: '',
    createdBy: 'Dakteris Gints'
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with existing diagnosis data
  useEffect(() => {
    if (diagnosis) {
      setFormData({
        code: diagnosis.code || '',
        description: diagnosis.description || '',
        diagnosedDate: diagnosis.diagnosedDate || new Date().toISOString().split('T')[0],
        status: diagnosis.status || 'active',
        clinicalStatus: diagnosis.clinicalStatus || '',
        notes: diagnosis.notes || '',
        createdBy: diagnosis.createdBy || 'Dakteris Gints'
      });
    }
  }, [diagnosis]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Diagnozes apraksts ir obligāts';
    }
    if (!formData.diagnosedDate) {
      newErrors.diagnosedDate = 'Diagnosticēšanas datums ir obligāts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (diagnosis?.id) {
        // Update existing
        updateDiagnosis(diagnosis.id, formData);
      } else {
        // Add new
        addDiagnosis(resident.id, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving diagnosis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Common ICD-10 codes for elderly care
  const commonCodes = [
    { code: 'I10', description: 'Esenciāla (primāra) hipertensija' },
    { code: 'E11', description: 'Cukura diabēts, 2. tips' },
    { code: 'F03', description: 'Demence, neprecizēta' },
    { code: 'J44', description: 'Cita hroniska obstruktīva plaušu slimība' },
    { code: 'I25', description: 'Hroniska išēmiska sirds slimība' },
    { code: 'M81', description: 'Osteoporoze bez patoloģiska lūzuma' },
    { code: 'G30', description: 'Alcheimera slimība' },
    { code: 'N18', description: 'Hroniska nieru slimība' },
    { code: 'I48', description: 'Priekškambaru mirdzēšana un plandīšanās' },
    { code: 'F32', description: 'Depresīva epizode' },
  ];

  const selectCommonCode = (item) => {
    setFormData(prev => ({
      ...prev,
      code: item.code,
      description: item.description
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {diagnosis ? 'Rediģēt diagnozi' : 'Pievienot diagnozi'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ICD-10 Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SSK-10 kods
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="piem., I10, E11"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Quick select common diagnoses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biežāk lietotās diagnozes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonCodes.slice(0, 5).map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => selectCommonCode(item)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded transition-colors"
                >
                  {item.code}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnozes apraksts <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="piem., Esenciāla hipertensija"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Diagnosed Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosticēšanas datums <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.diagnosedDate}
              onChange={(e) => handleChange('diagnosedDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.diagnosedDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.diagnosedDate && (
              <p className="mt-1 text-sm text-red-500">{errors.diagnosedDate}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statuss
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {Object.entries(DIAGNOSIS_STATUS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clinical status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Klīniskais stāvoklis
            </label>
            <select
              value={formData.clinicalStatus}
              onChange={(e) => handleChange('clinicalStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Nav norādīts</option>
              <option value="stable">Stabils</option>
              <option value="improving">Uzlabojas</option>
              <option value="worsening">Pasliktinās</option>
              <option value="remission">Remisija</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Papildus informācija
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Piezīmes par diagnozi..."
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

export default DiagnosisModal;
