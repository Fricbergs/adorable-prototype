/**
 * Migration v1: Transform old source attribution fields to new three-field model
 *
 * Bulk inventory:   receivedFrom + supplier  -->  entryMethod + supplierId + fundingSource
 * Resident inventory:   source               -->  entryMethod + supplierId + fundingSource
 */

import { STORAGE_KEYS } from '../../constants/inventoryConstants';

export function migrateV1SupplierFields() {
  let bulkCount = 0;
  let residentCount = 0;

  // --- Bulk inventory migration ---
  const bulkRaw = localStorage.getItem(STORAGE_KEYS.BULK_INVENTORY);
  if (bulkRaw) {
    const bulkItems = JSON.parse(bulkRaw);

    bulkItems.forEach(item => {
      // Map receivedFrom -> entryMethod
      if (item.receivedFrom !== undefined) {
        if (item.receivedFrom === 'manual') {
          item.entryMethod = 'manual_entry';
        } else {
          item.entryMethod = item.receivedFrom; // 'xml_import' stays as-is
        }
        delete item.receivedFrom;
      }

      // Map supplier string -> supplierId
      if (item.supplier !== undefined) {
        if (item.supplier === 'Recipe Plus') {
          item.supplierId = 'SUP-RECIPE-PLUS';
        } else {
          item.supplierId = 'SUP-SUPPLIER-2';
        }
        delete item.supplier;
      }

      // Default funding source for bulk items
      if (item.fundingSource === undefined) {
        item.fundingSource = 'facility';
      }

      bulkCount++;
    });

    localStorage.setItem(STORAGE_KEYS.BULK_INVENTORY, JSON.stringify(bulkItems));
  }

  // --- Resident inventory migration ---
  const residentRaw = localStorage.getItem(STORAGE_KEYS.RESIDENT_INVENTORY);
  if (residentRaw) {
    const residentItems = JSON.parse(residentRaw);

    residentItems.forEach(item => {
      // Map source -> entryMethod + supplierId + fundingSource
      if (item.source !== undefined) {
        if (item.source === 'relatives') {
          item.entryMethod = 'external_receipt';
          item.supplierId = 'SUP-RELATIVES';
          item.fundingSource = 'family';
        } else {
          // 'bulk_transfer' and any other value
          item.entryMethod = item.source; // keep 'bulk_transfer' as-is
          item.supplierId = 'SUP-RECIPE-PLUS'; // default for bulk-transferred items
          item.fundingSource = 'facility';
        }
        delete item.source;
        // Keep item.sourceId -- it is still valid (links to bulk item or receipt)
      }

      residentCount++;
    });

    localStorage.setItem(STORAGE_KEYS.RESIDENT_INVENTORY, JSON.stringify(residentItems));
  }

  console.log(`[Migration v1] Supplier fields migrated for ${bulkCount} bulk and ${residentCount} resident items`);
}
