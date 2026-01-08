import { useState, useEffect } from 'react';
import { X, Clock, Calendar, User, FileText, AlertCircle } from 'lucide-react';
import {
  TIME_SLOTS,
  TIME_SLOT_KEYS,
  MEDICATION_UNITS,
  MEDICATION_FORMS,
  FREQUENCIES,
  WEEK_DAYS
} from '../../constants/prescriptionConstants';
import { MEDICATION_CATALOG, getMedicationsByCategory } from '../../constants/medicationCatalog';
import { createPrescription, updatePrescription } from '../../domain/prescriptionHelpers';
import { validatePrescription, getEmptyPrescriptionForm, prescriptionToForm } from '../../domain/prescriptionValidation';

/**
 * PrescriptionModal - Modal for creating/editing prescriptions
 */
export default function PrescriptionModal({
  resident,
  prescription,
  onSave,
  onClose
}) {
  const isEditing = !!prescription;

  const [formData, setFormData] = useState(() =>
    isEditing
      ? prescriptionToForm(prescription)
      : getEmptyPrescriptionForm(resident.id)
  );
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState('');

  // Get medications grouped by category for the dropdown
  const medicationsByCategory = getMedicationsByCategory();

  // Handle medication selection from catalog
  const handleMedicationSelect = (medicationId) => {
    setSelectedMedicationId(medicationId);

    if (!medicationId) return;

    const medication = MEDICATION_CATALOG.find(m => m.id === medicationId);
    if (medication) {
      setFormData(prev => ({
        ...prev,
        medicationName: medication.name,
        activeIngredient: medication.activeIngredient,
        form: medication.form,
        // Set default dose for ALL time slots
        schedule: {
          morning: {
            ...prev.schedule.morning,
            dose: medication.defaultDose,
            unit: medication.defaultUnit
          },
          noon: {
            ...prev.schedule.noon,
            dose: medication.defaultDose,
            unit: medication.defaultUnit
          },
          evening: {
            ...prev.schedule.evening,
            dose: medication.defaultDose,
            unit: medication.defaultUnit
          },
          night: {
            ...prev.schedule.night,
            dose: medication.defaultDose,
            unit: medication.defaultUnit
          }
        }
      }));
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Update schedule slot
  const updateScheduleSlot = (slot, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [slot]: {
          ...prev.schedule[slot],
          [field]: value
        }
      }
    }));
  };

  // Toggle schedule slot enabled
  const toggleScheduleSlot = (slot) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [slot]: {
          ...prev.schedule[slot],
          enabled: !prev.schedule[slot].enabled
        }
      }
    }));
  };

  // Toggle specific day
  const toggleSpecificDay = (day) => {
    setFormData(prev => {
      const days = prev.specificDays || [];
      if (days.includes(day)) {
        return { ...prev, specificDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, specificDays: [...days, day] };
      }
    });
  };

  // Handle save
  const handleSave = async () => {
    const validation = validatePrescription(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing) {
        updatePrescription(prescription.id, formData);
      } else {
        createPrescription(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving prescription:', error);
      setErrors({ submit: 'Kļūda saglabājot. Lūdzu mēģiniet vēlreiz.' });
    } finally {
      setIsSaving(false);
    }
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
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Rediģēt ordināciju' : 'Jauna ordinācija'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Medication info section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Medikamenta informācija
                </h3>

                {/* Medication catalog selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Izvēlieties no kataloga
                  </label>
                  <select
                    value={selectedMedicationId}
                    onChange={(e) => handleMedicationSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50"
                  >
                    <option value="">— Izvēlēties medikamentu —</option>
                    {Object.entries(medicationsByCategory).map(([category, meds]) => (
                      <optgroup key={category} label={category}>
                        {meds.map(med => (
                          <option key={med.id} value={med.id}>
                            {med.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Izvēloties no saraksta, lauki tiks aizpildīti automātiski
                  </p>
                </div>

                {/* Medication name (auto-filled or manual) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medikamenta nosaukums *
                  </label>
                  <input
                    type="text"
                    value={formData.medicationName}
                    onChange={(e) => updateField('medicationName', e.target.value)}
                    placeholder="Nosaukums no kataloga vai ievadiet manuāli"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.medicationName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.medicationName && (
                    <p className="mt-1 text-sm text-red-600">{errors.medicationName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Active ingredient */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aktīvā viela
                    </label>
                    <input
                      type="text"
                      value={formData.activeIngredient}
                      onChange={(e) => updateField('activeIngredient', e.target.value)}
                      placeholder="Piem., Levothyroxinum"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  {/* Form type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zāļu forma
                    </label>
                    <select
                      value={formData.form}
                      onChange={(e) => updateField('form', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {MEDICATION_FORMS.map(form => (
                        <option key={form.value} value={form.value}>{form.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Prescription details section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Ordinēšanas informācija
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Prescribed by - auto-filled from logged-in doctor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ārsts
                    </label>
                    <input
                      type="text"
                      value={formData.prescribedBy}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">Pieslēdzies kā ārsts</p>
                  </div>

                  {/* Prescribed date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ordinēšanas datums *
                    </label>
                    <input
                      type="date"
                      value={formData.prescribedDate}
                      onChange={(e) => updateField('prescribedDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        errors.prescribedDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.prescribedDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.prescribedDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Lietošanas grafiks
                </h3>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biežums
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FREQUENCIES.map(freq => (
                      <button
                        key={freq.value}
                        type="button"
                        onClick={() => updateField('frequency', freq.value)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.frequency === freq.value
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific days (if frequency is specific_days) */}
                {formData.frequency === 'specific_days' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dienas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WEEK_DAYS.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleSpecificDay(day.value)}
                          className={`w-10 h-10 rounded-lg border font-medium transition-colors ${
                            formData.specificDays?.includes(day.value)
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                          }`}
                          title={day.label}
                        >
                          {day.short}
                        </button>
                      ))}
                    </div>
                    {errors.specificDays && (
                      <p className="mt-1 text-sm text-red-600">{errors.specificDays}</p>
                    )}
                  </div>
                )}

                {/* Time slots */}
                {formData.frequency !== 'as_needed' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Lietošanas laiki *
                    </label>
                    {errors.schedule && (
                      <p className="text-sm text-red-600">{errors.schedule}</p>
                    )}

                    {TIME_SLOT_KEYS.map(slot => (
                      <div
                        key={slot}
                        className={`border rounded-lg p-3 transition-colors ${
                          formData.schedule[slot]?.enabled
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Enable checkbox */}
                          <input
                            type="checkbox"
                            checked={formData.schedule[slot]?.enabled || false}
                            onChange={() => toggleScheduleSlot(slot)}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                          />

                          {/* Slot label */}
                          <span className="font-medium text-gray-700 w-20">
                            {TIME_SLOTS[slot].label}
                          </span>

                          {/* Time, dose, unit inputs (shown when enabled) */}
                          {formData.schedule[slot]?.enabled && (
                            <div className="flex items-center gap-2 flex-1">
                              {/* Time */}
                              <input
                                type="time"
                                value={formData.schedule[slot]?.time || TIME_SLOTS[slot].defaultTime}
                                onChange={(e) => updateScheduleSlot(slot, 'time', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />

                              {/* Dose */}
                              <input
                                type="text"
                                value={formData.schedule[slot]?.dose || ''}
                                onChange={(e) => updateScheduleSlot(slot, 'dose', e.target.value)}
                                placeholder="Deva"
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />

                              {/* Unit */}
                              <select
                                value={formData.schedule[slot]?.unit || 'mg'}
                                onChange={(e) => updateScheduleSlot(slot, 'unit', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              >
                                {MEDICATION_UNITS.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Conditional dosing */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.conditional || false}
                    onChange={(e) => updateField('conditional', e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">
                      Nosacīta lietošana (pēc nepieciešamības)
                    </label>
                    {formData.conditional && (
                      <input
                        type="text"
                        value={formData.conditionText || ''}
                        onChange={(e) => updateField('conditionText', e.target.value)}
                        placeholder="Piem., pie sāpēm vai ja t>37,5C"
                        className={`mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.conditionText ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    )}
                    {errors.conditionText && (
                      <p className="mt-1 text-sm text-red-600">{errors.conditionText}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Papildu norādījumi
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Īpašas norādes (parādīsies sarkanā krāsā)
                  </label>
                  <textarea
                    value={formData.instructions || ''}
                    onChange={(e) => updateField('instructions', e.target.value)}
                    placeholder="Piem., 1/2 tab., lietot ar ēdienu, u.c."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Piezīmes (iekšējai lietošanai)
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Papildu piezīmes..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Submit error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                  {errors.submit}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Atcelt
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saglabā...' : isEditing ? 'Saglabāt izmaiņas' : 'Pievienot ordināciju'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
