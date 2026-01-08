/**
 * Common Medications Catalog
 * Predefined medications commonly used in Latvian care homes
 * Data based on Latvijas Zāļu reģistrs (data.gov.lv)
 */

export const MEDICATION_CATALOG = [
  // Kardiovaskulārie
  {
    id: 'bisoprolol-5',
    name: 'Bisoprolol Actavis 5 mg',
    activeIngredient: 'Bisoprololum',
    form: 'tabletes',
    defaultDose: '5',
    defaultUnit: 'mg',
    atcCode: 'C07AB07',
    category: 'Kardiovaskulārie'
  },
  {
    id: 'amlodipine-5',
    name: 'Amlodipine Teva 5 mg',
    activeIngredient: 'Amlodipinum',
    form: 'tabletes',
    defaultDose: '5',
    defaultUnit: 'mg',
    atcCode: 'C08CA01',
    category: 'Kardiovaskulārie'
  },
  {
    id: 'ramipril-5',
    name: 'Ramipril Actavis 5 mg',
    activeIngredient: 'Ramiprilum',
    form: 'tabletes',
    defaultDose: '5',
    defaultUnit: 'mg',
    atcCode: 'C09AA05',
    category: 'Kardiovaskulārie'
  },
  {
    id: 'furosemide-40',
    name: 'Furosemide Grindeks 40 mg',
    activeIngredient: 'Furosemidum',
    form: 'tabletes',
    defaultDose: '40',
    defaultUnit: 'mg',
    atcCode: 'C03CA01',
    category: 'Kardiovaskulārie'
  },
  {
    id: 'aspirin-100',
    name: 'Aspirin Cardio 100 mg',
    activeIngredient: 'Acidum acetylsalicylicum',
    form: 'tabletes',
    defaultDose: '100',
    defaultUnit: 'mg',
    atcCode: 'B01AC06',
    category: 'Kardiovaskulārie'
  },

  // Diabēts
  {
    id: 'metformin-500',
    name: 'Metformin Actavis 500 mg',
    activeIngredient: 'Metforminum',
    form: 'tabletes',
    defaultDose: '500',
    defaultUnit: 'mg',
    atcCode: 'A10BA02',
    category: 'Diabēts'
  },
  {
    id: 'gliclazide-30',
    name: 'Gliclada 30 mg',
    activeIngredient: 'Gliclazidum',
    form: 'tabletes',
    defaultDose: '30',
    defaultUnit: 'mg',
    atcCode: 'A10BB09',
    category: 'Diabēts'
  },

  // Vairogdziedzeris
  {
    id: 'lthyroxin-50',
    name: 'L-Thyroxin Berlin-Chemie 50 mcg',
    activeIngredient: 'Levothyroxinum natricum',
    form: 'tabletes',
    defaultDose: '50',
    defaultUnit: 'mcg',
    atcCode: 'H03AA01',
    category: 'Vairogdziedzeris'
  },
  {
    id: 'lthyroxin-100',
    name: 'L-Thyroxin Berlin-Chemie 100 mcg',
    activeIngredient: 'Levothyroxinum natricum',
    form: 'tabletes',
    defaultDose: '100',
    defaultUnit: 'mcg',
    atcCode: 'H03AA01',
    category: 'Vairogdziedzeris'
  },

  // Psihotropie
  {
    id: 'sertraline-50',
    name: 'Sertraline Krka 50 mg',
    activeIngredient: 'Sertralinum',
    form: 'tabletes',
    defaultDose: '50',
    defaultUnit: 'mg',
    atcCode: 'N06AB06',
    category: 'Psihotropie'
  },
  {
    id: 'mirtazapine-15',
    name: 'Mirtazapine Actavis 15 mg',
    activeIngredient: 'Mirtazapinum',
    form: 'tabletes',
    defaultDose: '15',
    defaultUnit: 'mg',
    atcCode: 'N06AX11',
    category: 'Psihotropie'
  },
  {
    id: 'quetiapine-25',
    name: 'Quetiapine Teva 25 mg',
    activeIngredient: 'Quetiapinum',
    form: 'tabletes',
    defaultDose: '25',
    defaultUnit: 'mg',
    atcCode: 'N05AH04',
    category: 'Psihotropie'
  },

  // Sāpju mazināšana
  {
    id: 'paracetamol-500',
    name: 'Paracetamol Grindeks 500 mg',
    activeIngredient: 'Paracetamolum',
    form: 'tabletes',
    defaultDose: '500',
    defaultUnit: 'mg',
    atcCode: 'N02BE01',
    category: 'Pretsāpju'
  },
  {
    id: 'tramadol-50',
    name: 'Tramadol Stada 50 mg',
    activeIngredient: 'Tramadolum',
    form: 'kapsulas',
    defaultDose: '50',
    defaultUnit: 'mg',
    atcCode: 'N02AX02',
    category: 'Pretsāpju'
  },

  // GI trakts
  {
    id: 'omeprazole-20',
    name: 'Omeprazole Actavis 20 mg',
    activeIngredient: 'Omeprazolum',
    form: 'kapsulas',
    defaultDose: '20',
    defaultUnit: 'mg',
    atcCode: 'A02BC01',
    category: 'GI trakts'
  },
  {
    id: 'pantoprazole-40',
    name: 'Pantoprazole Krka 40 mg',
    activeIngredient: 'Pantoprazolum',
    form: 'tabletes',
    defaultDose: '40',
    defaultUnit: 'mg',
    atcCode: 'A02BC02',
    category: 'GI trakts'
  },
  {
    id: 'lactulose',
    name: 'Duphalac 667 mg/ml',
    activeIngredient: 'Lactulosum',
    form: 'skidrums',
    defaultDose: '15',
    defaultUnit: 'ml',
    atcCode: 'A06AD11',
    category: 'GI trakts'
  },

  // Vitamīni / minerālvielas
  {
    id: 'vitamin-d3',
    name: 'Vigantol 1000 SV',
    activeIngredient: 'Colecalciferolum',
    form: 'pilieni',
    defaultDose: '2',
    defaultUnit: 'drops',
    atcCode: 'A11CC05',
    category: 'Vitamīni'
  },
  {
    id: 'calcium-d3',
    name: 'Calcium-D3 Stada',
    activeIngredient: 'Calcii carbonas, Colecalciferolum',
    form: 'tabletes',
    defaultDose: '1',
    defaultUnit: 'tab',
    atcCode: 'A12AX',
    category: 'Vitamīni'
  },

  // Citi
  {
    id: 'allopurinol-100',
    name: 'Allopurinol Grindeks 100 mg',
    activeIngredient: 'Allopurinolum',
    form: 'tabletes',
    defaultDose: '100',
    defaultUnit: 'mg',
    atcCode: 'M04AA01',
    category: 'Citi'
  }
];

// Get medications grouped by category
export const getMedicationsByCategory = () => {
  const grouped = {};
  MEDICATION_CATALOG.forEach(med => {
    if (!grouped[med.category]) {
      grouped[med.category] = [];
    }
    grouped[med.category].push(med);
  });
  return grouped;
};

// Find medication by ID
export const getMedicationById = (id) => {
  return MEDICATION_CATALOG.find(m => m.id === id) || null;
};

// Search medications by name or ingredient
export const searchMedications = (query) => {
  const lowerQuery = query.toLowerCase();
  return MEDICATION_CATALOG.filter(m =>
    m.name.toLowerCase().includes(lowerQuery) ||
    m.activeIngredient.toLowerCase().includes(lowerQuery)
  );
};
