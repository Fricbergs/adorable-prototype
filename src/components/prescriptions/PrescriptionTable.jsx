import PrescriptionRow, { PrescriptionRowStatic } from './PrescriptionRow';
import { TIME_SLOTS, TIME_SLOT_KEYS } from '../../constants/prescriptionConstants';
import { getPrescriptionAdministrationStatus } from '../../domain/prescriptionHelpers';

/**
 * PrescriptionTable - Main prescription schedule table with 4 time columns
 * Each pill has a visible X button to mark refusal
 * Supports edit and cancel actions
 */
export default function PrescriptionTable({
  prescriptions,
  onRefuse,
  onEdit,
  onCancel
}) {
  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Nav aktīvu ordināciju
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 min-w-[350px]">
              Preparāta ordinēšana
            </th>
            {TIME_SLOT_KEYS.map(slot => (
              <th
                key={slot}
                className="px-3 py-3 text-center text-sm font-medium text-gray-600 w-32"
              >
                {TIME_SLOTS[slot].label}
              </th>
            ))}
            {(onEdit || onCancel) && (
              <th className="px-3 py-3 text-center text-sm font-medium text-gray-600 w-20">
                Darbības
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(prescription => {
            const administrationStatus = getPrescriptionAdministrationStatus(prescription.id);
            return (
              <PrescriptionRow
                key={prescription.id}
                prescription={prescription}
                administrationStatus={administrationStatus}
                onRefuse={onRefuse}
                onEdit={onEdit}
                onCancel={onCancel}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Static version for print view
export function PrescriptionTableStatic({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        Nav aktīvu ordināciju
      </div>
    );
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-3 py-2 text-left text-sm font-semibold border border-gray-300 min-w-[250px]">
            Preparāta ordinēšana
          </th>
          {TIME_SLOT_KEYS.map(slot => (
            <th
              key={slot}
              className="px-2 py-2 text-center text-sm font-semibold border border-gray-300 w-24"
            >
              {TIME_SLOTS[slot].label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {prescriptions.map(prescription => (
          <PrescriptionRowStatic
            key={prescription.id}
            prescription={prescription}
          />
        ))}
      </tbody>
    </table>
  );
}

// Mobile card view
export function PrescriptionCards({
  prescriptions,
  onRefuse
}) {
  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Nav aktīvu ordināciju
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map(prescription => {
        const administrationStatus = getPrescriptionAdministrationStatus(prescription.id);
        return (
          <PrescriptionCard
            key={prescription.id}
            prescription={prescription}
            administrationStatus={administrationStatus}
            onRefuse={onRefuse}
          />
        );
      })}
    </div>
  );
}

function PrescriptionCard({ prescription, administrationStatus, onRefuse }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('lv-LV');
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'given': return 'bg-teal-500 text-white';
      case 'refused': return 'bg-red-500 text-white';
      case 'skipped': return 'bg-gray-400 text-white';
      default: return 'bg-cyan-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'given') return '✓ ';
    if (status === 'refused') return '✕ ';
    return '';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-2">
        <div className="font-semibold text-gray-900">{prescription.medicationName}</div>
        {prescription.activeIngredient && (
          <div className="text-sm text-gray-500">{prescription.activeIngredient}</div>
        )}
      </div>

      <div className="text-xs text-gray-400 mb-2">
        Katru dienu, {formatDate(prescription.prescribedDate)} — līdz šim brīdim
      </div>

      {prescription.instructions && (
        <div className="text-sm text-orange-600 italic mb-3">{prescription.instructions}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {TIME_SLOT_KEYS.map(slot => {
          const schedule = prescription.schedule[slot];
          if (!schedule?.enabled) return null;

          const status = administrationStatus?.[slot] || 'pending';

          return (
            <div key={slot} className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${getStatusBadgeClasses(status)}`}>
              {getStatusIcon(status)}{schedule.time} {schedule.dose} {schedule.unit}

              {/* Refuse button - red X on white background */}
              {status !== 'refused' && (
                <button
                  onClick={() => onRefuse(prescription, slot)}
                  className="ml-1.5 p-1 rounded-full bg-white active:bg-red-50"
                  title="Atzīmēt atteikumu"
                >
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
