/**
 * Inventory management helper functions
 * Handles CRUD operations for both Warehouse A (bulk) and Warehouse B (resident)
 */

import {
  STORAGE_KEYS,
  INVENTORY_STATUS,
  ALERT_THRESHOLDS,
  CURRENT_USER,
  DEFAULT_MINIMUM_STOCK
} from '../constants/inventoryConstants';

import {
  mockBulkInventory,
  mockResidentInventory,
  mockTransfers,
  mockReceipts,
  mockDispenseLog
} from './mockInventoryData';

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize inventory data from mock data if not present
 */
export function initializeInventoryData() {
  // Bulk inventory
  if (!localStorage.getItem(STORAGE_KEYS.BULK_INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.BULK_INVENTORY, JSON.stringify(mockBulkInventory));
  }

  // Resident inventory
  if (!localStorage.getItem(STORAGE_KEYS.RESIDENT_INVENTORY)) {
    localStorage.setItem(STORAGE_KEYS.RESIDENT_INVENTORY, JSON.stringify(mockResidentInventory));
  }

  // Transfers
  if (!localStorage.getItem(STORAGE_KEYS.TRANSFERS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(mockTransfers));
  }

  // External receipts
  if (!localStorage.getItem(STORAGE_KEYS.RECEIPTS)) {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(mockReceipts));
  }

  // Dispense log
  if (!localStorage.getItem(STORAGE_KEYS.DISPENSE_LOG)) {
    localStorage.setItem(STORAGE_KEYS.DISPENSE_LOG, JSON.stringify(mockDispenseLog));
  }
}

/**
 * Reset all inventory data to mock defaults
 */
export function resetInventoryData() {
  localStorage.setItem(STORAGE_KEYS.BULK_INVENTORY, JSON.stringify(mockBulkInventory));
  localStorage.setItem(STORAGE_KEYS.RESIDENT_INVENTORY, JSON.stringify(mockResidentInventory));
  localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(mockTransfers));
  localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(mockReceipts));
  localStorage.setItem(STORAGE_KEYS.DISPENSE_LOG, JSON.stringify(mockDispenseLog));
}

/**
 * Clear all inventory data
 */
export function clearInventoryData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// ============================================
// ID GENERATION
// ============================================

function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

// ============================================
// BULK INVENTORY (WAREHOUSE A)
// ============================================

/**
 * Get all bulk inventory items
 */
export function getAllBulkInventory() {
  initializeInventoryData();
  const data = localStorage.getItem(STORAGE_KEYS.BULK_INVENTORY);
  return data ? JSON.parse(data) : [];
}

/**
 * Get a single bulk inventory item by ID
 */
export function getBulkInventoryItem(itemId) {
  const items = getAllBulkInventory();
  return items.find(item => item.id === itemId) || null;
}

/**
 * Create a new bulk inventory item
 */
export function createBulkInventoryItem(data) {
  const items = getAllBulkInventory();
  const now = new Date().toISOString();

  const newItem = {
    id: generateId('BI'),
    medicationName: data.medicationName,
    activeIngredient: data.activeIngredient || '',
    form: data.form || 'tabletes',
    batchNumber: data.batchNumber || '',
    expirationDate: data.expirationDate,
    quantity: data.quantity || 0,
    unit: data.unit || 'tabletes',
    unitCost: data.unitCost || 0,
    receivedDate: data.receivedDate || now.split('T')[0],
    entryMethod: data.entryMethod || 'manual_entry',
    supplierId: data.supplierId || '',
    fundingSource: data.fundingSource || 'facility',
    status: calculateInventoryStatus(data.quantity, data.minimumStock || DEFAULT_MINIMUM_STOCK, data.expirationDate),
    minimumStock: data.minimumStock || DEFAULT_MINIMUM_STOCK,
    createdAt: now,
    updatedAt: now
  };

  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.BULK_INVENTORY, JSON.stringify(items));

  return newItem;
}

/**
 * Update a bulk inventory item
 */
