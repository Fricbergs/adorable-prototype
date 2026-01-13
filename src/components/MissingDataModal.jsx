import React, { useState } from 'react';
import { AlertTriangle, X, ArrowLeft, FileWarning, Check } from 'lucide-react';
import { RESIDENT_FIELDS, CLIENT_FIELDS } from '../domain/agreementFields';

/**
 * Missing Data Modal
 * Shows full survey form allowing admin to fill in all data
 * Pre-populated with existing data, highlights missing required fields
 */
const MissingDataModal = ({
  missingFields,
  existingData = {},
  onClose,
  onGoBack,
  onProceedAnyway,
  onSave
}) => {
  const { consultation, resident, caregiver } = missingFields;
  const totalMissing = consultation.length + resident.length + caregiver.length;
  const showClientFields = existingData.signerScenario === 'relative';

  // Initialize form with existing data
  const [formData, setFormData] = useState(() => {
    const initial = { ...existingData };
    return initial;
  });

  // Get set of missing field names for highlighting
  const missingFieldNames = new Set([
    ...resident.map(f => f.field),
    ...caregiver.map(f => f.field)
  ]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Check if all required fields are filled
  const checkAllRequiredFilled = () => {
    // Check resident required fields
    for (const group of RESIDENT_FIELDS) {
      for (const field of group.fields) {
        if (field.required) {
          const value = formData[field.name];
          if (!value || (typeof value === 'string' && !value.trim())) {
            return false;
          }
        }
      }
    }
    // Check client required fields if relative scenario
    if (formData.signerScenario === 'relative') {
      for (const group of CLIENT_FIELDS) {
        for (const field of group.fields) {
          if (field.required) {
            const value = formData[field.name];
            if (!value || (typeof value === 'string' && !value.trim())) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const canSave = checkAllRequiredFilled() && consultation.length === 0;

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  // Render a single field
  const renderField = (field, isMissing) => {
    const value = formData[field.name] || '';
    const isRequired = field.required;
    const borderClass = isMissing
      ? 'border-orange-400 bg-orange-50'
      : 'border-gray-300';

    // Select field
    if (field.type === 'select' && field.options) {
      return (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${borderClass}`}
          >
            <option value="">Izvēlieties...</option>
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {field.helper && (
            <p className="text-xs text-gray-500">{field.helper}</p>
          )}
        </div>
      );
    }

    // Date field
    if (field.type === 'date') {
      return (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${borderClass}`}
          />
          {field.helper && (
            <p className="text-xs text-gray-500">{field.helper}</p>
          )}
        </div>
      );
    }

    // Number field
    if (field.type === 'number') {
      return (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${borderClass}`}
          />
          {field.helper && (
            <p className="text-xs text-gray-500">{field.helper}</p>
          )}
        </div>
      );
    }

    // Default text/tel/email field
    return (
      <div key={field.name} className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={field.type || 'text'}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder || field.label}
          className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${borderClass}`}
        />
        {field.helper && (
          <p className="text-xs text-gray-500">{field.helper}</p>
        )}
      </div>
    );
  };

  // Render a field group
  const renderFieldGroup = (group) => {
    return (
      <div key={group.id} className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">{group.title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {group.fields.map(field => {
            const isMissing = missingFieldNames.has(field.name);
            return renderField(field, isMissing);
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-4 flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* Header */}
        <div className="bg-orange-500 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Aizpildīt trūkstošos datus</h2>
                <p className="text-orange-100 text-sm mt-1">
                  {totalMissing > 0
                    ? `Trūkst ${totalMissing} obligāto lauku`
                    : 'Pārskatiet un papildiniet datus'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body - scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {/* Consultation Fields Warning */}
          {consultation.length > 0 && (
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <FileWarning className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900">
                  <p className="font-semibold mb-1">Trūkst konsultācijas datu</p>
                  <p className="mb-2">Šos laukus nevar aizpildīt šeit - jāatgriežas pie konsultācijas:</p>
                  <ul className="list-disc list-inside">
                    {consultation.map((item, idx) => (
                      <li key={idx}>{item.label}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Missing fields hint */}
          {totalMissing > 0 && consultation.length === 0 && (
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <FileWarning className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-900">
                  <p>Lauki ar <span className="text-orange-600 font-medium">oranžu fonu</span> ir obligāti un nav aizpildīti.</p>
                </div>
              </div>
            </div>
          )}

          {/* Resident Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              Rezidenta informācija
              {resident.length > 0 && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {resident.length} trūkst
                </span>
              )}
            </h3>
            <div className="space-y-6">
              {RESIDENT_FIELDS.map(group => renderFieldGroup(group))}
            </div>
          </div>

          {/* Client Fields - if relative scenario */}
          {showClientFields && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                Līguma parakstītāja informācija
                {caregiver.length > 0 && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                    {caregiver.length} trūkst
                  </span>
                )}
              </h3>
              <div className="space-y-6">
                {CLIENT_FIELDS.map(group => renderFieldGroup(group))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-200 space-y-2 flex-shrink-0">
          {/* Save button */}
          {canSave ? (
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Saglabāt un izveidot līgumu
            </button>
          ) : consultation.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Aizpildiet visus obligātos laukus (ar *), lai turpinātu.
              </p>
            </div>
          ) : null}

          {/* Go back button - for consultation fields */}
          {consultation.length > 0 && (
            <button
              onClick={onGoBack}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Atgriezties un aizpildīt konsultācijas datus
            </button>
          )}

          <button
            onClick={onProceedAnyway}
            className="w-full px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Turpināt tik un tā (neieteicams)
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Atcelt
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingDataModal;
