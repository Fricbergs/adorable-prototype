import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Package, AlertTriangle } from 'lucide-react';
import { getAllBulkInventory, createTransfer } from '../../domain/inventoryHelpers';
import { validateTransfer } from '../../domain/inventoryValidation';
import { TRANSFER_REASONS, CURRENT_USER } from '../../constants/inventoryConstants';

/**
 * Modal for transferring medication from Warehouse A to Warehouse B
 */
const TransferModal = ({ isOpen, onClose, residentId, residentName, preselectedItem, onTransferComplete }) => {
  const [bulkItems, setBulkItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('4_day_preparation');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const items = getAllBulkInventory().filter(item => item.quantity > 0);
      setBulkItems(items);

      if (preselectedItem) {
        setSelectedItem(preselectedItem);
      }
    }
  }, [isOpen, preselectedItem]);

  if (!isOpen) return null;

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setQuantity('');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationData = {
      bulkItemId: selectedItem?.id,
      residentId,
      quantity: parseInt(quantity),
      availableQuantity: selectedItem?.quantity,
      unit: selectedItem?.unit
    };

    const validation = validateTransfer(validationData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = createTransfer(
        selectedItem.id,
        residentId,
        parseInt(quantity),
        reason,
        notes
      );

      onTransferComplete && onTransferComplete(result);
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setQuantity('');
    setReason('4_day_preparation');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Pārvietot uz rezidenta noliktavu
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Resident Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <strong>Rezidents:</strong> {residentName}
            </p>
          </div>

          {/* Medication Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medikaments no noliktavas *
            </label>
            {selectedItem ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedItem.medicationName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Partija: {selectedItem.batchNumber} | Pieejami: {selectedItem.quantity} {selectedItem.unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="text-xs text-orange-600 hover:text-orange-700"
                  >
                    Mainīt
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {bulkItems.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500 text-center">
                    Nav pieejamu medikamentu
                  </p>
                ) : (
                  bulkItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemSelect(item)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.medicationName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pieejami: {item.quantity} {item.unit}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
            {errors.bulkItemId && (
              <p className="text-sm text-red-600 mt-1">{errors.bulkItemId}</p>
            )}
          </div>

          {/* Quantity */}
          {selectedItem && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daudzums *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setErrors({ ...errors, quantity: null });
                  }}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ievadiet daudzumu"
                />
                <span className="text-sm text-gray-500 min-w-[60px]">
                  {selectedItem.unit}
                </span>
              </div>
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maksimums: {selectedItem.quantity} {selectedItem.unit}
              </p>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iemesls
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {Object.values(TRANSFER_REASONS).map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Piezīmes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Papildu informācija..."
            />
          </div>

          {/* Transfer By */}
          <div className="text-sm text-gray-500">
            <strong>Pārvieto:</strong> {CURRENT_USER}
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{errors.submit}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Atcelt
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedItem || !quantity}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Pārvieto...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Pārvietot
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
