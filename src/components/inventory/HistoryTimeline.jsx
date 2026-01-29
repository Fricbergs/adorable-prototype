import React from 'react';
import { Upload, FileText, ArrowRight, Users, Globe, Clock } from 'lucide-react';
import { HISTORY_ACTION_TYPES } from '../../constants/inventoryConstants';
import { getSupplierName } from '../../domain/supplierHelpers';
import { getAllResidents } from '../../domain/residentHelpers';

// Icon map for Lucide components
const ICON_MAP = {
  Upload,
  FileText,
  ArrowRight,
  Users,
  Globe
};

// Color classes for dot and badge
const COLOR_CLASSES = {
  blue: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  purple: { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  orange: { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  violet: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700 border-violet-200' }
};

/**
 * Format date in Latvian locale
 */
function formatDayHeader(dateStr) {
  try {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('lv-LV', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Extract time from ISO date string
 */
function extractTime(dateStr) {
  if (!dateStr || !dateStr.includes('T')) return null;
  const timePart = dateStr.split('T')[1];
  if (!timePart) return null;
  const [h, m] = timePart.split(':');
  if (h === '00' && m === '00') return null;
  return `${h}:${m}`;
}

/**
 * Get resident name by ID (cached lookup)
 */
let residentsCache = null;
function getResidentName(residentId) {
  if (!residentId) return null;
  if (!residentsCache) {
    residentsCache = getAllResidents();
  }
  const r = residentsCache.find(res => res.id === residentId);
  return r ? `${r.firstName} ${r.lastName}` : null;
}

/**
 * HistoryTimeline - Day-grouped timeline of inventory actions
 */
export default function HistoryTimeline({ groups }) {
  // Reset cache on each render
  residentsCache = null;

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Nav atrastu ierakstu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.date}>
          {/* Day header */}
          <h3 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
            {formatDayHeader(group.date)}
          </h3>

          {/* Timeline */}
          <div className="relative border-l-2 border-gray-200 ml-4 space-y-3">
            {group.actions.map(action => {
              const actionType = HISTORY_ACTION_TYPES[action.type] || HISTORY_ACTION_TYPES.manual_entry;
              const IconComp = ICON_MAP[actionType.icon] || FileText;
              const colors = COLOR_CLASSES[actionType.color] || COLOR_CLASSES.blue;
              const time = extractTime(action.date);
              const supplierName = action.supplierId ? getSupplierName(action.supplierId) : null;
              const residentName = getResidentName(action.residentId);

              return (
                <div key={action.id} className="relative pl-6">
                  {/* Dot */}
                  <div className={`absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full ${colors.dot} ring-2 ring-white`} />

                  {/* Card */}
                  <div className="rounded-lg border border-gray-200 shadow-sm p-3 bg-white">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-1.5 rounded-md ${colors.badge} border`}>
                        <IconComp className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge} border`}>
                            {actionType.label}
                          </span>
                          {time && (
                            <span className="text-xs text-gray-400">{time}</span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 text-sm mt-1">
                          {action.medicationName}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                          <span>{action.quantity} {action.unit}</span>
                          {action.unitCost > 0 && (
                            <span>{action.unitCost.toFixed(2)} EUR/vien.</span>
                          )}
                          {supplierName && (
                            <span>{supplierName}</span>
                          )}
                          {residentName && (
                            <span>{residentName}</span>
                          )}
                          {action.details?.broughtBy && (
                            <span>Atnesa: {action.details.broughtBy}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
