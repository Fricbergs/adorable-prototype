import React from 'react';
import { ClipboardList, Edit2, Trash2 } from 'lucide-react';
import { DIAGNOSIS_STATUS } from '../../constants/residentConstants';

/**
 * DiagnosesSection - Displays list of diagnoses
 */
const DiagnosesSection = ({ diagnoses, onEdit, onDelete }) => {
  if (!diagnoses || diagnoses.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <ClipboardList className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Nav pievienotu diagnožu</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {diagnoses.map((diagnosis) => {
        const statusConfig = DIAGNOSIS_STATUS[diagnosis.status] || DIAGNOSIS_STATUS.active;

        return (
          <div
            key={diagnosis.id}
            className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {diagnosis.code && (
                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {diagnosis.code}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mt-1">
                  {diagnosis.description || 'Nav apraksta'}
                </p>
                {diagnosis.notes && (
                  <p className="text-sm text-gray-500 mt-1">{diagnosis.notes}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  {diagnosis.diagnosedDate && (
                    <span>
                      Diagnosticēts: {new Date(diagnosis.diagnosedDate).toLocaleDateString('lv-LV')}
                    </span>
                  )}
                  {diagnosis.createdBy && (
                    <span>Pievienoja: {diagnosis.createdBy}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(diagnosis)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Rediģēt"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(diagnosis.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Dzēst"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiagnosesSection;
