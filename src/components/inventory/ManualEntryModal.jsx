import React, { useState } from 'react';
import { X, Check, FileText } from 'lucide-react';
import { createBulkInventoryItem } from '../../domain/inventoryHelpers';
import { getActiveSuppliers } from '../../domain/supplierHelpers';

/**
 * Modal form for manual paper-invoice entry into bulk warehouse.
 * Primary use case: Supplier 2 delivers with paper invoices (no XML).
 */
const ManualEntryModal = ({ isOpen, onClose, onEntryComplete }) => {
  const [formData, setFormData] = useState({
    supplierId: 'SUP-SUPPLIER-2',
    medicationName: '',
    activeIngredient: '',
    form: 'tabletes',
    quantity: '',
    unit: 'tabletes',
    unitCost: '',
    expirationDate: '',
    batchNumber: '',
    invoiceRef: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter out pseudo-suppliers
  const realSuppliers = getActiveSuppliers().filter(s => !s.isPseudoSupplier);

  const FORM_OPTIONS = [
    { value: 'tabletes', label: 'Tabletes' },
    { value: 'kapsulas', label: 'Kapsulas' },
    { value: 'injekcijas', label: 'Injekcijas' },
    { value: 'pilieni', label: 'Pilieni' },
    { value: 'ziede', label: 'Ziede' },
    { value: 'šķīdums', label: 'Šķīdums' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.medicationName.trim()) {
      newErrors.medicationName = 'Medikamenta nosaukums ir obligāts';
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Daudzumam jābūt lielākam par 0';
    }
    if (formData.unitCost === '' || Number(formData.unitCost) < 0) {
      newErrors.unitCost = 'Vienības cena ir obligāta';
    }
    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Derīguma termiņš ir obligāts';
    }
    if (!formData.invoiceRef.trim()) {
      newErrors.invoiceRef = 'Rēķina numurs ir obligāts';
    }
    if (!formData.supplierId) {
      newErrors.supplierId = 'Piegādātājs ir obligāts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    // Small delay for UX consistency with XML import
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      createBulkInventoryItem({
        medicationName: formData.medicationName.trim(),
        activeIngredient: formData.activeIngredient.trim(),
        form: formData.form,
        quantity: Number(formData.quantity),
        unit: formData.unit.trim() || 'tabletes',
        unitCost: Number(formData.unitCost),
        expirationDate: formData.expirationDate,
        batchNumber: formData.batchNumber.trim(),
        entryMethod: 'manual_entry',
        supplierId: formData.supplierId,
        fundingSource: 'facility',
        invoiceRef: formData.invoiceRef.trim()
      });

      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        onEntryComplete && onEntryComplete();
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Manual entry failed:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      supplierId: 'SUP-SUPPLIER-2',
      medicationName: '',
      activeIngredient: '',
      form: 'tabletes',
      quantity: '',
      unit: 'tabletes',
      unitCost: '',
      expirationDate: '',
      batchNumber: '',
      invoiceRef: ''
    });
    setErrors({});
    setIsSubmitting(false);
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Manuāla ievade
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
        <div className="p-4 space-y-4">
          {showSuccess ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-700">
                Ieraksts pievienots!
              </p>
            </div>
          ) : (
            <>
              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Piegādātājs
                </label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => handleChange('supplierId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Izvēlieties piegādātāju</option>
                  {realSuppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <p className="mt-1 text-xs text-red-600">{errors.supplierId}</p>
                )}
              </div>

              {/* Invoice Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rēķina Nr. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.invoiceRef}
                  onChange={(e) => handleChange('invoiceRef', e.target.value)}
                  placeholder="piem., INV-2026-044"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.invoiceRef && (
                  <p className="mt-1 text-xs text-red-600">{errors.invoiceRef}</p>
                )}
              </div>

              {/* Medication Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medikamenta nosaukums <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.medicationName}
                  onChange={(e) => handleChange('medicationName', e.target.value)}
                  placeholder="piem., Paracetamol Accord 500 mg tabletes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.medicationName && (
                  <p className="mt-1 text-xs text-red-600">{errors.medicationName}</p>
                )}
              </div>

              {/* Active Ingredient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aktīvā viela
                </label>
                <input
                  type="text"
                  value={formData.activeIngredient}
                  onChange={(e) => handleChange('activeIngredient', e.target.value)}
                  placeholder="piem., Paracetamolum"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Form + Unit row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma
                  </label>
                  <select
                    value={formData.form}
                    onChange={(e) => handleChange('form', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {FORM_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vienība
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Quantity + Unit Cost row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daudzums <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vienības cena (&euro;) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitCost}
                    onChange={(e) => handleChange('unitCost', e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.unitCost && (
                    <p className="mt-1 text-xs text-red-600">{errors.unitCost}</p>
                  )}
                </div>
              </div>

              {/* Expiration + Batch row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Derīguma termiņš <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleChange('expirationDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  {errors.expirationDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.expirationDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partijas Nr.
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => handleChange('batchNumber', e.target.value)}
                    placeholder="piem., LOT2026-A01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!showSuccess && (
          <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50 gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Atcelt
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saglabā...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Saglabāt
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualEntryModal;
