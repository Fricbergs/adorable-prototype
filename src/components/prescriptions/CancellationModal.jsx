import React, { useState } from 'react';
import { X, Pause, Square, AlertTriangle } from 'lucide-react';
import { pausePrescription, discontinuePrescription } from '../../domain/prescriptionHelpers';

/**
 * CancellationModal - Modal for pausing or discontinuing a prescription
 * Supports:
 * - Pause: Temporarily stop until a specific date
 * - Discontinue: Permanently stop with reason
 */
const CancellationModal = ({ prescription, onSave, onClose }) => {
  const [mode, setMode] = useState('pause'); // 'pause' | 'discontinue'
  const [pauseUntil, setPauseUntil] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get tomorrow's date as minimum for pause
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'pause') {
      if (!pauseUntil) {
        setError('Lūdzu norādiet datumu, līdz kuram pārtraukt');
        return;
      }
      if (pauseUntil < minDate) {
        setError('Datumam jābūt nākotnē');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'pause') {
        pausePrescription(prescription.id, pauseUntil, reason);
      } else {
        discontinuePrescription(prescription.id, reason);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Kļūda saglabājot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pauseReasons = [
    'Hospitalizācija',
    'Operācija',
    'Citu medikamentu lietošana',
    'Blakusparādības',
    'Pagaidu pārtraukums'
  ];

  const discontinueReasons = [
    'Ārstēšana pabeigta',
    'Blakusparādības',
    'Neefektīvs',
    'Mainīts uz citu preparātu',
    'Pacients atteicies',
    'Nāve'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Atcelt zāles
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Medication info */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">
            {prescription.medicationName}
          </p>
          {prescription.activeIngredient && (
            <p className="text-xs text-gray-500">
              {prescription.activeIngredient}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mode selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('pause')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                mode === 'pause'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Pause className="w-6 h-6" />
              <span className="text-sm font-medium">Uz laiku</span>
              <span className="text-xs text-center">Pārtraukt līdz datumam</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('discontinue')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                mode === 'discontinue'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Square className="w-6 h-6" />
              <span className="text-sm font-medium">Pavisam</span>
              <span className="text-xs text-center">Atcelt neatgriezeniski</span>
            </button>
          </div>

          {/* Pause date (only for pause mode) */}
          {mode === 'pause' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pārtraukt līdz *
              </label>
              <input
                type="date"
                value={pauseUntil}
                onChange={(e) => setPauseUntil(e.target.value)}
                min={minDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Iemesls {mode === 'discontinue' ? '' : '(neobligāts)'}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2"
            >
              <option value="">Izvēlieties iemeslu...</option>
              {(mode === 'pause' ? pauseReasons : discontinueReasons).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vai ievadiet citu iemeslu..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Warning for discontinue */}
          {mode === 'discontinue' && (
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Uzmanību!</p>
                <p>Šī darbība ir neatgriezeniska. Zāles tiks pilnībā atceltas no ordinācijas plāna.</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                mode === 'discontinue'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? 'Saglabā...' : mode === 'pause' ? 'Pārtraukt' : 'Atcelt zāles'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancellationModal;
