import React from 'react';
import { AlertTriangle, X, ArrowLeft, FileWarning } from 'lucide-react';

/**
 * Missing Data Modal
 * Displays warning when trying to create agreement with incomplete data
 * Shows categorized list of missing required fields
 */
const MissingDataModal = ({ missingFields, onClose, onGoBack, onProceedAnyway }) => {
  const { consultation, resident, caregiver } = missingFields;
  const totalMissing = consultation.length + resident.length + caregiver.length;

  // Can only go back to fix resident/caregiver fields, not consultation fields
  const canGoBack = resident.length > 0 || caregiver.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Trūkst obligāto datu</h2>
                <p className="text-orange-100 text-sm mt-1">
                  Nepieciešams aizpildīt {totalMissing} laukus pirms līguma izveidošanas
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <FileWarning className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900">
                <p className="font-semibold mb-1">Kāpēc tas ir svarīgi?</p>
                <p>
                  Līgumam ir nepieciešama pilnīga informācija par klientu un pakalpojumu.
                  Lūdzu, atgriezieties un aizpildiet trūkstošos datus.
                </p>
              </div>
            </div>
          </div>

          {/* Missing Fields List */}
          <div className="space-y-6">
            {/* Consultation Fields */}
            {consultation.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {consultation.length}
                  </span>
                  Konsultācijas dati
                </h3>
                <ul className="space-y-2">
                  {consultation.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
                    >
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resident Fields */}
            {resident.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {resident.length}
                  </span>
                  Rezidenta dati
                </h3>
                <ul className="space-y-2">
                  {resident.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
                    >
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Caregiver Fields */}
            {caregiver.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {caregiver.length}
                  </span>
                  Apgādnieka dati
                </h3>
                <ul className="space-y-2">
                  {caregiver.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded px-3 py-2"
                    >
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Atgriezties un aizpildīt datus
            </button>
          )}
          {!canGoBack && consultation.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-900">
                Konsultācijas datus nevar rediģēt no šī soļa. Lūdzu, izvēlieties "Turpināt tik un tā" vai sazinieties ar administratoru.
              </p>
            </div>
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
