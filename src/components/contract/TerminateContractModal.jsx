import React, { useState } from 'react';
import { X, Calendar, FileX } from 'lucide-react';

/**
 * TerminateContractModal - Modal for terminating a contract with date
 */
const TerminateContractModal = ({ contract, onConfirm, onClose }) => {
  const [terminationDate, setTerminationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terminationDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(terminationDate, reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common termination reasons
  const commonReasons = [
    'Rezidents izrakstījies',
    'Pārcēlies uz citu iestādi',
    'Atgriezies mājās',
    'Miris',
    'Cits iemesls'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileX className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Izbeigt līgumu
              </h2>
              <p className="text-sm text-gray-500">
                {contract.contractNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Contract info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Rezidents:</strong> {contract.residentName || '—'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Sākuma datums:</strong> {contract.startDate ? new Date(contract.startDate).toLocaleDateString('lv-LV') : '—'}
            </p>
          </div>

          {/* Termination Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Izbeigšanas datums <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={terminationDate}
                onChange={(e) => setTerminationDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Datums, ar kuru līgums tiek izbeigts
            </p>
          </div>

          {/* Reason quick select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Iemesls
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonReasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    reason === r
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Papildus piezīmes..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Atcelt
            </button>
            <button
              type="submit"
              disabled={!terminationDate || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Apstrādā...' : 'Izbeigt līgumu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminateContractModal;
