import React, { useState } from 'react';
import { X, XCircle } from 'lucide-react';

/**
 * Modal for cancelling a lead with reason selection
 */
const CancelModal = ({ lead, onConfirm, onClose }) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const cancelReasons = [
    { value: 'no-availability', label: 'Nav vietu' },
    { value: 'price-too-high', label: 'Cena pārāk augsta' },
    { value: 'location', label: 'Nepiemērota atrašanās vieta' },
    { value: 'found-alternative', label: 'Atrada citu iestādi' },
    { value: 'changed-mind', label: 'Pārdomāja lēmumu' },
    { value: 'no-response', label: 'Nav atbildes no klienta' },
    { value: 'other', label: 'Cits iemesls' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason) {
      onConfirm({
        reason,
        notes,
        cancelledDate: new Date().toISOString().split('T')[0]
      });
      // onClose() is not needed - onConfirm triggers navigation that unmounts the modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Atcelt pieteikumu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Lead Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Pieteikums</p>
            <p className="font-medium text-gray-900">
              {lead.firstName} {lead.lastName}
            </p>
            <p className="text-xs text-gray-500">{lead.id}</p>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Atcelšanas iemesls <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Izvēlieties iemeslu...</option>
              {cancelReasons.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Papildu piezīmes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={3}
              placeholder="Piem., sīkāka informācija par atcelšanas iemeslu..."
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Uzmanību:</strong> Atceltus pieteikumus var skatīt tikai atceļot filtru.
              Šo darbību nevar atcelt.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Atcelt
            </button>
            <button
              type="submit"
              disabled={!reason}
              className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                reason
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Apstiprināt atcelšanu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelModal;
