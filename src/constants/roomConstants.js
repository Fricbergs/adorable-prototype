/**
 * Room Management Constants
 * Defines storage keys, status types, and configuration for room/bed management
 */

// localStorage keys for room data
export const STORAGE_KEYS = {
  ROOMS: 'adorable-rooms',
  BEDS: 'adorable-beds',
  OCCUPANCY_LOG: 'adorable-occupancy-log'
};

// Room status types
export const ROOM_STATUS = {
  available: {
    value: 'available',
    label: 'Pieejama',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  occupied: {
    value: 'occupied',
    label: 'Aizņemta',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  maintenance: {
    value: 'maintenance',
    label: 'Remonts',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  },
  reserved: {
    value: 'reserved',
    label: 'Rezervēta',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  }
};

// Bed status types
export const BED_STATUS = {
  free: {
    value: 'free',
    label: 'Brīva',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  occupied: {
    value: 'occupied',
    label: 'Aizņemta',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  reserved: {
    value: 'reserved',
    label: 'Rezervēta',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  }
};

// Room types with bed counts (triple removed per 2026-01-12 update)
export const ROOM_TYPES = {
  single: {
    value: 'single',
    label: 'Vienvietīga',
    bedCount: 1
  },
  double: {
    value: 'double',
    label: 'Divvietīga',
    bedCount: 2
  }
};

// Room type filter options for UI dropdowns
export const ROOM_TYPE_OPTIONS = [
  { value: 'all', label: 'Visi tipi' },
  { value: 'single', label: 'Vienvietīga' },
  { value: 'double', label: 'Divvietīga' }
];

// Available floors
export const FLOORS = [
  { value: 1, label: '1. stāvs' },
  { value: 2, label: '2. stāvs' },
  { value: 3, label: '3. stāvs' }
];

// Room features
export const ROOM_FEATURES = {
  window: { value: 'window', label: 'Logs', icon: 'Sun' },
  bathroom: { value: 'bathroom', label: 'Vannasistaba', icon: 'Bath' },
  balcony: { value: 'balcony', label: 'Balkons', icon: 'Home' },
  tv: { value: 'tv', label: 'TV', icon: 'Tv' },
  aircon: { value: 'aircon', label: 'Kondicionieris', icon: 'Wind' }
};

// Default room configuration for new facility
export const DEFAULT_ROOM_CONFIG = {
  floors: 3,
  roomsPerFloor: 5,
  defaultType: 'double'
};

// Occupancy calculation thresholds
export const OCCUPANCY_THRESHOLDS = {
  low: 50,    // < 50% = low occupancy (green)
  medium: 80, // 50-80% = medium occupancy (yellow)
  high: 100   // > 80% = high occupancy (red)
};
