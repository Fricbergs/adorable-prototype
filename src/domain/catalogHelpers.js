/**
 * Catalog query and cross-supplier matching functions
 *
 * Provides lookup, search, and equivalence-detection helpers
 * for per-supplier product catalogs (reference data).
 */

import { SUPPLIER_CATALOGS } from '../constants/supplierCatalogData';
import { getSupplierName } from './supplierHelpers';

// ============================================
// CATALOG LOOKUP
// ============================================

/**
 * Return the catalog array for a given supplier, or [] if unknown.
 */
export function getCatalogForSupplier(supplierId) {
  return SUPPLIER_CATALOGS[supplierId] || [];
}

// ============================================
// SEARCH
// ============================================

/**
 * Filter a single supplier's catalog by free-text query.
 * Matches against medicationName and activeIngredient (case-insensitive).
 */
export function searchCatalog(supplierId, query) {
  const catalog = getCatalogForSupplier(supplierId);
  if (!query) return catalog;

  const q = query.toLowerCase();
  return catalog.filter(
    item =>
      item.medicationName.toLowerCase().includes(q) ||
      item.activeIngredient.toLowerCase().includes(q)
  );
}

// ============================================
// CROSS-SUPPLIER EQUIVALENCE
// ============================================

/**
 * Find equivalent medications across ALL supplier catalogs.
 *
 * "Equivalent" means same activeIngredient AND same form.
 * Returns an array of { supplierId, supplierName, catalogItem }.
 */
export function findEquivalentMedications(activeIngredient, form) {
  if (!activeIngredient || !form) return [];

  const ingredientLower = activeIngredient.toLowerCase();
  const formLower = form.toLowerCase();
  const results = [];

  for (const [supplierId, catalog] of Object.entries(SUPPLIER_CATALOGS)) {
    for (const item of catalog) {
      if (
        item.activeIngredient.toLowerCase() === ingredientLower &&
        item.form.toLowerCase() === formLower
      ) {
        results.push({
          supplierId,
          supplierName: getSupplierName(supplierId),
          catalogItem: item,
        });
      }
    }
  }

  return results;
}

// ============================================
// AGGREGATE HELPERS
// ============================================

/**
 * Return a flat list of every catalog item across all suppliers,
 * each annotated with its supplierId.
 */
export function getAllCatalogItems() {
  const items = [];

  for (const [supplierId, catalog] of Object.entries(SUPPLIER_CATALOGS)) {
    for (const item of catalog) {
      items.push({ ...item, supplierId });
    }
  }

  return items;
}

/**
 * Search across ALL supplier catalogs by medication name or active ingredient.
 * Returns items annotated with supplierId (from getAllCatalogItems).
 *
 * @param {string} query - search string (minimum 2 characters)
 * @returns {Array} matching catalog items with supplierId
 */
export function searchUnifiedCatalog(query) {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const allItems = getAllCatalogItems();

  return allItems.filter(
    item =>
      item.medicationName.toLowerCase().includes(q) ||
      item.activeIngredient.toLowerCase().includes(q)
  );
}
