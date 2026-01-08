/**
 * Resident Helpers
 * CRUD operations for resident management
 * Creates residents from leads after agreement signing
 */

import { STORAGE_KEYS, RESIDENT_STATUS } from '../constants/residentConstants';
import { bookBed, confirmReservation, releaseBed, getRoomById } from './roomHelpers';

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize resident data in localStorage if not present
 */
export function initializeResidentData() {
  const existingResidents = localStorage.getItem(STORAGE_KEYS.RESIDENTS);
  if (!existingResidents) {
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify([]));
  }
}

// ============================================
// RESIDENT CRUD OPERATIONS
// ============================================

/**
 * Get all residents
 */
export function getAllResidents() {
  initializeResidentData();
  const residents = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESIDENTS) || '[]');
  return residents.sort((a, b) => a.lastName.localeCompare(b.lastName));
}

/**
 * Get active residents only
 */
export function getActiveResidents() {
  const residents = getAllResidents();
  return residents.filter(r => r.status === 'active');
}

/**
 * Get resident by ID
 */
export function getResidentById(residentId) {
  const residents = getAllResidents();
  return residents.find(r => r.id === residentId) || null;
}

/**
 * Get resident by lead ID
 */
export function getResidentByLeadId(leadId) {
  const residents = getAllResidents();
  return residents.find(r => r.leadId === leadId) || null;
}

/**
 * Generate unique resident ID
 */