export function updateBulkInventoryItem(itemId, data) {
  const items = getAllBulkInventory();
  const index = items.findIndex(item => item.id === itemId);

  if (index === -1) return null;

  const updatedItem = {
    ...items[index],
    ...data,
    status: calculateInventoryStatus(
      data.quantity ?? items[index].quantity,
      data.minimumStock ?? items[index].minimumStock,
      data.expirationDate ?? items[index].expirationDate
    ),
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  localStorage.setItem(STORAGE_KEYS.BULK_INVENTORY, JSON.stringify(items));

  return updatedItem;
}

/**
 * Update bulk inventory quantity (delta change)
 */
export function updateBulkInventoryQuantity(itemId, delta) {
  const item = getBulkInventoryItem(itemId);
  if (!item) return null;

  const newQuantity = Math.max(0, item.quantity + delta);
  return updateBulkInventoryItem(itemId, { quantity: newQuantity });
}

/**
 * Delete a bulk inventory item
 */
export function deleteBulkInventoryItem(itemId) {
  const items = getAllBulkInventory();
  const filtered = items.filter(item => item.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.BULK_INVENTORY, JSON.stringify(filtered));
  return true;
}

/**
 * Search bulk inventory by medication name
 */
export function searchBulkInventory(query) {
  const items = getAllBulkInventory();
  if (!query) return items;

  const searchLower = query.toLowerCase();
  return items.filter(item =>
    item.medicationName.toLowerCase().includes(searchLower) ||
    item.activeIngredient.toLowerCase().includes(searchLower) ||
    item.batchNumber.toLowerCase().includes(searchLower)
  );
}

/**
 * Get bulk inventory alerts (low stock, expiring, expired)
 */
export function getBulkInventoryAlerts() {
  const items = getAllBulkInventory();
  const today = new Date();
  const alerts = [];

  items.forEach(item => {
    // Low stock alert
    if (item.quantity <= item.minimumStock && item.quantity > 0) {
      alerts.push({
        type: 'low_stock',
        severity: item.quantity <= item.minimumStock / 2 ? 'critical' : 'warning',
        item,
        message: `Zems krājums: ${item.medicationName} (${item.quantity} ${item.unit})`
      });
    }

    // Depleted alert
    if (item.quantity === 0) {
      alerts.push({
        type: 'depleted',
        severity: 'critical',
        item,
        message: `Izlietots: ${item.medicationName}`
      });
    }

    // Expiration alerts
    if (item.expirationDate) {
      const expDate = new Date(item.expirationDate);
      const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 0) {
        alerts.push({
          type: 'expired',
          severity: 'critical',
          item,
          message: `Beidzies derīgums: ${item.medicationName}`
        });
      } else if (daysUntilExpiry <= ALERT_THRESHOLDS.EXPIRATION_CRITICAL_DAYS) {
        alerts.push({
          type: 'expiring_soon',
          severity: 'critical',
          item,
          daysRemaining: daysUntilExpiry,
          message: `Drīz beigsies derīgums (${daysUntilExpiry} dienas): ${item.medicationName}`
        });
      } else if (daysUntilExpiry <= ALERT_THRESHOLDS.EXPIRATION_WARNING_DAYS) {
        alerts.push({
          type: 'expiring_soon',
          severity: 'warning',
          item,
          daysRemaining: daysUntilExpiry,
          message: `Beigsies derīgums (${daysUntilExpiry} dienas): ${item.medicationName}`
        });
      }
    }
  });

  // Sort by severity (critical first)
  alerts.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;
    return 0;
  });

  return alerts;
}

// ============================================
// RESIDENT INVENTORY (WAREHOUSE B)
// ============================================

/**
 * Get all resident inventory items, optionally filtered by resident
 */
export function getResidentInventory(residentId = null) {
  initializeInventoryData();
  const data = localStorage.getItem(STORAGE_KEYS.RESIDENT_INVENTORY);
  const items = data ? JSON.parse(data) : [];

  if (residentId) {
    return items.filter(item => item.residentId === residentId);
  }
  return items;
}

/**
 * Get a single resident inventory item by ID
 */
export function getResidentInventoryItem(itemId) {
  const items = getResidentInventory();
  return items.find(item => item.id === itemId) || null;
}

