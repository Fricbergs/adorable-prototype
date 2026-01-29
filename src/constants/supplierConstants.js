/**
 * Supplier entity constants for multi-supplier inventory tracking
 */

// localStorage key for supplier data
export const SUPPLIER_STORAGE_KEY = 'adorable-suppliers';

// Catalog types define how a supplier's inventory is managed
export const SUPPLIER_CATALOG_TYPES = {
  xml: { value: 'xml', label: 'XML katalogs (automātisks imports)' },
  manual: { value: 'manual', label: 'Manuāla ievade (papīra rēķins)' },
  external: { value: 'external', label: 'Ārējais avots (radinieki, imports)' }
};

// Default suppliers seeded on first run
export const DEFAULT_SUPPLIERS = [
  {
    id: 'SUP-RECIPE-PLUS',
    name: 'Recipe Plus',
    catalogType: 'xml',
    contactInfo: { phone: '', email: '', address: '' },
    isActive: true,
    isDefault: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'SUP-SUPPLIER-2',
    name: 'Piegādātājs 2',
    catalogType: 'manual',
    contactInfo: { phone: '', email: '', address: '' },
    isActive: true,
    isDefault: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'SUP-RELATIVES',
    name: 'Radinieki',
    catalogType: 'external',
    contactInfo: {},
    isActive: true,
    isDefault: true,
    isPseudoSupplier: true,
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// How an inventory item entered the system
export const ENTRY_METHODS = {
  xml_import: { value: 'xml_import', label: 'XML imports' },
  manual_entry: { value: 'manual_entry', label: 'Manuāla ievade' },
  bulk_transfer: { value: 'bulk_transfer', label: 'No noliktavas' },
  external_receipt: { value: 'external_receipt', label: 'Radinieki atnesa' }
};

// Who pays for the item
export const FUNDING_SOURCES = {
  facility: { value: 'facility', label: 'Iestāde' },
  family: { value: 'family', label: 'Radinieki' },
  personal: { value: 'personal', label: 'Personīgais' }
};