function generateResidentId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RES-${timestamp}-${random}`;
}

/**
 * Create resident from lead data
 * Called when agreement is signed and bed is booked
 */
export function createResidentFromLead(lead, roomId, bedNumber) {
  if (!lead) {
    throw new Error('Nav norādīti līda dati');
  }

  if (!roomId || !bedNumber) {
    throw new Error('Nav norādīta istaba vai gulta');
  }

  // Check if resident already exists for this lead
  const existingResident = getResidentByLeadId(lead.id);
  if (existingResident) {
    throw new Error('Rezidents jau ir izveidots no šī līda');
  }

  const room = getRoomById(roomId);
  if (!room) {
    throw new Error('Istaba nav atrasta');
  }

  const residents = getAllResidents();

  const newResident = {
    id: generateResidentId(),
    // From Lead basic info
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    phone: lead.phone || '',
    email: lead.email || '',
    // From Lead survey (if completed)
    birthDate: lead.birthDate || null,
    personalCode: lead.personalCode || '',
    gender: lead.gender || null,
    // Address
    street: lead.street || '',
    city: lead.city || '',
    postalCode: lead.postalCode || '',
    // From consultation/agreement
    leadId: lead.id,
    agreementNumber: lead.agreementNumber || null,
    careLevel: lead.consultation?.careLevel || 'GIR3',
    // Room assignment
    roomId: roomId,
    roomNumber: room.number,
    bedNumber: bedNumber,
    // Care data
    allergies: lead.allergies || [],
    photo: null,
    // Contact person (from lead client data)
    contactPerson: lead.clientFirstName ? {
      firstName: lead.clientFirstName || '',
      lastName: lead.clientLastName || '',
      relationship: lead.relationship || '',
      phone: lead.clientPhone || '',
      email: lead.clientEmail || ''
    } : null,
    // Status
    status: 'active',
    admissionDate: new Date().toISOString(),
    dischargeDate: null,
    dischargeReason: null,
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Book the bed
  bookBed(roomId, bedNumber, newResident.id);

  // Save resident
  residents.push(newResident);
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));

  return newResident;
}

/**
 * Create resident manually (without lead)
 */
export function createResident(residentData) {
  const residents = getAllResidents();

  const newResident = {
    id: generateResidentId(),
    firstName: residentData.firstName || '',
    lastName: residentData.lastName || '',
    phone: residentData.phone || '',
    email: residentData.email || '',
    birthDate: residentData.birthDate || null,
    personalCode: residentData.personalCode || '',
    gender: residentData.gender || null,
    street: residentData.street || '',
    city: residentData.city || '',
    postalCode: residentData.postalCode || '',
    leadId: null,
    agreementNumber: residentData.agreementNumber || null,
    careLevel: residentData.careLevel || 'GIR3',
    roomId: residentData.roomId || null,
    roomNumber: residentData.roomNumber || null,
    bedNumber: residentData.bedNumber || null,
    allergies: residentData.allergies || [],
    photo: null,
    contactPerson: residentData.contactPerson || null,
    status: 'active',
    admissionDate: residentData.admissionDate || new Date().toISOString(),
    dischargeDate: null,
    dischargeReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Book the bed if room is provided
  if (newResident.roomId && newResident.bedNumber) {
    bookBed(newResident.roomId, newResident.bedNumber, newResident.id);
  }

  residents.push(newResident);
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));

  return newResident;
}

/**
 * Update resident information
 */
export function updateResident(residentId, updates) {
  const residents = getAllResidents();
  const index = residents.findIndex(r => r.id === residentId);

  if (index === -1) {
    throw new Error('Rezidents nav atrasts');
  }

  const oldResident = residents[index];
  const updatedResident = {
    ...oldResident,
    ...updates,
    id: oldResident.id, // Prevent ID change
    updatedAt: new Date().toISOString()
  };

  // Handle room change
  if (updates.roomId && updates.bedNumber &&
      (updates.roomId !== oldResident.roomId || updates.bedNumber !== oldResident.bedNumber)) {
    // Release old bed
    if (oldResident.roomId && oldResident.bedNumber) {
      releaseBed(oldResident.roomId, oldResident.bedNumber);
    }
    // Book new bed
    bookBed(updates.roomId, updates.bedNumber, residentId);

    // Update room number
    const newRoom = getRoomById(updates.roomId);
    updatedResident.roomNumber = newRoom?.number || null;
  }

  residents[index] = updatedResident;
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));

  return updatedResident;
}

/**
 * Discharge a resident
 */
export function dischargeResident(residentId, reason = '') {
  const residents = getAllResidents();
  const index = residents.findIndex(r => r.id === residentId);

  if (index === -1) {
    throw new Error('Rezidents nav atrasts');
  }

  const resident = residents[index];

  // Release the bed
  if (resident.roomId && resident.bedNumber) {
    releaseBed(resident.roomId, resident.bedNumber);
  }

  // Update resident status
  residents[index] = {
    ...resident,
    status: 'discharged',
    dischargeDate: new Date().toISOString(),
    dischargeReason: reason,
    roomId: null,
    roomNumber: null,
    bedNumber: null,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));

  return residents[index];
}

/**
 * Mark resident as deceased
 */
export function markResidentDeceased(residentId) {
  const residents = getAllResidents();
  const index = residents.findIndex(r => r.id === residentId);

  if (index === -1) {
    throw new Error('Rezidents nav atrasts');
  }

  const resident = residents[index];

  // Release the bed
  if (resident.roomId && resident.bedNumber) {
    releaseBed(resident.roomId, resident.bedNumber);
  }

  // Update resident status
  residents[index] = {
    ...resident,
    status: 'deceased',
    dischargeDate: new Date().toISOString(),
    roomId: null,
    roomNumber: null,
    bedNumber: null,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));

  return residents[index];
}

/**
 * Delete resident (only for testing/admin)
 */
export function deleteResident(residentId) {
  const residents = getAllResidents();
  const resident = residents.find(r => r.id === residentId);

  if (resident && resident.roomId && resident.bedNumber) {
    // Release the bed
    try {
      releaseBed(resident.roomId, resident.bedNumber);
    } catch (e) {
      // Ignore errors if bed doesn't exist
    }
  }

  const updatedResidents = residents.filter(r => r.id !== residentId);
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(updatedResidents));

  return true;
}

// ============================================
// RESIDENT QUERIES
// ============================================

/**
 * Search residents by name or room
 */
export function searchResidents(query) {
  const residents = getAllResidents();
  const lowerQuery = query.toLowerCase();

  return residents.filter(r =>
    r.firstName?.toLowerCase().includes(lowerQuery) ||
    r.lastName?.toLowerCase().includes(lowerQuery) ||
    r.roomNumber?.includes(query) ||
    r.personalCode?.includes(query)
  );
}

/**
 * Get residents by room
 */
export function getResidentsByRoom(roomId) {
  const residents = getAllResidents();
  return residents.filter(r => r.roomId === roomId && r.status === 'active');
}

/**
 * Get residents by care level
 */
export function getResidentsByCareLevel(careLevel) {
  const residents = getActiveResidents();
  return residents.filter(r => r.careLevel === careLevel);
}

/**
 * Get resident statistics
 */
export function getResidentStats() {
  const residents = getAllResidents();
  const active = residents.filter(r => r.status === 'active');

  const byCareLevel = {};
  active.forEach(r => {
    const level = r.careLevel || 'unknown';
    byCareLevel[level] = (byCareLevel[level] || 0) + 1;
  });

  return {
    total: residents.length,
    active: active.length,
    discharged: residents.filter(r => r.status === 'discharged').length,
    deceased: residents.filter(r => r.status === 'deceased').length,
    byCareLevel
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get full name
 */
export function getResidentFullName(resident) {
  if (!resident) return '';
  return `${resident.firstName || ''} ${resident.lastName || ''}`.trim();
}

/**
 * Clear all resident data (for testing)
 */
export function clearResidentData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
