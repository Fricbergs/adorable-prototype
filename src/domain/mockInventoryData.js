/**
 * Mock data for Noliktava (Inventory) system prototype
 * Matches medications from existing prescriptions
 */

import { INVENTORY_STATUS, INVENTORY_SOURCE, TRANSFER_REASONS, DISPENSE_TYPES } from '../constants/inventoryConstants';

// Generate date strings
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function getDateNDaysAgo(n) {
  const date = new Date(today);
  date.setDate(date.getDate() - n);
  return date.toISOString().split('T')[0];
}

function getDateNMonthsAhead(n) {
  const date = new Date(today);
  date.setMonth(date.getMonth() + n);
  return date.toISOString().split('T')[0];
}

// Bulk Inventory (Warehouse A) - Central storage
export const mockBulkInventory = [
  {
    id: 'BI-001',
    medicationName: 'L-Thyroxin Berlin-Chemie 50 mikrogramu tabletes',
    activeIngredient: 'Levothyroxinum natricum',
    form: 'tabletes',
    batchNumber: 'LT2024-A89',
    expirationDate: getDateNMonthsAhead(18),
    quantity: 500,
    unit: 'tabletes',
    unitCost: 0.08,
    receivedDate: getDateNDaysAgo(30),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 50,
    createdAt: getDateNDaysAgo(30) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(30) + 'T10:00:00'
  },
  {
    id: 'BI-002',
    medicationName: 'Somnols 7,5 mg apvalkotās tabletes',
    activeIngredient: 'Zopiclonum',
    form: 'tabletes',
    batchNumber: 'SOM2024-B12',
    expirationDate: getDateNMonthsAhead(12),
    quantity: 200,
    unit: 'tabletes',
    unitCost: 0.15,
    receivedDate: getDateNDaysAgo(45),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 30,
    createdAt: getDateNDaysAgo(45) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(45) + 'T10:00:00'
  },
  {
    id: 'BI-003',
    medicationName: 'Nateo D3 vit.cap 4000 SV',
    activeIngredient: 'Cholecalciferolum',
    form: 'kapsulas',
    batchNumber: 'NAT2024-C45',
    expirationDate: getDateNMonthsAhead(24),
    quantity: 300,
    unit: 'kapsulas',
    unitCost: 0.12,
    receivedDate: getDateNDaysAgo(20),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 40,
    createdAt: getDateNDaysAgo(20) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(20) + 'T10:00:00'
  },
  {
    id: 'BI-004',
    medicationName: 'Verospiron 25 mg tabletes',
    activeIngredient: 'Spironolactonum',
    form: 'tabletes',
    batchNumber: 'VER2024-D78',
    expirationDate: getDateNMonthsAhead(8),
    quantity: 150,
    unit: 'tabletes',
    unitCost: 0.10,
    receivedDate: getDateNDaysAgo(60),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 30,
    createdAt: getDateNDaysAgo(60) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(60) + 'T10:00:00'
  },
  {
    id: 'BI-005',
    medicationName: 'NovoMix 30 FlexPen',
    activeIngredient: 'Insulinum aspartum',
    form: 'injekcijas',
    batchNumber: 'NOV2024-E01',
    expirationDate: getDateNMonthsAhead(6),
    quantity: 10,
    unit: 'pildspalvas',
    unitCost: 25.00,
    receivedDate: getDateNDaysAgo(15),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 3,
    createdAt: getDateNDaysAgo(15) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(15) + 'T10:00:00'
  },
  {
    id: 'BI-006',
    medicationName: 'Paracetamol Accord 500 mg tabletes',
    activeIngredient: 'Paracetamolum',
    form: 'tabletes',
    batchNumber: 'PAR2024-F34',
    expirationDate: getDateNMonthsAhead(36),
    quantity: 1000,
    unit: 'tabletes',
    unitCost: 0.03,
    receivedDate: getDateNDaysAgo(90),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 100,
    createdAt: getDateNDaysAgo(90) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(90) + 'T10:00:00'
  },
  {
    id: 'BI-007',
    medicationName: 'Torasemid HEXAL 50 mg tabletes',
    activeIngredient: 'Torasemidum',
    form: 'tabletes',
    batchNumber: 'TOR2024-G56',
    expirationDate: getDateNMonthsAhead(10),
    quantity: 80,
    unit: 'tabletes',
    unitCost: 0.18,
    receivedDate: getDateNDaysAgo(40),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 20,
    createdAt: getDateNDaysAgo(40) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(40) + 'T10:00:00'
  },
  {
    id: 'BI-008',
    medicationName: 'Regulax Picosulphate 7,23 mg/ml pilieni',
    activeIngredient: 'Natrii picosulfas',
    form: 'pilieni',
    batchNumber: 'REG2024-H89',
    expirationDate: getDateNMonthsAhead(14),
    quantity: 5,
    unit: 'pudeles',
    unitCost: 4.50,
    receivedDate: getDateNDaysAgo(25),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 2,
    createdAt: getDateNDaysAgo(25) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(25) + 'T10:00:00'
  },
  {
    id: 'BI-009',
    medicationName: 'Olanzapine Accord 5 mg apvalkotās tabletes',
    activeIngredient: 'Olanzapinum',
    form: 'tabletes',
    batchNumber: 'OLA2024-I12',
    expirationDate: getDateNMonthsAhead(16),
    quantity: 120,
    unit: 'tabletes',
    unitCost: 0.22,
    receivedDate: getDateNDaysAgo(50),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 20,
    createdAt: getDateNDaysAgo(50) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(50) + 'T10:00:00'
  },
  {
    id: 'BI-010',
    medicationName: 'Metformin Accord 500 mg tabletes',
    activeIngredient: 'Metforminum',
    form: 'tabletes',
    batchNumber: 'MET2024-J45',
    expirationDate: getDateNMonthsAhead(20),
    quantity: 400,
    unit: 'tabletes',
    unitCost: 0.05,
    receivedDate: getDateNDaysAgo(35),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 60,
    createdAt: getDateNDaysAgo(35) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(35) + 'T10:00:00'
  },
  {
    id: 'BI-011',
    medicationName: 'Lisinopril Actavis 10 mg tabletes',
    activeIngredient: 'Lisinoprilum',
    form: 'tabletes',
    batchNumber: 'LIS2024-K78',
    expirationDate: getDateNMonthsAhead(22),
    quantity: 250,
    unit: 'tabletes',
    unitCost: 0.07,
    receivedDate: getDateNDaysAgo(55),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 30,
    createdAt: getDateNDaysAgo(55) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(55) + 'T10:00:00'
  },
  {
    id: 'BI-012',
    medicationName: 'Atorvastatin Teva 20 mg tabletes',
    activeIngredient: 'Atorvastatinum',
    form: 'tabletes',
    batchNumber: 'ATO2024-L01',
    expirationDate: getDateNMonthsAhead(15),
    quantity: 180,
    unit: 'tabletes',
    unitCost: 0.09,
    receivedDate: getDateNDaysAgo(28),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available',
    minimumStock: 30,
    createdAt: getDateNDaysAgo(28) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(28) + 'T10:00:00'
  },
  // Low stock item for demo
  {
    id: 'BI-013',
    medicationName: 'Aspirin Cardio 100 mg tabletes',
    activeIngredient: 'Acidum acetylsalicylicum',
    form: 'tabletes',
    batchNumber: 'ASP2024-M34',
    expirationDate: getDateNMonthsAhead(4),
    quantity: 15,
    unit: 'tabletes',
    unitCost: 0.04,
    receivedDate: getDateNDaysAgo(100),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'low',
    minimumStock: 30,
    createdAt: getDateNDaysAgo(100) + 'T10:00:00',
    updatedAt: todayStr + 'T10:00:00'
  },
  // Expiring soon item for demo
  {
    id: 'BI-014',
    medicationName: 'Omeprazole Actavis 20 mg kapsulas',
    activeIngredient: 'Omeprazolum',
    form: 'kapsulas',
    batchNumber: 'OME2023-N56',
    expirationDate: getDateNDaysAgo(-20), // Expires in 20 days
    quantity: 45,
    unit: 'kapsulas',
    unitCost: 0.11,
    receivedDate: getDateNDaysAgo(180),
    entryMethod: 'xml_import',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    status: 'available', // Will show as expiring soon
    minimumStock: 20,
    createdAt: getDateNDaysAgo(180) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(180) + 'T10:00:00'
  },

  // ---- Supplier 2 items (manual entry from paper invoices) ----
  {
    id: 'BI-015',
    medicationName: 'Metformin Sandoz 500 mg tabletes',
    activeIngredient: 'Metforminum',
    form: 'tabletes',
    batchNumber: 'MS2025-A01',
    expirationDate: getDateNMonthsAhead(22),
    quantity: 300,
    unit: 'tabletes',
    unitCost: 0.04,
    receivedDate: getDateNDaysAgo(10),
    entryMethod: 'manual_entry',
    supplierId: 'SUP-SUPPLIER-2',
    fundingSource: 'facility',
    invoiceRef: 'INV-2026-042',
    status: 'available',
    minimumStock: 50,
    createdAt: getDateNDaysAgo(10) + 'T09:00:00',
    updatedAt: getDateNDaysAgo(10) + 'T09:00:00'
  },
  {
    id: 'BI-016',
    medicationName: 'Diclofenac Teva 50 mg tabletes',
    activeIngredient: 'Diclofenacum natricum',
    form: 'tabletes',
    batchNumber: 'DT2025-B03',
    expirationDate: getDateNMonthsAhead(16),
    quantity: 100,
    unit: 'tabletes',
    unitCost: 0.06,
    receivedDate: getDateNDaysAgo(10),
    entryMethod: 'manual_entry',
    supplierId: 'SUP-SUPPLIER-2',
    fundingSource: 'facility',
    invoiceRef: 'INV-2026-042',
    status: 'available',
    minimumStock: 20,
    createdAt: getDateNDaysAgo(10) + 'T09:00:00',
    updatedAt: getDateNDaysAgo(10) + 'T09:00:00'
  },
  {
    id: 'BI-017',
    medicationName: 'Amoxicillin Sandoz 500 mg kapsulas',
    activeIngredient: 'Amoxicillinum',
    form: 'kapsulas',
    batchNumber: 'AS2025-C07',
    expirationDate: getDateNMonthsAhead(12),
    quantity: 60,
    unit: 'kapsulas',
    unitCost: 0.12,
    receivedDate: getDateNDaysAgo(10),
    entryMethod: 'manual_entry',
    supplierId: 'SUP-SUPPLIER-2',
    fundingSource: 'facility',
    invoiceRef: 'INV-2026-042',
    status: 'available',
    minimumStock: 15,
    createdAt: getDateNDaysAgo(10) + 'T09:00:00',
    updatedAt: getDateNDaysAgo(10) + 'T09:00:00'
  },
  {
    id: 'BI-018',
    medicationName: 'Wound Care Aquacel Ag+ 10x10 cm',
    activeIngredient: 'Hydrofiber/Ag',
    form: 'pārsējs',
    batchNumber: 'WC2025-D11',
    expirationDate: getDateNMonthsAhead(30),
    quantity: 25,
    unit: 'gab.',
    unitCost: 3.80,
    receivedDate: getDateNDaysAgo(10),
    entryMethod: 'manual_entry',
    supplierId: 'SUP-SUPPLIER-2',
    fundingSource: 'facility',
    invoiceRef: 'INV-2026-043',
    status: 'available',
    minimumStock: 5,
    createdAt: getDateNDaysAgo(10) + 'T09:15:00',
    updatedAt: getDateNDaysAgo(10) + 'T09:15:00'
  }
];

