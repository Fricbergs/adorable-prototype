/**
 * Supplier CRUD operations via localStorage
 * Follows the same pattern as inventoryHelpers.js
 */

import {
  SUPPLIER_STORAGE_KEY,
  DEFAULT_SUPPLIERS
} from '../constants/supplierConstants';

// ============================================
// ID GENERATION
// ============================================

function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Seed default suppliers if not yet present in localStorage
 */
export function initializeSuppliers() {
  if (!localStorage.getItem(SUPPLIER_STORAGE_KEY)) {
    localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(DEFAULT_SUPPLIERS));
  }
}

// ============================================
// READ
// ============================================

/**
 * Get all suppliers (initializes if needed)
 */
export function getAllSuppliers() {
  initializeSuppliers();
  const data = localStorage.getItem(SUPPLIER_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Find a supplier by ID, or null if not found
 */
export function getSupplierById(supplierId) {
  const suppliers = getAllSuppliers();
  return suppliers.find(s => s.id === supplierId) || null;
}

/**
 * Get only active suppliers
 */
export function getActiveSuppliers() {
  return getAllSuppliers().filter(s => s.isActive === true);
}

/**
 * Convenience: return supplier name or fallback label
 */
export function getSupplierName(supplierId) {
  const supplier = getSupplierById(supplierId);
  return supplier ? supplier.name : 'Nezināms piegādātājs';
}

// ============================================
// WRITE
// ============================================

/**
 * Create a new supplier and persist to localStorage
 */
export function createSupplier(data) {
  const suppliers = getAllSuppliers();
  const now = new Date().toISOString();

  const newSupplier = {
    id: generateId('SUP'),
    name: data.name,
    catalogType: data.catalogType || 'manual',
    contactInfo: data.contactInfo || {},
    isActive: true,
    isDefault: false,
    createdAt: now
  };

  suppliers.push(newSupplier);
  localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(suppliers));

  return newSupplier;
}

/**
 * Update an existing supplier. Prevents deletion of default suppliers.
 */
export function updateSupplier(supplierId, data) {
  const suppliers = getAllSuppliers();
  const index = suppliers.findIndex(s => s.id === supplierId);

  if (index === -1) return null;

  // Prevent deactivation of default suppliers
  if (suppliers[index].isDefault && data.isActive === false) {
    console.warn('[Supplier] Cannot deactivate default supplier:', supplierId);
    return suppliers[index];
  }

  const updatedSupplier = {
    ...suppliers[index],
    ...data,
    id: suppliers[index].id, // prevent ID overwrite
    isDefault: suppliers[index].isDefault, // prevent default flag change
    updatedAt: new Date().toISOString()
  };

  suppliers[index] = updatedSupplier;
  localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(suppliers));

  return updatedSupplier;
}
