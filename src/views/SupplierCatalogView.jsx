import React, { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import PageShell from '../components/PageShell';
import SupplierSelector from '../components/inventory/SupplierSelector';
import { getCatalogForSupplier, findEquivalentMedications } from '../domain/catalogHelpers';

/**
 * Browsable supplier product catalog page
 * Shows reference data: what each supplier offers, with cross-supplier equivalence indicators
 */
const SupplierCatalogView = ({ onNavigate }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState('SUP-RECIPE-PLUS');
  const [searchQuery, setSearchQuery] = useState('');

  // Get catalog for selected supplier, filtered by search
  const catalogItems = useMemo(() => {
    const catalog = getCatalogForSupplier(selectedSupplierId);
    if (!searchQuery) return catalog;

    const q = searchQuery.toLowerCase();
    return catalog.filter(
      item =>
        item.medicationName.toLowerCase().includes(q) ||
        item.activeIngredient.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
    );
  }, [selectedSupplierId, searchQuery]);

  // Availability badge rendering
  const renderAvailability = (availability) => {
    const config = {
      available: { label: 'Pieejams', className: 'bg-green-100 text-green-700' },
      limited: { label: 'Ierobežots', className: 'bg-yellow-100 text-yellow-700' },
      unavailable: { label: 'Nav pieejams', className: 'bg-red-100 text-red-700' }
    };
    const { label, className } = config[availability] || config.unavailable;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  // Equivalence count for a catalog item
  const getEquivalentCount = (item) => {
    const equivalents = findEquivalentMedications(item.activeIngredient, item.form);
    return equivalents.length;
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <button
              onClick={() => onNavigate && onNavigate('all-leads')}
              className="hover:text-orange-600 transition-colors"
            >
              Sakums
            </button>
            <span>/</span>
            <span className="text-gray-700">Katalogi</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-orange-500" />
            Piegadataju katalogi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Piegadataju precu saraksti (atsauces dati)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <SupplierSelector
                value={selectedSupplierId}
                onChange={setSelectedSupplierId}
              />
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Meklet kataloga..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Catalog Table */}
          {catalogItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nav atrasti kataloga ieraksti</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nosaukums
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktiva viela
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forma
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vienibas cena
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pieejamiba
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ekvivalenti
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {catalogItems.map((item) => {
                    const eqCount = getEquivalentCount(item);
                    return (
                      <tr key={item.sku} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600 font-mono">{item.sku}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">{item.medicationName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{item.activeIngredient}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{item.form}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {'\u20AC'}{item.unitCost.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {renderAvailability(item.availability)}
                        </td>
                        <td className="px-4 py-3">
                          {eqCount > 1 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {eqCount} piegadataji
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {catalogItems.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
              {catalogItems.length} {catalogItems.length === 1 ? 'ieraksts' : 'ieraksti'}
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Prototipa rezims:</strong> Kataloga dati ir simuleti. Realaja sistema dati tiktu sinhronizeti no piegadataju FTP serveriem.
          </p>
        </div>
      </div>
    </PageShell>
  );
};

export default SupplierCatalogView;
