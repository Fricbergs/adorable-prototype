/**
 * Mock Room Data
 * Sample rooms and beds for the care facility
 * Adoro Melodija - 3 floors, ~15 rooms
 */

// Sample rooms across 3 floors
export const MOCK_ROOMS = [
  // Floor 1 - Ground floor (rooms 101-105)
  {
    id: 'ROOM-101',
    number: '101',
    floor: 1,
    type: 'single',
    bedCount: 1,
    status: 'available',
    features: ['window', 'bathroom'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-102',
    number: '102',
    floor: 1,
    type: 'double',
    bedCount: 2,
    status: 'available',
    features: ['window', 'bathroom'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-103',
    number: '103',
    floor: 1,
    type: 'double',
    bedCount: 2,
    status: 'available',
    features: ['window'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-104',
    number: '104',
    floor: 1,
    type: 'triple',
    bedCount: 3,
    status: 'available',
    features: ['window', 'bathroom', 'tv'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-105',
    number: '105',
    floor: 1,
    type: 'single',
    bedCount: 1,
    status: 'maintenance',
    features: ['window', 'bathroom'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },

  // Floor 2 (rooms 201-205)
  {
    id: 'ROOM-201',
    number: '201',
    floor: 2,
    type: 'single',
    bedCount: 1,
    status: 'available',
    features: ['window', 'bathroom', 'balcony'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-202',
    number: '202',
    floor: 2,
    type: 'double',
    bedCount: 2,
    status: 'available',
    features: ['window', 'bathroom'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-203',
    number: '203',
    floor: 2,
    type: 'double',
    bedCount: 2,
    status: 'available',
    features: ['window', 'bathroom', 'tv'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-204',
    number: '204',
    floor: 2,
    type: 'triple',
    bedCount: 3,
    status: 'available',
    features: ['window', 'bathroom'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-205',
    number: '205',
    floor: 2,
    type: 'single',
    bedCount: 1,
    status: 'available',
    features: ['window', 'bathroom', 'balcony', 'tv'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },

  // Floor 3 (rooms 301-305)
  {
    id: 'ROOM-301',
    number: '301',
    floor: 3,
    type: 'single',
    bedCount: 1,
    status: 'available',
    features: ['window', 'bathroom', 'aircon'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-302',
    number: '302',
    floor: 3,
    type: 'double',
    bedCount: 2,
    status: 'available',
    features: ['window', 'bathroom', 'aircon'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-303',
    number: '303',
    floor: 3,
    type: 'double',
    bedCount: 2,
    status: 'available',
    features: ['window', 'bathroom', 'tv', 'aircon'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-304',
    number: '304',
    floor: 3,
    type: 'triple',
    bedCount: 3,
    status: 'available',
    features: ['window', 'bathroom'],
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ROOM-305',
    number: '305',
    floor: 3,
    type: 'single',
    bedCount: 1,
    status: 'available',
    features: ['window', 'bathroom', 'balcony', 'tv', 'aircon'],
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Generate beds for all rooms
export const generateBedsForRooms = (rooms) => {
  const beds = [];

  rooms.forEach(room => {
    for (let i = 1; i <= room.bedCount; i++) {
      beds.push({
        id: `BED-${room.number}-${i}`,
        roomId: room.id,
        bedNumber: i,
        status: 'free',
        residentId: null,
        reservedFor: null,
        assignedAt: null
      });
    }
  });

  return beds;
};

// Initial beds (all free)
export const MOCK_BEDS = generateBedsForRooms(MOCK_ROOMS);

// Summary statistics
export const getRoomSummary = () => {
  const totalRooms = MOCK_ROOMS.length;
  const totalBeds = MOCK_BEDS.length;

  const byType = {
    single: MOCK_ROOMS.filter(r => r.type === 'single').length,
    double: MOCK_ROOMS.filter(r => r.type === 'double').length,
    triple: MOCK_ROOMS.filter(r => r.type === 'triple').length
  };

  const byFloor = {
    1: MOCK_ROOMS.filter(r => r.floor === 1).length,
    2: MOCK_ROOMS.filter(r => r.floor === 2).length,
    3: MOCK_ROOMS.filter(r => r.floor === 3).length
  };

  return {
    totalRooms,
    totalBeds,
    byType,
    byFloor
  };
};