// Resident Inventory (Warehouse B) - Per-resident storage
export const mockResidentInventory = [
  // Resident R-001 (Jānis Bērziņš) inventory
  {
    id: 'RI-001',
    residentId: 'R-001',
    medicationName: 'L-Thyroxin Berlin-Chemie 50 mikrogramu tabletes',
    activeIngredient: 'Levothyroxinum natricum',
    form: 'tabletes',
    batchNumber: 'LT2024-A89',
    expirationDate: getDateNMonthsAhead(18),
    quantity: 8,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-001',
    prescriptionId: 'P-001',
    status: 'available',
    minimumStock: 4,
    lastDispenseDate: todayStr,
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: todayStr + 'T08:00:00'
  },
  {
    id: 'RI-002',
    residentId: 'R-001',
    medicationName: 'Somnols 7,5 mg apvalkotās tabletes',
    activeIngredient: 'Zopiclonum',
    form: 'tabletes',
    batchNumber: 'SOM2024-B12',
    expirationDate: getDateNMonthsAhead(12),
    quantity: 6,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-002',
    prescriptionId: 'P-002',
    status: 'available',
    minimumStock: 4,
    lastDispenseDate: getDateNDaysAgo(1),
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(1) + 'T21:00:00'
  },
  {
    id: 'RI-003',
    residentId: 'R-001',
    medicationName: 'Verospiron 25 mg tabletes',
    activeIngredient: 'Spironolactonum',
    form: 'tabletes',
    batchNumber: 'VER2024-D78',
    expirationDate: getDateNMonthsAhead(8),
    quantity: 5,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-004',
    prescriptionId: 'P-004',
    status: 'available',
    minimumStock: 4,
    lastDispenseDate: todayStr,
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: todayStr + 'T08:30:00'
  },
  {
    id: 'RI-004',
    residentId: 'R-001',
    medicationName: 'NovoMix 30 FlexPen',
    activeIngredient: 'Insulinum aspartum',
    form: 'injekcijas',
    batchNumber: 'NOV2024-E01',
    expirationDate: getDateNMonthsAhead(6),
    quantity: 1,
    unit: 'pildspalvas',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-005',
    prescriptionId: 'P-005',
    status: 'available',
    minimumStock: 1,
    lastDispenseDate: todayStr,
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: todayStr + 'T08:35:00'
  },
  {
    id: 'RI-005',
    residentId: 'R-001',
    medicationName: 'Olanzapine Accord 5 mg apvalkotās tabletes',
    activeIngredient: 'Olanzapinum',
    form: 'tabletes',
    batchNumber: 'OLA2024-I12',
    expirationDate: getDateNMonthsAhead(16),
    quantity: 7,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-009',
    prescriptionId: 'P-009',
    status: 'available',
    minimumStock: 4,
    lastDispenseDate: getDateNDaysAgo(1),
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(1) + 'T20:30:00'
  },
  // Low stock for demo
  {
    id: 'RI-006',
    residentId: 'R-001',
    medicationName: 'Nateo D3 vit.cap 4000 SV',
    activeIngredient: 'Cholecalciferolum',
    form: 'kapsulas',
    batchNumber: 'NAT2024-C45',
    expirationDate: getDateNMonthsAhead(24),
    quantity: 2,
    unit: 'kapsulas',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-003',
    prescriptionId: 'P-003',
    status: 'low',
    minimumStock: 4,
    lastDispenseDate: getDateNDaysAgo(1),
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(1) + 'T12:30:00'
  },

  // Resident R-002 (Anna Kalniņa) inventory
  {
    id: 'RI-007',
    residentId: 'R-002',
    medicationName: 'Metformin Accord 500 mg tabletes',
    activeIngredient: 'Metforminum',
    form: 'tabletes',
    batchNumber: 'MET2024-J45',
    expirationDate: getDateNMonthsAhead(20),
    quantity: 14,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-010',
    prescriptionId: 'P-010',
    status: 'available',
    minimumStock: 8,
    lastDispenseDate: todayStr,
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: todayStr + 'T08:05:00'
  },
  {
    id: 'RI-008',
    residentId: 'R-002',
    medicationName: 'Lisinopril Actavis 10 mg tabletes',
    activeIngredient: 'Lisinoprilum',
    form: 'tabletes',
    batchNumber: 'LIS2024-K78',
    expirationDate: getDateNMonthsAhead(22),
    quantity: 6,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-011',
    prescriptionId: 'P-011',
    status: 'available',
    minimumStock: 4,
    lastDispenseDate: todayStr,
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: todayStr + 'T08:05:00'
  },
  // Relatives brought medication
  {
    id: 'RI-009',
    residentId: 'R-002',
    medicationName: 'Omega-3 Fish Oil kapsulas',
    activeIngredient: 'Omega-3 fatty acids',
    form: 'kapsulas',
    batchNumber: 'OMG2024-X99',
    expirationDate: getDateNMonthsAhead(12),
    quantity: 30,
    unit: 'kapsulas',
    entryMethod: 'external_receipt',
    supplierId: 'SUP-RELATIVES',
    fundingSource: 'family',
    sourceId: 'ER-001',
    prescriptionId: null,
    status: 'available',
    minimumStock: 10,
    lastDispenseDate: null,
    createdAt: getDateNDaysAgo(7) + 'T14:00:00',
    updatedAt: getDateNDaysAgo(7) + 'T14:00:00'
  },

  // Resident R-003 (Pēteris Ozols) inventory
  {
    id: 'RI-010',
    residentId: 'R-003',
    medicationName: 'Atorvastatin Teva 20 mg tabletes',
    activeIngredient: 'Atorvastatinum',
    form: 'tabletes',
    batchNumber: 'ATO2024-L01',
    expirationDate: getDateNMonthsAhead(15),
    quantity: 8,
    unit: 'tabletes',
    entryMethod: 'bulk_transfer',
    supplierId: 'SUP-RECIPE-PLUS',
    fundingSource: 'facility',
    sourceId: 'BI-012',
    prescriptionId: 'P-012',
    status: 'available',
    minimumStock: 4,
    lastDispenseDate: getDateNDaysAgo(1),
    createdAt: getDateNDaysAgo(4) + 'T10:00:00',
    updatedAt: getDateNDaysAgo(1) + 'T21:00:00'
  }
];

