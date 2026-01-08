import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { TIME_SLOTS, REFUSAL_REASONS } from '../../constants/prescriptionConstants';
import { markMedicationRefused } from '../../domain/prescriptionHelpers';
import { validateRefusal } from '../../domain/prescriptionValidation';

// Hardcoded current user for prototype
const CURRENT_USER = 'Gints Fricbergs';

/**
 * RefusalModal - Modal for recording medication refusal
 */
export default function RefusalModal({
  resident,
  prescription,
  timeSlot,
  onSave,
  onClose
}) {
  const [refusalReason, setRefusalReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // User comes from login session (hardcoded for prototype)
  const administeredBy = CURRENT_USER;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Get the actual reason text
  const getReasonText = () => {
    if (refusalReason === 'custom') {
      return customReason;
    }
    return refusalReason;
  };

  // Handle save
  const handleSave = async () => {
    const reasonText = getReasonText();

    const validation = validateRefusal({
      refusalReason: reasonText,
      administeredBy
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);

    try {
      markMedicationRefused(
        prescription.id,
        resident.id,
        timeSlot,
        reasonText,
        administeredBy,
        notes
      );
      onSave();
    } catch (error) {
      console.error('Error saving refusal:', error);
      setErrors({ submit: 'Kļūda saglabājot. Lūdzu mēģiniet vēlreiz.' });
    } finally {
      setIsSaving(false);
    }
  };

  const slotInfo = TIME_SLOTS[timeSlot];
  const scheduleInfo = prescription.schedule[timeSlot];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-red-50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-red-900">
                Atzīmēt atteikumu
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            {/* Medication info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-900">{prescription.medicationName}</div>
              <div className="text-sm text-gray-600 mt-1">
                {slotInfo?.label} ({scheduleInfo?.time}) — {scheduleInfo?.dose} {scheduleInfo?.unit}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Rezidents: {resident.firstName} {resident.lastName}
              </div>
            </div>

            {/* Reason selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atteikuma iemesls *
              </label>
              <div className="space-y-2">
                {REFUSAL_REASONS.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      refusalReason === reason
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="refusalReason"
                      value={reason}
                      checked={refusalReason === reason}
                      onChange={(e) => setRefusalReason(e.target.value)}
                      className="w-4 h-4 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}

                {/* Custom reason option */}
                <label
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    refusalReason === 'custom'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="refusalReason"
                    value="custom"
                    checked={refusalReason === 'custom'}
                    onChange={(e) => setRefusalReason(e.target.value)}
                    className="w-4 h-4 mt-1 text-red-500 focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700">Cits iemesls:</span>
                    {refusalReason === 'custom' && (
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Aprakstiet iemeslu..."
                        rows={2}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    )}
                  </div>
                </label>
              </div>
              {errors.refusalReason && (
                <p className="mt-1 text-sm text-red-600">{errors.refusalReason}</p>
              )}
            </div>

            {/* Administered by - auto-filled from logged in user */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kas atzīmēja *
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                {administeredBy}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Papildu piezīmes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Piem., mēģināsim vēlreiz pusdienās..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Atcelt
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saglabā...' : 'Atzīmēt atteikumu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
