/**
 * Department Helpers
 * Functions for department-based room filtering and statistics
 */

import { DEPARTMENTS } from '../constants/departmentConstants';

const ROOMS_STORAGE_KEY = 'adorable-rooms';

/**
 * Get all rooms from storage
 */
function getRoomsFromStorage() {
  const stored = localStorage.getItem(ROOMS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Get all beds from storage
 */
function getBedsFromStorage() {
  const stored = localStorage.getItem('adorable-beds');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Filter rooms by department
 * @param {Array} rooms - Array of room objects
 * @param {string} department - 'regular', 'dementia', or 'all'
 * @returns {Array} Filtered rooms
 */
export function filterRoomsByDepartment(rooms, department) {
  if (!department || department === 'all') {
    return rooms;
  }
  return rooms.filter(room => room.department === department);
}

/**
 * Get occupancy statistics for a specific department
 * @param {string} department - 'regular', 'dementia', or 'all'
 * @returns {Object} Occupancy statistics
 */
export function getDepartmentOccupancy(department = 'all') {
  const rooms = getRoomsFromStorage();
  const beds = getBedsFromStorage();

  const filteredRooms = filterRoomsByDepartment(rooms, department);
  const roomIds = new Set(filteredRooms.map(r => r.id));
  const filteredBeds = beds.filter(b => roomIds.has(b.roomId));

  const totalBeds = filteredBeds.length;
  const occupiedBeds = filteredBeds.filter(b => b.status === 'occupied').length;
  const reservedBeds = filteredBeds.filter(b => b.status === 'reserved').length;
  const freeBeds = filteredBeds.filter(b => b.status === 'free').length;

  return {
    department,
    departmentLabel: department === 'all'
      ? 'Visas nodaļas'
      : DEPARTMENTS[department]?.label || department,
    totalRooms: filteredRooms.length,
    totalBeds,
    occupiedBeds,
    reservedBeds,
    freeBeds,
    occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
  };
}

/**
 * Get occupancy statistics for all departments
 * @returns {Object} Statistics by department
 */
export function getAllDepartmentsOccupancy() {
  return {
    all: getDepartmentOccupancy('all'),
    regular: getDepartmentOccupancy('regular'),
    dementia: getDepartmentOccupancy('dementia')
  };
}

/**
 * Check if a room belongs to the dementia department
 * @param {Object} room - Room object
 * @returns {boolean}
 */
export function isDementiaRoom(room) {
  return room?.department === 'dementia';
}

/**
 * Get rooms suitable for a resident with dementia
 * Only returns rooms from the dementia department
 * @param {Array} rooms - Array of room objects
 * @returns {Array} Dementia-suitable rooms
 */
export function getDementiaRooms(rooms) {
  return filterRoomsByDepartment(rooms, 'dementia');
}

/**
 * Get rooms suitable for a regular resident (non-dementia)
 * Returns all rooms (dementia rooms can also house regular residents if needed)
 * @param {Array} rooms - Array of room objects
 * @returns {Array} Regular rooms (or all rooms based on policy)
 */
export function getRegularRooms(rooms) {
  // Policy: Regular residents go to regular department only
  return filterRoomsByDepartment(rooms, 'regular');
}

/**
 * Get appropriate rooms based on whether resident has dementia
 * @param {Array} rooms - Array of room objects
 * @param {boolean} hasDementia - Whether the resident has dementia
 * @returns {Array} Appropriate rooms for the resident
 */
export function getRoomsForResident(rooms, hasDementia) {
  if (hasDementia) {
    return getDementiaRooms(rooms);
  }
  // Regular residents can be placed in regular department
  // (could also allow all rooms if policy changes)
  return getRegularRooms(rooms);
}
