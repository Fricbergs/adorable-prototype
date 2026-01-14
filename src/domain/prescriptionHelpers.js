// Prescription CRUD helpers for Ordinācijas Plāns
import { mockResidents, mockPrescriptions, mockAdministrationLogs } from './mockPrescriptionData';

// Import inventory scheduler for auto-dispense integration
// Note: Lazy import to avoid circular dependency
let processAdministrationEvent = null;
function getInventoryScheduler() {
  if (!processAdministrationEvent) {
    try {
      const scheduler = require('./inventoryScheduler');
      processAdministrationEvent = scheduler.processAdministrationEvent;
    } catch (e) {
      // Inventory module not available yet
      console.log('[PrescriptionHelpers] Inventory scheduler not loaded');
    }
  }
  return processAdministrationEvent;
}

// Storage keys
const RESIDENTS_KEY = 'adorable-prescription-residents';
const PRESCRIPTIONS_KEY = 'adorable-prescriptions';
const LOGS_KEY = 'adorable-administration-logs';

// Initialize data from localStorage or use mock data
export function initializePrescriptionData() {
  // Check if data exists in localStorage
  if (!localStorage.getItem(RESIDENTS_KEY)) {
    localStorage.setItem(RESIDENTS_KEY, JSON.stringify(mockResidents));
  }
  if (!localStorage.getItem(PRESCRIPTIONS_KEY)) {
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(mockPrescriptions));
  }
  if (!localStorage.getItem(LOGS_KEY)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(mockAdministrationLogs));
  }
}

// Generate unique ID
function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

// ============ RESIDENTS ============

