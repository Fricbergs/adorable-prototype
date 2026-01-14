import { useState, useEffect } from 'react';
import { X, Pill, TrendingUp, TrendingDown, XCircle, Check } from 'lucide-react';
import { TIME_SLOTS, DOSE_ADJUSTMENT_REASONS, MEDICATION_UNITS } from '../../constants/prescriptionConstants';
import { logDoseAction } from '../../domain/prescriptionHelpers';
import { validateDoseAction } from '../../domain/prescriptionValidation';

// Hardcoded current user for prototype
const CURRENT_USER = 'Māsa Līga';

/**
 * RefusalModal - Modal for dose actions (give, increase, decrease, skip)
 * Extended from original refusal-only modal to support all dose actions
 */
export default function RefusalModal({
  resident,
  prescription,
  timeSlot,
  onSave,
  onClose
}) {
  const [actionType, setActionType] = useState('given'); // 'given' | 'increased' | 'decreased' | 'skipped'
  const [newDose, setNewDose] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // User comes from login session (hardcoded for prototype)
  const administeredBy = CURRENT_USER;

  const slotInfo = TIME_SLOTS[timeSlot];
  const scheduleInfo = prescription.schedule[timeSlot];
  const originalDose = `${scheduleInfo?.dose || ''} ${scheduleInfo?.unit || ''}`.trim();

  // Initialize newUnit from prescription
  useEffect(() => {
    if (scheduleInfo?.unit) {
      setNewUnit(scheduleInfo.unit);
    }
  }, [scheduleInfo]);

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
    if (reason === 'custom') {
      return customReason;
    }
    return reason;
  };

  // Get actual dose text
  const getActualDose = () => {
    if (actionType === 'skipped') return null;
    if (actionType === 'given') return originalDose;
    return `${newDose} ${newUnit}`.trim();
  };

  // Handle save
  const handleSave = async () => {
    const reasonText = getReasonText();
    const actualDose = getActualDose();

    const validation = validateDoseAction({
      actionType,
      actualDose: actionType === 'increased' || actionType === 'decreased' ? newDose : 'n/a',
      reason: reasonText,
      administeredBy
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);

    try {
      logDoseAction(
        prescription.id,
        resident.id,
        timeSlot,
        actionType,
        originalDose,
        actualDose,
        reasonText,
        administeredBy,
        notes
      );
      onSave();
    } catch (error) {
      console.error('Error saving dose action:', error);
      setErrors({ submit: 'Kļūda saglabājot. Lūdzu mēģiniet vēlreiz.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Action type options
  const actionOptions = [
    {
      value: 'given',
      label: 'Iedot parasto devu',
      sublabel: originalDose,
      icon: Check,
      color: 'green'
    },
    {
      value: 'increased',
      label: 'Iedot palielinātu devu',
      sublabel: 'Norādīt jauno devu',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      value: 'decreased',
      label: 'Iedot samazinātu devu',
      sublabel: 'Norādīt jauno devu',
      icon: TrendingDown,
      color: 'yellow'
    },
    {
      value: 'skipped',
      label: 'Izlaist šo devu',
      sublabel: 'Deva netiks iedota',
      icon: XCircle,
      color: 'red'
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      green: isSelected ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-200',
      blue: isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-blue-200',
      yellow: isSelected ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 hover:border-yellow-200',
      red: isSelected ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-red-200'
    };
    return colors[color];
  };

  const getIconColorClass = (color) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600'
    };
    return colors[color];
  };

  const getButtonColorClass = () => {
    const colors = {
      given: 'bg-green-600 hover:bg-green-700',
      increased: 'bg-blue-600 hover:bg-blue-700',
      decreased: 'bg-yellow-600 hover:bg-yellow-700',
      skipped: 'bg-red-600 hover:bg-red-700'
    };
    return colors[actionType];
  };

  const getHeaderColorClass = () => {
    const colors = {
      given: 'bg-green-50',
      increased: 'bg-blue-50',
      decreased: 'bg-yellow-50',
      skipped: 'bg-red-50'
    };
    return colors[actionType];
  };

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
          <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-xl ${getHeaderColorClass()}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Pill className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Devas darbība
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
          <div className="px-6 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Medication info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="font-medium text-gray-900">{prescription.medicationName}</div>
              <div className="text-sm text-gray-600 mt-1">
                {slotInfo?.label} ({scheduleInfo?.time}) — Paredzēts: {originalDose}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Rezidents: {resident.firstName} {resident.lastName}
              </div>
            </div>

            {/* Action type selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ko darīt ar šo devu? *
              </label>
              <div className="space-y-2">
                {actionOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = actionType === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${getColorClasses(option.color, isSelected)}`}
                    >
                      <input
                        type="radio"
                        name="actionType"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => setActionType(e.target.value)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <Icon className={`w-5 h-5 ${getIconColorClass(option.color)}`} />
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.sublabel}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.actionType && (
                <p className="mt-1 text-sm text-red-600">{errors.actionType}</p>
              )}
            </div>

            {/* New dose input (for increased/decreased) */}
            {(actionType === 'increased' || actionType === 'decreased') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jaunā deva *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDose}
                    onChange={(e) => setNewDose(e.target.value)}
                    placeholder="Piem., 2"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.actualDose ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {MEDICATION_UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
                {errors.actualDose && (
                  <p className="mt-1 text-sm text-red-600">{errors.actualDose}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Iepriekšējā deva: {originalDose}
                </p>
              </div>
            )}

            {/* Reason selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Iemesls *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">— Izvēlieties iemeslu —</option>
                {DOSE_ADJUSTMENT_REASONS.map((r, index) => (
                  <option key={index} value={r}>{r}</option>
                ))}
                <option value="custom">Cits iemesls...</option>
              </select>
              {reason === 'custom' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Aprakstiet iemeslu..."
                  rows={2}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              )}
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Administered by - auto-filled from logged in user */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kas veica *
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
                placeholder="Piem., rezidents jutās labāk ar mazāku devu..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              className={`px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${getButtonColorClass()}`}
            >
              {isSaving ? 'Saglabā...' : 'Apstiprināt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
