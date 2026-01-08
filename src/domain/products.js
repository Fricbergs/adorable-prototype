/**
 * Product pricing domain helpers
 * Handles product catalog, pricing lookup, and product selection
 */

// Care levels (1-4 as per Latvian MK regulations Nr. 138)
export const CARE_LEVELS = ['1', '2', '3', '4'];

// Care level labels
export const CARE_LEVEL_LABELS = {
  '1': '1. līmenis - Minimāla atkarība',
  '2': '2. līmenis - Zema atkarība',
  '3': '3. līmenis - Vidēja atkarība',
  '4': '4. līmenis - Augsta atkarība'
};

// Room types
export const ROOM_TYPES = {
  SINGLE: '1-vietīga',
  DOUBLE: '2-vietīga'
};

// Term types
export const TERM_TYPES = {
  LONG: 'ilgtermiņa',
  SHORT: 'īstermiņa'
};

// Residence types
export const RESIDENCES = {
  MELODIJA: 'melodija',
  SAMPETERIS: 'sampeteris'
};

// Latvian labels for display
export const RESIDENCE_LABELS = {
  [RESIDENCES.MELODIJA]: 'Adoro Melodija',
  [RESIDENCES.SAMPETERIS]: 'Adoro Šampēteris'
};

export const ROOM_TYPE_LABELS = {
  [ROOM_TYPES.SINGLE]: '1-vietīga istaba',
  [ROOM_TYPES.DOUBLE]: '2-vietīga istaba'
};

export const TERM_TYPE_LABELS = {
  [TERM_TYPES.LONG]: 'Ilgtermiņa (>3 mēneši)',
  [TERM_TYPES.SHORT]: 'Īstermiņa (≤3 mēneši)'
};

/**
 * Default product catalog with pricing
 * Format: {RESIDENCE}-{CARE_LEVEL}-{ROOM_CODE}-{TERM_CODE}
 * Room codes: 1V = single, 2V = double
 * Term codes: ILG = long-term, IST = short-term
 * Care levels: 1-4 (per Latvian MK regulations Nr. 138)
 * Prices from: Cenrādis 2026 Adorable.xlsx
 */
