import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import PageShell from '../components/PageShell';
import HistoryFilters from '../components/inventory/HistoryFilters';
import HistoryTimeline from '../components/inventory/HistoryTimeline';
import { aggregateHistoryActions, groupActionsByDay, filterHistory } from '../domain/historyHelpers';
import { getAllResidents } from '../domain/residentHelpers';

/**
 * ImportHistoryView - Full-page import history audit trail
 * Shows day-grouped timeline of all receipt actions with filters
 */
export default function ImportHistoryView({ onBack }) {
  const [allActions, setAllActions] = useState([]);
  const [residents, setResidents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sourceType: '',
    residentId: ''
  });

  // Load all actions and residents on mount
  useEffect(() => {
    setAllActions(aggregateHistoryActions());
    setResidents(getAllResidents());
  }, []);

  // Apply filters and group by day
  const groups = useMemo(() => {
    const filtered = filterHistory(allActions, filters);
    return groupActionsByDay(filtered);
  }, [allActions, filters]);

  // Count for display
  const totalFiltered = groups.reduce((sum, g) => sum + g.actions.length, 0);

  return (
    <PageShell maxWidth="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importu vēsture</h1>
          <p className="text-sm text-gray-500">
            {totalFiltered} {totalFiltered === 1 ? 'ieraksts' : 'ieraksti'} — visas noliktavas darbības
          </p>
        </div>
      </div>

      {/* Filters */}
      <HistoryFilters
        filters={filters}
        onFilterChange={setFilters}
        residents={residents}
      />

      {/* Timeline */}
      <HistoryTimeline groups={groups} />
    </PageShell>
  );
}