// Transfer history (A to B)
export const mockTransfers = [
  {
    id: 'TR-001',
    bulkItemId: 'BI-001',
    residentId: 'R-001',
    residentInventoryId: 'RI-001',
    medicationName: 'L-Thyroxin Berlin-Chemie 50 mikrogramu tabletes',
    quantity: 8,
    unit: 'tabletes',
    transferredBy: 'Māsa Ilze',
    transferredAt: getDateNDaysAgo(4) + 'T10:00:00',
    reason: '4_day_preparation',
    notes: '4 dienu sagatavošana'
  },
  {
    id: 'TR-002',
    bulkItemId: 'BI-002',
    residentId: 'R-001',
    residentInventoryId: 'RI-002',
    medicationName: 'Somnols 7,5 mg apvalkotās tabletes',
    quantity: 8,
    unit: 'tabletes',
    transferredBy: 'Māsa Ilze',
    transferredAt: getDateNDaysAgo(4) + 'T10:05:00',
    reason: '4_day_preparation',
    notes: '4 dienu sagatavošana'
  },
  {
    id: 'TR-003',
    bulkItemId: 'BI-010',
    residentId: 'R-002',
    residentInventoryId: 'RI-007',
    medicationName: 'Metformin Accord 500 mg tabletes',
    quantity: 16,
    unit: 'tabletes',
    transferredBy: 'Māsa Anna',
    transferredAt: getDateNDaysAgo(4) + 'T10:30:00',
    reason: '4_day_preparation',
    notes: '4 dienu sagatavošana - 2x dienā'
  },
  {
    id: 'TR-004',
    bulkItemId: 'BI-012',
    residentId: 'R-003',
    residentInventoryId: 'RI-010',
    medicationName: 'Atorvastatin Teva 20 mg tabletes',
    quantity: 8,
    unit: 'tabletes',
    transferredBy: 'Māsa Līga',
    transferredAt: getDateNDaysAgo(4) + 'T11:00:00',
    reason: '4_day_preparation',
    notes: '4 dienu sagatavošana'
  }
];

