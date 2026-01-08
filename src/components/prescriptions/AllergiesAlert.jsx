import { AlertTriangle } from 'lucide-react';

/**
 * AllergiesAlert - Red alert banner displaying resident allergies
 */
export default function AllergiesAlert({ allergies }) {
  if (!allergies || allergies.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-red-800">Alerģijas: </span>
        <span className="text-red-700">{allergies.join(', ')}</span>
      </div>
    </div>
  );
}

// Compact version for print view
export function AllergiesAlertCompact({ allergies }) {
  if (!allergies || allergies.length === 0) {
    return (
      <div className="text-gray-500 text-sm">Nav zināmu alerģiju</div>
    );
  }

  return (
    <div className="bg-red-100 border-2 border-red-500 rounded px-3 py-2">
      <span className="font-bold text-red-800">ALERĢIJAS: </span>
      <span className="text-red-700 font-semibold">{allergies.join(', ')}</span>
    </div>
  );
}
