import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from 'lucide-react';
import { INVENTORY_STATUS } from '../../constants/inventoryConstants';

/**
 * Badge component for displaying inventory status
 */
const InventoryStatusBadge = ({ status, size = 'default' }) => {
  const statusConfig = INVENTORY_STATUS[status] || INVENTORY_STATUS.available;

  const sizeClasses = {
    small: 'px-1.5 py-0.5 text-xs',
    default: 'px-2 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  };

  const iconSize = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  const getIcon = () => {
    switch (status) {
      case 'available':
        return <CheckCircle className={`${iconSize[size]} text-green-600`} />;
      case 'low':
        return <AlertTriangle className={`${iconSize[size]} text-yellow-600`} />;
      case 'expired':
        return <XCircle className={`${iconSize[size]} text-red-600`} />;
      case 'depleted':
        return <MinusCircle className={`${iconSize[size]} text-gray-500`} />;
      default:
        return <CheckCircle className={`${iconSize[size]} text-green-600`} />;
    }
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${statusConfig.bgColor} ${statusConfig.textColor}
        ${sizeClasses[size]}
      `}
    >
      {getIcon()}
      {statusConfig.label}
    </span>
  );
};

export default InventoryStatusBadge;
