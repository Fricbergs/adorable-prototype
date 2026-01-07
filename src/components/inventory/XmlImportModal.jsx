import React, { useState } from 'react';
import { X, Upload, Check, Package, FileText } from 'lucide-react';
import { generateXmlImportData } from '../../domain/mockInventoryData';
import { createBulkInventoryItem } from '../../domain/inventoryHelpers';

/**
 * Modal for simulating XML import from Recipe Plus
 */
const XmlImportModal = ({ isOpen, onClose, onImportComplete }) => {
  const [importData, setImportData] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerateData = () => {
    const data = generateXmlImportData();
    setImportData(data);
    setImportSuccess(false);
  };

  const handleImport = async () => {
    if (!importData) return;

    setIsImporting(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const newItem = createBulkInventoryItem({
        ...importData,
        receivedFrom: 'xml_import'
      });

      setImportSuccess(true);
      setIsImporting(false);

      // Notify parent after a brief delay to show success
      setTimeout(() => {
        onImportComplete && onImportComplete(newItem);
        onClose();
        setImportData(null);
        setImportSuccess(false);
      }, 1000);
    } catch (error) {
      console.error('Import failed:', error);
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setImportData(null);
    setImportSuccess(false);
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
              Simulēt XML importu
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Šī ir simulācijas funkcija. Reālajā sistēmā XML fails tiktu importēts no Recipe Plus.
            </p>
          </div>

          {!importData ? (
            <div className="text-center py-6">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                Nospiediet pogu, lai ģenerētu parauga importa datus
              </p>
              <button
                onClick={handleGenerateData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Ģenerēt importa datus
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Importējamie dati:
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Medikaments</p>
                    <p className="text-sm font-medium text-gray-900">
                      {importData.medicationName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Aktīvā viela</p>
                    <p className="text-sm text-gray-700">
                      {importData.activeIngredient}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Daudzums</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {importData.quantity} {importData.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Partijas Nr.</p>
                    <p className="text-sm font-mono text-gray-700">
                      {importData.batchNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Derīgums</p>
                    <p className="text-sm text-gray-700">
                      {new Date(importData.expirationDate).toLocaleDateString('lv-LV')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Vienības cena</p>
                    <p className="text-sm text-gray-700">
                      €{importData.unitCost.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Piegādātājs</p>
                    <p className="text-sm text-gray-700">
                      {importData.supplier}
                    </p>
                  </div>
                </div>
              </div>

              {importSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700 font-medium">
                    Imports veiksmīgs!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          {importData && (
            <button
              onClick={handleGenerateData}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Ģenerēt citus datus
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Atcelt
            </button>
            {importData && !importSuccess && (
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isImporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importē...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Importēt
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XmlImportModal;
