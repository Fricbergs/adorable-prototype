import React from 'react';
import { getSupplierName } from '../../domain/supplierHelpers';

/**
 * Color-coded pill badge for displaying a supplier name
 * Follows the InventoryStatusBadge pattern
 */
const SupplierBadge = ({ supplierId, supplierName, size = 'default' }) => {
  const colorMap = {
    'SUP-RECIPE-PLUS': 'bg-blue-100 text-blue-700',
    'SUP-SUPPLIER-2': 'bg-purple-100 text-purple-700',
    'SUP-RELATIVES': 'bg-green-100 text-green-700'
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    large: 'px-3 py-1 text-sm'
  };

  const colors = colorMap[supplierId] || 'bg-gray-100 text-gray-700';
  const displayName = supplierName || getSupplierName(supplierId);

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${colors}
        ${sizeClasses[size]}
      `}
    >
      {displayName}
    </span>
  );
};

export default SupplierBadge;
