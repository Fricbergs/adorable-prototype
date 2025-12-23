import React from 'react';
import { Clock, CheckCircle, FileText, ListChecks, XCircle } from 'lucide-react';
import { STATUS } from '../constants/steps';

/**
 * Status badge component for displaying lead status
 * @param {string} status - Status value (prospect, consultation, survey_filled, agreement, queue, cancelled)
 * @param {boolean} showIcon - Whether to show icon
 */
const StatusBadge = ({ status, showIcon = true }) => {
  const statusConfig = {
    [STATUS.PROSPECT]: {
      label: 'Jauns pieteikums',
      shortLabel: 'Pieteikums',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: Clock
    },
    [STATUS.CONSULTATION]: {
      label: 'Konsultācija pabeigta',
      shortLabel: 'Konsultācija',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: CheckCircle
    },
    [STATUS.SURVEY_FILLED]: {
      label: 'Anketa aizpildīta',
      shortLabel: 'Anketa',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: FileText
    },
    [STATUS.AGREEMENT]: {
      label: 'Līgums',
      shortLabel: 'Līgums',
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: FileText
    },
    [STATUS.QUEUE]: {
      label: 'Rindā',
      shortLabel: 'Rindā',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: ListChecks
    },
    [STATUS.CANCELLED]: {
      label: 'Atcelts',
      shortLabel: 'Atcelts',
      className: 'bg-gray-100 text-gray-700 border-gray-300',
      icon: XCircle
    }
  };

  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.className}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {config.shortLabel}
    </span>
  );
};

export default StatusBadge;
