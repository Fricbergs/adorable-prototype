import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Search, Upload, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import PageShell from '../components/PageShell';
import BulkInventoryTable from '../components/inventory/BulkInventoryTable';
import InventoryAlerts from '../components/inventory/InventoryAlerts';
import XmlImportModal from '../components/inventory/XmlImportModal';
import ManualEntryModal from '../components/inventory/ManualEntryModal';
import {
  getAllBulkInventory,
  getBulkInventoryAlerts,
  getInventorySummary,
  searchBulkInventory
} from '../domain/inventoryHelpers';

/**
 * Dashboard view for Warehouse A (Lielā noliktava)
 */
const InventoryDashboardView = ({ onNavigate, onSelectResident }) => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);

  // Load data
  const loadData = () => {
    const items = getAllBulkInventory();
    setInventory(items);
    setAlerts(getBulkInventoryAlerts());
    setSummary(getInventorySummary());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter inventory by search
  const filteredInventory = searchQuery
    ? searchBulkInventory(searchQuery)
    : inventory;

  // Handle transfer button click
  const handleTransfer = (item) => {
    // Navigate to resident selection with the item to transfer
    onSelectResident && onSelectResident(item);
  };

  // Handle import complete
  const handleImportComplete = (newItem) => {
    loadData();
  };

  // Handle manual entry complete
  const handleManualEntryComplete = () => {
    loadData();
  };

  // Summary stats
  const stats = [
    {
      label: 'Kopā medikamenti',
      value: summary?.bulk?.totalItems || 0,
      color: 'text-gray-900'
    },
    {
      label: 'Zems krājums',
      value: summary?.bulk?.lowStockCount || 0,
      color: summary?.bulk?.lowStockCount > 0 ? 'text-yellow-600' : 'text-gray-900'
    },
    {
      label: 'Beidzas derīgums',
      value: (summary?.bulk?.expiringCount || 0) + (summary?.bulk?.expiredCount || 0),
      color: (summary?.bulk?.expiringCount || 0) + (summary?.bulk?.expiredCount || 0) > 0 ? 'text-red-600' : 'text-gray-900'
    },
    {
      label: 'Izlietots',
      value: summary?.bulk?.depletedCount || 0,
      color: summary?.bulk?.depletedCount > 0 ? 'text-red-600' : 'text-gray-900'
    }
  ];

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                onClick={() => onNavigate && onNavigate('all-leads')}
                className="hover:text-orange-600 transition-colors"
              >
                Sākums
              </button>
              <span>/</span>
              <span className="text-gray-700">Lielā noliktava</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-orange-500" />
              Lielā noliktava
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Centrālā zāļu noliktava (A)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atjaunot"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowManualEntryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Manuāla ievade
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Simulēt XML importu
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Brīdinājumi ({alerts.length})
              </h2>
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showAlerts ? 'Slēpt' : 'Rādīt'}
              </button>
            </div>
            {showAlerts && (
              <InventoryAlerts
                alerts={alerts}
                onAlertClick={(alert) => {
                  // Scroll to item or highlight it
                  const element = document.getElementById(`item-${alert.item?.id}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('ring-2', 'ring-orange-500');
                    setTimeout(() => {
                      element.classList.remove('ring-2', 'ring-orange-500');
                    }, 2000);
                  }
                }}
              />
            )}
          </div>
        )}

        {/* Search and Table */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Meklēt medikamentu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <BulkInventoryTable
            items={filteredInventory}
            onTransfer={handleTransfer}
          />

          {/* Footer */}
          {filteredInventory.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
              Rāda {filteredInventory.length} no {inventory.length} ierakstiem
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Prototipa režīms:</strong> Šī ir demonstrācijas versija. Dati tiek glabāti pārlūka lokālajā krātuvē.
          </p>
        </div>
      </div>

      {/* Import Modal */}
      <XmlImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={showManualEntryModal}
        onClose={() => setShowManualEntryModal(false)}
        onEntryComplete={handleManualEntryComplete}
      />
    </PageShell>
  );
};

export default InventoryDashboardView;
