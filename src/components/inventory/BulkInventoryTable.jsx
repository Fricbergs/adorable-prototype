import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import InventoryStatusBadge from './InventoryStatusBadge';
import SupplierBadge from './SupplierBadge';

/**
 * Table component for displaying bulk inventory (Warehouse A)
 */
const BulkInventoryTable = ({ items, onTransfer, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('lv-LV', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getExpirationWarning = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const expDate = new Date(dateString);
    const daysUntil = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 0) return 'text-red-600 font-bold';
    if (daysUntil <= 7) return 'text-red-500';
    if (daysUntil <= 30) return 'text-yellow-600';
    return '';
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nav medikamentu noliktavā</p>
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Partija
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Piegādātājs
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daudzums
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Derīgums
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statuss
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Darbības
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {item.medicationName}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">
                    {item.activeIngredient}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-600 font-mono">
                  {item.batchNumber || '-'}
                </span>
              </td>
              <td className="px-4 py-3">
                {item.supplierId ? (
                  <SupplierBadge supplierId={item.supplierId} size="small" />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
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
                <span className={`text-sm ${getExpirationWarning(item.expirationDate)}`}>
                  {formatDate(item.expirationDate)}
                </span>
              </td>
              <td className="px-4 py-3">
                <InventoryStatusBadge status={item.status} size="small" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {onView && (
                    <button
                      onClick={() => onView(item)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Skatīt detaļas"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onTransfer && item.quantity > 0 && (
                    <button
                      onClick={() => onTransfer(item)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                      title="Pārvietot uz rezidenta noliktavu"
                    >
                      <ArrowRight className="w-3 h-3" />
                      Pārvietot
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BulkInventoryTable;
