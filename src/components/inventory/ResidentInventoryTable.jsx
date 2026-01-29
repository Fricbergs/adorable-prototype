import React from 'react';
import { ArrowRight, Users, Package } from 'lucide-react';
import InventoryStatusBadge from './InventoryStatusBadge';
import { INVENTORY_SOURCE } from '../../constants/inventoryConstants';

/**
 * Table component for displaying resident inventory (Warehouse B)
 */
const ResidentInventoryTable = ({ items, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getSourceIcon = (entryMethod) => {
    if (entryMethod === 'external_receipt') {
      return <Users className="w-3 h-3 text-blue-500" />;
    }
    return <ArrowRight className="w-3 h-3 text-orange-500" />;
  };

  const getSourceLabel = (entryMethod) => {
    return INVENTORY_SOURCE[entryMethod]?.label || entryMethod;
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p>Nav medikamentu rezidenta noliktavā</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medikaments
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daudzums
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avots
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Derīgums
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statuss
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onView && onView(item)}
              className={`hover:bg-gray-50 transition-colors ${onView ? 'cursor-pointer' : ''}`}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {item.medicationName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Partija: {item.batchNumber || '-'}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`text-sm font-semibold ${
                  item.quantity === 0 ? 'text-red-600' :
                  item.quantity <= item.minimumStock ? 'text-yellow-600' :
                  'text-gray-900'
                }`}>
                  {item.quantity}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  {item.unit}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                  {getSourceIcon(item.entryMethod)}
                  {getSourceLabel(item.entryMethod)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-600">
                  {formatDate(item.expirationDate)}
                </span>
              </td>
              <td className="px-4 py-3">
                <InventoryStatusBadge status={item.status} size="small" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResidentInventoryTable;
