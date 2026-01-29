/**
 * Inventory system constants for medication warehouse management
 */

// localStorage keys
export const STORAGE_KEYS = {
  BULK_INVENTORY: 'adorable-inventory-bulk',
  RESIDENT_INVENTORY: 'adorable-inventory-resident',
  TRANSFERS: 'adorable-inventory-transfers',
  RECEIPTS: 'adorable-inventory-receipts',
  DISPENSE_LOG: 'adorable-inventory-dispense-log'
};

// Inventory status types
export const INVENTORY_STATUS = {
  available: { value: 'available', label: 'Pieejams', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  low: { value: 'low', label: 'Zems krājums', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  expired: { value: 'expired', label: 'Beidzies derīgums', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  depleted: { value: 'depleted', label: 'Izlietots', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-500' }
};

// Source types for resident inventory (keyed by entryMethod value)
export const INVENTORY_SOURCE = {
  bulk_transfer: { value: 'bulk_transfer', label: 'No noliktavas', icon: 'ArrowRight' },
  external_receipt: { value: 'external_receipt', label: 'Radinieki atnesa', icon: 'Users' }
};

// Transfer reasons
export const TRANSFER_REASONS = {
  four_day_prep: { value: '4_day_preparation', label: '4 dienu sagatavošana' },
  replenishment: { value: 'replenishment', label: 'Papildināšana' },
  emergency: { value: 'emergency', label: 'Ārkārtas' }
};

// Relationship types for external receipts
export const RELATIONSHIPS = [
  { value: 'family', label: 'Ģimenes loceklis' },
  { value: 'friend', label: 'Draugs' },
  { value: 'caregiver', label: 'Aprūpētājs' },
  { value: 'other', label: 'Cits' }
];

// Alert thresholds
export const ALERT_THRESHOLDS = {
  LOW_STOCK_DAYS: 4,           // Alert when less than 4 days supply
  EXPIRATION_WARNING_DAYS: 30, // Warn 30 days before expiration
  EXPIRATION_CRITICAL_DAYS: 7  // Critical 7 days before expiration
};

// Dispense log entry types
export const DISPENSE_TYPES = {
  auto: { value: 'auto_dispense', label: 'Automātiska izsniegšana' },
  restore: { value: 'refusal_restore', label: 'Atteikuma atjaunošana' },
  manual: { value: 'manual_adjustment', label: 'Manuāla korekcija' }
};

// Receipt sources for bulk inventory (keyed by entryMethod value)
export const RECEIPT_SOURCES = {
  xml_import: { value: 'xml_import', label: 'XML imports (Recipe Plus)' },
  manual_entry: { value: 'manual_entry', label: 'Manuāla ievade' }
};

// Source categories for resident inventory display
export const SOURCE_CATEGORIES = {
  facility: { value: 'facility', label: 'No noliktavas', color: 'orange' },
  relative: { value: 'relative', label: 'Radinieki', color: 'blue' },
  foreign: { value: 'foreign', label: 'Arvalstu', color: 'violet' }
};

// Fields specific to foreign medications
export const FOREIGN_MEDICATION_FIELDS = ['originCountry', 'isForeign'];

// Default minimum stock levels (can be overridden per medication)
export const DEFAULT_MINIMUM_STOCK = 20;

// Current user (mock - in real app would come from auth)
export const CURRENT_USER = 'Gints Fricbergs';

// Latvian labels for UI
export const LABELS = {
  // Navigation
  NOLIKTAVA: 'Noliktava',
  LIELA_NOLIKTAVA: 'Lielā noliktava',
  REZIDENTU_NOLIKTAVAS: 'Rezidentu noliktavas',
  ATSKAITES: 'Atskaites',

  // Actions
  PARVIETOT: 'Pārvietot',
  PARVIETOT_NO_NOLIKTAVAS: 'Pārvietot no noliktavas',
  RADINIEKI_ATNES: 'Radinieki atnes',
  SIMULET_XML_IMPORTU: 'Simulēt XML importu',

  // Fields
  MEDIKAMENTS: 'Medikaments',
  PARTIJAS_NUMURS: 'Partijas numurs',
  DERIGUMA_TERMINS: 'Derīguma termiņš',
  DAUDZUMS: 'Daudzums',
  VIENIBA: 'Vienība',
  AVOTS: 'Avots',
  STATUSS: 'Statuss',
  SAISTITA_ORDINACIJA: 'Saistītā ordinācija',
  SANEMTS: 'Saņemts',

  // Status
  ZEMS_KRAJUMS: 'Zems krājums',
  BEIDZAS_DERIGUMS: 'Beidzas derīgums',
  IZSNIEGTS: 'Izsniegts',
  ATJAUNOTS: 'Atjaunots',

  // Alerts
  BRIDINAJUMI: 'Brīdinājumi',
  NAV_BRIDINAJUMU: 'Nav brīdinājumu',

  // Transfer
  DIENU_SAGATAVOSANA: 'dienu sagatavošana',
  APREKSINA_4_DIENAS: 'Aprēķinātais daudzums 4 dienām',

  // Reports
  KRAJUMU_PARSKATS: 'Krājumu pārskats',
  PATERINS_PERIODS: 'Patēriņa periods',
  TRANSFERS_VESTURE: 'Pārvietojumu vēsture'
};