/**
 * Get inventory item for a specific prescription
 */
export function getInventoryForPrescription(prescriptionId) {
  const items = getResidentInventory();
  return items.find(item => item.prescriptionId === prescriptionId) || null;
}

/**
 * Create a new resident inventory item
 */
export function createResidentInventoryItem(data) {
  const items = getResidentInventory();
  const now = new Date().toISOString();

  const newItem = {
    id: generateId('RI'),
    residentId: data.residentId,
    medicationName: data.medicationName,
    activeIngredient: data.activeIngredient || '',
    form: data.form || 'tabletes',
    batchNumber: data.batchNumber || '',
    expirationDate: data.expirationDate,
    quantity: data.quantity || 0,
    unit: data.unit || 'tabletes',
    entryMethod: data.entryMethod || 'bulk_transfer',
    supplierId: data.supplierId || '',
    fundingSource: data.fundingSource || 'facility',
    unitCost: data.unitCost || 0,
    billingExcluded: data.billingExcluded || false,
    isForeign: data.isForeign || false,
    originCountry: data.originCountry || '',
    sourceId: data.sourceId || null,
    prescriptionId: data.prescriptionId || null,
    status: calculateInventoryStatus(data.quantity, data.minimumStock || 4, data.expirationDate),
    minimumStock: data.minimumStock || 4,
    lastDispenseDate: null,
    createdAt: now,
    updatedAt: now
  };

  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.RESIDENT_INVENTORY, JSON.stringify(items));

  return newItem;
}

/**
 * Update a resident inventory item
 */
export function updateResidentInventoryItem(itemId, data) {
  const items = getResidentInventory();
  const index = items.findIndex(item => item.id === itemId);

  if (index === -1) return null;

  const updatedItem = {
    ...items[index],
    ...data,
    status: calculateInventoryStatus(
      data.quantity ?? items[index].quantity,
      data.minimumStock ?? items[index].minimumStock,
      data.expirationDate ?? items[index].expirationDate
    ),
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  localStorage.setItem(STORAGE_KEYS.RESIDENT_INVENTORY, JSON.stringify(items));

  return updatedItem;
}

/**
 * Update resident inventory quantity (delta change)
 */
export function updateResidentInventoryQuantity(itemId, delta) {
  const item = getResidentInventoryItem(itemId);
  if (!item) return null;

  const newQuantity = Math.max(0, item.quantity + delta);
  const now = new Date().toISOString();

  return updateResidentInventoryItem(itemId, {
    quantity: newQuantity,
    lastDispenseDate: delta < 0 ? now.split('T')[0] : item.lastDispenseDate
  });
}

/**
 * Delete a resident inventory item
 */
export function deleteResidentInventoryItem(itemId) {
  const items = getResidentInventory();
  const filtered = items.filter(item => item.id !== itemId);
  localStorage.setItem(STORAGE_KEYS.RESIDENT_INVENTORY, JSON.stringify(filtered));
  return true;
}

/**
 * Get resident inventory alerts for a specific resident
 */
export function getResidentInventoryAlerts(residentId) {
  const items = getResidentInventory(residentId);
  const today = new Date();
  const alerts = [];

  items.forEach(item => {
    // Low stock alert
    if (item.quantity <= item.minimumStock && item.quantity > 0) {
      alerts.push({
        type: 'low_stock',
        severity: item.quantity <= 2 ? 'critical' : 'warning',
        item,
        message: `Zems krājums: ${item.medicationName} (${item.quantity} ${item.unit})`
      });
    }

    // Depleted alert
    if (item.quantity === 0) {
      alerts.push({
        type: 'depleted',
        severity: 'critical',
        item,
        message: `Nav krājumā: ${item.medicationName}`
      });
    }

    // Expiration alerts
    if (item.expirationDate) {
      const expDate = new Date(item.expirationDate);
      const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 0) {
        alerts.push({
          type: 'expired',
          severity: 'critical',
          item,
          message: `Beidzies derīgums: ${item.medicationName}`
        });
      } else if (daysUntilExpiry <= ALERT_THRESHOLDS.EXPIRATION_CRITICAL_DAYS) {
        alerts.push({
          type: 'expiring_soon',
          severity: 'critical',
          item,
          daysRemaining: daysUntilExpiry,
          message: `Drīz beigsies derīgums: ${item.medicationName}`
        });
      }
    }
  });

  return alerts;
}

