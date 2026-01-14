import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { DIAGNOSIS_STATUS } from '../../constants/residentConstants';
import { ICD10_CODES } from '../../constants/icd10Codes';
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

  // Search state - codeInput is what user types in the dropdown search
  const [codeInput, setCodeInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter ICD-10 codes based on what user typed
  const filteredCodes = useMemo(() => {
    const query = codeInput.toLowerCase().trim();
    if (!query || query.length < 1) return [];

    const results = ICD10_CODES.filter(item =>
      item.code.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query)
    );

    // Limit to 50 results for performance
    return results.slice(0, 50);
  }, [codeInput]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const selectCode = (item) => {
    setFormData(prev => ({
      ...prev,
      code: item.code,
      description: item.name
    }));
    setCodeInput('');
    setShowDropdown(false);
    // Clear validation error
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code || !formData.description.trim()) {
      newErrors.description = 'Lūdzu izvēlieties diagnozi';
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
    { code: 'I10', name: 'Esenciāla (primāra) hipertensija' },
    { code: 'E11', name: 'Cukura diabēts, 2. tips' },
    { code: 'F03', name: 'Demence, neprecizēta' },
    { code: 'J44', name: 'Cita hroniska obstruktīva plaušu slimība' },
    { code: 'I25', name: 'Hroniska išēmiska sirds slimība' },
  ];

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
          {/* Combined Diagnosis Selector with Search Dropdown */}
          <div className="relative" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnoze <span className="text-red-500">*</span>
            </label>

            {/* Clickable selector field */}
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } hover:border-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
            >
              {formData.code ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-medium text-sm shrink-0">
                    {formData.code}
                  </span>
                  <span className="text-gray-700 truncate">{formData.description}</span>
                </div>
              ) : (
                <span className="text-gray-400">Izvēlieties diagnozi...</span>
              )}
              <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}

            {/* Dropdown with search */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {/* Search input inside dropdown */}
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Meklēt pēc koda vai nosaukuma..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Quick select common diagnoses */}
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-1.5">Biežāk lietotās:</p>
                  <div className="flex flex-wrap gap-1">
                    {commonCodes.map(item => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => selectCode(item)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 rounded transition-colors"
                      >
                        {item.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search results */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredCodes.length > 0 ? (
                    filteredCodes.map((item, idx) => (
                      <button
                        key={`${item.code}-${idx}`}
                        type="button"
                        onClick={() => selectCode(item)}
                        className="w-full px-3 py-2 text-left hover:bg-orange-50 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-orange-600">{item.code}</span>
                        <span className="text-gray-600 ml-2 text-sm">{item.name}</span>
                      </button>
                    ))
                  ) : codeInput.length >= 2 ? (
                    <div className="p-3 text-gray-500 text-sm text-center">
                      Nav atrasts neviens kods
                    </div>
                  ) : (
                    <div className="p-3 text-gray-400 text-sm text-center">
                      Ievadiet vismaz 2 simbolus...
                    </div>
                  )}
                </div>
              </div>
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