export const DEFAULT_PRODUCTS = [
  // ==========================================
  // Adoro Melodija - Long-term (Ilglaicīga)
  // ==========================================
  // Double rooms (Divvietīga)
  { code: 'AM-1-2V-ILG', residence: 'melodija', careLevel: '1', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 48.00 },
  { code: 'AM-2-2V-ILG', residence: 'melodija', careLevel: '2', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 51.00 },
  { code: 'AM-3-2V-ILG', residence: 'melodija', careLevel: '3', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 58.00 },
  { code: 'AM-4-2V-ILG', residence: 'melodija', careLevel: '4', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 63.00 },
  // Single rooms (Vienvietīga)
  { code: 'AM-1-1V-ILG', residence: 'melodija', careLevel: '1', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 65.00 },
  { code: 'AM-2-1V-ILG', residence: 'melodija', careLevel: '2', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 70.00 },
  { code: 'AM-3-1V-ILG', residence: 'melodija', careLevel: '3', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 77.00 },
  { code: 'AM-4-1V-ILG', residence: 'melodija', careLevel: '4', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 87.00 },

  // ==========================================
  // Adoro Melodija - Short-term (Īslaicīga)
  // ==========================================
  // Double rooms (Divvietīga)
  { code: 'AM-1-2V-IST', residence: 'melodija', careLevel: '1', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 51.00 },
  { code: 'AM-2-2V-IST', residence: 'melodija', careLevel: '2', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 55.00 },
  { code: 'AM-3-2V-IST', residence: 'melodija', careLevel: '3', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 63.00 },
  { code: 'AM-4-2V-IST', residence: 'melodija', careLevel: '4', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 67.00 },
  // Single rooms (Vienvietīga)
  { code: 'AM-1-1V-IST', residence: 'melodija', careLevel: '1', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 69.00 },
  { code: 'AM-2-1V-IST', residence: 'melodija', careLevel: '2', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 74.00 },
  { code: 'AM-3-1V-IST', residence: 'melodija', careLevel: '3', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 82.00 },
  { code: 'AM-4-1V-IST', residence: 'melodija', careLevel: '4', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 95.00 },

  // ==========================================
  // Adoro Šampēteris - Long-term (Ilglaicīga)
  // ==========================================
  // Double rooms (Divvietīga)
  { code: 'AŠ-1-2V-ILG', residence: 'sampeteris', careLevel: '1', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 51.00 },
  { code: 'AŠ-2-2V-ILG', residence: 'sampeteris', careLevel: '2', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 55.00 },
  { code: 'AŠ-3-2V-ILG', residence: 'sampeteris', careLevel: '3', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 62.00 },
  { code: 'AŠ-4-2V-ILG', residence: 'sampeteris', careLevel: '4', roomType: '2-vietīga', termType: 'ilgtermiņa', dailyRate: 67.00 },
  // Single rooms (Vienvietīga)
  { code: 'AŠ-1-1V-ILG', residence: 'sampeteris', careLevel: '1', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 69.00 },
  { code: 'AŠ-2-1V-ILG', residence: 'sampeteris', careLevel: '2', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 74.00 },
  { code: 'AŠ-3-1V-ILG', residence: 'sampeteris', careLevel: '3', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 82.00 },
  { code: 'AŠ-4-1V-ILG', residence: 'sampeteris', careLevel: '4', roomType: '1-vietīga', termType: 'ilgtermiņa', dailyRate: 94.00 },

  // ==========================================
  // Adoro Šampēteris - Short-term (Īslaicīga)
  // ==========================================
  // Double rooms (Divvietīga)
  { code: 'AŠ-1-2V-IST', residence: 'sampeteris', careLevel: '1', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 55.00 },
  { code: 'AŠ-2-2V-IST', residence: 'sampeteris', careLevel: '2', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 58.00 },
  { code: 'AŠ-3-2V-IST', residence: 'sampeteris', careLevel: '3', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 67.00 },
  { code: 'AŠ-4-2V-IST', residence: 'sampeteris', careLevel: '4', roomType: '2-vietīga', termType: 'īstermiņa', dailyRate: 71.00 },
  // Single rooms (Vienvietīga)
  { code: 'AŠ-1-1V-IST', residence: 'sampeteris', careLevel: '1', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 73.00 },
  { code: 'AŠ-2-1V-IST', residence: 'sampeteris', careLevel: '2', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 80.00 },
  { code: 'AŠ-3-1V-IST', residence: 'sampeteris', careLevel: '3', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 88.00 },
  { code: 'AŠ-4-1V-IST', residence: 'sampeteris', careLevel: '4', roomType: '1-vietīga', termType: 'īstermiņa', dailyRate: 101.00 }
].map((p, idx) => ({
  ...p,
  id: `P-${String(idx + 1).padStart(3, '0')}`,
  name: generateProductName(p),
  active: true,
  validFrom: '2026-01-01',
  validTo: null
}));

/**
 * Generate human-readable product name
 * @param {Object} product - Product with residence, careLevel, roomType, termType
 * @returns {string} Product name
 */
export function generateProductName(product) {
  const residence = product.residence === 'melodija' ? 'Melodija' : 'Šampēteris';
  const room = product.roomType === '1-vietīga' ? 'vienviet.' : 'divviet.';
  const term = product.termType === 'ilgtermiņa' ? 'ilgt.' : 'īst.';
  return `${residence} ${product.careLevel} ${room} ${term}`;
}

/**
 * Find product by combination of parameters
 * @param {string} careLevel - GIR1-GIR6
 * @param {string} roomType - '1-vietīga' or '2-vietīga'
 * @param {string} residence - 'melodija' or 'sampeteris'
 * @param {string} termType - 'ilgtermiņa' or 'īstermiņa'
 * @param {Array} products - Product catalog (defaults to DEFAULT_PRODUCTS)
 * @returns {Object|null} Matching product or null
 */
export const findProduct = (careLevel, roomType, residence, termType, products = DEFAULT_PRODUCTS) => {
  return products.find(p =>
    p.careLevel === careLevel &&
    p.roomType === roomType &&
    p.residence === residence &&
    p.termType === termType &&
    p.active !== false
  ) || null;
};

/**
 * Find product by code
 * @param {string} code - Product code
 * @param {Array} products - Product catalog
 * @returns {Object|null} Matching product or null
 */
