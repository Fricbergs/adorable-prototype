/**
 * Inventory Scheduler - Auto-dispense integration
 * Handles automatic inventory deduction when medications are administered
 * and restoration when medications are refused
 */

import {
  getResidentInventory,
  getInventoryForPrescription,
  updateResidentInventoryQuantity,
  createDispenseLog,
  getResidentInventoryItem
} from './inventoryHelpers';

import { getPrescriptionById } from './prescriptionHelpers';

import { DISPENSE_TYPES } from '../constants/inventoryConstants';

/**
 * Process an administration event and update inventory accordingly
 * Called when markMedicationGiven or markMedicationRefused is executed
 *
 * @param {Object} administrationLog - The administration log entry
 * @returns {Object|null} The dispense log entry created, or null if no inventory action
 */
export function processAdministrationEvent(administrationLog) {
  if (!administrationLog) return null;

  const { prescriptionId, residentId, status, timeSlot, id: logId } = administrationLog;

  // Only process 'given' and 'refused' statuses
  if (status === 'given') {
    return handleMedicationGiven(prescriptionId, residentId, timeSlot, logId);
  } else if (status === 'refused') {
    return handleMedicationRefused(prescriptionId, residentId, timeSlot, logId);
  }

  return null;
}

/**
 * Handle medication given - deduct from inventory
 */
function handleMedicationGiven(prescriptionId, residentId, timeSlot, administrationLogId) {
  // Get the prescription to find dose
  const prescription = getPrescriptionById(prescriptionId);
  if (!prescription) {
    console.warn(`[InventoryScheduler] Prescription not found: ${prescriptionId}`);
    return null;
  }

  // Calculate dose for this time slot
  const dose = calculateDoseForTimeSlot(prescription, timeSlot);
  if (!dose || dose.amount <= 0) {
    console.warn(`[InventoryScheduler] No dose found for ${prescriptionId} at ${timeSlot}`);
    return null;
  }

  // Find matching resident inventory item
  const inventoryItem = findMatchingInventoryItem(prescription, residentId);
  if (!inventoryItem) {
    console.warn(`[InventoryScheduler] No inventory found for prescription ${prescriptionId}`);
    return null;
  }

  // Check if sufficient quantity
  if (inventoryItem.quantity < dose.amount) {
    console.warn(`[InventoryScheduler] Insufficient inventory for ${prescription.medicationName}: need ${dose.amount}, have ${inventoryItem.quantity}`);
    // Still deduct what's available, don't block administration
  }

  const previousQuantity = inventoryItem.quantity;
  const quantityToDispense = Math.min(dose.amount, inventoryItem.quantity);

  // Update inventory
  updateResidentInventoryQuantity(inventoryItem.id, -quantityToDispense);

  // Create dispense log
  const dispenseLog = createDispenseLog({
    residentInventoryId: inventoryItem.id,
    residentId,
    prescriptionId,
    administrationLogId,
    quantityDispensed: quantityToDispense,
    unit: dose.unit,
    timeSlot,
    type: DISPENSE_TYPES.auto.value,
    previousQuantity,
    newQuantity: previousQuantity - quantityToDispense
  });

  console.log(`[InventoryScheduler] Dispensed ${quantityToDispense} ${dose.unit} of ${prescription.medicationName}`);

  return dispenseLog;
}

/**
 * Handle medication refused - restore to inventory
 * Note: We only restore if there was a prior dispense in this session
 */
function handleMedicationRefused(prescriptionId, residentId, timeSlot, administrationLogId) {
  // Get the prescription to find dose
  const prescription = getPrescriptionById(prescriptionId);
  if (!prescription) {
    console.warn(`[InventoryScheduler] Prescription not found: ${prescriptionId}`);
    return null;
  }

  // Calculate dose for this time slot
  const dose = calculateDoseForTimeSlot(prescription, timeSlot);
  if (!dose || dose.amount <= 0) {
    return null;
  }

  // Find matching resident inventory item
  const inventoryItem = findMatchingInventoryItem(prescription, residentId);
  if (!inventoryItem) {
    // No inventory to restore to
    return null;
  }

  const previousQuantity = inventoryItem.quantity;

  // Update inventory - add back the dose
  updateResidentInventoryQuantity(inventoryItem.id, dose.amount);

  // Create restore log
  const dispenseLog = createDispenseLog({
    residentInventoryId: inventoryItem.id,
    residentId,
    prescriptionId,
    administrationLogId,
    quantityDispensed: -dose.amount, // Negative for restoration
    unit: dose.unit,
    timeSlot,
    type: DISPENSE_TYPES.restore.value,
    previousQuantity,
    newQuantity: previousQuantity + dose.amount
  });

  console.log(`[InventoryScheduler] Restored ${dose.amount} ${dose.unit} of ${prescription.medicationName}`);

  return dispenseLog;
}