// ============================================
// TRANSFERS (A to B)
// ============================================

/**
 * Get all transfers, optionally filtered by resident
 */
export function getAllTransfers(residentId = null) {
  initializeInventoryData();
  const data = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
  const transfers = data ? JSON.parse(data) : [];

  if (residentId) {
    return transfers.filter(t => t.residentId === residentId);
  }
  return transfers;
}

/**
 * Create a transfer from bulk (A) to resident inventory (B)
 */
export function createTransfer(bulkItemId, residentId, quantity, reason = '4_day_preparation', notes = '') {
  const bulkItem = getBulkInventoryItem(bulkItemId);
  if (!bulkItem) {
    throw new Error('Bulk inventory item not found');
  }

  if (bulkItem.quantity < quantity) {
    throw new Error('Insufficient quantity in bulk inventory');
  }

  const now = new Date().toISOString();

  // Check if resident already has this medication
  let residentItem = getResidentInventory(residentId)
    .find(item => item.medicationName === bulkItem.medicationName && item.batchNumber === bulkItem.batchNumber);

  if (residentItem) {
    // Update existing resident inventory
    residentItem = updateResidentInventoryItem(residentItem.id, {
      quantity: residentItem.quantity + quantity
    });
  } else {
    // Create new resident inventory item
    residentItem = createResidentInventoryItem({
      residentId,
      medicationName: bulkItem.medicationName,
      activeIngredient: bulkItem.activeIngredient,
      form: bulkItem.form,
      batchNumber: bulkItem.batchNumber,
      expirationDate: bulkItem.expirationDate,
      quantity,
      unit: bulkItem.unit,
      unitCost: bulkItem.unitCost || 0,
      entryMethod: 'bulk_transfer',
      supplierId: bulkItem.supplierId || 'SUP-RECIPE-PLUS',
      fundingSource: 'facility',
      sourceId: bulkItemId,
      prescriptionId: null, // Can be linked later
      minimumStock: 4
    });
  }

  // Decrease bulk inventory
  updateBulkInventoryQuantity(bulkItemId, -quantity);

  // Record the transfer
  const transfers = getAllTransfers();
  const transfer = {
    id: generateId('TR'),
    bulkItemId,
    residentId,
    residentInventoryId: residentItem.id,
    medicationName: bulkItem.medicationName,
    quantity,
    unit: bulkItem.unit,
    transferredBy: CURRENT_USER,
    transferredAt: now,
    reason,
    notes
  };

  transfers.push(transfer);
  localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));

  return { transfer, residentItem };
}

/**
 * Get transfer history for a resident
 */
export function getTransferHistory(residentId) {
  return getAllTransfers(residentId)
    .sort((a, b) => new Date(b.transferredAt) - new Date(a.transferredAt));
}

/**
 * Calculate 4-day supply needs for a resident based on their prescriptions
 */
export function calculateFourDaySupply(residentId, prescriptions) {
  const needs = [];

  prescriptions.forEach(prescription => {
    if (prescription.status !== 'active' || prescription.frequency === 'as_needed') {
      return;
    }

    // Calculate daily dose
    let dailyDose = 0;
    const schedule = prescription.schedule;

    ['morning', 'noon', 'evening', 'night'].forEach(slot => {
      if (schedule[slot]?.enabled && schedule[slot]?.dose) {
        dailyDose += parseFloat(schedule[slot].dose) || 0;
      }
    });

    // For specific days, calculate weekly average
    if (prescription.frequency === 'specific_days' && prescription.specificDays) {
      const daysPerWeek = prescription.specificDays.length;
      dailyDose = (dailyDose * daysPerWeek) / 7;
    }

    const fourDayNeed = Math.ceil(dailyDose * 4);

    // Get current resident inventory for this medication
    const residentInventory = getResidentInventory(residentId)
      .find(item => item.prescriptionId === prescription.id);

    const currentStock = residentInventory?.quantity || 0;
    const shortage = Math.max(0, fourDayNeed - currentStock);

    needs.push({
      prescriptionId: prescription.id,
      medicationName: prescription.medicationName,
      dailyDose,
      fourDayNeed,
      currentStock,
      shortage,
      unit: schedule.morning?.unit || schedule.noon?.unit || schedule.evening?.unit || schedule.night?.unit || 'tabletes'
    });
  });

  return needs;
}

