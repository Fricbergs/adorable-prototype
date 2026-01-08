/**
 * Room Helpers
 * CRUD operations for room and bed management
 */

import { STORAGE_KEYS, ROOM_STATUS, BED_STATUS, ROOM_TYPES } from '../constants/roomConstants';
import { MOCK_ROOMS, MOCK_BEDS, generateBedsForRooms } from './mockRoomData';

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize room data in localStorage if not present
 */
export function initializeRoomData() {
  const existingRooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
  const existingBeds = localStorage.getItem(STORAGE_KEYS.BEDS);

  if (!existingRooms) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(MOCK_ROOMS));
  }

  if (!existingBeds) {
    const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
    const beds = generateBedsForRooms(rooms);
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));
  }
}

// ============================================
// ROOM CRUD OPERATIONS
// ============================================

/**
 * Get all rooms
 */
export function getAllRooms() {
  initializeRoomData();
  const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS) || '[]');
  return rooms;
}

/**
 * Get room by ID
 */
export function getRoomById(roomId) {
  const rooms = getAllRooms();
  return rooms.find(r => r.id === roomId) || null;
}

/**
 * Get room by number
 */
export function getRoomByNumber(roomNumber) {
  const rooms = getAllRooms();
  return rooms.find(r => r.number === roomNumber) || null;
}

/**
 * Create a new room
 */
export function createRoom(roomData) {
  const rooms = getAllRooms();
  const beds = getAllBeds();

  const newRoom = {
    id: `ROOM-${roomData.number}`,
    number: roomData.number,
    floor: roomData.floor,
    type: roomData.type,
    bedCount: ROOM_TYPES[roomData.type]?.bedCount || 1,
    status: roomData.status || 'available',
    features: roomData.features || [],
    createdAt: new Date().toISOString()
  };

  // Check for duplicate room number
  if (rooms.some(r => r.number === newRoom.number)) {
    throw new Error(`Istaba ${newRoom.number} jau eksistē`);
  }

  rooms.push(newRoom);
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));

  // Create beds for the new room
  const newBeds = generateBedsForRooms([newRoom]);
  const updatedBeds = [...beds, ...newBeds];
  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(updatedBeds));

  return newRoom;
}

/**
 * Update an existing room
 */
export function updateRoom(roomId, updates) {
  const rooms = getAllRooms();
  const index = rooms.findIndex(r => r.id === roomId);

  if (index === -1) {
    throw new Error('Istaba nav atrasta');
  }

  const oldRoom = rooms[index];
  const updatedRoom = {
    ...oldRoom,
    ...updates,
    id: oldRoom.id, // Prevent ID change
    updatedAt: new Date().toISOString()
  };

  // If bed count changed, update beds
  if (updates.type && updates.type !== oldRoom.type) {
    const newBedCount = ROOM_TYPES[updates.type]?.bedCount || oldRoom.bedCount;
    updatedRoom.bedCount = newBedCount;
    updateBedsForRoom(roomId, newBedCount);
  }

  rooms[index] = updatedRoom;
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));

  return updatedRoom;
}

/**
 * Delete a room (only if empty)
 */
export function deleteRoom(roomId) {
  const rooms = getAllRooms();
  const beds = getAllBeds();

  // Check if room has occupied beds
  const roomBeds = beds.filter(b => b.roomId === roomId);
  const hasOccupiedBeds = roomBeds.some(b => b.status === 'occupied');

  if (hasOccupiedBeds) {
    throw new Error('Nevar dzēst istabu ar aizņemtām gultām');
  }

  // Remove room
  const updatedRooms = rooms.filter(r => r.id !== roomId);
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(updatedRooms));

  // Remove beds
  const updatedBeds = beds.filter(b => b.roomId !== roomId);
  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(updatedBeds));

  return true;
}

// ============================================
// ROOM QUERIES
// ============================================

/**
 * Get rooms by floor
 */
export function getRoomsByFloor(floor) {
  const rooms = getAllRooms();
  return rooms.filter(r => r.floor === floor);
}

/**
 * Get rooms by type
 */
export function getRoomsByType(type) {
  const rooms = getAllRooms();
  return rooms.filter(r => r.type === type);
}

/**
 * Get available rooms (with at least one free bed)
 */
export function getAvailableRooms() {
  const rooms = getAllRooms();
  const beds = getAllBeds();

  return rooms.filter(room => {
    if (room.status === 'maintenance') return false;
    const roomBeds = beds.filter(b => b.roomId === room.id);
    return roomBeds.some(b => b.status === 'free');
  });
}

/**
 * Get rooms with availability info
 */
