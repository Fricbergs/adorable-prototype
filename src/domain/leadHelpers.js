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

/**
 * Add queue data to lead when moving to queue status
 * @param {Object} lead - Existing lead
 * @returns {Object} Lead with queue data
 */
export const addToQueue = (lead) => {
  return {
    ...lead,
    status: 'queue',
    queuedDate: getCurrentDate(),
    queuedTime: getCurrentTime(),
    queueOfferSent: false,
    queueOfferSentDate: null,
    queueOfferSentTime: null
  };
};

/**
 * Mark queue offer as sent
 * @param {Object} lead - Lead in queue
 * @returns {Object} Lead with offer sent data
 */
export const markQueueOfferSent = (lead) => {
  return {
    ...lead,
    queueOfferSent: true,
    queueOfferSentDate: getCurrentDate(),
    queueOfferSentTime: getCurrentTime()
  };
};

/**
 * Calculate queue position for a lead
 * @param {Object} lead - Lead to check
 * @param {Array} allLeads - All leads in the system
 * @returns {number} Queue position (1-based)
 */
export const calculateQueuePosition = (lead, allLeads) => {
  const queueLeads = allLeads
    .filter(l => l.status === 'queue')
    .sort((a, b) => {
      // Sort by queued date/time (FIFO)
      const dateA = a.queuedDate || a.createdDate;
      const dateB = b.queuedDate || b.createdDate;
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      const timeA = a.queuedTime || a.createdTime || '00:00';
      const timeB = b.queuedTime || b.createdTime || '00:00';
      return timeA.localeCompare(timeB);
    });

  const position = queueLeads.findIndex(l => l.id === lead.id);
  return position === -1 ? 0 : position + 1;
};

/**
 * Calculate days in queue
 * @param {Object} lead - Lead in queue
 * @returns {number} Days waiting
 */
export const calculateDaysInQueue = (lead) => {
  const queuedDate = lead.queuedDate || lead.createdDate;
  if (!queuedDate) return 0;

  const start = new Date(queuedDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
