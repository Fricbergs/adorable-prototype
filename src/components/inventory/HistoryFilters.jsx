import React from 'react';
import { Filter } from 'lucide-react';
import { HISTORY_ACTION_TYPES } from '../../constants/inventoryConstants';

/**
 * HistoryFilters - Filter bar for import history timeline
 * Date range, source type, and resident filters
 */
export default function HistoryFilters({ filters, onFilterChange, residents = [] }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value || '' });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <Filter className="w-4 h-4" />
        <span>Filtri</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {/* Date range: from */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500 whitespace-nowrap">No datuma</label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Date range: to */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500 whitespace-nowrap">Līdz datumam</label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Source type dropdown */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500 whitespace-nowrap">Avots</label>
          <select
            value={filters.sourceType || ''}
            onChange={(e) => handleChange('sourceType', e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Visi</option>
            {Object.values(HISTORY_ACTION_TYPES).map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Resident dropdown */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500 whitespace-nowrap">Rezidents</label>
          <select
            value={filters.residentId || ''}
            onChange={(e) => handleChange('residentId', e.target.value)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Visi rezidenti</option>
            {residents.map(r => (
              <option key={r.id} value={r.id}>
                {r.firstName} {r.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
