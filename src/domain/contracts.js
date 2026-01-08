/**
 * Contract domain helpers
 * Handles contract data model, numbering, and status management
 */

// Contract status values
export const CONTRACT_STATUS = {
  DRAFT: 'melnraksts',
  ACTIVE: 'aktīvs',
  COMPLETED: 'pabeigts',
  CANCELLED: 'anulēts'
};

// Contract status labels in Latvian
export const CONTRACT_STATUS_LABELS = {
  [CONTRACT_STATUS.DRAFT]: 'Melnraksts',
  [CONTRACT_STATUS.ACTIVE]: 'Aktīvs',
  [CONTRACT_STATUS.COMPLETED]: 'Pabeigts',
  [CONTRACT_STATUS.CANCELLED]: 'Anulēts'
};

// Appendix types
export const APPENDIX_TYPES = {
  SERVICE_DESCRIPTION: 'pakalpojumu_apraksts',
  INTERNAL_RULES: 'iekšējie_noteikumi',
  CARE_LEVEL: 'aprūpes_līmenis',
  PRICE_CHANGE: 'cenu_maiņa',
  OTHER: 'cits'
};

// Starting contract numbers per residence
const CONTRACT_START_NUMBERS = {
  melodija: 2988,
  sampeteris: 0
};

/**
 * Generate next contract number based on residence and year
 * Format: AM-####/YYYY for Melodija, AŠ-####/YYYY for Šampēteris
 * @param {string} residence - 'melodija' or 'sampeteris'
 * @param {number} year - Contract year
 * @param {Array} existingContracts - All existing contracts
 * @returns {string} Generated contract number
 */
export const generateContractNumber = (residence, year, existingContracts = []) => {
  const prefix = residence === 'melodija' ? 'AM' : 'AŠ';
  const startNumber = CONTRACT_START_NUMBERS[residence] || 0;

  // Filter contracts for this residence and year
  const existingForResidence = existingContracts.filter(c => {
    if (!c.contractNumber) return false;
    return c.contractNumber.startsWith(prefix) && c.contractNumber.includes(`/${year}`);
  });

  if (existingForResidence.length === 0) {
    return `${prefix}-${String(startNumber).padStart(4, '0')}/${year}`;
  }

  // Find highest number
  const maxNumber = Math.max(...existingForResidence.map(c => {
    const match = c.contractNumber.match(/-(\d+)\//);
    return match ? parseInt(match[1], 10) : startNumber - 1;
  }));

  return `${prefix}-${String(maxNumber + 1).padStart(4, '0')}/${year}`;
};

/**
 * Validate contract number format
 * @param {string} contractNumber - Contract number to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateContractNumber = (contractNumber) => {
  if (!contractNumber) {
    return { valid: false, error: 'Līguma numurs ir obligāts' };
  }

  // Pattern: AM-####/YYYY or AŠ-####/YYYY
  const pattern = /^(AM|AŠ)-\d{4}\/\d{4}$/;
  if (!pattern.test(contractNumber)) {
    return { valid: false, error: 'Nepareizs formāts. Izmantojiet: AM-####/GGGG vai AŠ-####/GGGG' };
  }

  return { valid: true };
};

/**
 * Generate appendix number for a contract
 * Format: {CONTRACT_NUMBER}-{SEQ}/{YEAR}
 * @param {string} contractNumber - Base contract number
 * @param {number} appendixIndex - Appendix sequence number (1-based)
 * @returns {string} Appendix number
 */
export const generateAppendixNumber = (contractNumber, appendixIndex) => {
  // Extract parts from contract number (e.g., "AM-2988/2026")
  const match = contractNumber.match(/^(.+)\/(\d{4})$/);
  if (!match) return `${contractNumber}-${appendixIndex}`;

  const [, basePart, year] = match;
  return `${basePart}-${appendixIndex}/${year}`;
};

/**
 * Generate unique contract ID
 * @returns {string} Contract ID in format C-YYYY-XXXXX
 */
export const generateContractId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `C-${year}-${random}`;
};

/**
 * Create a new draft contract
 * @param {Object} params - Contract parameters
 * @returns {Object} Draft contract object
 */
export const createDraftContract = ({
  residence = 'melodija',
  residentId = null,
  clientId = null,
  residentIsClient = false,
  startDate = null,
  endDate = null,
  noEndDate = true,
  roomId = null,
  careLevel = null,
  roomType = null,
  notes = ''
} = {}) => {
  const now = new Date().toISOString();

  return {
    id: generateContractId(),
    contractNumber: null, // Generated when saving
    status: CONTRACT_STATUS.DRAFT,

    // Parties
    residentId,
    clientId,
    residentIsClient,

    // Dates
    startDate,
    endDate,
    noEndDate,

    // Product & Pricing (calculated later)
    productCode: null,
    dailyRate: null,
    discountPercent: 0,
    dailyRateWithDiscount: null,

    // Room
    roomId,
    residence,
    roomType,

    // Care
    careLevel,
    termType: null, // Calculated from dates

    // Meta
    notes,
    createdAt: now,
    createdBy: 'admin',
    activatedAt: null,

    // Appendixes (generated on activation)
    appendixes: [],

    // Amendments
    amendments: []
  };
};

