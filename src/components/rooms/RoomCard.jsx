import React from 'react';
import { Home, User, Sun, Droplets, Tv, Wind, Trees, Settings } from 'lucide-react';
import RoomStatusBadge from './RoomStatusBadge';
import { ROOM_TYPES, ROOM_FEATURES, BED_STATUS } from '../../constants/roomConstants';

/**
 * RoomCard - Displays a room with beds visualization
 */
const RoomCard = ({ room, onSelect, onEdit, selectable = false, selectedBed = null }) => {
  const { number, floor, type, status, features = [], beds = [], freeBeds = 0, occupiedBeds = 0 } = room;

  const typeConfig = ROOM_TYPES[type] || ROOM_TYPES.single;

  // Feature icon mapping
  const featureIcons = {
    window: Sun,
    bathroom: Droplets,
    tv: Tv,
    aircon: Wind,
    balcony: Trees
  };

  // Get status color for bed dots
  const getBedColor = (bed) => {
    switch (bed.status) {
      case 'occupied':
        return 'bg-red-500';
      case 'reserved':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const isRoomAvailable = status !== 'maintenance' && freeBeds > 0;

  return (
    <div
      className={`
        bg-white border rounded-lg overflow-hidden transition-all
        ${selectable && isRoomAvailable ? 'cursor-pointer hover:border-orange-400 hover:shadow-md' : ''}
        ${status === 'maintenance' ? 'opacity-60' : ''}
        ${selectable && !isRoomAvailable ? 'opacity-50' : ''}
      `}
      onClick={() => selectable && isRoomAvailable && onSelect?.(room)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Istaba {number}</h3>
            <p className="text-xs text-gray-500">{floor}. stāvs • {typeConfig.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RoomStatusBadge status={status} />
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(room);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Beds visualization */}
      <div className="px-4 py-3">
        <p className="text-xs text-gray-500 mb-2">Gultas</p>
        <div className="flex items-center gap-2">
          {beds.map((bed) => (
            <div
              key={bed.id}
              className={`
                relative flex items-center justify-center w-12 h-10 rounded border-2
                ${bed.status === 'free' ? 'border-green-300 bg-green-50' : ''}
                ${bed.status === 'occupied' ? 'border-red-300 bg-red-50' : ''}
                ${bed.status === 'reserved' ? 'border-yellow-300 bg-yellow-50' : ''}
                ${selectable && bed.status === 'free' ? 'cursor-pointer hover:border-orange-400' : ''}
                ${selectedBed === bed.bedNumber ? 'ring-2 ring-orange-500' : ''}
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (selectable && bed.status === 'free') {
                  onSelect?.(room, bed.bedNumber);
                }
              }}
              title={`Gulta ${bed.bedNumber} - ${BED_STATUS[bed.status]?.label}`}
            >
              <User className={`w-4 h-4 ${bed.status === 'free' ? 'text-green-500' : bed.status === 'occupied' ? 'text-red-500' : 'text-yellow-600'}`} />
              <span className="absolute -top-1 -right-1 text-[10px] font-medium bg-white border rounded px-1">
                {bed.bedNumber}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Brīvas: {freeBeds}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Aizņemtas: {occupiedBeds}
          </span>
          {beds.some(b => b.status === 'reserved') && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Rezervētas: {beds.filter(b => b.status === 'reserved').length}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {features.map((feature) => {
              const IconComponent = featureIcons[feature] || Sun;
              const featureConfig = ROOM_FEATURES[feature];
              return (
                <span
                  key={feature}
                  className="flex items-center gap-1 text-xs text-gray-500"
                  title={featureConfig?.label}
                >
                  <IconComponent className="w-3 h-3" />
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
