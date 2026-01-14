import { useState, useMemo } from 'react';
import { Check, X, SkipForward, ChevronDown, ChevronUp, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import HistoryFilters from './HistoryFilters';
import { getAdministrationHistory, getDateRange } from '../../domain/prescriptionHelpers';
import { TIME_SLOTS } from '../../constants/prescriptionConstants';

/**
 * HistoryView - Shows historical administration records with filtering
 */
export default function HistoryView({
  residentId,
  prescriptions
}) {
  const [filters, setFilters] = useState({
    datePreset: '7days',
    status: 'all',
    medicationId: '',
    searchQuery: ''
  });

  const [expandedLogId, setExpandedLogId] = useState(null);

  // Get filtered history data
  const historyLogs = useMemo(() => {
    const dateRange = getDateRange(filters.datePreset);
    return getAdministrationHistory(residentId, {
      ...dateRange,
      status: filters.status,
      medicationId: filters.medicationId,
      searchQuery: filters.searchQuery
    });
  }, [residentId, filters]);

  // Group logs by date for better display
  const groupedLogs = useMemo(() => {
    const groups = {};
    historyLogs.forEach(log => {
      if (!groups[log.date]) {
        groups[log.date] = [];
      }
      groups[log.date].push(log);
    });
    return groups;
  }, [historyLogs]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === today) return 'Šodien';
    if (dateStr === yesterdayStr) return 'Vakar';

    return date.toLocaleDateString('lv-LV', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('lv-LV', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'given':
        return {
          icon: <Check className="w-4 h-4" />,
          label: 'Iedota',
          bgColor: 'bg-teal-100',
          textColor: 'text-teal-700',
          iconColor: 'text-teal-600'
        };
      case 'increased':
        return {
          icon: <TrendingUp className="w-4 h-4" />,
          label: 'Palielināta',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'decreased':
        return {
          icon: <TrendingDown className="w-4 h-4" />,
          label: 'Samazināta',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'refused':
        return {
          icon: <X className="w-4 h-4" />,
          label: 'Atteicās',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          iconColor: 'text-red-600'
        };
      case 'skipped':
        return {
          icon: <SkipForward className="w-4 h-4" />,
          label: 'Izlaista',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-600'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'Nezināms',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-600'
        };
    }
  };

  const toggleExpand = (logId) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <HistoryFilters
        filters={filters}
        onFiltersChange={setFilters}
        medications={prescriptions}
      />

      {/* Results count */}
      <div className="text-sm text-gray-500">
        {historyLogs.length === 0
          ? 'Nav ierakstu'
          : `${historyLogs.length} ierakst${historyLogs.length === 1 ? 's' : 'i'}`
        }
      </div>

      {/* History list grouped by date */}
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          Nav atrasti ieraksti ar izvēlētajiem filtriem
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([date, logs]) => (
            <div key={date}>
              {/* Date header */}
              <div className="sticky top-0 bg-white py-2 mb-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">
                  {formatDate(date)}
                </h3>
              </div>

              {/* Logs for this date */}
              <div className="space-y-2">
                {logs.map(log => {
                  const statusConfig = getStatusConfig(log.status);
                  const isExpanded = expandedLogId === log.id;
                  const hasDetails = log.refusalReason || log.adjustmentReason || log.notes || log.actualDose;

                  return (
                    <div
                      key={log.id}
                      className={`border rounded-lg overflow-hidden transition-colors ${
                        log.status === 'refused'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {/* Main row */}
                      <button
                        onClick={() => hasDetails && toggleExpand(log.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left ${
                          hasDetails ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                        }`}
                      >
                        {/* Status icon */}
                        <div className={`p-2 rounded-full ${statusConfig.bgColor} ${statusConfig.iconColor}`}>
                          {statusConfig.icon}
                        </div>

                        {/* Medication info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {log.medicationName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {TIME_SLOTS[log.timeSlot]?.label} • {log.dose} {log.unit}
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          {statusConfig.label}
                        </div>

                        {/* Expand indicator */}
                        {hasDetails && (
                          <div className="text-gray-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        )}
                      </button>

                      {/* Expanded details */}
                      {isExpanded && hasDetails && (
                        <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                          <div className="ml-11 space-y-2 text-sm">
                            {/* Dose adjustment info */}
                            {(log.status === 'increased' || log.status === 'decreased') && log.actualDose && (
                              <div>
                                <span className="text-gray-500">Deva mainīta: </span>
                                <span className="text-gray-700 line-through mr-1">{log.originalDose}</span>
                                <span className="text-gray-500">→</span>
                                <span className={`ml-1 font-medium ${log.status === 'increased' ? 'text-blue-700' : 'text-yellow-700'}`}>
                                  {log.actualDose}
                                </span>
                              </div>
                            )}
                            {/* Adjustment reason (for increased/decreased/skipped) */}
                            {log.adjustmentReason && (
                              <div>
                                <span className="text-gray-500">Iemesls: </span>
                                <span className={`${log.status === 'skipped' ? 'text-gray-700' : log.status === 'increased' ? 'text-blue-700' : 'text-yellow-700'}`}>
                                  {log.adjustmentReason}
                                </span>
                              </div>
                            )}
                            {/* Refusal reason (for refused status) */}
                            {log.refusalReason && (
                              <div>
                                <span className="text-gray-500">Iemesls: </span>
                                <span className="text-red-700">{log.refusalReason}</span>
                              </div>
                            )}
                            {log.notes && (
                              <div>
                                <span className="text-gray-500">Piezīmes: </span>
                                <span className="text-gray-700">{log.notes}</span>
                              </div>
                            )}
                            <div className="text-xs text-gray-400">
                              Atzīmēja: {log.administeredBy} • {formatTime(log.administeredAt)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer info for non-expanded items */}
                      {!isExpanded && (
                        <div className="px-3 pb-2 text-xs text-gray-400 ml-11">
                          {log.administeredBy} • {formatTime(log.administeredAt)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
