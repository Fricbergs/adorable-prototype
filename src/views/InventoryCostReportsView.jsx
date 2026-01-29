import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import PageShell from '../components/PageShell';
import CostSummaryCards from '../components/inventory/CostSummaryCards';
import ResidentCostBreakdown from '../components/inventory/ResidentCostBreakdown';
import { getCostSummaryByResident, getResidentInventory } from '../domain/inventoryHelpers';
import { getAllResidents } from '../domain/residentHelpers';

/**
 * InventoryCostReportsView -- Izmaksu atskaite
 * Cross-resident cost summary with per-resident drill-down.
 */
export default function InventoryCostReportsView({ onBack }) {
  const [summaries, setSummaries] = useState([]);
  const [residents, setResidents] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [sortKey, setSortKey] = useState('totalCost');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    const data = getCostSummaryByResident();
    setSummaries(data);

    // Build resident name map
    const all = getAllResidents();
    const map = {};
    all.forEach(r => {
      map[r.id] = `${r.firstName} ${r.lastName}`;
    });
    setResidents(map);
  }, []);

  // Sort summaries
  const sorted = useMemo(() => {
    return [...summaries].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') {
        const na = residents[a.residentId] || '';
        const nb = residents[b.residentId] || '';
        return na.localeCompare(nb, 'lv') * dir;
      }
      return ((a[sortKey] || 0) - (b[sortKey] || 0)) * dir;
    });
  }, [summaries, sortKey, sortDir, residents]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleExpand = (residentId) => {
    setExpandedId(prev => prev === residentId ? null : residentId);
  };

  const SortHeader = ({ label, sortField, align = 'left' }) => {
    const active = sortKey === sortField;
    return (
      <th
        className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 ${align === 'right' ? 'text-right' : 'text-left'}`}
        onClick={() => handleSort(sortField)}
      >
        <span className="inline-flex items-center gap-1">
          {label}
          {active ? (
            sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          ) : (
            <ArrowUpDown className="w-3 h-3 opacity-30" />
          )}
        </span>
      </th>
    );
  };

  return (
    <PageShell maxWidth="max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Izmaksu atskaite</h1>
          <p className="text-sm text-gray-500">Izmaksu sadalījums pa rezidentiem</p>
        </div>
      </div>

      {/* Summary Cards */}
      <CostSummaryCards summaries={summaries} />

      {/* Sortable Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 w-8"></th>
                <SortHeader label="Rezidents" sortField="name" />
                <SortHeader label="Kopējā summa" sortField="totalCost" align="right" />
                <SortHeader label="Iepirktie" sortField="facilityPurchasedTotal" align="right" />
                <SortHeader label="Bezmaksas" sortField="zeroCostTotal" align="right" />
                <SortHeader label="Vienības" sortField="itemCount" align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sorted.map(row => {
                const isExpanded = expandedId === row.residentId;
                const name = residents[row.residentId] || row.residentId;
                return (
                  <React.Fragment key={row.residentId}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(row.residentId)}
                    >
                      <td className="px-4 py-3 text-center">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 inline" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 inline" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          EUR {row.totalCost.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-green-700">
                          EUR {row.facilityPurchasedTotal.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-500">
                          EUR {row.zeroCostTotal.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-700">{row.itemCount}</span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-4 py-0">
                          <ResidentCostBreakdown
                            residentId={row.residentId}
                            items={getResidentInventory(row.residentId)}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nav datu par rezidentu izmaksām
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