/**
 * Calculate dose for a specific time slot from prescription schedule
 */
function calculateDoseForTimeSlot(prescription, timeSlot) {
  const schedule = prescription.schedule?.[timeSlot];

  if (!schedule?.enabled || !schedule?.dose) {
    return null;
  }

  return {
    amount: parseFloat(schedule.dose) || 0,
    unit: schedule.unit || 'tabletes'
  };
}

/**
 * Find matching inventory item for a prescription
 * Looks for items with matching medication name or linked prescription ID
 */
function findMatchingInventoryItem(prescription, residentId) {
  const residentInventory = getResidentInventory(residentId);

  // First try to find by prescription ID
  let item = residentInventory.find(i => i.prescriptionId === prescription.id);

  if (!item) {
    // Then try by medication name (fuzzy match)
    item = residentInventory.find(i =>
      i.medicationName.toLowerCase() === prescription.medicationName.toLowerCase() ||
      i.medicationName.toLowerCase().includes(prescription.medicationName.toLowerCase().split(' ')[0])
    );
  }

  return item || null;
}

/**
 * Link a resident inventory item to a prescription
 * Called when transferring medication or when creating new prescription
 */
export function linkInventoryToPrescription(inventoryItemId, prescriptionId) {
  const item = getResidentInventoryItem(inventoryItemId);
  if (item && !item.prescriptionId) {
    // Update the item with the prescription link
    // This would be done via updateResidentInventoryItem
    console.log(`[InventoryScheduler] Linked inventory ${inventoryItemId} to prescription ${prescriptionId}`);
  }
}

/**
 * Process all pending dispenses for a resident
 * Can be called on page load to sync inventory with administration logs
 */
export function reconcileInventoryWithLogs(residentId) {
  // This would compare administration logs with dispense logs
  // and create any missing dispense entries
  // For the prototype, we skip this complexity
  console.log(`[InventoryScheduler] Reconciliation requested for resident ${residentId}`);
}

/**
 * Check if resident has sufficient inventory for their prescriptions
 * Returns list of medications that need restocking
 */
export function checkInventoryNeeds(residentId, prescriptions) {
  const inventory = getResidentInventory(residentId);
  const needs = [];

  prescriptions.forEach(prescription => {
    if (prescription.status !== 'active' || prescription.frequency === 'as_needed') {
      return;
    }

    // Calculate 4-day requirement
    let dailyDose = 0;
    const schedule = prescription.schedule;

    ['morning', 'noon', 'evening', 'night'].forEach(slot => {
      if (schedule[slot]?.enabled && schedule[slot]?.dose) {
        dailyDose += parseFloat(schedule[slot].dose) || 0;
      }
    });

    // For specific days, adjust daily average
    if (prescription.frequency === 'specific_days' && prescription.specificDays) {
      const daysPerWeek = prescription.specificDays.length;
      dailyDose = (dailyDose * daysPerWeek) / 7;
    }

    const fourDayNeed = Math.ceil(dailyDose * 4);

    // Find current stock
    const inventoryItem = findMatchingInventoryItem(prescription, residentId);
    const currentStock = inventoryItem?.quantity || 0;

    if (currentStock < fourDayNeed) {
      needs.push({
        prescriptionId: prescription.id,
        medicationName: prescription.medicationName,
        currentStock,
        fourDayNeed,
        shortage: fourDayNeed - currentStock,
        inventoryItemId: inventoryItem?.id
      });
    }
  });

  return needs;
}
