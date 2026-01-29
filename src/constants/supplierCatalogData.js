/**
 * Per-supplier product catalog data (mock/seed data)
 *
 * Each catalog entry represents a medication product a supplier offers.
 * This is reference data (what they sell), NOT transaction data (what we received).
 *
 * Fields:
 *   sku             - Supplier-specific product code
 *   medicationName  - Brand name + strength + form (Latvian)
 *   activeIngredient - INN name (Latin)
 *   form            - Dosage form (tabletes, kapsulas, injekcijas, pilieni, etc.)
 *   unit            - Dispensing unit
 *   unitCost        - EUR per unit
 *   availability    - 'available' | 'limited' | 'unavailable'
 */

// ============================================
// RECIPE PLUS CATALOG (XML supplier)
// ============================================

export const RECIPE_PLUS_CATALOG = [
  // -- Already in mockBulkInventory --
  { sku: 'RP-001', medicationName: 'L-Thyroxin Berlin-Chemie 50 mikrogramu tabletes', activeIngredient: 'Levothyroxinum natricum', form: 'tabletes', unit: 'tabletes', unitCost: 0.08, availability: 'available' },
  { sku: 'RP-002', medicationName: 'Somnols 7,5 mg apvalkotās tabletes', activeIngredient: 'Zopiclonum', form: 'tabletes', unit: 'tabletes', unitCost: 0.15, availability: 'available' },
  { sku: 'RP-003', medicationName: 'Nateo D3 vit.cap 4000 SV', activeIngredient: 'Cholecalciferolum', form: 'kapsulas', unit: 'kapsulas', unitCost: 0.12, availability: 'available' },
  { sku: 'RP-004', medicationName: 'Verospiron 25 mg tabletes', activeIngredient: 'Spironolactonum', form: 'tabletes', unit: 'tabletes', unitCost: 0.10, availability: 'available' },
  { sku: 'RP-005', medicationName: 'NovoMix 30 FlexPen', activeIngredient: 'Insulinum aspartum', form: 'injekcijas', unit: 'pildspalvas', unitCost: 25.00, availability: 'limited' },
  { sku: 'RP-006', medicationName: 'Paracetamol Accord 500 mg tabletes', activeIngredient: 'Paracetamolum', form: 'tabletes', unit: 'tabletes', unitCost: 0.03, availability: 'available' },
  { sku: 'RP-007', medicationName: 'Torasemid HEXAL 50 mg tabletes', activeIngredient: 'Torasemidum', form: 'tabletes', unit: 'tabletes', unitCost: 0.18, availability: 'available' },
  { sku: 'RP-008', medicationName: 'Regulax Picosulphate 7,23 mg/ml pilieni', activeIngredient: 'Natrii picosulfas', form: 'pilieni', unit: 'pudeles', unitCost: 4.50, availability: 'available' },
  { sku: 'RP-009', medicationName: 'Olanzapine Accord 5 mg apvalkotās tabletes', activeIngredient: 'Olanzapinum', form: 'tabletes', unit: 'tabletes', unitCost: 0.22, availability: 'available' },
  { sku: 'RP-010', medicationName: 'Metformin Accord 500 mg tabletes', activeIngredient: 'Metforminum', form: 'tabletes', unit: 'tabletes', unitCost: 0.05, availability: 'available' },
  { sku: 'RP-011', medicationName: 'Lisinopril Actavis 10 mg tabletes', activeIngredient: 'Lisinoprilum', form: 'tabletes', unit: 'tabletes', unitCost: 0.07, availability: 'available' },
  { sku: 'RP-012', medicationName: 'Atorvastatin Teva 20 mg tabletes', activeIngredient: 'Atorvastatinum', form: 'tabletes', unit: 'tabletes', unitCost: 0.09, availability: 'available' },
  { sku: 'RP-013', medicationName: 'Aspirin Cardio 100 mg tabletes', activeIngredient: 'Acidum acetylsalicylicum', form: 'tabletes', unit: 'tabletes', unitCost: 0.04, availability: 'available' },
  { sku: 'RP-014', medicationName: 'Omeprazole Actavis 20 mg kapsulas', activeIngredient: 'Omeprazolum', form: 'kapsulas', unit: 'kapsulas', unitCost: 0.11, availability: 'available' },
  // -- From generateXmlImportData --
  { sku: 'RP-015', medicationName: 'Bisoprolol Actavis 5 mg tabletes', activeIngredient: 'Bisoprololum', form: 'tabletes', unit: 'tabletes', unitCost: 0.06, availability: 'available' },
  { sku: 'RP-016', medicationName: 'Amlodipine Teva 5 mg tabletes', activeIngredient: 'Amlodipinum', form: 'tabletes', unit: 'tabletes', unitCost: 0.04, availability: 'available' },
  { sku: 'RP-017', medicationName: 'Furosemid Polpharma 40 mg tabletes', activeIngredient: 'Furosemidum', form: 'tabletes', unit: 'tabletes', unitCost: 0.05, availability: 'available' },
  { sku: 'RP-018', medicationName: 'Pantoprazole Actavis 40 mg tabletes', activeIngredient: 'Pantoprazolum', form: 'tabletes', unit: 'tabletes', unitCost: 0.08, availability: 'available' },
  { sku: 'RP-019', medicationName: 'Xarelto 20 mg tabletes', activeIngredient: 'Rivaroxabanum', form: 'tabletes', unit: 'tabletes', unitCost: 2.50, availability: 'limited' },
];