export function getAllResidents() {
  initializePrescriptionData();
  const data = localStorage.getItem(RESIDENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getResidentById(residentId) {
  const residents = getAllResidents();
  return residents.find(r => r.id === residentId) || null;
}

export function updateResidentVitals(residentId, vitals) {
  const residents = getAllResidents();
  const index = residents.findIndex(r => r.id === residentId);
  if (index !== -1) {
    residents[index].vitals = {
      ...vitals,
      measuredAt: new Date().toISOString()
    };
    localStorage.setItem(RESIDENTS_KEY, JSON.stringify(residents));
    return residents[index];
  }
  return null;
}

// ============ PRESCRIPTIONS ============

export function getAllPrescriptions() {
  initializePrescriptionData();
  const data = localStorage.getItem(PRESCRIPTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getPrescriptionsForResident(residentId) {
  const prescriptions = getAllPrescriptions();
  return prescriptions.filter(p => p.residentId === residentId);
}

export function getActivePrescriptionsForResident(residentId) {
  const prescriptions = getPrescriptionsForResident(residentId);
  return prescriptions.filter(p => p.status === 'active');
}

export function getPrescriptionById(prescriptionId) {
  const prescriptions = getAllPrescriptions();
  return prescriptions.find(p => p.id === prescriptionId) || null;
}

export function createPrescription(data) {
  const prescriptions = getAllPrescriptions();

  const newPrescription = {
    id: generateId('P'),
    residentId: data.residentId,
    medicationName: data.medicationName || '',
    activeIngredient: data.activeIngredient || '',
    form: data.form || 'tabletes',
    prescribedDate: data.prescribedDate || new Date().toISOString().split('T')[0],
    prescribedBy: data.prescribedBy || '',
    validUntil: data.validUntil || null,
    schedule: data.schedule || {
      morning: { time: null, dose: null, unit: null, enabled: false },
      noon: { time: null, dose: null, unit: null, enabled: false },
      evening: { time: null, dose: null, unit: null, enabled: false },
      night: { time: null, dose: null, unit: null, enabled: false }
    },
    instructions: data.instructions || null,
    conditional: data.conditional || false,
    conditionText: data.conditionText || null,
    frequency: data.frequency || 'daily',
    specificDays: data.specificDays || [],
    status: 'active',
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };

  prescriptions.push(newPrescription);
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));

  return newPrescription;
}

export function updatePrescription(prescriptionId, data) {
  const prescriptions = getAllPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescriptionId);

  if (index !== -1) {
    prescriptions[index] = {
      ...prescriptions[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
    return prescriptions[index];
  }

  return null;
}

export function deletePrescription(prescriptionId) {
  const prescriptions = getAllPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescriptionId);

  if (index !== -1) {
    // Soft delete - change status to discontinued
    prescriptions[index].status = 'discontinued';
    prescriptions[index].discontinuedAt = new Date().toISOString();
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
    return true;
  }

  return false;
}

export function hardDeletePrescription(prescriptionId) {
  const prescriptions = getAllPrescriptions();
  const filtered = prescriptions.filter(p => p.id !== prescriptionId);
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(filtered));
  return filtered.length < prescriptions.length;
}

/**
 * Pause a prescription temporarily until a specific date
 * @param {string} prescriptionId - ID of prescription to pause
 * @param {string} untilDate - Date to resume (YYYY-MM-DD format)
 * @param {string} reason - Optional reason for pause
 * @returns {Object|null} Updated prescription or null
 */
export function pausePrescription(prescriptionId, untilDate, reason = '') {
  const prescriptions = getAllPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescriptionId);

  if (index !== -1) {
    prescriptions[index] = {
      ...prescriptions[index],
      status: 'paused',
      pausedAt: new Date().toISOString(),
      pausedUntil: untilDate,
      pauseReason: reason,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
    return prescriptions[index];
  }
  return null;
}

/**
 * Resume a paused prescription
 * @param {string} prescriptionId - ID of prescription to resume
 * @returns {Object|null} Updated prescription or null
 */
export function resumePrescription(prescriptionId) {
  const prescriptions = getAllPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescriptionId);

  if (index !== -1 && prescriptions[index].status === 'paused') {
    prescriptions[index] = {
      ...prescriptions[index],
      status: 'active',
      resumedAt: new Date().toISOString(),
      pausedAt: null,
      pausedUntil: null,
      pauseReason: null,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
    return prescriptions[index];
  }
  return null;
}

/**
 * Permanently discontinue a prescription
 * @param {string} prescriptionId - ID of prescription to discontinue
 * @param {string} reason - Reason for discontinuation
 * @returns {Object|null} Updated prescription or null
 */
export function discontinuePrescription(prescriptionId, reason = '') {
  const prescriptions = getAllPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescriptionId);

  if (index !== -1) {
    prescriptions[index] = {
      ...prescriptions[index],
      status: 'discontinued',
      discontinuedAt: new Date().toISOString(),
      discontinuedReason: reason,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
    return prescriptions[index];
  }
  return null;
}

// ============ ADMINISTRATION LOGS ============

export function getAllAdministrationLogs() {
  initializePrescriptionData();
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getAdministrationLogsForResident(residentId, date = null) {
  const logs = getAllAdministrationLogs();
  const targetDate = date || new Date().toISOString().split('T')[0];
  return logs.filter(log => log.residentId === residentId && log.date === targetDate);
}

export function getAdministrationLogForPrescription(prescriptionId, date = null, timeSlot = null) {
  const logs = getAllAdministrationLogs();
  const targetDate = date || new Date().toISOString().split('T')[0];
  return logs.find(log =>
    log.prescriptionId === prescriptionId &&
    log.date === targetDate &&
    (timeSlot ? log.timeSlot === timeSlot : true)
  ) || null;
}

export function logAdministration(data) {
  const logs = getAllAdministrationLogs();
  const today = new Date().toISOString().split('T')[0];

  // Check if log already exists for this prescription/date/timeSlot
  const existingIndex = logs.findIndex(log =>
    log.prescriptionId === data.prescriptionId &&
    log.date === (data.date || today) &&
    log.timeSlot === data.timeSlot
  );

  const logEntry = {
    id: existingIndex !== -1 ? logs[existingIndex].id : generateId('MA'),
    prescriptionId: data.prescriptionId,
    residentId: data.residentId,
    date: data.date || today,
    timeSlot: data.timeSlot,
    status: data.status, // 'given', 'refused', 'skipped'
    refusalReason: data.refusalReason || null,
    administeredBy: data.administeredBy || 'Sistēma',
    administeredAt: new Date().toISOString(),
    notes: data.notes || ''
  };

  if (existingIndex !== -1) {
    logs[existingIndex] = logEntry;
  } else {
    logs.push(logEntry);
  }

  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return logEntry;
}

export function markMedicationGiven(prescriptionId, residentId, timeSlot, administeredBy) {
  const log = logAdministration({
    prescriptionId,
    residentId,
    timeSlot,
    status: 'given',
    administeredBy
  });

  // Trigger inventory deduction
  const scheduler = getInventoryScheduler();
  if (scheduler) {
    try {
      scheduler(log);
    } catch (e) {
      console.warn('[PrescriptionHelpers] Inventory update failed:', e);
    }
  }

  return log;
}

export function markMedicationRefused(prescriptionId, residentId, timeSlot, refusalReason, administeredBy, notes = '') {
  const log = logAdministration({
    prescriptionId,
    residentId,
    timeSlot,
    status: 'refused',
    refusalReason,
    administeredBy,
    notes
  });

  // Trigger inventory restoration
  const scheduler = getInventoryScheduler();
  if (scheduler) {
    try {
      scheduler(log);
    } catch (e) {
      console.warn('[PrescriptionHelpers] Inventory restoration failed:', e);
    }
  }

  return log;
}

export function markMedicationSkipped(prescriptionId, residentId, timeSlot, administeredBy, notes = '') {
  return logAdministration({
    prescriptionId,
    residentId,
    timeSlot,
    status: 'skipped',
    administeredBy,
    notes
  });
}

/**
 * Log a dose action (nurse adjustment)
 * @param {string} prescriptionId - Prescription ID
 * @param {string} residentId - Resident ID
 * @param {string} timeSlot - Time slot (morning/noon/evening/night)
 * @param {string} actionType - 'given' | 'increased' | 'decreased' | 'skipped'
 * @param {string} originalDose - Originally prescribed dose (e.g., "1 tab")
 * @param {string} actualDose - Actual dose given (null if skipped)
 * @param {string} reason - Reason for adjustment
 * @param {string} administeredBy - Who administered/adjusted
 * @param {string} notes - Additional notes
 * @returns {Object} Log entry
 */
export function logDoseAction(
  prescriptionId,
  residentId,
  timeSlot,
  actionType,
  originalDose,
  actualDose,
  reason,
  administeredBy,
  notes = ''
) {
  const logs = getAllAdministrationLogs();
  const today = new Date().toISOString().split('T')[0];

  // Check if log already exists for this prescription/date/timeSlot
  const existingIndex = logs.findIndex(log =>
    log.prescriptionId === prescriptionId &&
    log.date === today &&
    log.timeSlot === timeSlot
  );

  const logEntry = {
    id: existingIndex !== -1 ? logs[existingIndex].id : generateId('MA'),
    prescriptionId,
    residentId,
    date: today,
    timeSlot,
    status: actionType, // 'given', 'increased', 'decreased', 'skipped'
    originalDose,
    actualDose,
    adjustmentReason: reason,
    administeredBy: administeredBy || 'Sistēma',
    administeredAt: new Date().toISOString(),
    notes
  };

  if (existingIndex !== -1) {
    logs[existingIndex] = logEntry;
  } else {
    logs.push(logEntry);
  }

  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));

  // Trigger inventory update
  const scheduler = getInventoryScheduler();
  if (scheduler) {
    try {
      scheduler(logEntry);
    } catch (e) {
      console.warn('[PrescriptionHelpers] Inventory update failed:', e);
    }
  }

  return logEntry;
}

