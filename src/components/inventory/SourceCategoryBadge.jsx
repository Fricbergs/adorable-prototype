import React from 'react';
import { SOURCE_CATEGORIES } from '../../constants/inventoryConstants';

/**
 * Color-coded pill badge for displaying source category of a resident inventory item.
 * Categories: facility (orange), relative (blue), foreign (violet)
 * Follows the SupplierBadge pattern.
 */

const SOURCE_CATEGORY_COLORS = {
  facility: 'bg-orange-100 text-orange-700',
  relative: 'bg-blue-100 text-blue-700',
  foreign: 'bg-violet-100 text-violet-700'
};

const SOURCE_CATEGORY_LABELS = {
  facility: SOURCE_CATEGORIES.facility.label,
  relative: SOURCE_CATEGORIES.relative.label,
  foreign: SOURCE_CATEGORIES.foreign.label
};

/**
 * Determine the source category of a resident inventory item.
 * - bulk_transfer -> facility (from warehouse)
 * - external_receipt + isForeign -> foreign
 * - external_receipt -> relative
 * - fallback -> facility
 */
export function getSourceCategory(item) {
  if (item.entryMethod === 'bulk_transfer') return 'facility';
  if (item.entryMethod === 'external_receipt' && item.isForeign) return 'foreign';
  if (item.entryMethod === 'external_receipt') return 'relative';
  return 'facility';
}

const SourceCategoryBadge = ({ item, size = 'default' }) => {
  const category = getSourceCategory(item);

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs'
  };

  const colors = SOURCE_CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
  let label = SOURCE_CATEGORY_LABELS[category] || category;

  // Foreign items show origin country in parentheses
  if (category === 'foreign' && item.originCountry) {
    label = `${label} (${item.originCountry})`;
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${colors}
        ${sizeClasses[size] || sizeClasses.default}
      `}
    >
      {label}
    </span>
  );
};

export default SourceCategoryBadge;