export function getRoomsWithOccupancy() {
  const rooms = getAllRooms();
  const beds = getAllBeds();

  return rooms.map(room => {
    const roomBeds = beds.filter(b => b.roomId === room.id);
    const freeBeds = roomBeds.filter(b => b.status === 'free').length;
    const occupiedBeds = roomBeds.filter(b => b.status === 'occupied').length;
    const reservedBeds = roomBeds.filter(b => b.status === 'reserved').length;

    return {
      ...room,
      beds: roomBeds,
      freeBeds,
      occupiedBeds,
      reservedBeds,
      isFullyOccupied: freeBeds === 0,
      occupancyPercent: Math.round((occupiedBeds / room.bedCount) * 100)
    };
  });
}

// ============================================
// BED CRUD OPERATIONS
// ============================================

/**
 * Get all beds
 */
export function getAllBeds() {
  initializeRoomData();
  const beds = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEDS) || '[]');
  return beds;
}

/**
 * Get bed by ID
 */
export function getBedById(bedId) {
  const beds = getAllBeds();
  return beds.find(b => b.id === bedId) || null;
}

/**
 * Get beds in a room
 */
export function getBedsInRoom(roomId) {
  const beds = getAllBeds();
  return beds.filter(b => b.roomId === roomId);
}

/**
 * Get available beds in a room
 */
export function getAvailableBeds(roomId) {
  const beds = getBedsInRoom(roomId);
  return beds.filter(b => b.status === 'free');
}

/**
 * Update beds when room type changes
 */
function updateBedsForRoom(roomId, newBedCount) {
  const beds = getAllBeds();
  const roomBeds = beds.filter(b => b.roomId === roomId);
  const otherBeds = beds.filter(b => b.roomId !== roomId);
  const room = getRoomById(roomId);

  // If decreasing bed count, only remove free beds
  if (newBedCount < roomBeds.length) {
    const occupiedBeds = roomBeds.filter(b => b.status !== 'free');
    if (occupiedBeds.length > newBedCount) {
      throw new Error('Nevar samazināt gultu skaitu - ir aizņemtas gultas');
    }
    // Keep occupied beds, remove excess free beds
    const keptBeds = roomBeds.slice(0, newBedCount);
    const updatedBeds = [...otherBeds, ...keptBeds];
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(updatedBeds));
  }
  // If increasing bed count, add new beds
  else if (newBedCount > roomBeds.length) {
    const newBeds = [];
    for (let i = roomBeds.length + 1; i <= newBedCount; i++) {
      newBeds.push({
        id: `BED-${room.number}-${i}`,
        roomId: roomId,
        bedNumber: i,
        status: 'free',
        residentId: null,
        reservedFor: null,
        assignedAt: null
      });
    }
    const updatedBeds = [...beds, ...newBeds];
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(updatedBeds));
  }
}

// ============================================
// BED BOOKING OPERATIONS
// ============================================

/**
 * Book a bed for a resident
 */
export function bookBed(roomId, bedNumber, residentId) {
  const beds = getAllBeds();
  const bedId = `BED-${getRoomById(roomId)?.number}-${bedNumber}`;
  const index = beds.findIndex(b => b.id === bedId);

  if (index === -1) {
    throw new Error('Gulta nav atrasta');
  }

  if (beds[index].status === 'occupied') {
    throw new Error('Gulta jau ir aizņemta');
  }

  beds[index] = {
    ...beds[index],
    status: 'occupied',
    residentId: residentId,
    reservedFor: null,
    assignedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));

  // Log the occupancy change
  logOccupancyChange(roomId, bedNumber, 'book', residentId);

  return beds[index];
}

/**
 * Reserve a bed for a lead (before they become resident)
 */
export function reserveBed(roomId, bedNumber, leadId) {
  const beds = getAllBeds();
  const room = getRoomById(roomId);
  const bedId = `BED-${room?.number}-${bedNumber}`;
  const index = beds.findIndex(b => b.id === bedId);

  if (index === -1) {
    throw new Error('Gulta nav atrasta');
  }

  if (beds[index].status !== 'free') {
    throw new Error('Gulta nav brīva');
  }

  beds[index] = {
    ...beds[index],
    status: 'reserved',
    reservedFor: leadId,
    assignedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));

  return beds[index];
}

/**
 * Release a bed (when resident leaves)
 */
export function releaseBed(roomId, bedNumber) {
  const beds = getAllBeds();
  const room = getRoomById(roomId);
  const bedId = `BED-${room?.number}-${bedNumber}`;
  const index = beds.findIndex(b => b.id === bedId);

  if (index === -1) {
    throw new Error('Gulta nav atrasta');
  }

  const previousResidentId = beds[index].residentId;

  beds[index] = {
    ...beds[index],
    status: 'free',
    residentId: null,
    reservedFor: null,
    assignedAt: null
  };

  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));

  // Log the occupancy change
  logOccupancyChange(roomId, bedNumber, 'release', previousResidentId);

  return beds[index];
}

/**
 * Convert reserved bed to occupied (when lead becomes resident)
 */
