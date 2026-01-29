import React, { useState, useMemo } from 'react';
import { X, Users, AlertTriangle, Check, Search } from 'lucide-react';
import { recordExternalReceipt } from '../../domain/inventoryHelpers';
import { validateRelativeBroughtItem, MEDICATION_FORMS, UNIT_OPTIONS } from '../../domain/inventoryValidation';
import { searchUnifiedCatalog } from '../../domain/catalogHelpers';
import { getSupplierName } from '../../domain/supplierHelpers';
import { RELATIONSHIPS, CURRENT_USER } from '../../constants/inventoryConstants';

/**
 * Two-step modal for recording medication brought by relatives.
 *
 * Step 1: Search unified catalog across all suppliers.
 * Step 2a: Auto-filled form from catalog selection.
 * Step 2b: Free-text entry with originCountry for foreign medications.
 *
 * Both paths record zero cost, billing-excluded items.
 */
const ExternalReceiptModal = ({ isOpen, onClose, residentId, residentName, onReceiptComplete }) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    medicationName: '',
    activeIngredient: '',
    form: 'tabletes',
    batchNumber: '',
    expirationDate: '',
    quantity: '',
    unit: 'tabletes',
    broughtBy: '',
    relationship: 'family',
    notes: '',
    isForeign: false,
    originCountry: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catalog search results (memoized)
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchUnifiedCatalog(searchQuery);
  }, [searchQuery]);

  if (!isOpen) return null;

  // Determine which step to show
  const showSearchStep = !selectedCatalogItem && !isManualEntry;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleCatalogSelect = (item) => {
    setSelectedCatalogItem(item);
    setFormData(prev => ({
      ...prev,
      medicationName: item.medicationName,
      activeIngredient: item.activeIngredient,
      form: item.form,
      unit: item.unit || 'tabletes',
      isForeign: false,
      originCountry: ''
    }));
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    setSelectedCatalogItem(null);
    setFormData(prev => ({
      ...prev,
      medicationName: '',
      activeIngredient: '',
      form: 'tabletes',
      unit: 'tabletes',
      isForeign: true,
      originCountry: ''
    }));
  };

  const handleBackToSearch = () => {
    setSelectedCatalogItem(null);
    setIsManualEntry(false);
    setSearchQuery('');
    setFormData(prev => ({
      ...prev,
      medicationName: '',
      activeIngredient: '',
      form: 'tabletes',
      unit: 'tabletes',
      isForeign: false,
      originCountry: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRelativeBroughtItem(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = recordExternalReceipt(residentId, {
        ...formData,
        quantity: parseInt(formData.quantity)
      });

      onReceiptComplete && onReceiptComplete(result);
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCatalogItem(null);
    setIsManualEntry(false);
    setFormData({
      medicationName: '',
      activeIngredient: '',
      form: 'tabletes',
      batchNumber: '',
      expirationDate: '',
      quantity: '',
      unit: 'tabletes',
      broughtBy: '',
      relationship: 'family',
      notes: '',
      isForeign: false,
      originCountry: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Radinieku atnestie
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
          {/* Resident Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Rezidents:</strong> {residentName}
            </p>
          </div>

          {/* STEP 1: Catalog Search */}
          {showSearchStep && (
            <div className="space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Meklet medikamentu kataloga..."
                  autoFocus
                />
              </div>

              {/* Search results */}
              {searchQuery.length >= 2 && (
                <div className="space-y-1">
                  {searchResults.length > 0 ? (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-60 overflow-y-auto">
                      {searchResults.map((item, idx) => (
                        <button
                          key={`${item.supplierId}-${item.catalogId || idx}`}
                          onClick={() => handleCatalogSelect(item)}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.medicationName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.activeIngredient} | {item.form}
                              </p>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap ml-2">
                              {getSupplierName(item.supplierId)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-2">
                      Nav atbilstibu kataloga
                    </p>
                  )}

                  {/* Manual entry fallback button */}
                  <button
                    type="button"
                    onClick={handleManualEntry}
                    className="w-full mt-2 px-4 py-2 text-sm font-medium text-violet-700 border border-violet-300 rounded-lg hover:bg-violet-50 transition-colors"
                  >
                    Nav kataloga -- ievadiet manuali
                  </button>
                </div>
              )}

              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <p className="text-xs text-gray-400">
                  Ievadiet vismaz 2 simbolus, lai mekletu...
                </p>
              )}
            </div>
          )}

          {/* STEP 2: Entry Form */}
          {!showSearchStep && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Info bar -- catalog or manual */}
              {selectedCatalogItem && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <p className="text-sm text-blue-700">
                    Atpazits no kataloga: <strong>{selectedCatalogItem.medicationName}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={handleBackToSearch}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mainit
                  </button>
                </div>
              )}
              {isManualEntry && (
                <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-lg px-3 py-2">
                  <p className="text-sm text-violet-700">
                    Arvalstu / nezinams medikaments
                  </p>
                  <button
                    type="button"
                    onClick={handleBackToSearch}
                    className="text-xs text-violet-600 hover:text-violet-800 font-medium"
                  >
                    Mainit
                  </button>
                </div>
              )}

              {/* Medication Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medikamenta nosaukums *
                </label>
                <input
                  type="text"
                  value={formData.medicationName}
                  onChange={(e) => handleChange('medicationName', e.target.value)}
                  readOnly={!!selectedCatalogItem}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.medicationName ? 'border-red-300' : 'border-gray-300'
                  } ${selectedCatalogItem ? 'bg-gray-50 text-gray-600' : ''}`}
                  placeholder="Piem., Aspirin 100 mg tabletes"
                />
                {errors.medicationName && (
                  <p className="text-sm text-red-600 mt-1">{errors.medicationName}</p>
                )}
              </div>

              {/* Active Ingredient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aktiva viela
                </label>
                <input
                  type="text"
                  value={formData.activeIngredient}
                  onChange={(e) => handleChange('activeIngredient', e.target.value)}
                  readOnly={!!selectedCatalogItem}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    selectedCatalogItem ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  placeholder="Piem., Acidum acetylsalicylicum"
                />
              </div>

              {/* Form and Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma
                  </label>
                  <select
                    value={formData.form}
                    onChange={(e) => handleChange('form', e.target.value)}
                    disabled={!!selectedCatalogItem}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      selectedCatalogItem ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                  >
                    {MEDICATION_FORMS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vieniba *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    disabled={!!selectedCatalogItem}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.unit ? 'border-red-300' : 'border-gray-300'
                    } ${selectedCatalogItem ? 'bg-gray-50 text-gray-600' : ''}`}
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="text-sm text-red-600 mt-1">{errors.unit}</p>
                  )}
                </div>
              </div>

              {/* Origin Country (only for foreign / manual entry) */}
              {formData.isForeign && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Izcelsmes valsts *
                  </label>
                  <input
                    type="text"
                    value={formData.originCountry}
                    onChange={(e) => handleChange('originCountry', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.originCountry ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Piem., Vacija, Polija, ASV"
                  />
                  {errors.originCountry && (
                    <p className="text-sm text-red-600 mt-1">{errors.originCountry}</p>
                  )}
                </div>
              )}

              {/* Quantity and Batch */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daudzums *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.quantity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ja zinams"
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deriguma termins
                </label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleChange('expirationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Brought By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kursh atnesa zales *
                </label>
                <input
                  type="text"
                  value={formData.broughtBy}
                  onChange={(e) => handleChange('broughtBy', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.broughtBy ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Vards, uzvards"
                />
                {errors.broughtBy && (
                  <p className="text-sm text-red-600 mt-1">{errors.broughtBy}</p>
                )}
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attiecibas ar rezidentu
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => handleChange('relationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {RELATIONSHIPS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Piezimes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Papildu informacija..."
                />
              </div>

              {/* Received By */}
              <div className="text-sm text-gray-500">
                <strong>Pienema:</strong> {CURRENT_USER}
              </div>

              {/* Prototype notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  Visas radinieku atnestas preces tiek registretas ar nulles izmaksam un nav iekļautas norēķinos.
                </p>
              </div>

              {/* Error */}
              {errors.submit && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">{errors.submit}</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Atcelt
          </button>
          {!showSearchStep && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saglaba...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Registret
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalReceiptModal;
