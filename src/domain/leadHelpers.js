/**
 * Generate a unique lead ID
 * @returns {string} Lead ID in format L-YYYY-XXX
 */
export const generateLeadId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `L-${year}-${random}`;
};

/**
 * Generate a unique agreement number
 * @returns {string} Agreement number in format A-YYYY-XXX
 */
export const generateAgreementNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `A-${year}-${random}`;
};

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * @returns {string} Current date
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current time in Latvian format (HH:MM)
 * @returns {string} Current time
 */
export const getCurrentTime = () => {
  return new Date().toLocaleTimeString('lv-LV', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Create a new prospect from form data
 * @param {Object} leadData - Form data
 * @returns {Object} Prospect object with generated metadata
 */
export const createProspect = (leadData) => {
  return {
    id: generateLeadId(),
    ...leadData,
    status: 'prospect',
    createdDate: getCurrentDate(),
    createdTime: getCurrentTime(),
    source: 'manual',
    assignedTo: 'Kristens Blūms'
  };
};

/**
 * Upgrade prospect to lead with consultation data
 * Sets status to 'consultation' (consultation completed)
 * @param {Object} prospect - Existing prospect
 * @param {Object} consultation - Consultation data with price
 * @returns {Object} Lead object with consultation data
 */
export const upgradeToLead = (prospect, consultation) => {
  return {
    ...prospect,
    status: 'consultation',
    consultation
  };
};