// External receipts (relatives brought)
export const mockReceipts = [
  {
    id: 'ER-001',
    residentId: 'R-002',
    residentInventoryId: 'RI-009',
    medicationName: 'Omega-3 Fish Oil kapsulas',
    activeIngredient: 'Omega-3 fatty acids',
    form: 'kapsulas',
    batchNumber: 'OMG2024-X99',
    expirationDate: getDateNMonthsAhead(12),
    quantity: 30,
    unit: 'kapsulas',
    broughtBy: 'Dēls Jānis',
    relationship: 'family',
    receivedBy: 'Māsa Anna',
    receivedAt: getDateNDaysAgo(7) + 'T14:00:00',
    notes: 'Radinieks atnesa papildus vitamīnus'
  }
];

// Dispense log (auto-dispense audit trail)
export const mockDispenseLog = [
  {
    id: 'DL-001',
    residentInventoryId: 'RI-001',
    residentId: 'R-001',
    prescriptionId: 'P-001',
    administrationLogId: 'MA-TODAY-1',
    quantityDispensed: 1,
    unit: 'tabletes',
    dispensedAt: todayStr + 'T07:35:00',
    timeSlot: 'morning',
    type: 'auto_dispense',
    previousQuantity: 9,
    newQuantity: 8
  },
  {
    id: 'DL-002',
    residentInventoryId: 'RI-003',
    residentId: 'R-001',
    prescriptionId: 'P-004',
    administrationLogId: 'MA-TODAY-2',
    quantityDispensed: 1,
    unit: 'tabletes',
    dispensedAt: todayStr + 'T08:32:00',
    timeSlot: 'morning',
    type: 'auto_dispense',
    previousQuantity: 6,
    newQuantity: 5
  },
  {
    id: 'DL-003',
    residentInventoryId: 'RI-007',
    residentId: 'R-002',
    prescriptionId: 'P-010',
    administrationLogId: 'MA-TODAY-5',
    quantityDispensed: 1,
    unit: 'tabletes',
    dispensedAt: todayStr + 'T08:05:00',
    timeSlot: 'morning',
    type: 'auto_dispense',
    previousQuantity: 15,
    newQuantity: 14
  },
  {
    id: 'DL-004',
    residentInventoryId: 'RI-008',
    residentId: 'R-002',
    prescriptionId: 'P-011',
    administrationLogId: 'MA-TODAY-6',
    quantityDispensed: 1,
    unit: 'tabletes',
    dispensedAt: todayStr + 'T08:05:00',
    timeSlot: 'morning',
    type: 'auto_dispense',
    previousQuantity: 7,
    newQuantity: 6
  }
];