export const findProductByCode = (code, products = DEFAULT_PRODUCTS) => {
  return products.find(p => p.code === code) || null;
};

/**
 * Get all products for a specific residence
 * @param {string} residence - 'melodija' or 'sampeteris'
 * @param {Array} products - Product catalog
 * @returns {Array} Filtered products
 */
export const getProductsByResidence = (residence, products = DEFAULT_PRODUCTS) => {
  return products.filter(p => p.residence === residence && p.active !== false);
};

/**
 * Get daily rate for contract parameters
 * @param {Object} params - Contract parameters
 * @param {string} params.careLevel - GIR1-GIR6
 * @param {string} params.roomType - Room type
 * @param {string} params.residence - Residence
 * @param {string} params.termType - Term type
 * @param {Array} products - Product catalog
 * @returns {number|null} Daily rate or null if product not found
 */
export const getDailyRate = ({ careLevel, roomType, residence, termType }, products = DEFAULT_PRODUCTS) => {
  const product = findProduct(careLevel, roomType, residence, termType, products);
  return product?.dailyRate || null;
};

/**
 * Calculate monthly estimate from daily rate
 * @param {number} dailyRate - Daily rate in EUR
 * @param {number} daysInMonth - Days in month (default 30)
 * @returns {number} Monthly estimate
 */
export const calculateMonthlyEstimate = (dailyRate, daysInMonth = 30) => {
  if (!dailyRate || dailyRate <= 0) return 0;
  return Number((dailyRate * daysInMonth).toFixed(2));
};

/**
 * Format price for display
 * @param {number} price - Price value
 * @param {string} unit - Unit to append (default 'EUR')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, unit = 'EUR') => {
  if (price === null || price === undefined) return '—';
  return `${price.toFixed(2)} ${unit}`;
};

/**
 * Format daily rate for contract display
 * @param {number} dailyRate - Daily rate
 * @returns {string} Formatted string like "65.00 EUR / diennakts"
 */
export const formatDailyRate = (dailyRate) => {
  if (!dailyRate) return '—';
  return `${dailyRate.toFixed(2)} EUR / diennakts`;
};

/**
 * Get care level number from string
 * @param {string} careLevel - e.g., '3' or 'GIR3' (legacy)
 * @returns {number} Care level number (1-4)
 */
export const getCareLevelNumber = (careLevel) => {
  if (!careLevel) return null;
  // Handle direct number format
  if (/^[1-4]$/.test(String(careLevel))) {
    return parseInt(careLevel, 10);
  }
  // Handle legacy GIR format
  const match = String(careLevel).match(/GIR(\d)/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Normalize care level to string format '1'-'4'
 * For compatibility with existing consultation data (which stores as numbers or 'GIR' format)
 * @param {string|number} careLevel - Care level in any format: 1, '1', 'GIR1'
 * @returns {string} Normalized care level '1'-'4' or null
 */
export const normalizeCareLevel = (careLevel) => {
  if (!careLevel) return null;
  const num = getCareLevelNumber(careLevel);
  return num && num >= 1 && num <= 4 ? String(num) : null;
};

/**
 * @deprecated Use normalizeCareLevel instead
 * Map legacy care level (1-4) to current format
 * @param {string|number} legacyCareLevel - Care level '1', '2', '3', '4'
 * @returns {string} Care level
 */
export const mapLegacyCareLevel = (legacyCareLevel) => {
  return normalizeCareLevel(legacyCareLevel);
};

/**
 * Map legacy room type to new format
 * @param {string} legacyRoomType - 'single', 'double', 'triple'
 * @returns {string} New room type format
 */
export const mapLegacyRoomType = (legacyRoomType) => {
  const mapping = {
    'single': '1-vietīga',
    'double': '2-vietīga',
    'triple': '2-vietīga' // Map triple to double for now
  };
  return mapping[legacyRoomType] || null;
};

/**
 * Map legacy duration to term type
 * @param {string} legacyDuration - 'long' or 'short'
 * @returns {string} Term type
 */
export const mapLegacyDuration = (legacyDuration) => {
  const mapping = {
    'long': 'ilgtermiņa',
    'short': 'īstermiņa'
  };
  return mapping[legacyDuration] || 'ilgtermiņa';
};