// ============ SUMMARY HELPERS ============

export function getTodaysAdministrationSummary(residentId) {
  const today = new Date().toISOString().split('T')[0];
  const prescriptions = getActivePrescriptionsForResident(residentId);
  const logs = getAdministrationLogsForResident(residentId, today);

  const summary = {
    morning: { total: 0, given: 0, refused: 0, pending: 0 },
    noon: { total: 0, given: 0, refused: 0, pending: 0 },
    evening: { total: 0, given: 0, refused: 0, pending: 0 },
    night: { total: 0, given: 0, refused: 0, pending: 0 }
  };

  // Count prescriptions for each time slot
  prescriptions.forEach(p => {
    Object.keys(summary).forEach(slot => {
      if (p.schedule[slot]?.enabled) {
        summary[slot].total++;

        const log = logs.find(l => l.prescriptionId === p.id && l.timeSlot === slot);
        if (log) {
          if (log.status === 'given') summary[slot].given++;
          else if (log.status === 'refused') summary[slot].refused++;
        } else {
          summary[slot].pending++;
        }
      }
    });
  });

  return summary;
}

export function getPrescriptionAdministrationStatus(prescriptionId, date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const prescription = getPrescriptionById(prescriptionId);
  const logs = getAllAdministrationLogs().filter(
    log => log.prescriptionId === prescriptionId && log.date === targetDate
  );

  if (!prescription) return null;

  const status = {};
  Object.keys(prescription.schedule).forEach(slot => {
    if (prescription.schedule[slot]?.enabled) {
      const log = logs.find(l => l.timeSlot === slot);
      status[slot] = log ? log.status : 'pending';
    }
  });

  return status;
}

// ============ WEEKLY VIEW HELPERS ============

// Get week dates (Mon-Sun) for a given reference date
export function getWeekDates(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const day = date.getDay();
  // Adjust to Monday (day 0 = Sunday, so we need to handle that)
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  return weekDates;
}

// Latvian day abbreviations
export const DAY_ABBREVIATIONS = ['P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'];

// Get administration data for entire week
export function getWeekAdministrationData(residentId, weekDates) {
  const prescriptions = getActivePrescriptionsForResident(residentId);
  const allLogs = getAllAdministrationLogs().filter(l => l.residentId === residentId);

  const weekData = {};

  weekDates.forEach(date => {
    weekData[date] = {};
    const logsForDate = allLogs.filter(l => l.date === date);

    prescriptions.forEach(p => {
      const prescriptionStatus = {};

      ['morning', 'noon', 'evening', 'night'].forEach(slot => {
        if (p.schedule[slot]?.enabled) {
          const log = logsForDate.find(l => l.prescriptionId === p.id && l.timeSlot === slot);
          prescriptionStatus[slot] = log ? log.status : 'pending';
        }
      });

      weekData[date][p.id] = prescriptionStatus;
    });
  });

  return weekData;
}