// Helper functions
export function getMockInventoryData() {
  return {
    bulkInventory: mockBulkInventory,
    residentInventory: mockResidentInventory,
    transfers: mockTransfers,
    receipts: mockReceipts,
    dispenseLog: mockDispenseLog
  };
}

export function getMockBulkInventory() {
  return mockBulkInventory;
}

export function getMockResidentInventory(residentId) {
  if (residentId) {
    return mockResidentInventory.filter(item => item.residentId === residentId);
  }
  return mockResidentInventory;
}

export function getMockTransfers(residentId) {
  if (residentId) {
    return mockTransfers.filter(t => t.residentId === residentId);
  }
  return mockTransfers;
}

export function getMockReceipts(residentId) {
  if (residentId) {
    return mockReceipts.filter(r => r.residentId === residentId);
  }
  return mockReceipts;
}

// Supplier name lookup for XML import (avoids importing supplierHelpers which uses localStorage)
const SUPPLIER_NAMES = {
  'SUP-RECIPE-PLUS': 'Recipe Plus',
  'SUP-SUPPLIER-2': 'Piegādātājs 2'
};

// XML Import simulator data
export function generateXmlImportData(supplierId = 'SUP-RECIPE-PLUS') {
  const medications = [
    { name: 'Bisoprolol Actavis 5 mg tabletes', ingredient: 'Bisoprololum', form: 'tabletes', unit: 'tabletes', cost: 0.06 },
    { name: 'Amlodipine Teva 5 mg tabletes', ingredient: 'Amlodipinum', form: 'tabletes', unit: 'tabletes', cost: 0.04 },
    { name: 'Furosemid Polpharma 40 mg tabletes', ingredient: 'Furosemidum', form: 'tabletes', unit: 'tabletes', cost: 0.05 },
    { name: 'Pantoprazole Actavis 40 mg tabletes', ingredient: 'Pantoprazolum', form: 'tabletes', unit: 'tabletes', cost: 0.08 },
    { name: 'Xarelto 20 mg tabletes', ingredient: 'Rivaroxabanum', form: 'tabletes', unit: 'tabletes', cost: 2.50 }
  ];

  const randomMed = medications[Math.floor(Math.random() * medications.length)];
  const batchNum = `XML${Date.now().toString(36).toUpperCase()}`;

  return {
    medicationName: randomMed.name,
    activeIngredient: randomMed.ingredient,
    form: randomMed.form,
    batchNumber: batchNum,
    expirationDate: getDateNMonthsAhead(Math.floor(Math.random() * 24) + 6),
    quantity: Math.floor(Math.random() * 200) + 50,
    unit: randomMed.unit,
    unitCost: randomMed.cost,
    supplierId,
    supplierName: SUPPLIER_NAMES[supplierId] || supplierId
  };
}
