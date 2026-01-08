import { Check, X } from 'lucide-react';

/**
 * TimeSlotCell - Displays a medication dose in a specific time slot
 * Shows time + dose in a colored badge, with visible refuse button
 */
export default function TimeSlotCell({ schedule, status, onRefuse }) {
  // If slot is not enabled, show empty cell
  if (!schedule?.enabled) {
    return <td className="px-2 py-3 text-center text-gray-300">—</td>;
  }

  const { time, dose, unit } = schedule;

  // Determine badge color based on status
  const getBadgeClasses = () => {
    const base = 'inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium';

    switch (status) {
      case 'given':
        return `${base} bg-teal-500 text-white`;
      case 'refused':
        return `${base} bg-red-500 text-white`;
      case 'skipped':
        return `${base} bg-gray-400 text-white`;
      case 'pending':
      default:
        return `${base} bg-cyan-500 text-white`;
    }
  };

  // Status icon
  const StatusIcon = () => {
    if (status === 'given') return <Check className="w-3.5 h-3.5" />;
    if (status === 'refused') return <X className="w-3.5 h-3.5" />;
    return null;
  };

  return (
    <td className="px-2 py-3 text-center">
      <div className={getBadgeClasses()}>
        <StatusIcon />
        <span>{time}</span>
        <span className="font-bold">{dose} {unit}</span>

        {/* Refuse button - red X on white background */}
        {status !== 'refused' && (
          <button
            onClick={(e) => { e.stopPropagation(); onRefuse(); }}
            className="ml-1.5 p-1 rounded-full bg-white hover:bg-red-50 transition-colors"
            title="Atzīmēt atteikumu"
          >
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        )}
      </div>
    </td>
  );
}

// Simpler version for print view (no interactivity)
export function TimeSlotCellStatic({ schedule }) {
  if (!schedule?.enabled) {
    return <td className="px-2 py-2 text-center text-gray-300 border border-gray-200">—</td>;
  }

  const { time, dose, unit } = schedule;

  return (
    <td className="px-2 py-2 text-center border border-gray-200">
      <div className="inline-flex flex-col items-center bg-cyan-500 text-white px-3 py-1 rounded">
        <span className="text-xs">{time}</span>
        <span className="font-bold text-sm">{dose} {unit}</span>
      </div>
    </td>
  );
}
