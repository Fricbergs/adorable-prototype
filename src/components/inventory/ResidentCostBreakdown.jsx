import React from 'react';
import { getSupplierName } from '../../domain/supplierHelpers';
import { getWeightedAverageCost } from '../../domain/inventoryHelpers';

/**
 * Per-resident grouped item list with costs by source category.
 * Groups into: "Iestades iepirktie" (facility-purchased) and "Radinieku atnestie" (relative-brought).
 * Foreign medications fold into relative-brought per CONTEXT.md.
 */
const ResidentCostBreakdown = ({ residentId, items }) => {
  // Split items into two groups
  const facilityItems = items.filter(i => i.entryMethod === 'bulk_transfer');
  const relativeItems = items.filter(i => i.entryMethod === 'external_receipt');

  // Group facility items by supplierId
  const supplierGroups = {};
  facilityItems.forEach(item => {
    const sid = item.supplierId || 'unknown';
    if (!supplierGroups[sid]) {
      supplierGroups[sid] = { supplierId: sid, name: getSupplierName(sid), items: [], subtotal: 0 };
    }
    const lineCost = (item.unitCost || 0) * item.quantity;
    supplierGroups[sid].items.push(item);
    supplierGroups[sid].subtotal += lineCost;
  });

  const facilityTotal = facilityItems.reduce((s, i) => s + (i.unitCost || 0) * i.quantity, 0);
  const relativeTotal = relativeItems.reduce((s, i) => s + (i.unitCost || 0) * i.quantity, 0);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 mb-2">
      {/* Facility-purchased section */}
      {facilityItems.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
            <span>Iestades iepirktie</span>
            <span className="text-green-700">EUR {facilityTotal.toFixed(2)}</span>
          </h4>
          {Object.values(supplierGroups).map(group => (
            <div key={group.supplierId} className="mb-3 last:mb-0">
              <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                {group.name}
              </p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const cost = (item.unitCost || 0) * item.quantity;
                  return (
                    <div key={item.id} className="flex items-center justify-between py-1 px-2 bg-white rounded text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-800 truncate block">{item.medicationName}</span>
                      </div>
                      <div className="flex items-center gap-4 ml-3 shrink-0">
                        <span className="text-gray-500 text-xs">
                          {item.quantity} {item.unit}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {(item.unitCost || 0).toFixed(2)}/{item.unit}
                        </span>
                        <span className="font-semibold text-gray-900 w-20 text-right">
                          EUR {cost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-1 pr-2">
                <span className="text-xs text-gray-500">
                  Starpsumma: EUR {group.subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Relative-brought section (includes foreign medications) */}
      {relativeItems.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
            <span>Radinieku atnestie</span>
            <span className="text-gray-500">EUR {relativeTotal.toFixed(2)}</span>
          </h4>
          <div className="space-y-1">
            {relativeItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-1 px-2 bg-white rounded text-sm">
                <div className="flex-1 min-w-0">
                  <span className="text-gray-800 truncate block">
                    {item.medicationName}
                    {item.isForeign && item.originCountry && (
                      <span className="ml-1 text-xs text-violet-600">({item.originCountry})</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-4 ml-3 shrink-0">
                  <span className="text-gray-500 text-xs">
                    {item.quantity} {item.unit}
                  </span>
                  <span className="font-semibold text-gray-900 w-20 text-right">
                    EUR 0.00
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {facilityItems.length === 0 && relativeItems.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">Nav vienību</p>
      )}
    </div>
  );
};

export default ResidentCostBreakdown;