// ============================================
// EXTERNAL RECEIPTS (Relatives bring)
// ============================================

/**
 * Get all external receipts, optionally filtered by resident
 */
export function getAllReceipts(residentId = null) {
  initializeInventoryData();
  const data = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
  const receipts = data ? JSON.parse(data) : [];

  if (residentId) {
    return receipts.filter(r => r.residentId === residentId);
  }
  return receipts;
}

/**
 * Record an external receipt (relatives bring medication)
 */
export function recordExternalReceipt(residentId, data) {
  const now = new Date().toISOString();

  // Create resident inventory item
  const residentItem = createResidentInventoryItem({
    residentId,
    medicationName: data.medicationName,
    activeIngredient: data.activeIngredient || '',
    form: data.form || 'tabletes',
    batchNumber: data.batchNumber || '',
    expirationDate: data.expirationDate,
    quantity: data.quantity,
    unit: data.unit || 'tabletes',
    unitCost: 0,
    billingExcluded: true,
    isForeign: data.isForeign || false,
    originCountry: data.originCountry || '',
    entryMethod: 'external_receipt',
    supplierId: 'SUP-RELATIVES',
    fundingSource: 'family',
    sourceId: null, // Will be set to receipt ID
    prescriptionId: data.prescriptionId || null,
    minimumStock: 4
  });

  // Record the receipt
  const receipts = getAllReceipts();
  const receipt = {
    id: generateId('ER'),
    residentId,
    residentInventoryId: residentItem.id,
    medicationName: data.medicationName,
    activeIngredient: data.activeIngredient || '',
    form: data.form || 'tabletes',
    batchNumber: data.batchNumber || '',
    expirationDate: data.expirationDate,
    quantity: data.quantity,
    unit: data.unit || 'tabletes',
    broughtBy: data.broughtBy || '',
    relationship: data.relationship || 'family',
    receivedBy: CURRENT_USER,
    receivedAt: now,
    notes: data.notes || ''
  };

  receipts.push(receipt);
  localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));

  // Update resident item with receipt ID
  updateResidentInventoryItem(residentItem.id, { sourceId: receipt.id });

  return { receipt, residentItem };
}

// ============================================
// DISPENSE LOG
// ============================================

/**
 * Get all dispense log entries
 */
export function getAllDispenseLogs(residentId = null) {
  initializeInventoryData();
  const data = localStorage.getItem(STORAGE_KEYS.DISPENSE_LOG);
  const logs = data ? JSON.parse(data) : [];

  if (residentId) {
    return logs.filter(l => l.residentId === residentId);
  }
  return logs;
}

/**
 * Create a dispense log entry
 */
export function createDispenseLog(data) {
  const logs = getAllDispenseLogs();
  const now = new Date().toISOString();

  const log = {
    id: generateId('DL'),
    residentInventoryId: data.residentInventoryId,
    residentId: data.residentId,
    prescriptionId: data.prescriptionId,
    administrationLogId: data.administrationLogId,
    quantityDispensed: data.quantityDispensed,
    unit: data.unit,
    dispensedAt: now,
    timeSlot: data.timeSlot,
    type: data.type || 'auto_dispense',
    previousQuantity: data.previousQuantity,
    newQuantity: data.newQuantity
  };

  logs.push(log);
  localStorage.setItem(STORAGE_KEYS.DISPENSE_LOG, JSON.stringify(logs));

  return log;
}

// ============================================
// STATUS HELPERS
// ============================================

/**
 * Calculate inventory status based on quantity and expiration
 */
