import React, { useState } from 'react';
import { X, Users, AlertTriangle, Check } from 'lucide-react';
import { recordExternalReceipt } from '../../domain/inventoryHelpers';
import { validateExternalReceipt, MEDICATION_FORMS, UNIT_OPTIONS } from '../../domain/inventoryValidation';
import { RELATIONSHIPS, CURRENT_USER } from '../../constants/inventoryConstants';

/**
 * Modal for recording medication brought by relatives
 */
const ExternalReceiptModal = ({ isOpen, onClose, residentId, residentName, onReceiptComplete }) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    activeIngredient: '',
    form: 'tabletes',
    batchNumber: '',
    expirationDate: '',
    quantity: '',
    unit: 'tabletes',
    broughtBy: '',
    relationship: 'family',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateExternalReceipt(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = recordExternalReceipt(residentId, {
        ...formData,
        quantity: parseInt(formData.quantity)
      });

      onReceiptComplete && onReceiptComplete(result);
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      medicationName: '',
      activeIngredient: '',
      form: 'tabletes',
      batchNumber: '',
      expirationDate: '',
      quantity: '',
      unit: 'tabletes',
      broughtBy: '',
      relationship: 'family',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Radinieki atnes zāles
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Resident Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Rezidents:</strong> {residentName}
            </p>
          </div>

          {/* Medication Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medikamenta nosaukums *
            </label>
            <input
              type="text"
              value={formData.medicationName}
              onChange={(e) => handleChange('medicationName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.medicationName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Piem., Aspirin 100 mg tabletes"
            />
            {errors.medicationName && (
              <p className="text-sm text-red-600 mt-1">{errors.medicationName}</p>
            )}
          </div>

          {/* Active Ingredient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aktīvā viela
            </label>
            <input
              type="text"
              value={formData.activeIngredient}
              onChange={(e) => handleChange('activeIngredient', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Piem., Acidum acetylsalicylicum"
            />
          </div>

          {/* Form and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma
              </label>
              <select
                value={formData.form}
                onChange={(e) => handleChange('form', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {MEDICATION_FORMS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vienība *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.unit ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="text-sm text-red-600 mt-1">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Quantity and Batch */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daudzums *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partijas Nr.
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => handleChange('batchNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ja zināms"
              />
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Derīguma termiņš
            </label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleChange('expirationDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Brought By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kurš atnesa zāles *
            </label>
            <input
              type="text"
              value={formData.broughtBy}
              onChange={(e) => handleChange('broughtBy', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.broughtBy ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Vārds, uzvārds"
            />
            {errors.broughtBy && (
              <p className="text-sm text-red-600 mt-1">{errors.broughtBy}</p>
            )}
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attiecības ar rezidentu
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => handleChange('relationship', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Papildu informācija..."
            />
          </div>

          {/* Received By */}
          <div className="text-sm text-gray-500">
            <strong>Pieņēma:</strong> {CURRENT_USER}
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{errors.submit}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Atcelt
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saglabā...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Reģistrēt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalReceiptModal;
