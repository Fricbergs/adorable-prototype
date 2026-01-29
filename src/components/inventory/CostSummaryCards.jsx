import React from 'react';
import { DollarSign, ShoppingCart, Gift, Package } from 'lucide-react';

/**
 * Summary stat cards for cost reports header.
 * Shows aggregate cost numbers across all residents.
 */
const CostSummaryCards = ({ summaries }) => {
  const totalCost = summaries.reduce((s, r) => s + r.totalCost, 0);
  const facilityTotal = summaries.reduce((s, r) => s + r.facilityPurchasedTotal, 0);
  const zeroCostTotal = summaries.reduce((s, r) => s + r.zeroCostTotal, 0);
  const totalItems = summaries.reduce((s, r) => s + r.itemCount, 0);

  const cards = [
    {
      label: 'Kopējās izmaksas',
      value: `EUR ${totalCost.toFixed(2)}`,
      icon: DollarSign,
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Iestādes iepirktie',
      value: `EUR ${facilityTotal.toFixed(2)}`,
      icon: ShoppingCart,
      borderColor: 'border-green-200',
      iconColor: 'text-green-500'
    },
    {
      label: 'Bezmaksas (radinieki)',
      value: `EUR ${zeroCostTotal.toFixed(2)}`,
      icon: Gift,
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-400'
    },
    {
      label: 'Kopā vienības',
      value: totalItems,
      icon: Package,
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className={`bg-white rounded-lg shadow-sm border ${card.borderColor} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CostSummaryCards;
