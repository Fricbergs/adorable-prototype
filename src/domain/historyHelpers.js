/**
 * History helpers for import history timeline
 * Aggregates all inventory actions into a unified, filterable timeline
 */

import { getAllBulkInventory, getAllTransfers, getAllReceipts, getResidentInventory } from './inventoryHelpers';

// ============================================
// AGGREGATE ALL HISTORY ACTIONS
// ============================================

/**
 * Aggregates all inventory actions into a unified timeline array.
 * Sources: bulk inventory items, transfers, external receipts.
 * Returns array sorted newest-first by date.
 */
export function aggregateHistoryActions() {
  const actions = [];

  // 1. Bulk inventory items (XML imports and manual entries)
  const bulkItems = getAllBulkInventory();
  bulkItems.forEach(item => {
    actions.push({
      id: item.id,
      type: item.entryMethod === 'xml_import' ? 'xml_import' : 'manual_entry',
      date: item.createdAt || item.receivedDate + 'T00:00:00',
      medicationName: item.medicationName,
      quantity: item.quantity,
      unit: item.unit,
      supplierId: item.supplierId || '',
      unitCost: item.unitCost || 0,
      residentId: null,
      details: {
        batchNumber: item.batchNumber,
        expirationDate: item.expirationDate,
        activeIngredient: item.activeIngredient
      }
    });
  });

  // 2. Transfers (A -> B)
  const transfers = getAllTransfers();
  transfers.forEach(t => {
    actions.push({
      id: t.id,
      type: 'transfer',
      date: t.transferredAt,
      medicationName: t.medicationName,
      quantity: t.quantity,
      unit: t.unit,
      supplierId: '',
      unitCost: 0,
      residentId: t.residentId,
      details: {
        reason: t.reason,
        transferredBy: t.transferredBy,
        notes: t.notes
      }
    });
  });

  // 3. External receipts (relatives / foreign medications)
  const receipts = getAllReceipts();
  const allResidentItems = getResidentInventory();

  receipts.forEach(r => {
    // Check if associated resident item has isForeign=true
    const residentItem = allResidentItems.find(ri => ri.id === r.residentInventoryId);
    const isForeign = residentItem?.isForeign === true;

    actions.push({
      id: r.id,
      type: isForeign ? 'foreign_receipt' : 'external_receipt',
      date: r.receivedAt,
      medicationName: r.medicationName,
      quantity: r.quantity,
      unit: r.unit,
      supplierId: '',
      unitCost: 0,
      residentId: r.residentId,
      details: {
        broughtBy: r.broughtBy,
        relationship: r.relationship,
        receivedBy: r.receivedBy,
        notes: r.notes,
        isForeign
      }
    });
  });

  // Sort newest-first
  actions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return actions;
}

// ============================================
// GROUP ACTIONS BY DAY
// ============================================

/**
 * Groups action array by date (YYYY-MM-DD).
 * Returns array of { date, actions } sorted newest day first.
 */
export function groupActionsByDay(actions) {
  const dayMap = {};

  actions.forEach(action => {
    const day = action.date ? action.date.split('T')[0] : 'unknown';
    if (!dayMap[day]) {
      dayMap[day] = [];
    }
    dayMap[day].push(action);
  });

  return Object.keys(dayMap)
    .sort((a, b) => b.localeCompare(a))
    .map(date => ({
      date,
      actions: dayMap[date]
    }));
}

// ============================================
// FILTER HISTORY
// ============================================

/**
 * Filters actions array by optional criteria.
 * filters = { startDate, endDate, sourceType, residentId }
 */
export function filterHistory(actions, filters = {}) {
  const { startDate, endDate, sourceType, residentId } = filters;

  return actions.filter(action => {
    // Date range filter
    if (startDate) {
      const actionDay = action.date ? action.date.split('T')[0] : '';
      if (actionDay < startDate) return false;
    }
    if (endDate) {
      const actionDay = action.date ? action.date.split('T')[0] : '';
      if (actionDay > endDate) return false;
    }

    // Source type filter
    if (sourceType && action.type !== sourceType) {
      return false;
    }

    // Resident filter: bulk items have no residentId, so exclude them when filtering by resident
    if (residentId) {
      if (!action.residentId) return false;
      if (action.residentId !== residentId) return false;
    }

    return true;
  });
}
