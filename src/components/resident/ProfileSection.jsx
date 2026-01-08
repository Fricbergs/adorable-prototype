import React, { useState } from 'react';
import { ChevronDown, Plus, History } from 'lucide-react';

/**
 * ProfileSection - Accordion wrapper for profile sections
 */
const ProfileSection = ({
  title,
  icon: Icon,
  children,
  count,
  lastUpdate,
  onAdd,
  onHistory,
  defaultOpen = false,
  addLabel = 'Pievienot',
  badge,
  badgeColor = 'gray'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const badgeColors = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header - clickable to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
          )}
          <div className="text-left">
            <h3 className="font-medium text-gray-900">{title}</h3>
            {lastUpdate && (
              <p className="text-xs text-gray-500">
                Pēdējais ieraksts: {lastUpdate}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {count}
            </span>
          )}
          {badge && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-gray-200">
          {/* Action buttons */}
          {(onAdd || onHistory) && (
            <div className="flex items-center justify-end gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
              {onHistory && (
                <button
                  onClick={onHistory}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  Vēsture
                </button>
              )}
              {onAdd && (
                <button
                  onClick={onAdd}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {addLabel}
                </button>
              )}
            </div>
          )}

          {/* Section content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