export function confirmReservation(roomId, bedNumber, residentId) {
  const beds = getAllBeds();
  const room = getRoomById(roomId);
  const bedId = `BED-${room?.number}-${bedNumber}`;
  const index = beds.findIndex(b => b.id === bedId);

  if (index === -1) {
    throw new Error('Gulta nav atrasta');
  }

  if (beds[index].status !== 'reserved') {
    throw new Error('Gulta nav rezervēta');
  }

  beds[index] = {
    ...beds[index],
    status: 'occupied',
    residentId: residentId,
    reservedFor: null,
    assignedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));

  // Log the occupancy change
  logOccupancyChange(roomId, bedNumber, 'confirm', residentId);

  return beds[index];
}

/**
 * Cancel a bed reservation
 */
export function cancelReservation(roomId, bedNumber) {
  const beds = getAllBeds();
  const room = getRoomById(roomId);
  const bedId = `BED-${room?.number}-${bedNumber}`;
  const index = beds.findIndex(b => b.id === bedId);

  if (index === -1) {
    throw new Error('Gulta nav atrasta');
  }

  if (beds[index].status !== 'reserved') {
    throw new Error('Gulta nav rezervēta');
  }

  beds[index] = {
    ...beds[index],
    status: 'free',
    reservedFor: null,
    assignedAt: null
  };

  localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));

  return beds[index];
}

// ============================================
// OCCUPANCY STATISTICS
// ============================================

/**
 * Get overall occupancy statistics
 */
export function getOccupancyStats() {
  const rooms = getAllRooms();
  const beds = getAllBeds();

  const totalRooms = rooms.length;
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const reservedBeds = beds.filter(b => b.status === 'reserved').length;
  const freeBeds = beds.filter(b => b.status === 'free').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;

  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // By floor
  const byFloor = [1, 2, 3].map(floor => {
    const floorRooms = rooms.filter(r => r.floor === floor);
    const floorBeds = beds.filter(b => {
      const room = rooms.find(r => r.id === b.roomId);
      return room?.floor === floor;
    });
    const floorOccupied = floorBeds.filter(b => b.status === 'occupied').length;

    return {
      floor,
      rooms: floorRooms.length,
      beds: floorBeds.length,
      occupied: floorOccupied,
      free: floorBeds.filter(b => b.status === 'free').length,
      occupancyRate: floorBeds.length > 0 ? Math.round((floorOccupied / floorBeds.length) * 100) : 0
    };
  });

  // By room type
  const byType = Object.keys(ROOM_TYPES).map(type => {
    const typeRooms = rooms.filter(r => r.type === type);
    const typeBeds = beds.filter(b => {
      const room = rooms.find(r => r.id === b.roomId);
      return room?.type === type;
    });
    const typeOccupied = typeBeds.filter(b => b.status === 'occupied').length;

    return {
      type,
      label: ROOM_TYPES[type].label,
      rooms: typeRooms.length,
      beds: typeBeds.length,
      occupied: typeOccupied,
      occupancyRate: typeBeds.length > 0 ? Math.round((typeOccupied / typeBeds.length) * 100) : 0
    };
  });

  return {
    totalRooms,
    totalBeds,
    occupiedBeds,
    reservedBeds,
    freeBeds,
    maintenanceRooms,
    occupancyRate,
    byFloor,
    byType
  };
}

// ============================================
// OCCUPANCY LOG
// ============================================

/**
 * Log an occupancy change for audit trail
 */
function logOccupancyChange(roomId, bedNumber, action, residentId) {
  const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.OCCUPANCY_LOG) || '[]');

  logs.push({
    id: `OCC-${Date.now()}`,
    roomId,
    bedNumber,
    action,
    residentId,
    timestamp: new Date().toISOString()
  });

  // Keep only last 1000 entries
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }

  localStorage.setItem(STORAGE_KEYS.OCCUPANCY_LOG, JSON.stringify(logs));
}

/**
 * Get occupancy log
 */
export function getOccupancyLog(limit = 50) {
  const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.OCCUPANCY_LOG) || '[]');
  return logs.slice(-limit).reverse();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Find bed by resident ID
 */
export function getBedByResidentId(residentId) {
  const beds = getAllBeds();
  return beds.find(b => b.residentId === residentId) || null;
}

/**
 * Get room info for a resident
 */
export function getRoomForResident(residentId) {
  const bed = getBedByResidentId(residentId);
  if (!bed) return null;

  const room = getRoomById(bed.roomId);
  return room ? { ...room, bedNumber: bed.bedNumber } : null;
}

/**
 * Clear all room data (for testing)
 */
export function clearRoomData() {
  localStorage.removeItem(STORAGE_KEYS.ROOMS);
  localStorage.removeItem(STORAGE_KEYS.BEDS);
  localStorage.removeItem(STORAGE_KEYS.OCCUPANCY_LOG);
}