function calculateInventoryStatus(quantity, minimumStock, expirationDate) {
  if (quantity === 0) {
    return 'depleted';
  }

  if (expirationDate) {
    const today = new Date();
    const expDate = new Date(expirationDate);
    if (expDate <= today) {
      return 'expired';
    }
  }

  if (quantity <= minimumStock) {
    return 'low';
  }

  return 'available';
}

/**
 * Get status display info
 */
export function getStatusDisplay(status) {
  return INVENTORY_STATUS[status] || INVENTORY_STATUS.available;
}

// ============================================
// SUMMARY & REPORTS
// ============================================

/**
 * Get inventory summary statistics
 */
export function getInventorySummary() {
  const bulkItems = getAllBulkInventory();
  const residentItems = getResidentInventory();
  const bulkAlerts = getBulkInventoryAlerts();

  return {
    bulk: {
      totalItems: bulkItems.length,
      totalQuantity: bulkItems.reduce((sum, item) => sum + item.quantity, 0),
      lowStockCount: bulkItems.filter(item => item.status === 'low').length,
      depletedCount: bulkItems.filter(item => item.status === 'depleted').length,
      expiringCount: bulkAlerts.filter(a => a.type === 'expiring_soon').length,
      expiredCount: bulkAlerts.filter(a => a.type === 'expired').length
    },
    resident: {
      totalItems: residentItems.length,
      residentsWithInventory: [...new Set(residentItems.map(i => i.residentId))].length
    },
    alerts: {
      total: bulkAlerts.length,
      critical: bulkAlerts.filter(a => a.severity === 'critical').length,
      warning: bulkAlerts.filter(a => a.severity === 'warning').length
    }
  };
}

/**
 * Get cost summary grouped by resident.
 * Returns array of { residentId, totalCost, facilityPurchasedTotal, zeroCostTotal, itemCount }
 */
export function getCostSummaryByResident() {
  const items = getResidentInventory();
  const map = {};

  items.forEach(item => {
    if (!map[item.residentId]) {
      map[item.residentId] = { residentId: item.residentId, totalCost: 0, facilityPurchasedTotal: 0, zeroCostTotal: 0, itemCount: 0 };
    }
    const entry = map[item.residentId];
    const lineCost = (item.unitCost || 0) * item.quantity;
    entry.totalCost += lineCost;
    entry.itemCount += 1;

    if (item.entryMethod === 'bulk_transfer') {
      entry.facilityPurchasedTotal += lineCost;
    } else if (item.entryMethod === 'external_receipt') {
      entry.zeroCostTotal += lineCost; // always 0 for external items
    }
  });

  return Object.values(map);
}

/**
 * Get weighted average unit cost for a specific medication for a resident.
 * Looks up each transfer's source bulk item unitCost and computes sum(unitCost*qty)/sum(qty).
 */
export function getWeightedAverageCost(residentId, medicationName) {
  const transfers = getAllTransfers(residentId);
  const bulkItems = getAllBulkInventory();

  const relevant = transfers.filter(t => t.medicationName === medicationName);
  if (relevant.length === 0) return 0;

  let totalCostQty = 0;
  let totalQty = 0;

  relevant.forEach(tr => {
    const bulkItem = bulkItems.find(bi => bi.id === tr.bulkItemId);
    const cost = bulkItem ? (bulkItem.unitCost || 0) : 0;
    totalCostQty += cost * tr.quantity;
    totalQty += tr.quantity;
  });

  return totalQty > 0 ? totalCostQty / totalQty : 0;
}

/**
 * Get resident inventory summary
 */
export function getResidentInventorySummary(residentId) {
  const items = getResidentInventory(residentId);
  const alerts = getResidentInventoryAlerts(residentId);

  return {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lowStockCount: items.filter(item => item.status === 'low').length,
    depletedCount: items.filter(item => item.status === 'depleted').length,
    fromBulk: items.filter(item => item.entryMethod === 'bulk_transfer').length,
    fromRelatives: items.filter(item => item.entryMethod === 'external_receipt').length,
    alerts: alerts.length
  };
}