/**
 * Determine term type from contract dates
 * Long-term (ilgtermiņa): >3 months or no end date
 * Short-term (īstermiņa): ≤3 months
 * @param {string} startDate - Start date ISO string
 * @param {string} endDate - End date ISO string
 * @param {boolean} noEndDate - Whether contract has no end date
 * @returns {string} 'ilgtermiņa' or 'īstermiņa'
 */
export const getTermType = (startDate, endDate, noEndDate) => {
  if (noEndDate || !endDate) return 'ilgtermiņa';

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);

  return diffMonths > 3 ? 'ilgtermiņa' : 'īstermiņa';
};

/**
 * Calculate price with discount
 * @param {number} dailyRate - Base daily rate
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discounted daily rate
 */
export const calculateDiscountedPrice = (dailyRate, discountPercent = 0) => {
  if (!dailyRate || dailyRate <= 0) return null;
  const discount = Math.max(0, Math.min(100, discountPercent));
  return Number((dailyRate * (1 - discount / 100)).toFixed(2));
};

/**
 * Generate standard appendixes for a contract based on residence
 * Melodija: 2 appendixes (Services + Rules)
 * Šampēteris: 3 appendixes (Services + Rules + Care Level)
 * @param {string} contractNumber - Contract number
 * @param {string} residence - Residence type
 * @returns {Array} Array of appendix objects
 */
export const generateStandardAppendixes = (contractNumber, residence) => {
  const appendixes = [
    {
      id: 1,
      type: APPENDIX_TYPES.SERVICE_DESCRIPTION,
      number: generateAppendixNumber(contractNumber, 1),
      name: 'Pakalpojumu apraksts'
    },
    {
      id: 2,
      type: APPENDIX_TYPES.INTERNAL_RULES,
      number: generateAppendixNumber(contractNumber, 2),
      name: 'Iekšējie noteikumi'
    }
  ];

  // Šampēteris has additional Care Level appendix
  if (residence === 'sampeteris') {
    appendixes.push({
      id: 3,
      type: APPENDIX_TYPES.CARE_LEVEL,
      number: generateAppendixNumber(contractNumber, 3),
      name: 'Aprūpes līmeņa aprēķins'
    });
  }

  return appendixes;
};

/**
 * Activate a draft contract
 * - Generates contract number if not set
 * - Sets status to active
 * - Generates standard appendixes
 * @param {Object} contract - Draft contract
 * @param {Array} existingContracts - All existing contracts (for number generation)
 * @returns {Object} Activated contract
 */
export const activateContract = (contract, existingContracts = []) => {
  const year = new Date().getFullYear();
  const contractNumber = contract.contractNumber ||
    generateContractNumber(contract.residence, year, existingContracts);

  const appendixes = generateStandardAppendixes(contractNumber, contract.residence);

  return {
    ...contract,
    contractNumber,
    status: CONTRACT_STATUS.ACTIVE,
    activatedAt: new Date().toISOString(),
    appendixes
  };
};

/**
 * Validate contract for activation
 * @param {Object} contract - Contract to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateContractForActivation = (contract) => {
  const errors = [];

  if (!contract.startDate) {
    errors.push('Sākuma datums ir obligāts');
  }

  if (!contract.noEndDate && !contract.endDate) {
    errors.push('Beigu datums ir obligāts (vai atzīmējiet "Nav beigu datuma")');
  }

  // Check for resident name (residentId is assigned later in bed booking)
  if (!contract.residentName && !contract.residentId) {
    errors.push('Rezidents ir obligāts');
  }

  // Check for room type (roomId is assigned later in bed booking)
  if (!contract.roomType && !contract.roomId) {
    errors.push('Istabas tips ir obligāts');
  }

  if (!contract.dailyRate || contract.dailyRate <= 0) {
    errors.push('Dienas cena nav aprēķināta');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Format contract number for display
 * @param {string} contractNumber - Raw contract number
 * @returns {string} Formatted contract number
 */
export const formatContractNumber = (contractNumber) => {
  return contractNumber || '—';
};

/**
 * Get residence code from contract number
 * @param {string} contractNumber - Contract number
 * @returns {string} 'melodija' or 'sampeteris'
 */
export const getResidenceFromContractNumber = (contractNumber) => {
  if (!contractNumber) return null;
  return contractNumber.startsWith('AM') ? 'melodija' : 'sampeteris';
};
