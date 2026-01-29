/**
 * Validation functions for inventory forms
 */

import { DEFAULT_MINIMUM_STOCK } from '../constants/inventoryConstants';

/**
 * Validate a bulk inventory item form
 */
export function validateBulkInventoryItem(data) {
  const errors = {};

  if (!data.medicationName?.trim()) {
    errors.medicationName = 'Medikamenta nosaukums ir obligāts';
  }

  if (!data.quantity || data.quantity < 0) {
    errors.quantity = 'Daudzumam jābūt pozitīvam skaitlim';
  }

  if (!data.unit?.trim()) {
    errors.unit = 'Vienība ir obligāta';
  }

  if (!data.expirationDate) {
    errors.expirationDate = 'Derīguma termiņš ir obligāts';
  } else {
    const expDate = new Date(data.expirationDate);
    if (isNaN(expDate.getTime())) {
      errors.expirationDate = 'Nederīgs datuma formāts';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate a transfer form
 */
export function validateTransfer(data) {
  const errors = {};

  if (!data.bulkItemId) {
    errors.bulkItemId = 'Jāizvēlas medikaments no noliktavas';
  }

  if (!data.residentId) {
    errors.residentId = 'Jāizvēlas rezidents';
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.quantity = 'Daudzumam jābūt lielākam par 0';
  }

  if (data.availableQuantity !== undefined && data.quantity > data.availableQuantity) {
    errors.quantity = `Pieejami tikai ${data.availableQuantity} ${data.unit || 'vienības'}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate an external receipt form (relatives bring)
 */
export function validateExternalReceipt(data) {
  const errors = {};

  if (!data.medicationName?.trim()) {
    errors.medicationName = 'Medikamenta nosaukums ir obligāts';
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.quantity = 'Daudzumam jābūt lielākam par 0';
  }

  if (!data.unit?.trim()) {
    errors.unit = 'Vienība ir obligāta';
  }

  if (!data.broughtBy?.trim()) {
    errors.broughtBy = 'Jānorāda, kurš atnesa zāles';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check if batch number is valid format
 */
export function isValidBatchNumber(batchNumber) {
  if (!batchNumber) return true; // Optional field
  // Allow alphanumeric with dashes
  return /^[A-Za-z0-9\-]+$/.test(batchNumber);
}

/**
 * Check if expiration date is valid
 */
export function isValidExpirationDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Check if quantity is valid
 */
export function isValidQuantity(quantity) {
  const num = parseFloat(quantity);
  return !isNaN(num) && num >= 0;
}

/**
 * Get empty bulk inventory form template
 */
export function getEmptyBulkInventoryForm() {
  return {
    medicationName: '',
    activeIngredient: '',
    form: 'tabletes',
    batchNumber: '',
    expirationDate: '',
    quantity: '',
    unit: 'tabletes',
    unitCost: '',
    supplierId: '',
    entryMethod: 'manual_entry',
    fundingSource: 'facility',
    minimumStock: DEFAULT_MINIMUM_STOCK
  };
}

/**
 * Get empty transfer form template
 */
export function getEmptyTransferForm(residentId = null) {
  return {
    bulkItemId: '',
    residentId: residentId,
    quantity: '',
    reason: '4_day_preparation',
    notes: ''
  };
}

/**
 * Get empty external receipt form template
 */
export function getEmptyExternalReceiptForm(residentId = null) {
  return {
    residentId: residentId,
    medicationName: '',
    activeIngredient: '',
    form: 'tabletes',
    batchNumber: '',
    expirationDate: '',
    quantity: '',
    unit: 'tabletes',
    broughtBy: '',
    relationship: 'family',
    notes: ''
  };
}

/**
 * Medication form options
 */
export const MEDICATION_FORMS = [
  { value: 'tabletes', label: 'Tabletes' },
  { value: 'kapsulas', label: 'Kapsulas' },
  { value: 'skidrums', label: 'Šķidrums' },
  { value: 'injekcijas', label: 'Injekcijas' },
  { value: 'pilieni', label: 'Pilieni' },
  { value: 'ziede', label: 'Ziede' },
  { value: 'aerosols', label: 'Aerosols' },
  { value: 'plastiris', label: 'Plākstiris' },
  { value: 'cits', label: 'Cits' }
];

/**
 * Unit options
 */
export const UNIT_OPTIONS = [
  { value: 'tabletes', label: 'tabletes' },
  { value: 'kapsulas', label: 'kapsulas' },
  { value: 'ml', label: 'ml' },
  { value: 'mg', label: 'mg' },
  { value: 'gab.', label: 'gab.' },
  { value: 'pudeles', label: 'pudeles' },
  { value: 'pildspalvas', label: 'pildspalvas' },
  { value: 'ampulas', label: 'ampulas' }
];
