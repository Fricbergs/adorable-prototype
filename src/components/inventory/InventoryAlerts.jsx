import React from 'react';
import { AlertTriangle, XCircle, Clock, Package } from 'lucide-react';

/**
 * Component for displaying inventory alerts
 */
const InventoryAlerts = ({ alerts, onAlertClick, compact = false }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type, severity) => {
    const iconClass = severity === 'critical' ? 'text-red-500' : 'text-yellow-500';
    const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';

    switch (type) {
      case 'low_stock':
        return <Package className={`${iconSize} ${iconClass}`} />;
      case 'depleted':
        return <XCircle className={`${iconSize} ${iconClass}`} />;
      case 'expired':
        return <XCircle className={`${iconSize} ${iconClass}`} />;
      case 'expiring_soon':
        return <Clock className={`${iconSize} ${iconClass}`} />;
      default:
        return <AlertTriangle className={`${iconSize} ${iconClass}`} />;
    }
  };

  const getSeverityStyles = (severity) => {
    if (severity === 'critical') {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  };

  // Group alerts by type
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {criticalAlerts.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            {criticalAlerts.length} kritisks
          </span>
        )}
        {warningAlerts.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            {warningAlerts.length} brīdinājums
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
        Brīdinājumi ({alerts.length})
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.item?.id || index}-${alert.type}`}
            onClick={() => onAlertClick && onAlertClick(alert)}
            className={`
              flex items-start gap-3 p-3 rounded-lg border
              ${getSeverityStyles(alert.severity)}
              ${onAlertClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getAlertIcon(alert.type, alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {alert.item?.medicationName || 'Nezināms medikaments'}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {alert.message}
              </p>
              {alert.daysRemaining !== undefined && (
                <p className="text-xs opacity-60 mt-1">
                  Atlikušās dienas: {alert.daysRemaining}
                </p>
              )}
            </div>
            {alert.item?.quantity !== undefined && (
              <div className="flex-shrink-0 text-right">
                <span className="text-sm font-bold">
                  {alert.item.quantity}
                </span>
                <span className="text-xs opacity-70 ml-1">
                  {alert.item.unit}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAlerts;
