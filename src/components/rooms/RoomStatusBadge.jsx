import React from 'react';
import { ROOM_STATUS, BED_STATUS } from '../../constants/roomConstants';

/**
 * RoomStatusBadge - Displays room or bed status as a colored badge
 */
const RoomStatusBadge = ({ status, type = 'room', size = 'md' }) => {
  const statusConfig = type === 'bed' ? BED_STATUS : ROOM_STATUS;
  const config = statusConfig[status] || statusConfig.available;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${config.bgColor} ${config.textColor}
        ${sizeClasses[size]}
      `}
    >
      {config.label}
    </span>
  );
};

export default RoomStatusBadge;
