import TimeSlotCell from './TimeSlotCell';
import { TIME_SLOT_KEYS } from '../../constants/prescriptionConstants';

/**
 * PrescriptionRow - Single medication row in the prescription table
 * Matching wireframe design: clean table with 4 time columns
 */
export default function PrescriptionRow({
  prescription,
  administrationStatus,
  onRefuse
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFrequency = () => {
    if (prescription.frequency === 'daily') return 'Katru dienu';
    if (prescription.frequency === 'as_needed') return 'Pēc nepieciešamības';
    if (prescription.frequency === 'specific_days' && prescription.specificDays?.length) {
      const dayMap = {
        monday: 'P', tuesday: 'O', wednesday: 'T',
        thursday: 'C', friday: 'Pk', saturday: 'S', sunday: 'Sv'
      };
      return prescription.specificDays.map(d => dayMap[d]).join(', ');
    }
    return '';
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 group">
      {/* Medication info column */}
      <td className="px-6 py-4">
        <div>
          {/* Medication name */}
          <div className="font-semibold text-gray-900">
            {prescription.medicationName}
          </div>

          {/* Active ingredient */}
          {prescription.activeIngredient && (
            <div className="text-sm text-gray-500">
              {prescription.activeIngredient}
            </div>
          )}

          {/* Date and frequency */}
          <div className="text-xs text-gray-400 mt-1">
            {prescription.frequency === 'daily' ? 'Katru dienu' : formatFrequency()}, {formatDate(prescription.prescribedDate)}
            {prescription.validUntil && ` — ${formatDate(prescription.validUntil)}`}
            {!prescription.validUntil && ' — līdz šim brīdim'}
          </div>

          {/* Instructions in orange/red italic - matching wireframe */}
          {prescription.instructions && (
            <div className="text-sm text-orange-600 italic mt-1">
              {prescription.instructions}
            </div>
          )}

          {/* Conditional note */}
          {prescription.conditional && prescription.conditionText && (
            <div className="text-sm text-orange-600 italic mt-1">
              {prescription.conditionText}
            </div>
          )}
        </div>
      </td>

      {/* Time slot columns with visible refuse button */}
      {TIME_SLOT_KEYS.map(slot => (
        <TimeSlotCell
          key={slot}
          schedule={prescription.schedule[slot]}
          status={administrationStatus?.[slot] || 'pending'}
          onRefuse={() => onRefuse(prescription, slot)}
        />
      ))}
    </tr>
  );
}

// Static version for print view
export function PrescriptionRowStatic({ prescription }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV');
  };

  return (
    <tr className="border-b border-gray-300">
      <td className="px-3 py-2 border border-gray-200">
        <div className="font-medium">{prescription.medicationName}</div>
        {prescription.activeIngredient && (
          <div className="text-sm text-gray-600">{prescription.activeIngredient}</div>
        )}
        <div className="text-xs text-gray-500">
          {formatDate(prescription.prescribedDate)} — līdz šim brīdim
        </div>
        {prescription.instructions && (
          <div className="text-sm text-red-600 italic">{prescription.instructions}</div>
        )}
      </td>

      {TIME_SLOT_KEYS.map(slot => {
        const schedule = prescription.schedule[slot];
        if (!schedule?.enabled) {
          return <td key={slot} className="px-2 py-2 text-center border border-gray-200 text-gray-300">—</td>;
        }
        return (
          <td key={slot} className="px-2 py-2 text-center border border-gray-200">
            <div className="inline-flex flex-col items-center bg-cyan-500 text-white px-2 py-1 rounded text-sm">
              <span className="text-xs">{schedule.time}</span>
              <span className="font-bold">{schedule.dose} {schedule.unit}</span>
            </div>
          </td>
        );
      })}
    </tr>
  );
}
