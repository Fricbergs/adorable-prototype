/**
 * Quarterly Nurse Data Helpers
 * Functions for quarterly measurements (weight, BMI) and data management
 * Per 2026-01-12: Weight is recorded once per quarter by nurse
 */

const QUARTERLY_STORAGE_KEY = 'adorable-quarterly-nurse-data';

/**
 * Calculate BMI from weight and height
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number|null} BMI value rounded to 1 decimal place
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return null;
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
}

/**
 * Get BMI category based on WHO classification
 * @param {number} bmi - BMI value
 * @returns {Object} Category with label and color
 */
export function getBMICategory(bmi) {
  if (!bmi || bmi <= 0) {
    return { value: 'unknown', label: 'Nav datu', color: 'gray' };
  }

  if (bmi < 18.5) {
    return { value: 'underweight', label: 'Nepietiekams svars', color: 'yellow' };
  } else if (bmi < 25) {
    return { value: 'normal', label: 'Normāls svars', color: 'green' };
  } else if (bmi < 30) {
    return { value: 'overweight', label: 'Liekais svars', color: 'orange' };
  } else {
    return { value: 'obese', label: 'Aptaukošanās', color: 'red' };
  }
}

/**
 * Get current quarter (1-4) from date
 * @param {Date} date - Date to get quarter from
 * @returns {number} Quarter number (1-4)
 */
export function getQuarter(date = new Date()) {
  return Math.ceil((date.getMonth() + 1) / 3);
}

/**
 * Get quarter label in Latvian
 * @param {number} quarter - Quarter number (1-4)
 * @param {number} year - Year
 * @returns {string} Quarter label
 */
export function getQuarterLabel(quarter, year) {
  const quarterLabels = {
    1: 'Q1 (Jan-Mar)',
    2: 'Q2 (Apr-Jūn)',
    3: 'Q3 (Jūl-Sep)',
    4: 'Q4 (Okt-Dec)'
  };
  return `${quarterLabels[quarter]} ${year}`;
}

/**
 * Get all quarterly data from storage
 * @returns {Array} All quarterly data records
 */
function getQuarterlyDataFromStorage() {
  const stored = localStorage.getItem(QUARTERLY_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save quarterly data to storage
 * @param {Array} data - Data array to save
 */
function saveQuarterlyDataToStorage(data) {
  localStorage.setItem(QUARTERLY_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Record quarterly nurse data for a resident
 * @param {string} residentId - Resident ID
 * @param {Object} data - Quarterly data { weight, height, bmi, notes }
 * @returns {Object} Created record
 */
export function recordQuarterlyData(residentId, data) {
  const now = new Date();
  const quarter = getQuarter(now);
  const year = now.getFullYear();

  const record = {
    id: `QND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    residentId,
    quarter,
    year,
    weight: data.weight || null,
    height: data.height || null,
    bmi: data.weight && data.height ? calculateBMI(data.weight, data.height) : null,
    notes: data.notes || '',
    measuredBy: data.measuredBy || 'Māsa',
    measuredAt: now.toISOString(),
    createdAt: now.toISOString()
  };

  const allData = getQuarterlyDataFromStorage();
  allData.push(record);
  saveQuarterlyDataToStorage(allData);

  return record;
}

/**
 * Get quarterly data history for a resident
 * @param {string} residentId - Resident ID
 * @param {number} limit - Maximum number of records to return
 * @returns {Array} Quarterly data records sorted by date (newest first)
 */
export function getQuarterlyHistory(residentId, limit = 8) {
  const allData = getQuarterlyDataFromStorage();
  return allData
    .filter(record => record.residentId === residentId)
    .sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt))
    .slice(0, limit);
}

/**
 * Get the latest quarterly data for a resident
 * @param {string} residentId - Resident ID
 * @returns {Object|null} Latest quarterly data or null
 */
export function getLatestQuarterlyData(residentId) {
  const history = getQuarterlyHistory(residentId, 1);
  return history.length > 0 ? history[0] : null;
}

/**
 * Check if quarterly data has been recorded for current quarter
 * @param {string} residentId - Resident ID
 * @returns {boolean} True if current quarter data exists
 */
export function hasCurrentQuarterData(residentId) {
  const now = new Date();
  const currentQuarter = getQuarter(now);
  const currentYear = now.getFullYear();

  const allData = getQuarterlyDataFromStorage();
  return allData.some(record =>
    record.residentId === residentId &&
    record.quarter === currentQuarter &&
    record.year === currentYear
  );
}

/**
 * Get weight trend for a resident (last 4 quarters)
 * @param {string} residentId - Resident ID
 * @returns {Array} Array of { quarter, year, weight, bmi } objects
 */
export function getWeightTrend(residentId) {
  const history = getQuarterlyHistory(residentId, 4);
  return history.map(record => ({
    quarter: record.quarter,
    year: record.year,
    label: getQuarterLabel(record.quarter, record.year),
    weight: record.weight,
    bmi: record.bmi,
    measuredAt: record.measuredAt
  })).reverse(); // Oldest first for charting
}
