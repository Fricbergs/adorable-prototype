import React, { useState, useEffect } from 'react';
import { User, ArrowLeft, Package, Users, ArrowRight, RefreshCw, AlertTriangle, Search } from 'lucide-react';
import PageShell from '../components/PageShell';
import ResidentInventoryTable from '../components/inventory/ResidentInventoryTable';
import InventoryAlerts from '../components/inventory/InventoryAlerts';
import TransferModal from '../components/inventory/TransferModal';
import ExternalReceiptModal from '../components/inventory/ExternalReceiptModal';
import {
  getResidentInventory,
  getResidentInventoryAlerts,
  getResidentInventorySummary
} from '../domain/inventoryHelpers';
import { getAllResidents } from '../domain/prescriptionHelpers';

/**
 * View for Resident Inventory (Warehouse B)
 * Shows resident selection or resident-specific inventory
 */
const ResidentInventoryView = ({ selectedResident, preselectedBulkItem, onBack, onNavigate }) => {
  const [residents, setResidents] = useState([]);
  const [currentResident, setCurrentResident] = useState(selectedResident || null);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [pendingBulkItem, setPendingBulkItem] = useState(preselectedBulkItem || null);

  // Load residents
  useEffect(() => {
    const loadedResidents = getAllResidents();
    setResidents(loadedResidents);
  }, []);

  // Load resident inventory
  const loadInventory = () => {
    if (currentResident) {
      const items = getResidentInventory(currentResident.id);
      setInventory(items);
      setAlerts(getResidentInventoryAlerts(currentResident.id));
      setSummary(getResidentInventorySummary(currentResident.id));
    }
  };

  useEffect(() => {
    loadInventory();
  }, [currentResident]);

  // Handle resident selection
  const handleSelectResident = (resident) => {
    setCurrentResident(resident);
    // Auto-open transfer modal if there's a pending bulk item
    if (pendingBulkItem) {
      setShowTransferModal(true);
    }
  };

  // Handle back to resident list
  const handleBackToList = () => {
    setCurrentResident(null);
    setInventory([]);
    setAlerts([]);
    setSummary(null);
  };

  // Filter residents by search
  const filteredResidents = residents.filter(r =>
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roomNumber?.includes(searchQuery)
  );

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // If no resident selected, show resident list
  if (!currentResident) {
    return (
      <PageShell>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                onClick={() => onNavigate && onNavigate('bulk-inventory')}
                className="hover:text-orange-600 transition-colors"
              >
                Noliktava
              </button>
              <span>/</span>
              <span className="text-gray-700">Rezidentu noliktavas</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-orange-500" />
              Rezidentu noliktavas
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Izvēlieties rezidentu, lai skatītu viņa zāļu krājumus
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Meklēt rezidentu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Resident List */}
          <div className="grid gap-3">
            {filteredResidents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nav atrasts neviens rezidents
              </div>
            ) : (
              filteredResidents.map((resident) => {
                const residentInventory = getResidentInventory(resident.id);
                const residentAlerts = getResidentInventoryAlerts(resident.id);

                return (
                  <button
                    key={resident.id}
                    onClick={() => handleSelectResident(resident)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Istaba {resident.roomNumber} • {calculateAge(resident.birthDate)} gadi • {resident.careLevel}
                        </p>
                      </div>

                      {/* Inventory Info */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {residentInventory.length} medikamenti
                          </p>
                          {residentAlerts.length > 0 && (
                            <InventoryAlerts alerts={residentAlerts} compact />
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // Show resident inventory
  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                onClick={handleBackToList}
                className="hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Rezidenti
              </button>
              <span>/</span>
              <span className="text-gray-700">{currentResident.firstName} {currentResident.lastName}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rezidenta noliktava
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadInventory}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atjaunot"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resident Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentResident.firstName} {currentResident.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                Istaba {currentResident.roomNumber} • {calculateAge(currentResident.birthDate)} gadi • {currentResident.careLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Pārvietot no noliktavas
          </button>
          <button
            onClick={() => setShowReceiptModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Radinieki atnes
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">Medikamenti</p>
              <p className="text-xl font-bold text-gray-900">{summary.totalItems}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">No noliktavas</p>
              <p className="text-xl font-bold text-orange-600">{summary.fromBulk}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">No radiniekiem</p>
              <p className="text-xl font-bold text-blue-600">{summary.fromRelatives}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">Brīdinājumi</p>
              <p className={`text-xl font-bold ${summary.alerts > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {summary.alerts}
              </p>
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <InventoryAlerts alerts={alerts} />
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Zāļu krājumi</h3>
          </div>
          <ResidentInventoryTable items={inventory} />
        </div>
      </div>

      {/* Modals */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setPendingBulkItem(null);
        }}
        residentId={currentResident.id}
        residentName={`${currentResident.firstName} ${currentResident.lastName}`}
        preselectedItem={pendingBulkItem}
        onTransferComplete={() => {
          setShowTransferModal(false);
          setPendingBulkItem(null);
          loadInventory();
        }}
      />

      <ExternalReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        residentId={currentResident.id}
        residentName={`${currentResident.firstName} ${currentResident.lastName}`}
        onReceiptComplete={() => {
          setShowReceiptModal(false);
          loadInventory();
        }}
      />
    </PageShell>
  );
};

export default ResidentInventoryView;