// Get aggregated day status for a prescription
// Returns: 'complete' | 'partial' | 'refused' | 'pending' | 'future' | 'not_scheduled'
export function getDayAdministrationStatus(prescription, date, logs) {
  const today = new Date().toISOString().split('T')[0];
  const targetDate = new Date(date);
  const todayDate = new Date(today);

  // Check if prescription applies to this day (for specific_days frequency)
  if (prescription.frequency === 'specific_days' && prescription.specificDays?.length > 0) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = targetDate.getDay();
    if (!prescription.specificDays.includes(dayNames[dayOfWeek])) {
      return 'not_scheduled';
    }
  }

  // Count enabled time slots
  const enabledSlots = ['morning', 'noon', 'evening', 'night'].filter(
    slot => prescription.schedule[slot]?.enabled
  );

  if (enabledSlots.length === 0) return 'not_scheduled';

  // Future date
  if (targetDate > todayDate) {
    return 'future';
  }

  // Get logs for this prescription on this date
  const dayLogs = logs.filter(
    l => l.prescriptionId === prescription.id && l.date === date
  );

  let given = 0;
  let refused = 0;

  enabledSlots.forEach(slot => {
    const log = dayLogs.find(l => l.timeSlot === slot);
    if (log?.status === 'given') given++;
    else if (log?.status === 'refused') refused++;
  });

  // Determine overall status
  if (refused > 0) return 'refused';
  if (given === enabledSlots.length) return 'complete';
  if (given > 0) return 'partial';
  if (date === today) return 'pending';

  // Past date with no logs - consider as not recorded
  return 'pending';
}

// ============ HISTORY VIEW HELPERS ============

// Get filtered administration history
export function getAdministrationHistory(residentId, filters = {}) {
  const { dateFrom, dateTo, status, medicationId, searchQuery } = filters;

  let logs = getAllAdministrationLogs().filter(l => l.residentId === residentId);

  // Filter by date range
  if (dateFrom) {
    logs = logs.filter(l => l.date >= dateFrom);
  }
  if (dateTo) {
    logs = logs.filter(l => l.date <= dateTo);
  }

  // Filter by status
  if (status && status !== 'all') {
    logs = logs.filter(l => l.status === status);
  }

  // Filter by medication
  if (medicationId) {
    logs = logs.filter(l => l.prescriptionId === medicationId);
  }

  // Enrich logs with prescription data and filter by search query
  const prescriptions = getAllPrescriptions();
  const enrichedLogs = logs.map(log => {
    const prescription = prescriptions.find(p => p.id === log.prescriptionId);
    return {
      ...log,
      medicationName: prescription?.medicationName || 'Nezināms medikaments',
      dose: prescription?.schedule[log.timeSlot]?.dose || '',
      unit: prescription?.schedule[log.timeSlot]?.unit || ''
    };
  });

  // Filter by search query
  let filteredLogs = enrichedLogs;
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredLogs = enrichedLogs.filter(l =>
      l.medicationName.toLowerCase().includes(query)
    );
  }

  // Sort by date (newest first), then by time slot
  const slotOrder = { morning: 0, noon: 1, evening: 2, night: 3 };
  filteredLogs.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return slotOrder[a.timeSlot] - slotOrder[b.timeSlot];
  });

  return filteredLogs;
}

// Get date range for filter presets
export function getDateRange(preset) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  switch (preset) {
    case '7days': {
      const from = new Date(today);
      from.setDate(from.getDate() - 7);
      return { dateFrom: from.toISOString().split('T')[0], dateTo: todayStr };
    }
    case '30days': {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { dateFrom: from.toISOString().split('T')[0], dateTo: todayStr };
    }
    case '90days': {
      const from = new Date(today);
      from.setDate(from.getDate() - 90);
      return { dateFrom: from.toISOString().split('T')[0], dateTo: todayStr };
    }
    default:
      return { dateFrom: null, dateTo: todayStr };
  }
}

// ============ DATA RESET ============

export function resetPrescriptionData() {
  localStorage.setItem(RESIDENTS_KEY, JSON.stringify(mockResidents));
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(mockPrescriptions));
  localStorage.setItem(LOGS_KEY, JSON.stringify(mockAdministrationLogs));
}

export function clearPrescriptionData() {
  localStorage.removeItem(RESIDENTS_KEY);
  localStorage.removeItem(PRESCRIPTIONS_KEY);
  localStorage.removeItem(LOGS_KEY);
}