// ============================================
// SUPPLIER 2 CATALOG (manual/paper invoice supplier)
// ============================================

export const SUPPLIER_2_CATALOG = [
  // -- Overlapping with Recipe Plus (same activeIngredient + form, different brand/price) --
  { sku: 'S2-001', medicationName: 'Metformin Sandoz 500 mg tabletes', activeIngredient: 'Metforminum', form: 'tabletes', unit: 'tabletes', unitCost: 0.04, availability: 'available' },
  { sku: 'S2-002', medicationName: 'Lisinopril Sandoz 10 mg tabletes', activeIngredient: 'Lisinoprilum', form: 'tabletes', unit: 'tabletes', unitCost: 0.06, availability: 'available' },
  { sku: 'S2-003', medicationName: 'Omeprazole Sandoz 20 mg kapsulas', activeIngredient: 'Omeprazolum', form: 'kapsulas', unit: 'kapsulas', unitCost: 0.09, availability: 'available' },
  { sku: 'S2-004', medicationName: 'Paracetamol Kabi 500 mg tabletes', activeIngredient: 'Paracetamolum', form: 'tabletes', unit: 'tabletes', unitCost: 0.02, availability: 'available' },
  { sku: 'S2-005', medicationName: 'Bisoprolol Sandoz 5 mg tabletes', activeIngredient: 'Bisoprololum', form: 'tabletes', unit: 'tabletes', unitCost: 0.05, availability: 'available' },
  // -- Unique to Supplier 2 --
  { sku: 'S2-006', medicationName: 'Diclofenac Teva 50 mg tabletes', activeIngredient: 'Diclofenacum natricum', form: 'tabletes', unit: 'tabletes', unitCost: 0.06, availability: 'available' },
  { sku: 'S2-007', medicationName: 'Amoxicillin Sandoz 500 mg kapsulas', activeIngredient: 'Amoxicillinum', form: 'kapsulas', unit: 'kapsulas', unitCost: 0.12, availability: 'available' },
  { sku: 'S2-008', medicationName: 'Wound Care Aquacel Ag+ 10x10 cm', activeIngredient: 'Hydrofiber/Ag', form: 'pārsējs', unit: 'gab.', unitCost: 3.80, availability: 'available' },
  { sku: 'S2-009', medicationName: 'Vitamīns B12 1000 mcg tabletes', activeIngredient: 'Cyanocobalaminum', form: 'tabletes', unit: 'tabletes', unitCost: 0.08, availability: 'available' },
  { sku: 'S2-010', medicationName: 'Magnija citrāts 200 mg tabletes', activeIngredient: 'Magnesii citras', form: 'tabletes', unit: 'tabletes', unitCost: 0.07, availability: 'available' },
  { sku: 'S2-011', medicationName: 'Ceftriaxone Sandoz 1 g pulveris inj.', activeIngredient: 'Ceftriaxonum', form: 'injekcijas', unit: 'flakoni', unitCost: 2.10, availability: 'limited' },
  { sku: 'S2-012', medicationName: 'Drotaverine Teva 40 mg tabletes', activeIngredient: 'Drotaverinum', form: 'tabletes', unit: 'tabletes', unitCost: 0.04, availability: 'available' },
];

// ============================================
// LOOKUP MAP (keyed by supplier ID)
// ============================================

export const SUPPLIER_CATALOGS = {
  'SUP-RECIPE-PLUS': RECIPE_PLUS_CATALOG,
  'SUP-SUPPLIER-2': SUPPLIER_2_CATALOG,
};
