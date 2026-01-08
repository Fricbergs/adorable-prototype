import { useState } from 'react';
import { Filter, Search, X, ChevronDown } from 'lucide-react';

const DATE_PRESETS = [
  { value: '7days', label: 'Pēdējās 7 dienas' },
  { value: '30days', label: 'Pēdējās 30 dienas' },
  { value: '90days', label: 'Pēdējās 90 dienas' },
  { value: 'all', label: 'Visi ieraksti' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Visi statusi' },
  { value: 'given', label: 'Iedotas' },
  { value: 'refused', label: 'Atteikumi' },
  { value: 'skipped', label: 'Izlaistas' }
];

/**
 * HistoryFilters - Filter bar for history view
 */
export default function HistoryFilters({
  filters,
  onFiltersChange,
  medications = []
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDatePresetChange = (preset) => {
    onFiltersChange({ ...filters, datePreset: preset });
  };

  const handleStatusChange = (status) => {
    onFiltersChange({ ...filters, status });
  };

  const handleMedicationChange = (medicationId) => {
    onFiltersChange({ ...filters, medicationId });
  };

  const handleSearchChange = (searchQuery) => {
    onFiltersChange({ ...filters, searchQuery });
  };

  const clearFilters = () => {
    onFiltersChange({
      datePreset: '7days',
      status: 'all',
      medicationId: '',
      searchQuery: ''
    });
  };

  const hasActiveFilters =
    filters.datePreset !== '7days' ||
    filters.status !== 'all' ||
    filters.medicationId ||
    filters.searchQuery;

  return (
    <div className="space-y-3">
      {/* Main filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Meklēt medikamentu..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date preset dropdown */}
        <select
          value={filters.datePreset || '7days'}
          onChange={(e) => handleDatePresetChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {DATE_PRESETS.map(preset => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>

        {/* Status dropdown */}
        <select
          value={filters.status || 'all'}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* More filters button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm transition-colors ${
            isExpanded || filters.medicationId
              ? 'border-orange-300 bg-orange-50 text-orange-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtri</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Notīrīt
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Medication filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medikaments
              </label>
              <select
                value={filters.medicationId || ''}
                onChange={(e) => handleMedicationChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Visi medikamenti</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.medicationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.datePreset !== '7days' && (
            <FilterPill
              label={DATE_PRESETS.find(p => p.value === filters.datePreset)?.label}
              onRemove={() => handleDatePresetChange('7days')}
            />
          )}
          {filters.status !== 'all' && (
            <FilterPill
              label={STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
              onRemove={() => handleStatusChange('all')}
            />
          )}
          {filters.medicationId && (
            <FilterPill
              label={medications.find(m => m.id === filters.medicationId)?.medicationName || 'Medikaments'}
              onRemove={() => handleMedicationChange('')}
            />
          )}
          {filters.searchQuery && (
            <FilterPill
              label={`"${filters.searchQuery}"`}
              onRemove={() => handleSearchChange('')}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-orange-200 rounded-full p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
